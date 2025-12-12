import os
import uuid
from urllib.parse import urlparse

import frappe
from frappe import _
from frappe.model.document import Document
from frappe.website.website_generator import WebsiteGenerator


class Property(WebsiteGenerator):
	def autoname(self):
		"""
		Override autoname to generate 8-char UID for 'kode' field if it's empty.
		Also set it as doc.name if you want.
		"""
		if not self.name:
			self.name = uuid.uuid4().hex[:8]

	def validate(self):
		"""Recalculate harga per meter persegi before saving"""
		if self.harga and self.luas_tanah:
			try:
				self.permeter = self.harga / self.luas_tanah
			except ZeroDivisionError:
				self.permeter = 0
		else:
			self.permeter = 0

		# --- Alamat Property ---
		parts = []

		if self.nama_jalan:
			parts.append(f"{self.nama_jalan} ")

		if self.perumahan:
			perumahan_name = frappe.db.get_value("Perumahan", self.perumahan, "perumahan_name")
			if perumahan_name:
				parts.append(perumahan_name)

		if self.perumahan_cluster:
			cluster_name = frappe.db.get_value("Perumahan Cluster", self.perumahan_cluster, "cluster_name")
			if cluster_name:
				parts.append(f" Cluster {cluster_name}")

		if self.blok_perumahan:
			parts.append(f" Blok {self.blok_perumahan}")

		if self.nomor_rumah:
			sep = " " if not self.blok_perumahan else "-"
			parts.append(f"{sep}{self.nomor_rumah}")

		if self.kecamatan_name:
			parts.append(f" {self.kecamatan_name}")

		if self.kota:
			parts.append(f" {self.kota}")

		if self.provinsi:
			parts.append(f"{self.provinsi}")

		self.alamat_property = "".join(parts).strip()

		desired = f"listing/{self.name}"
		current = (self.route or "").strip()

		if current != desired:
			self.route = desired

	def get_context(self, context=None):
		context = context or {}
		context["doc"] = self

		context["meta"] = {
			"title": self.judul_listing or self.name,
			"description": self.detail_listing or "",
			"image": self.gambar_utama or "",
		}

		if frappe.session.user != "Guest":
			user_doc = frappe.get_doc("User", frappe.session.user)
			context["user"] = {
				"name": user_doc.full_name,
				"user_image": user_doc.user_image,
			}

		return context

	def before_insert(self):
		import json

		import requests

		CHILD_TABLE_FIELD = "received_broadcast_text"
		CHILD_VALUE_FIELD = "received_broadcast_text"
		CHILD_TABLE_DB = "tabProperty Listing Received Broadcast"

		# ---- GET CONFIG FROM "Automation Webhook" DOCTYPE ----
		config = frappe.get_value(
			"Automation Webhook",
			{"function": "AI Listing Generator"},
			["enabled", "webhook_url", "document_owner_filter"],
			as_dict=True,
		)

		TARGET_OWNER = config.document_owner_filter

		def log(message):
			frappe.log_error(message, f"Webhook - {self.name or 'PRE-INSERT'}")

		# owner check
		if self.owner != TARGET_OWNER:
			log(f"⛔ Skipped: Owner mismatch ({self.owner} != {TARGET_OWNER})")
			return

		rows = self.get(CHILD_TABLE_FIELD) or []
		messages = [row.get(CHILD_VALUE_FIELD) for row in rows if row.get(CHILD_VALUE_FIELD)]

		if not messages:
			log(f"⚠️ No broadcast text found in child field '{CHILD_VALUE_FIELD}'. Duplicate check skipped.")
			return

		latest_message = messages[-1]

		# ---- DUPLICATE CHECK ----
		existing = frappe.db.sql(
			f"SELECT parent FROM `{CHILD_TABLE_DB}` WHERE `{CHILD_VALUE_FIELD}` = %s",
			(latest_message,),
			as_dict=True,
		)

		if existing:
			duplicate_name = existing[0].parent

			user_message = f"""
			<b>🚫 Duplicate Message Detected</b><br><br>
			Pesan yang sama sudah pernah diterima.<br><br>
			<b>Property:</b> {duplicate_name}<br>
			<b>Isi Pesan:</b><br>
			<div style="padding:6px; margin-top:4px; border-radius:4px;">
			{frappe.utils.escape_html(latest_message)}
			</div>
			"""

			log(f"DUPLICATE BLOCKED → Exists in: {duplicate_name}\nMessage: {latest_message}")
			frappe.throw(user_message, title="Duplicate Found")

	def after_insert(self):
		import json

		import requests

		CHILD_TABLE_FIELD = "received_broadcast_text"
		CHILD_VALUE_FIELD = "received_broadcast_text"

		# ---- GET CONFIG FROM "Automation Webhook" DOCTYPE ----
		config = frappe.get_value(
			"Automation Webhook",
			{"function": "AI Listing Generator"},
			["enabled", "webhook_url", "document_owner_filter"],
			as_dict=True,
		)

		WEBHOOK_URL = config.webhook_url
		TARGET_OWNER = config.document_owner_filter

		def log(message):
			frappe.log_error(message, f"Webhook - {self.name}")

		# Skip if disabled
		log(f"[DEBUG] config.enabled raw value: {config.enabled}")

		if not config.enabled:
			log("[DEBUG] Webhook disabled → execution stopped.")
			return

		if self.owner != TARGET_OWNER:
			log(f"⛔ Skipped: Owner mismatch ({self.owner} != {TARGET_OWNER})")
			return

		rows = self.get(CHILD_TABLE_FIELD) or []
		messages = [row.get(CHILD_VALUE_FIELD) for row in rows if row.get(CHILD_VALUE_FIELD)]

		# Stop only when NO ROWS exist in child table
		if not rows:
			log("⛔ No broadcast message row found. Stopping process.")
			return

		# There is a row but message content is blank → allow insert and webhook,
		# but normalize to empty string instead of None
		messages = [row.get(CHILD_VALUE_FIELD) or "" for row in rows]

		if any(text.strip() == "" for text in messages):
			log("⚠ Message exists but text is blank.")

		payload = {"owner": self.owner, "doc_name": self.name, "messages": messages}

		log(f"📤 Sending webhook:\n{json.dumps(payload, indent=2)}")

		try:
			res = requests.post(WEBHOOK_URL, json=payload, timeout=10)
			log(f"✔️ Webhook sent — Response {res.status_code}: {res.text}")
		except Exception as e:
			log(f"❌ Webhook sending ERROR: {e!s}")
			raise frappe.ValidationError("Webhook gagal dikirim. Coba lagi.")


@frappe.whitelist()
def update_main_photo(docname=None, filename=None, mainphotolink=None, folderid=None):
	try:
		## --- get full request data for logging---
		# import json

		# try:
		# 	full_json = frappe.local.form_dict  # includes all parameters sent in POST
		# 	full_json_str = json.dumps(full_json, indent=2, default=str)
		# except Exception:
		# 	full_json_str = "Could not parse frappe.local.form_dict"

		## --- log the complete raw JSON ---
		# frappe.log_error(
		# 	title="update_main_photo: FULL JSON RECEIVED",
		# 	message=full_json_str,
		# )

		if not docname or not filename or not mainphotolink:
			frappe.throw(f"Missing parameter: {docname=} {filename=} {mainphotolink=}")

		if not frappe.db.exists("Property", docname):
			frappe.throw(f"Property {docname} not found")

		# --- create File record ---
		file_doc = frappe.get_doc(
			{
				"doctype": "File",
				"file_name": filename,
				"file_url": mainphotolink,
				"attached_to_doctype": "Property",
				"attached_to_name": docname,
				"is_private": 0,
			}
		)
		file_doc.insert(ignore_permissions=True)

		# --- manually update File.attached_to_field (simulating Attach Image UI behavior) ---
		frappe.db.set_value("File", file_doc.name, "attached_to_field", "gambar_utama")
		frappe.db.commit()

		# --- load the Property document ---
		property_doc = frappe.get_doc("Property", docname)

		# --- update google_drive_folder if empty and folderid provided ---
		if (
			not property_doc.google_drive_folder or property_doc.google_drive_folder.strip() == ""
		) and folderid:
			property_doc.google_drive_folder = folderid

		# --- update Gambar Utama field value ---
		property_doc.gambar_utama = file_doc.file_url

		# --- save Property document ---
		property_doc.save(ignore_permissions=True)
		frappe.db.commit()

		# --- log success into Error Log for debugging ---
		# frappe.log_error(
		# 	title="update_main_photo: success",
		# 	message=frappe.as_json(
		# 		{
		# 			"docname": docname,
		# 			"file_name": file_doc.file_name,
		# 			"file_url": file_doc.file_url,
		# 			"gambar_utama": property_doc.gambar_utama,
		# 			"google_drive_folder": property_doc.google_drive_folder,
		# 		}
		# 	),
		# )

		return {
			"status": "success",
			"file_name": file_doc.name,
			"gambar_utama": property_doc.gambar_utama,
			"google_drive_folder": property_doc.google_drive_folder,
		}

	except Exception as e:
		frappe.log_error(
			title="update_main_photo: failed",
			message=frappe.get_traceback(),
		)
		frappe.throw(f"update_main_photo failed: {e!s}")

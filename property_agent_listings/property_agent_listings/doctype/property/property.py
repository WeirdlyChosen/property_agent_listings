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
			# If either field is missing, reset to 0
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
			# If blok_perumahan is empty, add space before nomor
			sep = " " if not self.blok_perumahan else "-"
			parts.append(f"{sep}{self.nomor_rumah}")

		if self.kecamatan_name:
			parts.append(f" {self.kecamatan_name}")

		if self.kota:
			parts.append(f" {self.kota}")

		if self.provinsi:
			parts.append(f" {self.provinsi}")

		self.alamat_property = "".join(parts).strip()

	@frappe.whitelist(allow_guest=True)
	def update_main_photo(docname, folderID, filename, mainphotolink):
		"""
		Webhook endpoint to update the 'gambar_utama' (main photo) in Property doctype.
		Expected payload:
			{
				"docname": "PROP-00045",
				"folderID": "1a2b3c4d5e6f",
				"filename": "main_front.jpg",
				"mainphotolink": "https://lh3.googleusercontent.com/d/1abcXYZ"
			}
		"""

		# 1️⃣ Validate Property exists
		if not frappe.db.exists("Property", docname):
			frappe.throw(_("Property {0} not found").format(docname))

		property_doc = frappe.get_doc("Property", docname)

		# 2️⃣ Store the folder ID if field exists
		if hasattr(property_doc, "google_drive_folder"):
			property_doc.google_drive_folder = folderID

		# 3️⃣ Optionally remove old attached File if you want to replace it
		if property_doc.gambar_utama:
			old_file = frappe.db.get_value(
				"File", {"file_url": property_doc.gambar_utama, "attached_to_name": docname}, "name"
			)
			if old_file:
				frappe.delete_doc("File", old_file, ignore_permissions=True)

		# 4️⃣ Create new File doc (public link)
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

		# 5️⃣ Update Property.gambar_utama (Attach type field)
		property_doc.gambar_utama = file_doc.file_url
		property_doc.save(ignore_permissions=True)
		frappe.db.commit()

		return {
			"status": "success",
			"property": docname,
			"filename": filename,
			"file_url": file_doc.file_url,
			"folderID": folderID,
		}

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


@frappe.whitelist()
def update_main_photo(docname=None, filename=None, mainphotolink=None):
	try:
		log_data = {"docname": docname, "filename": filename, "mainphotolink": mainphotolink}
		frappe.log_error(message=str(log_data), title="update_main_photo: received data")

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
		frappe.log_error(message=file_doc.as_dict(), title="update_main_photo: before insert")

		file_doc.insert(ignore_permissions=True)
		frappe.log_error(message=file_doc.as_dict(), title="update_main_photo: after insert")

		# --- manually update File.attached_to_field (simulating Attach Image UI behavior) ---
		frappe.db.set_value("File", file_doc.name, "attached_to_field", "gambar_utama")
		frappe.db.commit()

		# --- update Property field value ---
		property_doc = frappe.get_doc("Property", docname)
		property_doc.gambar_utama = file_doc.file_url
		property_doc.save(ignore_permissions=True)
		frappe.db.commit()

		frappe.log_error(
			message={
				"gambar_utama": property_doc.gambar_utama,
				"file_url": file_doc.file_url,
				"file_name": file_doc.name,
			},
			title="update_main_photo: success",
		)

		return {"status": "success", "file_name": file_doc.name, "gambar_utama": property_doc.gambar_utama}

	except Exception as e:
		frappe.log_error(title="update_main_photo failed", message=frappe.get_traceback())
		frappe.throw(f"update_main_photo failed: {e!s}")

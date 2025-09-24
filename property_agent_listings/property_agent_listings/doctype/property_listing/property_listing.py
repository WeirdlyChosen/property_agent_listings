import uuid

import frappe
from frappe.model.document import Document
from frappe.website.website_generator import WebsiteGenerator


class PropertyListing(WebsiteGenerator):
	def autoname(self):
		"""
		Override autoname to generate 8-char UID for 'kode' field if it's empty.
		Also set it as doc.name if you want.
		"""
		if not self.kode:
			self.kode = uuid.uuid4().hex[:8]

		# If you also want to use it as the document name
		self.name = self.kode

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

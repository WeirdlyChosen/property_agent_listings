# Copyright (c) 2025, HomeAutomator and contributors
# For license information, please see license.txt

# import frappe
import re
from datetime import datetime
from urllib.parse import quote

import frappe
from frappe.model.document import Document


class PropertyListingContact(Document):
	pass


@frappe.whitelist()
def get_whatsapp_html(contact_id):
	doc = frappe.get_doc("Property Listing Contact", contact_id)

	# Sanitize number
	wa_number = doc.mobile_no
	if not wa_number:
		return "<span style='color:red'>Invalid number</span>"

	# Greeting
	hour = datetime.now().hour
	if hour < 11:
		greet = "pagi"
	elif hour < 15:
		greet = "siang"
	elif hour < 18:
		greet = "sore"
	else:
		greet = "malam"

	firstname = frappe.db.get_value("User", frappe.session.user, "first_name") or ""
	listing = frappe.get_doc("Property Listing", doc.parent)

	# Owner check
	if doc.property_owner:
		message = f"""Selamat {greet}, saya {firstname} dari Raywhite TPI Wiyung.
{listing.tipe_property} yang di {listing.alamat_properti} apa masih ada?
Apa bisa saya bantu pasarkan {listing.tipe_property} Bapak/Ibu?
Kalau bisa mohon dikirim spek dan fotonya. Terimakasih 🙏"""
	else:
		message = f"""Selamat {greet}, saya {firstname} dari Raywhite TPI Wiyung.
{listing.tipe_property} yang di {listing.alamat_properti} apa masih ada?
Bisa tolong dikirim spek dan fotonya ya. Nanti bisa co broke. Thank you 🙏"""

	wa_url = f"https://api.whatsapp.com/send?phone={wa_number}&text={quote(message)}"

	# 🔹 HTML button
	return f"""
        <a href="{wa_url}" target="_blank">
            <button class="btn btn-sm btn-success">
                <i class="fa fa-whatsapp"></i> WhatsApp
            </button>
        </a>
    """

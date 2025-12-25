import frappe


def fill_gender(doc, method=None):
	try:
		# ✅ Ensure gender is not empty
		gender = doc.gender or "Other"

		# Optional: Update the doc gender field directly
		doc.gender = gender

		# ✅ Create a real Error Log entry for debugging
		frappe.get_doc(
			{
				"doctype": "Error Log",
				"method": "Contact Fill Gender",
				"error": f"Contact: {doc.name}. Gender used: {gender}",
				"traceback": f"Gender used: {gender}",
			}
		).insert(ignore_permissions=True)

		# --- Example placeholder for other logic ---
		# frappe.enqueue("property_agent_listings.api.contact_sync.send_to_pabbly",
		#                contact_name=doc.name, gender=gender)

	except Exception as e:
		frappe.get_doc(
			{
				"doctype": "Error Log",
				"method": "Contact Fill Gender Exception",
				"error": str(e),
				"traceback": frappe.get_traceback(),
			}
		).insert(ignore_permissions=True)


def ensure_single_phone_primary(doc, method=None):
	if not doc.phone_nos or len(doc.phone_nos) != 1:
		return

	row = doc.phone_nos[0]

	# Already correct → do nothing
	if row.is_primary_phone and row.is_primary_mobile_no:
		return

	# Force flags
	row.is_primary_phone = 1
	row.is_primary_mobile_no = 1

	# VERY IMPORTANT:
	# Prevent Frappe from recalculating flags
	doc.flags.ignore_validate = True
	doc.flags.ignore_links = True

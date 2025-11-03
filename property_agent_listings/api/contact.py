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

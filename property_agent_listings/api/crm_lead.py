import json

import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def create_crm_lead(email=None, mobilephone=None, name=None, reference=None, listingtitle=None):
	"""Webhook endpoint to create a Lead in Frappe CRM"""
	try:
		# --- Log full incoming data for traceability ---
		frappe.log_error(
			message=json.dumps(
				{
					"email": email,
					"mobilephone": mobilephone,
					"name": name,
					"reference": reference,
					"listingtitle": listingtitle,
				},
				indent=2,
			),
			title="Incoming Lead Webhook (Full Data)",
		)

		# --- Validate required fields ---
		if not (email or mobilephone or name):
			frappe.throw(_("Missing required parameters: name, email, or mobilephone"))

		# --- Check for existing leads with same email ---
		existing_leads = frappe.get_all(
			"CRM Lead",
			filters={"email": email} if email else {},
			fields=["name", "first_name", "mobile_no", "email", "website"],
		)

		# --- Check if there's a perfect match (all fields equal) ---
		duplicate = None
		for lead in existing_leads:
			if (
				(lead.first_name or "").strip().lower() == (name or "").strip().lower()
				and (lead.mobile_no or "").strip() == (mobilephone or "").strip()
				and (lead.email or "").strip().lower() == (email or "").strip().lower()
				and (lead.website or "").strip().lower() == (reference or "").strip().lower()
			):
				duplicate = lead.name
				break

		if duplicate:
			# ✅ Lead already exists — add comment if listingtitle present
			if listingtitle:
				add_crm_lead_comment(duplicate, listingtitle)
			return {"status": "exists", "lead_name": duplicate, "action": "comment_added_if_any"}

		# --- Create CRM Lead ---
		lead = frappe.get_doc(
			{
				"doctype": "CRM Lead",
				"first_name": name or "Unknown",
				"mobile_no": mobilephone,
				"email": email,
				"website": reference,
			}
		)
		lead.insert(ignore_permissions=True)
		frappe.db.commit()

		# --- Create a comment for this lead ---
		if listingtitle:
			add_crm_lead_comment(lead.name, listingtitle)

		return {"status": "success", "lead_name": lead.name}

	except Exception as e:
		frappe.log_error(frappe.get_traceback(), "create_crm_lead Webhook Error")
		return {"status": "error", "message": str(e)}


def add_crm_lead_comment(lead_name, content):
	"""Add a comment to the specified CRM Lead and log result."""
	try:
		if not lead_name or not content:
			frappe.log_error(
				f"Skipped comment creation. Missing data — Lead: {lead_name}, Content: {content}",
				"CRM Lead Comment Skipped",
			)
			return

		# Log before attempting insert
		frappe.log_error(
			json.dumps(
				{"action": "prepare_comment", "lead_name": lead_name, "content_preview": content[:120]},
				indent=2,
			),
			"CRM Lead Comment Insert Debug",
		)

		comment = frappe.get_doc(
			{
				"doctype": "Comment",
				"comment_type": "Comment",
				"reference_doctype": "CRM Lead",
				"reference_name": lead_name,
				"content": content,
			}
		)
		comment.insert(ignore_permissions=True)
		frappe.db.commit()

		# Log after success
		frappe.log_error(
			json.dumps(
				{
					"action": "comment_created",
					"lead_name": lead_name,
					"comment_name": comment.name,
					"content_preview": content[:120],
				},
				indent=2,
			),
			"CRM Lead Comment Created",
		)

	except Exception:
		frappe.log_error(frappe.get_traceback(), "add_crm_lead_comment Error")

import frappe
import requests
from werkzeug.wrappers import Response

FB_APP_ID = frappe.conf.get("fb_app_id")
FB_APP_SECRET = frappe.conf.get("fb_app_secret")


@frappe.whitelist(allow_guest=True)
def proxy_gdrive(url: str):
	"""
	Proxy a full Google Drive image URL.
	Example: /api/method/your_app.api.image_proxy.proxy_gdrive?url=<full-url>
	"""
	if not url:
		frappe.throw("URL is required")

	try:
		r = requests.get(url, timeout=10)
		r.raise_for_status()

		content_type = r.headers.get("Content-Type", "image/jpeg")

		return Response(
			r.content,
			content_type=content_type,
			status=200,
			headers={
				"Cache-Control": "public, max-age=86400",  # cache 1 day
				"Content-Length": str(len(r.content)),
			},
		)

	except Exception as e:
		frappe.log_error(f"Failed to proxy image: {e}")
		return Response("Image not available", status=404)


def trigger_facebook_rescrape(listing_name):
	"""Force Facebook to refresh OG preview for this listing."""
	if not FB_APP_ID or not FB_APP_SECRET:
		frappe.log_error("Facebook App ID/Secret not configured", "FB Rescrape")
		return

	url = frappe.utils.get_url(f"/listing/{listing_name}")
	api_url = "https://graph.facebook.com/v19.0/"

	payload = {"id": url, "scrape": "true", "access_token": f"{FB_APP_ID}|{FB_APP_SECRET}"}

	try:
		r = requests.post(api_url, data=payload, timeout=10)
		r.raise_for_status()
		frappe.logger().info(f"FB Rescrape OK: {url} — {r.text}")

	except Exception:
		frappe.log_error(frappe.get_traceback(), f"FB Rescrape Failed: {url}")

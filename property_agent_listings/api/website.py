import frappe
import requests
from werkzeug.wrappers import Response


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

import frappe
import uuid
from frappe.website.website_generator import WebsiteGenerator

class PropertyListing(WebsiteGenerator):
    def autoname(self):
        """
        Override autoname to generate 8-char UID for 'id' field if it's empty.
        Also set it as doc.name if you want.
        """
        if not self.id:
            self.id = uuid.uuid4().hex[:8]

        # If you also want to use it as the document name
        self.name = self.id
        
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

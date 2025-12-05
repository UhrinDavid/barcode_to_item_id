import frappe
from frappe import _

def get_context(context):
	context.title = _("Barcode Scanner")
	context.show_sidebar = False

	# Check if user is logged in
	if frappe.session.user == "Guest":
		frappe.local.flags.redirect_location = "/login"
		raise frappe.Redirect

	return context

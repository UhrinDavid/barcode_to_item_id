from frappe import _

def get_data():
	return [
		{
			"module_name": "Barcode to Item ID",
			"color": "grey",
			"icon": "octicon octicon-device-camera",
			"type": "module",
			"label": _("Barcode Scanner")
		}
	]

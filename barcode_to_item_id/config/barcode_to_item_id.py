from frappe import _

def get_data():
	return [
		{
			"label": _("Tools"),
			"items": [
				{
					"type": "page",
					"name": "barcode-scanner",
					"label": _("Barcode Scanner"),
					"description": _("Scan barcodes to get item details"),
					"route": "/barcode-scanner"
				}
			]
		}
	]

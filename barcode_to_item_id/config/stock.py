from frappe import _

def get_data():
	return [
		{
			"module_name": "Stock",
			"_label": _("Stock"),
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

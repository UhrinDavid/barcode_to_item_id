import frappe

@frappe.whitelist()
def scan_barcode_and_get_item(barcode):
    """
    Scan barcode and return item details
    This is a READ-ONLY operation that only queries existing data
    """
    try:
        # Input validation - only allow alphanumeric characters and common barcode symbols
        if not barcode or not isinstance(barcode, str):
            return {"success": False, "error": "Invalid barcode format"}

        # Sanitize barcode input
        barcode = frappe.utils.cstr(barcode).strip()
        if not barcode or len(barcode) > 50:  # Reasonable barcode length limit
            return {"success": False, "error": "Invalid barcode format"}

        # Search for item by barcode (READ-ONLY query)
        item_barcode = frappe.db.get_value('Item Barcode',
            {'barcode': barcode},
            ['parent', 'barcode'],
            as_dict=True
        )

        if not item_barcode:
            return {"success": False, "error": "No item found for this barcode"}

        # Get item details (READ-ONLY query)
        item = frappe.db.get_value('Item',
            item_barcode.parent,
            ['name', 'item_name', 'item_group', 'description', 'image', 'valuation_rate'],
            as_dict=True
        )

        if not item:
            return {"success": False, "error": "Item not found"}

        # Get default supplier (READ-ONLY query)
        default_supplier = frappe.db.get_value('Item Default',
            {'parent': item_barcode.parent, 'parenttype': 'Item'},
            'default_supplier'
        ) or frappe.db.get_value('Item Supplier',
            {'parent': item_barcode.parent},
            'supplier'
        )

        # Return sanitized item data
        return {
            "success": True,
            "item_code": item.name,
            "item_name": item.item_name,
            "item_group": item.item_group,
            "supplier": default_supplier or "No Supplier",
            "description": item.description or "",  # Keep HTML for rich text display
            "image": item.image,
            "valuation_rate": item.valuation_rate,
            "barcode": item_barcode.barcode
        }

    except frappe.PermissionError:
        return {"success": False, "error": "Access denied"}
    except Exception as e:
        frappe.log_error(f"Barcode scan error: {str(e)}")
        return {"success": False, "error": "An error occurred while processing the barcode"}

@frappe.whitelist()
def has_app_permission():
    """
    Check if user has permission to access the barcode scanner app
    """
    # Allow all logged-in users to access the barcode scanner
    # You can customize this logic based on your requirements
    return True

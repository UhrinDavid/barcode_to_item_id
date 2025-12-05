import frappe

def boot_session(bootinfo):
    """Add custom links to ERPNext modules"""

    # Add barcode scanner link to Stock module
    if "erpnext" in frappe.get_installed_apps():
        # Get current desk pages
        desk_pages = bootinfo.get("desk_pages", {})

        # Add to Stock module
        if "Stock" not in desk_pages:
            desk_pages["Stock"] = {
                "category": "Modules",
                "links": []
            }

        # Add our barcode scanner link
        barcode_link = {
            "label": "Barcode Scanner",
            "name": "Barcode Scanner",
            "type": "doctype",
            "is_query_report": 0,
            "description": "Scan barcodes to get item details"
        }

        # Check if link already exists to avoid duplicates
        stock_links = desk_pages["Stock"].get("links", [])
        exists = any(link.get("name") == "Barcode Scanner" for link in stock_links)

        if not exists:
            stock_links.append(barcode_link)
            desk_pages["Stock"]["links"] = stock_links

        bootinfo["desk_pages"] = desk_pages

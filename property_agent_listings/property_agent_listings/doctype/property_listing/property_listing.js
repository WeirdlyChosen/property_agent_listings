// Copyright (c) 2025, HomeAutomator and contributors
// For license information, please see license.txt

frappe.ui.form.on("Property Listing", {
    refresh: function(frm) {
        // -------------------------------------
        // 1. VARIABLE GENERATION
        // -------------------------------------

        // Check special description flags
        let google_drive_link = "";
        google_drive_url =  "https://drive.google.com/drive/u/1/folders/" + frm.doc.gd_folder ;   
        // google_drive_link = f'<a target="_blank" href="{url}">Google Drive</a>' ;
        let isLelang = "";
        if (
            (frm.doc.description || "").toLowerCase().includes("aset macet") ||
            (frm.doc.description || "").toLowerCase().includes("lelang") ||
            (frm.doc.description || "").toLowerCase().includes("no viewing")
        ) {
            isLelang = "-L";
        }

        // Harga text formatting
        let hargaText = "";
        if (frm.doc.harga) {
            if (frm.doc.harga / 1000000000 >= 1) {
                hargaText = (frm.doc.harga / 1000000000).toFixed(2).replace(/\.00$/, "") + "M ";
            } else {
                hargaText = (frm.doc.harga / 1000000).toFixed(0) + " juta ";
            }
        }

        // Foto link text
        let fotoText = "";
        if (frm.doc.gd_folder) {
            fotoText = "📷Foto: https://drive.google.com/embeddedfolderview?id=" + frm.doc.gd_folder + "#grid";
        }

        // Video link text
        let videoText = "";
        if (frm.doc.yt_link) {
            videoText = "🎥Video: " + frm.doc.yt_link;
        }

        // -------------------------------------
        // 2. DETAIL LISTING (detail_listing_123)
        // -------------------------------------
        
        frm.set_value("harga_123", frm.doc.harga);
        frm.set_value("luas_tanah_123", frm.doc.luas_tanah);


        // -------------------------------------
        // 3. DETAIL LISTING (detail_listing_123)
        // -------------------------------------
        let detail_listing_123 =
            (frm.doc.id || "") + isLelang + "\n\n" +
            (frm.doc.judul_listing || "") + "\n\n" +
            (frm.doc.detail_listing || "") + "\n\n" +
            "Hanya " + hargaText + "saja!\n\n" +


        frm.set_value("detail_listing_123", detail_listing_123);

        // -------------------------------------
        // 4. WHATSAPP TEXT (text_wa_client)
        // -------------------------------------
        let footerText = frappe.boot.user ? (frappe.boot.user.footerText || "") : "";
        let phone = frappe.boot.user ? (frappe.boot.user.phone || "") : "";

        let text_wa_client =
            (frm.doc.id || "") + isLelang + "\n\n" +
            (frm.doc.tagline || "") + "\n\n" +
            (frm.doc.description || "") + "\n\n" +
            "Hanya " + hargaText + "saja!\n\n" +
            fotoText + "\n" +
            videoText; + "\n\n" +
            footerText + "\n" +
            "https://wa.me/" + phone;

        frm.set_value("text_wa_client", text_wa_client);
        // END of Whatsapp text
    }
});
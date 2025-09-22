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
            fotoText = "📷Foto: https://drive.google.com/embeddedfolderview?id=" + frm.doc.gd_folder + "#grid" + "\n\n";
        }

        // Video link text
        let videoText = "";
        if (frm.doc.yt_link) {
            videoText = "🎥Video: " + frm.doc.yt_link + "\n\n";
        }

        let footerText = "Joe\nRay White TPI Wiyung";

        // NEW: Prepare variable for phone (will be async fetched)
        let phone = "";

        if (frappe.boot.user) {
            phone = frappe.boot.user.phone || "";
        }
        // -------------------------------------
        // 2. COPYWRITING TAB
        // -------------------------------------

        let wa_group_broadcast_text =
            (frm.doc.name || "") + isLelang +
            (frm.doc.judul_listing || "") +
            "\n\n" +
            (frm.doc.detail_listing || "") +
            "\n\n" +
            "Hanya " + hargaText + "saja!\n\n" +
            (fotoText || "") +
            (videoText || "") +
            footerText +
            "\n" +
            "https://wa.me/6287731234911" + phone;

        frm.set_value("wa_group_broadcast_text", wa_group_broadcast_text);

        // -------------------------------------
        // 3. DETAIL LISTING (detail_listing)
        // -------------------------------------
        
        frm.set_value("harga_123", frm.doc.harga);
        frm.set_value("luas_tanah_123", frm.doc.luas_tanah);


        // -------------------------------------
        // 4. DETAIL LISTING (detail_listing_123)
        // -------------------------------------
        let detail_listing_123 =
            (frm.doc.id || "") + isLelang + "\n\n" +
            (frm.doc.judul_listing || "") + "\n\n" +
            (frm.doc.detail_listing || "") + "\n\n" +
            "Hanya " + hargaText + "saja!\n\n" +


        frm.set_value("detail_listing_123", detail_listing_123);

    }
});

// -----------------------------
// Child Table (Property Listing Contact)
// -----------------------------
frappe.ui.form.on("Property Listing Contact", {
    whatsapp_button: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (!row.mobile_no) {
            frappe.msgprint("No mobile number found for this contact.");
            return;
        }

        // 🔹 Sanitize WhatsApp number
        let wa_number = row.mobile_no.replace(/\D/g, "");
        if (wa_number.startsWith("0")) {
            wa_number = "62" + wa_number.substring(1);
        }
        if (!wa_number) {
            frappe.msgprint("Invalid WhatsApp number.");
            return;
        }

        // 🔹 Greeting based on current hour
        let hour = new Date().getHours();
        let greet = "malam";
        if (hour < 11) greet = "pagi";
        else if (hour < 15) greet = "siang";
        else if (hour < 18) greet = "sore";

        // 🔹 Get first name of logged-in user
        let firstname = frappe.boot.user.first_name || "";

        // 🔹 Get listing info from parent form
        let tipe_property = frm.doc.tipe_property || "property";
        let alamat = frm.doc.alamat_property || "";

        // 🔹 Message based on owner check
        let message;
        if (row.property_owner) {
            message = `Selamat ${greet}, saya ${firstname} dari Raywhite TPI Wiyung.
${tipe_property} yang di ${alamat} apa masih ada? 
Apa bisa saya bantu pasarkan ${tipe_property} Bapak/Ibu? 
Kalau bisa mohon dikirim spek dan fotonya. Terimakasih 🙏`;
        } else {
            message = `Selamat ${greet}, saya ${firstname} dari Raywhite TPI Wiyung.
${tipe_property} yang di ${alamat} apa masih ada? 
Bisa tolong dikirim spek dan fotonya ya. Nanti bisa co broke. Thank you 🙏`;
        }

        // 🔹 Encode for URL
        let wa_url = `https://api.whatsapp.com/send?phone=${wa_number}&text=${encodeURIComponent(message)}`;

        // 🔹 Open in new browser tab
        window.open(wa_url, "_blank");
    }
});
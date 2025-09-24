// Copyright (c) 2025, HomeAutomator and contributors
// For license information, please see license.txt

frappe.ui.form.on("Property Listing", {
	refresh: function (frm) {
		// -------------------------------------
		// 1. VARIABLE GENERATION
		// -------------------------------------

		// Check special description flags
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
		if (frm.doc.google_drive_folder) {
			fotoText =
				"📷Foto: https://drive.google.com/embeddedfolderview?id=" +
				frm.doc.google_drive_folder +
				"#grid" +
				"\n\n";
		}

		// Video link text
		let videoText = "";
		if (frm.doc.youtube_link) {
			videoText = "🎥Video: " + frm.doc.youtube_link + "\n\n";
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
			(frm.doc.name || "") +
			isLelang +
			"\n\n" +
			(frm.doc.judul_listing || "") +
			"\n\n" +
			(frm.doc.detail_listing || "") +
			"\n\n" +
			"Hanya " +
			hargaText +
			"saja!\n\n" +
			footerText +
			"\n" +
			"https://wa.me/6287731234911" +
			phone;

		frm.set_value("wa_group_broadcast_text", wa_group_broadcast_text);

		let wa_client_broadcast_text =
			(frm.doc.name || "") +
			isLelang +
			"\n\n" +
			(frm.doc.judul_listing || "") +
			"\n\n" +
			(frm.doc.detail_listing || "") +
			"\n\n" +
			(fotoText || "") +
			(videoText || "") +
			"Hanya " +
			hargaText +
			"saja!\n\n" +
			footerText +
			"\n" +
			"https://wa.me/6287731234911" +
			phone;

		frm.set_value("wa_client_broadcast_text", wa_client_broadcast_text);

		// -------------------------------------
		// 3. R123 TAB (mirror fields from Details tab)
		// -------------------------------------
		frm.set_value("tipe_property_123", frm.doc.tipe_property || "");
		frm.set_value("harga_123", frm.doc.harga || "");
		frm.set_value("luas_tanah_123", frm.doc.luas_tanah || "");
		frm.set_value("luas_bangunan_123", frm.doc.luas_bangunan || "");
		frm.set_value("kamar_tidur_123", frm.doc.kamar_tidur || "");
		frm.set_value("kamar_mandi_123", frm.doc.kamar_mandi || "");
		frm.set_value("kamar_tidur_pembantu_123", frm.doc.kamar_tidur_pembantu || "");
		frm.set_value("kamar_mandi_pembantu_123", frm.doc.kamar_mandi_pembantu || "");
		frm.set_value("jumlah_lantai_123", frm.doc.jumlah_lantai || "");
		frm.set_value("garasi_123", frm.doc.garasi || "");
		frm.set_value("carport_123", frm.doc.carport || "");
		frm.set_value("ruang_tamu_123", frm.doc.ruang_tamu || "");
		frm.set_value("ruang_makan_123", frm.doc.ruang_makan || "");
		frm.set_value("dapur_123", frm.doc.dapur || "");
		frm.set_value("lokasi_hook_123", frm.doc.lokasi_hook || "");
		frm.set_value("sertifikat_123", frm.doc.sertifikat || "");
		frm.set_value("kondisi_property_123", frm.doc.kondisi_property || "");
		frm.set_value("kondisi_perabotan_123", frm.doc.kondisi_perabotan || "");
		frm.set_value("usp_123", frm.doc.usp || "");
		frm.set_value("fasilitas_123", frm.doc.fasilitas || "");
		frm.set_value("fasilitas_perumahan_123", frm.doc.fasilitas_perumahan || "");
		frm.set_value("lebar_jalan_123", frm.doc.lebar_jalan || "");
		frm.set_value("konsep_123", frm.doc.konsep || "");
		frm.set_value("pemandangan_123", frm.doc.pemandangan || "");
		frm.set_value("daya_listrik_123", frm.doc.daya_listrik || "");
		frm.set_value("tahun_dibangun_123", frm.doc.tahun_dibangun || "");
		frm.set_value("tahun_renovasi_123", frm.doc.tahun_renovasi || "");
		frm.set_value("sumber_air_123", frm.doc.sumber_air || "");
		frm.set_value("material_lantai_123", frm.doc.material_lantai || "");
		frm.set_value("letak_123", frm.doc.letak || "");
		frm.set_value("terjangkau_internet_123", frm.doc.terjangkau_internet || "");

		// Orientasi hadap (grouped together at the end of R123)
		frm.set_value("timur_123", frm.doc.timur || "");
		frm.set_value("tenggara_123", frm.doc.tenggara || "");
		frm.set_value("selatan_123", frm.doc.selatan || "");
		frm.set_value("barat_daya_123", frm.doc.barat_daya || "");
		frm.set_value("barat_123", frm.doc.barat || "");
		frm.set_value("barat_laut_123", frm.doc.barat_laut || "");
		frm.set_value("utara_123", frm.doc.utara || "");
		frm.set_value("timur_laut_123", frm.doc.timur_laut || "");

		let detail_listing_123 =
			(frm.doc.name || "") +
			isLelang +
			"\n\n" +
			(frm.doc.judul_listing || "") +
			"\n\n" +
			(frm.doc.detail_listing || "") +
			"\n\n" +
			"Hanya " +
			hargaText +
			"saja!\n\n";

		frm.set_value("detail_listing_123", detail_listing_123);
	},
});

frappe.ui.form.on("Property Listing", {
	google_drive_link: function (frm) {
		if (frm.doc.google_drive_folder) {
			let url = "https://drive.google.com/drive/folders/" + frm.doc.google_drive_folder;
			window.open(url, "_blank");
		} else {
			frappe.msgprint("No Google Drive folder set.");
		}
	},
});

// -----------------------------
// Child Table (Property Listing Contact)
// -----------------------------
frappe.ui.form.on("Property Listing Contact", {
	whatsapp_button: function (frm, cdt, cdn) {
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
		let wa_url = `https://api.whatsapp.com/send?phone=${wa_number}&text=${encodeURIComponent(
			message
		)}`;

		// 🔹 Open in new browser tab
		window.open(wa_url, "_blank");
	},
});

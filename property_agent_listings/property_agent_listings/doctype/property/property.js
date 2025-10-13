// Copyright (c) 2025, HomeAutomator and contributors
// For license information, please see license.txt

// Copyright (c) 2025, HomeAutomator and contributors
// For license information, please see license.txt

frappe.ui.form.on("Property", {
	refresh: function (frm) {
		// -------------------------------------
		// 1. VARIABLE GENERATION
		// -------------------------------------

		let isLelang = "";
		if (
			(frm.doc.description || "").toLowerCase().includes("aset macet") ||
			(frm.doc.description || "").toLowerCase().includes("lelang") ||
			(frm.doc.description || "").toLowerCase().includes("no viewing")
		) {
			isLelang = "-L";
		}

		let hargaText = "";
		if (frm.doc.harga) {
			if (frm.doc.harga / 1000000000 >= 1) {
				hargaText = (frm.doc.harga / 1000000000).toFixed(2).replace(/\.00$/, "") + "M ";
			} else {
				hargaText = (frm.doc.harga / 1000000).toFixed(0) + " juta |";
			}
		}

		let perMeterText = "";
		if (frm.doc.permeter) {
			perMeterText = "\n" + Math.floor(frm.doc.permeter / 1000000) + " jutaan per meter!";
		}

		let lantaiText = "";
		if (frm.doc.jml_lantai && frm.doc.jml_lantai > 1) {
			lantaiText = " | " + frm.doc.jml_lantai + " Lantai";
		}

		let fotoText = "";
		if (frm.doc.google_drive_folder) {
			fotoText =
				"📷Foto: https://drive.google.com/embeddedfolderview?id=" +
				frm.doc.google_drive_folder +
				"#grid" +
				"\n\n";
		}

		let videoText = "";
		if (frm.doc.youtube_link) {
			videoText = "🎥Video: " + frm.doc.youtube_link + "\n\n";
		}

		let footerText = "Joe\nRay White TPI Wiyung";
		let phone = frappe.boot.user ? frappe.boot.user.phone || "" : "";

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
		frm.doc.wa_group_broadcast_text = wa_group_broadcast_text;
		refresh_field("wa_group_broadcast_text");

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
		frm.doc.wa_client_broadcast_text = wa_client_broadcast_text;
		refresh_field("wa_client_broadcast_text");

		let wa_status_or_story =
			(frm.doc.tipe_property || "") +
			" " +
			(frm.doc.perumahan || "") +
			" Murah!!\n" +
			"LT: " +
			(frm.doc.luas_tanah || "") +
			" m²" +
			lantaiText +
			"\n\n" +
			"Hanya " +
			hargaText +
			perMeterText +
			"\n\n" +
			(frm.doc.name || "");
		frm.doc.wa_status_or_story = wa_status_or_story;
		refresh_field("wa_status_or_story");

		// -------------------------------------
		// 3. R123 TAB (mirror fields)
		// -------------------------------------

		frm.doc.tipe_property_123 = frm.doc.tipe_property || "";
		refresh_field("tipe_property_123");
		frm.doc.harga_123 = frm.doc.harga || "";
		refresh_field("harga_123");
		frm.doc.luas_tanah_123 = frm.doc.luas_tanah || "";
		refresh_field("luas_tanah_123");
		frm.doc.luas_bangunan_123 = frm.doc.luas_bangunan || "";
		refresh_field("luas_bangunan_123");
		frm.doc.kamar_tidur_123 = frm.doc.kamar_tidur || "";
		refresh_field("kamar_tidur_123");
		frm.doc.kamar_mandi_123 = frm.doc.kamar_mandi || "";
		refresh_field("kamar_mandi_123");
		frm.doc.kamar_tidur_pembantu_123 = frm.doc.kamar_tidur_pembantu || "";
		refresh_field("kamar_tidur_pembantu_123");
		frm.doc.kamar_mandi_pembantu_123 = frm.doc.kamar_mandi_pembantu || "";
		refresh_field("kamar_mandi_pembantu_123");
		frm.doc.jumlah_lantai_123 = frm.doc.jumlah_lantai || "";
		refresh_field("jumlah_lantai_123");
		frm.doc.garasi_123 = frm.doc.garasi || "";
		refresh_field("garasi_123");
		frm.doc.carport_123 = frm.doc.carport || "";
		refresh_field("carport_123");
		frm.doc.ruang_tamu_123 = frm.doc.ruang_tamu || "";
		refresh_field("ruang_tamu_123");
		frm.doc.ruang_makan_123 = frm.doc.ruang_makan || "";
		refresh_field("ruang_makan_123");
		frm.doc.dapur_123 = frm.doc.dapur || "";
		refresh_field("dapur_123");
		frm.doc.lokasi_hook_123 = frm.doc.lokasi_hook || "";
		refresh_field("lokasi_hook_123");
		frm.doc.sertifikat_123 = frm.doc.sertifikat || "";
		refresh_field("sertifikat_123");
		frm.doc.kondisi_property_123 = frm.doc.kondisi_property || "";
		refresh_field("kondisi_property_123");
		frm.doc.kondisi_perabotan_123 = frm.doc.kondisi_perabotan || "";
		refresh_field("kondisi_perabotan_123");
		frm.doc.usp_123 = frm.doc.usp || "";
		refresh_field("usp_123");
		frm.doc.fasilitas_123 = frm.doc.fasilitas || "";
		refresh_field("fasilitas_123");
		frm.doc.fasilitas_perumahan_123 = frm.doc.fasilitas_perumahan || "";
		refresh_field("fasilitas_perumahan_123");
		frm.doc.lebar_jalan_123 = frm.doc.lebar_jalan || "";
		refresh_field("lebar_jalan_123");
		frm.doc.konsep_123 = frm.doc.konsep || "";
		refresh_field("konsep_123");
		frm.doc.pemandangan_123 = frm.doc.pemandangan || "";
		refresh_field("pemandangan_123");
		frm.doc.daya_listrik_123 = frm.doc.daya_listrik || "";
		refresh_field("daya_listrik_123");
		frm.doc.tahun_dibangun_123 = frm.doc.tahun_dibangun || "";
		refresh_field("tahun_dibangun_123");
		frm.doc.tahun_renovasi_123 = frm.doc.tahun_renovasi || "";
		refresh_field("tahun_renovasi_123");
		frm.doc.sumber_air_123 = frm.doc.sumber_air || "";
		refresh_field("sumber_air_123");
		frm.doc.material_lantai_123 = frm.doc.material_lantai || "";
		refresh_field("material_lantai_123");
		frm.doc.letak_123 = frm.doc.letak || "";
		refresh_field("letak_123");
		frm.doc.terjangkau_internet_123 = frm.doc.terjangkau_internet || "";
		refresh_field("terjangkau_internet_123");
		frm.doc.timur_123 = frm.doc.timur || "";
		refresh_field("timur_123");
		frm.doc.tenggara_123 = frm.doc.tenggara || "";
		refresh_field("tenggara_123");
		frm.doc.selatan_123 = frm.doc.selatan || "";
		refresh_field("selatan_123");
		frm.doc.barat_daya_123 = frm.doc.barat_daya || "";
		refresh_field("barat_daya_123");
		frm.doc.barat_123 = frm.doc.barat || "";
		refresh_field("barat_123");
		frm.doc.barat_laut_123 = frm.doc.barat_laut || "";
		refresh_field("barat_laut_123");
		frm.doc.utara_123 = frm.doc.utara || "";
		refresh_field("utara_123");
		frm.doc.timur_laut_123 = frm.doc.timur_laut || "";
		refresh_field("timur_laut_123");

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
		frm.doc.detail_listing_123 = detail_listing_123;
		refresh_field("detail_listing_123");
	},
});

frappe.ui.form.on("Property", {
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
// Child Table (Property Contact)
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

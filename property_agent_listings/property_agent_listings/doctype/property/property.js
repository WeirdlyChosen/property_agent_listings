// Copyright (c) 2025, HomeAutomator and contributors
// For license information, please see license.txt

// Copyright (c) 2025, HomeAutomator and contributors
// For license information, please see license.txt

// ---------------------------
// Property Form Logic
// ---------------------------
frappe.ui.form.on("Property", {
	//----------------------------------------------------------
	// FIELD CHANGE TRIGGERS
	//----------------------------------------------------------
	// --- Fields that trigger rebuild_copywriting ---
	usp(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "usp");
	},
	luas_tanah(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "luas_tanah");
	},
	lxp(frm) {
		frm.trigger("rebuild_copywriting");
	},
	luas_bangunan(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "luas_bangunan");
	},
	jumlah_lantai(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "jumlah_lantai");
	},
	kamar_tidur(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "kamar_tidur");
	},
	kamar_tidur_pembantu(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "kamar_tidur_pembantu");
	},
	kamar_mandi(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "kamar_mandi");
	},
	kamar_mandi_pembantu(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "kamar_mandi_pembantu");
	},
	garasi(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "garasi");
	},
	carport(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "carport");
	},
	daya_listrik(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "daya_listrik");
	},
	sumber_air(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "sumber_air");
	},

	timur(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "timur");
	},
	tenggara(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "tenggara");
	},
	selatan(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "selatan");
	},
	barat_daya(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "barat_daya");
	},
	barat(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "barat");
	},
	barat_laut(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "barat_laut");
	},
	utara(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "utara");
	},
	timur_laut(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "timur_laut");
	},

	lokasi_hook(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "lokasi_hook");
	},
	kondisi_perabotan(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "kondisi_perabotan");
	},
	material_lantai(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "material_lantai");
	},
	lebar_jalan(frm) {
		frm.trigger("rebuild_copywriting");
		frm.trigger("mirror", "lebar_jalan");
	},

	// --- Remaining fields that should only trigger mirror ---
	cobroke(frm) {
		frm.trigger("mirror", "cobroke");
	},
	konsep(frm) {
		frm.trigger("mirror", "konsep");
	},
	kota(frm) {
		frm.trigger("mirror", "kota");
	},
	kecamatan_name(frm) {
		frm.trigger("mirror", "kecamatan_name");
	},
	provinsi(frm) {
		frm.trigger("mirror", "provinsi");
	},
	ruang_makan(frm) {
		frm.trigger("mirror", "ruang_makan");
	},
	ruang_tamu(frm) {
		frm.trigger("mirror", "ruang_tamu");
	},
	fasilitas(frm) {
		frm.trigger("mirror", "fasilitas");
	},
	fasilitas_perumahan(frm) {
		frm.trigger("mirror", "fasilitas_perumahan");
	},
	tahun_dibangun(frm) {
		frm.trigger("mirror", "tahun_dibangun");
	},
	tahun_renovasi(frm) {
		frm.trigger("mirror", "tahun_renovasi");
	},
	letak(frm) {
		frm.trigger("mirror", "letak");
	},
	terjangkau_internet(frm) {
		frm.trigger("mirror", "terjangkau_internet");
	},
	sertifikat(frm) {
		frm.trigger("mirror", "sertifikat");
	},
	kondisi_property(frm) {
		frm.trigger("mirror", "kondisi_property");
	},
	youtube_link(frm) {
		frm.trigger("mirror", "youtube_link");
	},
	google_drive_link(frm) {
		frm.trigger("mirror", "google_drive_link");
	},
	nama_jalan(frm) {
		frm.trigger("mirror", "nama_jalan");
	},
	blok_perumahan(frm) {
		frm.trigger("mirror", "blok_perumahan");
	},
	nomor_rumah(frm) {
		frm.trigger("mirror", "nomor_rumah");
	},
	video(frm) {
		frm.trigger("mirror", "video");
	},

	//----------------------------------------------------------
	// MIRROR LOGIC (_123 & _lamudi)
	//----------------------------------------------------------
	mirror(frm, fieldname) {
		const value = frm.doc[fieldname] || "";

		const f123 = `${fieldname}_123`;
		const flamudi = `${fieldname}_lamudi`;

		if (f123 in frm.doc) frm.set_value(f123, value);
		if (flamudi in frm.doc) frm.set_value(flamudi, value);
	},

	//----------------------------------------------------------
	// COPYWRITING BUILDER
	//----------------------------------------------------------
	build_copywriting(frm) {
		const f = frm.doc;

		//------------------------------------------------------
		// existing helpers rebuilt cleanly
		//------------------------------------------------------
		const isLelang = (f.description || "").toLowerCase().match(/aset macet|lelang|no viewing/)
			? "-L"
			: "";

		let hargaText = "";
		if (f.harga) {
			hargaText =
				f.harga >= 1_000_000_000
					? (f.harga / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "M "
					: (f.harga / 1_000_000).toFixed(0) + " juta ";
		}

		const perMeterText = f.permeter
			? "\n" + Math.floor(f.permeter / 1_000_000) + " jutaan per meter!"
			: "";
		const lantaiText = f.jumlah_lantai > 1 ? " | " + f.jumlah_lantai + " Lantai" : "";

		const fotoText = f.google_drive_folder
			? "📷Foto: https://" + frappe.boot.sitename + (f.route ? "/" + f.route : "") + "\n\n"
			: "";

		const videoText = f.youtube_link ? "🎥Video: " + f.youtube_link + "\n\n" : "";

		const footerText = "Joe\nNext Level Properti";
		const phone = frappe.boot.user?.phone || "";

		//------------------------------------------------------
		// BUILD FIELDS
		//------------------------------------------------------

		//frm.set_value("wa_group_broadcast_text",
		frm.doc.wa_group_broadcast_text =
			(f.name || "") +
			isLelang +
			"\n\n" +
			(f.judul_listing || "") +
			"\n\n" +
			(f.detail_listing || "") +
			"\n\n" +
			"Hanya " +
			hargaText +
			"saja!\n\n" +
			footerText +
			"\n" +
			"https://wa.me/6287731234911" +
			phone;

		// frm.set_value("wa_client_broadcast_text",
		frm.doc.wa_client_broadcast_text =
			(f.name || "") +
			isLelang +
			"\n\n" +
			(f.judul_listing || "") +
			"\n\n" +
			(f.detail_listing || "") +
			"\n\n" +
			"Hanya " +
			hargaText +
			"saja!\n\n" +
			fotoText +
			videoText +
			footerText +
			"\n" +
			"https://wa.me/6287731234911" +
			phone;

		// frm.set_value("wa_status_or_story",
		frm.doc.wa_status_or_story =
			(f.tipe_property || "") +
			" " +
			(f.perumahan || "") +
			" Murah!!\n" +
			"LT: " +
			(f.luas_tanah || "") +
			" m²" +
			lantaiText +
			"\n\n" +
			"Hanya " +
			hargaText +
			perMeterText +
			"\n\n" +
			(f.name || "");

		// Keep only alphanumeric, punctuation, and symbols.
		// Remove everything else (including emojis).
		const whitelist = /[^a-zA-Z0-9\s.,:;!?@#$%^&*()_\-+=\/\\'"<>[\]{}|~`]/g;

		const judulClean = (frm.doc.judul_listing || "").replace(whitelist, "").trim();
		const detailClean = (frm.doc.detail_listing || "").replace(whitelist, "").trim();

		let detail_listing_123 =
			(frm.doc.name || "") +
			isLelang +
			"\n\n" +
			judulClean +
			"\n\n" +
			detailClean +
			"\n\n" +
			"Hanya " +
			hargaText +
			"saja!\n\nJoe\nNext Level Properti\n";

		frm.doc.judul_listing_123 = judulClean;
		frm.doc.judul_listing_lamudi = judulClean;
		frm.doc.detail_listing_123 = detail_listing_123;
		frm.doc.detail_listing_lamudi = detail_listing_123;
		refresh_field("judul_listing_123");
		refresh_field("judul_listing_lamudi");
		refresh_field("detail_listing_123");
		refresh_field("detail_listing_lamudi");

		// Description generator
		// write the generator script here.
		// -------------------------------------
		{
			const f = frm.doc; // shorthand

			// helper: safe fetch
			const get = (field) => f[field] || "";

			// Start building the detail description (replicating your GSheet formula)
			let desc = "";

			// USP
			if (get("usp")) desc += `${get("usp")}\n`;

			// LT + LxP
			if (get("luas_tanah")) desc += `LT: ${get("luas_tanah")}m²`;
			if (get("lxp")) desc += ` --> ${get("lxp")}`;
			desc += "\n";

			// LB + jumlah_lantai
			if (get("luas_bangunan")) {
				desc += `LB: ${get("luas_bangunan")}m²`;
				if (get("jumlah_lantai") > 1) desc += ` ${get("jumlah_lantai")} lantai`;
				desc += "\n";
			}

			// Kamar tidur
			if (get("kamar_tidur") || get("kamar_tidur_pembantu")) {
				desc += "Kamar Tidur: ";
				desc += get("kamar_tidur") || "";
				if (get("kamar_tidur_pembantu")) desc += ` + ${get("kamar_tidur_pembantu")}`;
				desc += "\n";
			}

			// Kamar mandi
			if (get("kamar_mandi") || get("kamar_mandi_pembantu")) {
				desc += "Kamar Mandi: ";
				desc += get("kamar_mandi") || "";
				if (get("kamar_mandi_pembantu")) desc += ` + ${get("kamar_mandi_pembantu")}`;
				desc += "\n";
			}

			// Garasi
			if (parseInt(get("garasi")) > 0) desc += `Garasi: ${get("garasi")} mobil\n`;

			// Carport
			if (parseInt(get("carport")) > 0) desc += `Carport: ${get("carport")} mobil\n`;

			// PLN
			if (get("daya_listrik")) desc += `PLN: ${get("daya_listrik")} Watt\n`;

			// Air
			if (get("sumber_air")) desc += `Air: ${get("sumber_air")}\n`;

			// Hadap + hook
			// Hadap builder
			const hadap_map = {
				timur: "Timur",
				tenggara: "Tenggara",
				selatan: "Selatan",
				barat_daya: "Barat Daya",
				barat: "Barat",
				barat_laut: "Barat Laut",
				utara: "Utara",
				timur_laut: "Timur Laut",
			};

			let hadap_list = [];
			for (let key in hadap_map) {
				if (flt(get(key)) === 1) {
					hadap_list.push(hadap_map[key]);
				}
			}

			// Build text
			if (hadap_list.length) {
				desc += "Hadap: " + hadap_list.join(", ");
			}

			// Hook
			if (flt(get("lokasi_hook")) === 1) {
				desc += " (Hook)";
			}
			desc += "\n";

			// Perabotan
			if (["Full Furnished", "Semi Furnished"].includes(get("kondisi_perabotan")))
				desc += `${get("kondisi_perabotan")}\n`;

			// Material lantai
			if (get("material_lantai")) desc += `${get("material_lantai")}\n`;

			// Lebar jalan
			if (get("lebar_jalan")) {
				const n = parseInt(get("lebar_jalan"));
				if (n > 2) {
					desc += `Jalan lebar! ${n} mobil!\n`;
				} else {
					desc += `Row jalan ${n} mobil\n`;
				}
			}

			// Assign the generated text
			frm.doc.detail_listing_generator = desc.trim();
		}
		// END Description generator
	},

	// do it again if there are changes
	rebuild_copywriting(frm) {
		const f = frm.doc;

		//------------------------------------------------------
		// existing helpers rebuilt cleanly
		//------------------------------------------------------
		const isLelang = (f.description || "").toLowerCase().match(/aset macet|lelang|no viewing/)
			? "-L"
			: "";

		let hargaText = "";
		if (f.harga) {
			hargaText =
				f.harga >= 1_000_000_000
					? (f.harga / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "M "
					: (f.harga / 1_000_000).toFixed(0) + " juta ";
		}

		const perMeterText = f.permeter
			? "\n" + Math.floor(f.permeter / 1_000_000) + " jutaan per meter!"
			: "";
		const lantaiText = f.jumlah_lantai > 1 ? " | " + f.jumlah_lantai + " Lantai" : "";

		const fotoText = f.google_drive_folder
			? "📷Foto: https://" + frappe.boot.sitename + (f.route ? "/" + f.route : "") + "\n\n"
			: "";

		const videoText = f.youtube_link ? "🎥Video: " + f.youtube_link + "\n\n" : "";

		const footerText = "Joe\nNext Level Properti";
		const phone = frappe.boot.user?.phone || "";

		//------------------------------------------------------
		// BUILD FIELDS
		//------------------------------------------------------

		frm.set_value(
			"wa_group_broadcast_text",
			(f.name || "") +
				isLelang +
				"\n\n" +
				(f.judul_listing || "") +
				"\n\n" +
				(f.detail_listing || "") +
				"\n\n" +
				"Hanya " +
				hargaText +
				"saja!\n\n" +
				footerText +
				"\n" +
				"https://wa.me/6287731234911" +
				phone
		);

		frm.set_value(
			"wa_client_broadcast_text",
			(f.name || "") +
				isLelang +
				"\n\n" +
				(f.judul_listing || "") +
				"\n\n" +
				(f.detail_listing || "") +
				"\n\n" +
				"Hanya " +
				hargaText +
				"saja!\n\n" +
				fotoText +
				videoText +
				footerText +
				"\n" +
				"https://wa.me/6287731234911" +
				phone
		);

		frm.set_value(
			"wa_status_or_story",
			(f.tipe_property || "") +
				" " +
				(f.perumahan || "") +
				" Murah!!\n" +
				"LT: " +
				(f.luas_tanah || "") +
				" m²" +
				lantaiText +
				"\n\n" +
				"Hanya " +
				hargaText +
				perMeterText +
				"\n\n" +
				(f.name || "")
		);

		// Keep only alphanumeric, punctuation, and symbols.
		// Remove everything else (including emojis).
		const whitelist = /[^a-zA-Z0-9\s.,:;!?@#$%^&*()_\-+=\/\\'"<>[\]{}|~`]/g;

		const judulClean = (frm.doc.judul_listing || "").replace(whitelist, "").trim();
		const detailClean = (frm.doc.detail_listing || "").replace(whitelist, "").trim();

		let detail_listing_123 =
			(frm.doc.name || "") +
			isLelang +
			"\n\n" +
			judulClean +
			"\n\n" +
			detailClean +
			"\n\n" +
			"Hanya " +
			hargaText +
			"saja!\n\nJoe\nNext Level Properti\n";

		frm.doc.judul_listing_123 = judulClean;
		frm.doc.judul_listing_lamudi = judulClean;
		frm.doc.detail_listing_123 = detail_listing_123;
		frm.doc.detail_listing_lamudi = detail_listing_123;
		refresh_field("judul_listing_123");
		refresh_field("judul_listing_lamudi");
		refresh_field("detail_listing_123");
		refresh_field("detail_listing_lamudi");

		// Description generator
		// write the generator script here.
		// -------------------------------------
		{
			const f = frm.doc; // shorthand

			// helper: safe fetch
			const get = (field) => f[field] || "";

			// Start building the detail description (replicating your GSheet formula)
			let desc = "";

			// USP
			if (get("usp")) desc += `${get("usp")}\n`;

			// LT + LxP
			if (get("luas_tanah")) desc += `LT: ${get("luas_tanah")}m²`;
			if (get("lxp")) desc += ` --> ${get("lxp")}`;
			desc += "\n";

			// LB + jumlah_lantai
			if (get("luas_bangunan")) {
				desc += `LB: ${get("luas_bangunan")}m²`;
				if (get("jumlah_lantai") > 1) desc += ` ${get("jumlah_lantai")} lantai`;
				desc += "\n";
			}

			// Kamar tidur
			if (get("kamar_tidur") || get("kamar_tidur_pembantu")) {
				desc += "Kamar Tidur: ";
				desc += get("kamar_tidur") || "";
				if (get("kamar_tidur_pembantu")) desc += ` + ${get("kamar_tidur_pembantu")}`;
				desc += "\n";
			}

			// Kamar mandi
			if (get("kamar_mandi") || get("kamar_mandi_pembantu")) {
				desc += "Kamar Mandi: ";
				desc += get("kamar_mandi") || "";
				if (get("kamar_mandi_pembantu")) desc += ` + ${get("kamar_mandi_pembantu")}`;
				desc += "\n";
			}

			// Garasi
			if (parseInt(get("garasi")) > 0) desc += `Garasi: ${get("garasi")} mobil\n`;

			// Carport
			if (parseInt(get("carport")) > 0) desc += `Carport: ${get("carport")} mobil\n`;

			// PLN
			if (get("daya_listrik")) desc += `PLN: ${get("daya_listrik")} Watt\n`;

			// Air
			if (get("sumber_air")) desc += `Air: ${get("sumber_air")}\n`;

			// Hadap + hook
			// Hadap builder
			const hadap_map = {
				timur: "Timur",
				tenggara: "Tenggara",
				selatan: "Selatan",
				barat_daya: "Barat Daya",
				barat: "Barat",
				barat_laut: "Barat Laut",
				utara: "Utara",
				timur_laut: "Timur Laut",
			};

			let hadap_list = [];
			for (let key in hadap_map) {
				if (flt(get(key)) === 1) {
					hadap_list.push(hadap_map[key]);
				}
			}

			// Build text
			if (hadap_list.length) {
				desc += "Hadap: " + hadap_list.join(", ");
			}

			// Hook
			if (flt(get("lokasi_hook")) === 1) {
				desc += " (Hook)";
			}
			desc += "\n";

			// Perabotan
			if (["Full Furnished", "Semi Furnished"].includes(get("kondisi_perabotan")))
				desc += `${get("kondisi_perabotan")}\n`;

			// Material lantai
			if (get("material_lantai")) desc += `${get("material_lantai")}\n`;

			// Lebar jalan
			if (get("lebar_jalan")) {
				const n = parseInt(get("lebar_jalan"));
				if (n > 2) {
					desc += `Jalan lebar! ${n} mobil!\n`;
				} else {
					desc += `Row jalan ${n} mobil\n`;
				}
			}

			// Assign the generated text
			frm.doc.detail_listing_generator = desc.trim();
			refresh_field("detail_listing_generator");
		}
		// END Description generator
	},

	//----------------------------------------------------------
	// ONLOAD MIRROR SYNC (runs once)
	//----------------------------------------------------------
	onload(frm) {
		// mirror essential fields when loading an existing doc
		const base_fields = [
			"tipe_property",
			"harga",
			"luas_tanah",
			"luas_bangunan",
			"kamar_tidur",
			"kamar_mandi",
			"kamar_tidur_pembantu",
			"kamar_mandi_pembantu",
			"jumlah_lantai",
			"garasi",
			"carport",
			"ruang_tamu",
			"ruang_makan",
			"dapur",
			"lokasi_hook",
			"sertifikat",
			"kondisi_property",
			"kondisi_perabotan",
			"usp",
			"fasilitas",
			"fasilitas_perumahan",
			"lebar_jalan",
			"konsep",
			"pemandangan",
			"daya_listrik",
			"tahun_dibangun",
			"tahun_renovasi",
			"sumber_air",
			"material_lantai",
			"letak",
			"terjangkau_internet",
			"timur",
			"tenggara",
			"selatan",
			"barat_daya",
			"barat",
			"barat_laut",
			"utara",
			"timur_laut",
		];

		base_fields.forEach((f) => {
			if (frm.doc[f] !== undefined) {
				frm.doc[`${f}_123`] = frm.doc[f];
				frm.doc[`${f}_lamudi`] = frm.doc[f];
			}
		});

		frm.trigger("build_copywriting");
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

frappe.ui.form.on("Property", {
	perumahan_cluster: function (frm) {
		if (frm.doc.perumahan_cluster) {
			frappe.db
				.get_value("Perumahan Cluster", frm.doc.perumahan_cluster, "perumahan")
				.then((r) => {
					if (r && r.message && r.message.perumahan) {
						frm.set_value("perumahan", r.message.perumahan);
					} else {
						frappe.msgprint({
							title: __("Not Found"),
							message: __("No Perumahan linked with this Cluster."),
							indicator: "orange",
						});
					}
				});
		}

		if (frm.doc.perumahan) {
			frappe.db.get_value("Perumahan", frm.doc.perumahan, "kota").then((r) => {
				if (r && r.message && r.message.kota) {
					frm.set_value("kota", r.message.kota);
				} else {
					frappe.msgprint({
						title: __("Not Found"),
						message: __("No Kota linked with this Perumahan."),
						indicator: "orange",
					});
				}
			});
		}
	},

	perumahan: function (frm) {
		// if user picks perumahan directly, fetch kota
		if (!frm.doc.perumahan) {
			frm.set_value("kota", "");
			return;
		}
		frappe.db.get_value("Perumahan", frm.doc.perumahan, "kota").then((r) => {
			const kota = r?.message?.kota || "";
			frm.set_value("kota", kota);
		});
	},
});

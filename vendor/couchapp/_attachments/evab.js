/*
Diese Funktionen werden in evab auf mehreren Seiten benutzt
*/

window.em = window.em || {};

window.em.erstelleNeuesDatum = function() {
	var jetzt = new Date(),
		Jahr = jetzt.getFullYear(),
		Mnt = jetzt.getMonth()+1,
		MntAusgabe = ((Mnt < 10) ? "0" + Mnt : Mnt),
		Tag = jetzt.getDate(),
		TagAusgabe = ((Tag < 10) ? "0" + Tag : Tag),
		Datum = Jahr + "-" + MntAusgabe + "-" + TagAusgabe;
	return Datum;
};

window.em.erstelleNeueUhrzeit = function() {
	var jetzt = new Date(),
		Std = jetzt.getHours(),
		StdAusgabe = ((Std < 10) ? "0" + Std : Std),
		Min = jetzt.getMinutes(),
		MinAusgabe = ((Min < 10) ? "0" + Min : Min),
		Sek = jetzt.getSeconds(),
		SekAusgabe = ((Sek < 10) ? "0" + Sek : Sek),
		Zeit = StdAusgabe + ":" + MinAusgabe + ":" + SekAusgabe;
	return Zeit;
};

// wandelt decimal degrees (vom GPS) in WGS84 um
window.em.DdInWgs84BreiteGrad = function(Breite) {
	return Math.floor(Breite);
};

window.em.DdInWgs84BreiteMin = function(Breite) {
	var BreiteGrad = Math.floor(Breite),
		BreiteMin = Math.floor((Breite-BreiteGrad)*60);
	return BreiteMin;
};

window.em.DdInWgs84BreiteSec = function(Breite) {
	var BreiteGrad = Math.floor(Breite),
		BreiteMin = Math.floor((Breite-BreiteGrad)*60),
		BreiteSec = Math.round((((Breite - BreiteGrad) - (BreiteMin/60)) * 60 * 60) * 100) / 100;
	return BreiteSec;
};

window.em.DdInWgs84LaengeGrad = function(Laenge) {
	return Math.floor(Laenge);
};

window.em.DdInWgs84LaengeMin = function(Laenge) {
	var LaengeGrad = Math.floor(Laenge),
		LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
	return LaengeMin;
};

window.em.DdInWgs84LaengeSec = function(Laenge) {
	var LaengeGrad = Math.floor(Laenge),
		LaengeMin = Math.floor((Laenge-LaengeGrad)*60),
		LaengeSec = Math.round((((Laenge - LaengeGrad) - (LaengeMin/60)) * 60 * 60) * 100 ) / 100;
	return LaengeSec;
};

// Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
window.em.Wgs84InChX = function(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
	var lat,
		lng,
		lat_aux,
		lng_aux;

	// Converts degrees dec to sex
	lat = BreiteSec + BreiteMin*60 + BreiteGrad*3600;
	lng = LaengeSec + LaengeMin*60 + LaengeGrad*3600;

	// Axiliary values (% Bern)
	lat_aux = (lat - 169028.66)/10000;
	lng_aux = (lng - 26782.5)/10000;

	x = 200147.07
	  + 308807.95 * lat_aux 
	  +   3745.25 * Math.pow(lng_aux,2)
	  +     76.63 * Math.pow(lat_aux,2)
	  -    194.56 * Math.pow(lng_aux,2) * lat_aux
	  +    119.79 * Math.pow(lat_aux,3);

	return x;
};

// Wandelt WGS84 in CH-Landeskoordinaten um
window.em.Wgs84InChY = function(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
	var lat_aux,
		lng_aux;

	// Converts degrees dec to sex
	lat = BreiteSec + BreiteMin*60 + BreiteGrad*3600;
	lng = LaengeSec + LaengeMin*60 + LaengeGrad*3600;

	// Axiliary values (% Bern)
	lat_aux = (lat - 169028.66)/10000;
	lng_aux = (lng - 26782.5)/10000;

	// Process Y
	y = 600072.37
	   + 211455.93 * lng_aux 
	   -  10938.51 * lng_aux * lat_aux
	   -      0.36 * lng_aux * Math.pow(lat_aux,2)
	   -     44.54 * Math.pow(lng_aux,3);

	return y;
};

// wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
window.em.DdInChX = function(Breite, Laenge) {
	var BreiteGrad = window.em.DdInWgs84BreiteGrad(Breite),
		BreiteMin = window.em.DdInWgs84BreiteMin(Breite),
		BreiteSec = window.em.DdInWgs84BreiteSec(Breite),
		LaengeGrad = window.em.DdInWgs84LaengeGrad(Laenge),
		LaengeMin = window.em.DdInWgs84LaengeMin(Laenge),
		LaengeSec = window.em.DdInWgs84LaengeSec(Laenge),
		x = Math.floor(window.em.Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return x;
};

window.em.DdInChY = function(Breite, Laenge) {
	var BreiteGrad = window.em.DdInWgs84BreiteGrad(Breite),
		BreiteMin = window.em.DdInWgs84BreiteMin(Breite),
		BreiteSec = window.em.DdInWgs84BreiteSec(Breite),
		LaengeGrad = window.em.DdInWgs84LaengeGrad(Laenge),
		LaengeMin = window.em.DdInWgs84LaengeMin(Laenge),
		LaengeSec = window.em.DdInWgs84LaengeSec(Laenge),
		y = Math.floor(window.em.Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return y;
};

// von CH-Landeskoord zu DecDeg

// Convert CH y/x to WGS lat
window.em.CHtoWGSlat = function(y, x) {
	// Converts militar to civil and to unit = 1000km
	var lat,
		y_aux,
		x_aux;

	// Axiliary values (% Bern)
	y_aux = (y - 600000)/1000000;
	x_aux = (x - 200000)/1000000;

	// Process lat
	lat = 16.9023892
	     +  3.238272 * x_aux
	     -  0.270978 * Math.pow(y_aux,2)
	     -  0.002528 * Math.pow(x_aux,2)
	     -  0.0447   * Math.pow(y_aux,2) * x_aux
	     -  0.0140   * Math.pow(x_aux,3);

	// Unit 10000" to 1 " and converts seconds to degrees (dec)
	lat = lat * 100/36;

	return lat;
};

// Convert CH y/x to WGS long
window.em.CHtoWGSlng = function(y, x) {
	// Converts militar to civil and to unit = 1000km
	var lng,
		y_aux,
		x_aux;

	// Axiliary values (% Bern)
	y_aux = (y - 600000)/1000000;
	x_aux = (x - 200000)/1000000;

	// Process long
	lng = 2.6779094
	    + 4.728982 * y_aux
	    + 0.791484 * y_aux * x_aux
	    + 0.1306   * y_aux * Math.pow(x_aux,2)
	    - 0.0436   * Math.pow(y_aux,3);

	// Unit 10000" to 1 " and converts seconds to degrees (dec)
	lng = lng * 100/36;
	
	return lng;
};

window.em.melde = function(Meldung) {
	$("<div id='meldung' data-role='popup' class='ui-content' data-overlay-theme='a'><a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right'>Close</a>"+Meldung+"</div>")
		.css({"line-height": "95%", "font-weight": "bold"})
		.appendTo($.mobile.pageContainer);
	$("#meldung").popup({
		afterclose: function(event, ui) {
			// Meldung wieder aus pageContainer entfernen
			$("#meldung").remove();
		}
	});
	$("#meldung").popup("open");
};

// wird in FeldEdit.html verwendet
window.em.geheZurueckFE = function() {
	window.em.leereStorageFeldEdit();
	if (localStorage.zurueck && localStorage.zurueck !== "FelderWaehlen.html") {
		// via die Feldliste zurück
		window.em.leereStorageFeldEdit();
		$.mobile.navigate("FeldListe.html");
	} else if (localStorage.zurueck && localStorage.zurueck === "FelderWaehlen.html") {
		// direkt zurück, Feldliste auslassen
		window.em.leereStorageFeldEdit();
		window.em.leereStorageFeldListe();
		// TODO: Geht zwar richtig zurück. Springt dann aber direkt zur BeobListe.html!
		$.mobile.navigate("FelderWaehlen.html");
		delete localStorage.zurueck;
	} else {
		// uups, kein zurück vorhanden
		window.em.leereAlleVariabeln();
		$.mobile.navigate("BeobListe.html");
	}
};

// Neue Beobachtungen werden gespeichert
// ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
// aufgerufen bloss von Artenliste.html
window.em.speichereNeueBeob = function(aArtBezeichnung) {
	var doc = {};
	doc.User = localStorage.Email;
	doc.aAutor = localStorage.Autor;
	doc.aArtGruppe = localStorage.aArtGruppe;
	//delete localStorage.aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = localStorage.aArtId;
	if (localStorage.Von === "hArtListe" || localStorage.Von === "hArtEdit") {
		doc.Typ = "hArt";
		doc.hProjektId = localStorage.ProjektId;
		doc.hRaumId = localStorage.RaumId;
		doc.hOrtId = localStorage.OrtId;
		doc.hZeitId = localStorage.ZeitId;
		doc.aArtId = localStorage.aArtId;
		window.em.speichereNeueBeob_02(doc);
	} else {
		//localStorage.Von == "BeobListe" || localStorage.Von == "BeobEdit"
		doc.Typ = "Beobachtung";
		doc.zDatum = window.em.erstelleNeuesDatum();
		doc.zUhrzeit = window.em.erstelleNeueUhrzeit();
		window.em.speichereNeueBeob_02(doc);
	}
};

// Neue Beobachtungen werden gespeichert
// ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
// dies ist der letzte Schritt:
// Autor anfügen und weiter zum Edit-Formular
window.em.speichereNeueBeob_02 = function(doc) {
	$db.saveDoc(doc, {
		success: function(data) {
			var row_objekt = {};
			// doc um id und rev ergänzen
			doc._id = data.id;
			doc._rev = data.rev;
			if (doc.Typ === 'hArt') {
				// Variabeln verfügbar machen
				localStorage.hBeobId = data.id;
				// damit hArtEdit.html die hBeob nicht aus der DB holen muss
				window.em.hArt = doc;
				// window.em.hBeobListe ergänzen, damit bei der nächsten Art kontrolliert werden kann, ob sie schon erfasst wurde
				row_objekt.id = data.id;
				row_objekt.doc = doc;
				// Vorsicht: window.em.hBeobListe existiert nicht, wenn in hBeobEdit F5 gedrückt wurde!
				if (window.em.hBeobListe && window.em.hBeobListe.rows) {
					window.em.hBeobListe.rows.push(row_objekt);
					// jetzt die Liste neu sortieren
					window.em.hBeobListe.rows = _.sortBy(window.em.hBeobListe.rows, function(row) {
						return row.doc.aArtName;
					});
				}
				$.mobile.navigate("hArtEdit.html");
			} else {
				// Variabeln verfügbar machen
				localStorage.BeobId = data.id;
				// damit BeobEdit.html die Beob nicht aus der DB holen muss
				window.em.Beobachtung = doc;
				// Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
				window.em.leereStorageBeobListe();
				$.mobile.navigate("BeobEdit.html");
			}
		},
		error: function() {
			window.em.melde("Beobachtung nicht gespeichert.");
		}
	});
};

// Speichert, wenn in BeobEdit oder hArtEdit eine neue Art und ev. auch eine neue Artgruppe gewählt wurde
// erwartet localStorage.Von = von welchem Formular aufgerufen wurde
window.em.speichereBeobNeueArtgruppeArt = function(aArtName) {
	var docId;
	if (localStorage.Von === "BeobListe" || localStorage.Von === "BeobEdit") {
		docId = localStorage.BeobId;
	} else {
		docId = localStorage.hBeobId;
	}
	$db = $.couch.db("evab");
	$db.openDoc(docId, {
		success: function(doc) {
			if (localStorage.aArtGruppe) {
				doc.aArtGruppe = localStorage.aArtGruppe;
			}
			doc.aArtName = aArtName;
			doc.aArtId = sessionStorage.ArtId;
			$db.saveDoc(doc, {
				success: function(data) {
					var row_objekt = {};
					if (localStorage.Von === "BeobListe" || localStorage.Von === "BeobEdit") {
						// Variabeln verfügbar machen
						localStorage.BeobId = docId;
						// Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						window.em.leereStorageBeobListe();
						$.mobile.navigate("BeobEdit.html");
					} else {
						// Variabeln verfügbar machen
						localStorage.hBeobId = docId;
						// damit hArtEdit.html die hBeob nicht aus der DB holen muss
						window.em.hArt = doc;
						// window.em.hBeobListe anpassen
						// Vorsicht: window.em.hBeobListe existiert nicht, wenn in hBeobEdit F5 gedrückt wurde!
						if (window.em.hBeobListe && window.em.hBeobListe.rows) {
							for (var i in window.em.hBeobListe.rows) {
								if (window.em.hBeobListe.rows[i].id == docId) {
									window.em.hBeobListe.rows[i].doc.aArtGruppe = localStorage.aArtGruppe;
									window.em.hBeobListe.rows[i].doc.aArtName = aArtName;
									window.em.hBeobListe.rows[i].doc.aArtId = sessionStorage.ArtId;
								}
							}
							// window.em.hBeobListe neu sortieren
							window.em.hBeobListe.rows = _.sortBy(window.em.hBeobListe.rows, function(row) {
								return row.doc.aArtName;
							});
						}
						delete localStorage.aArtGruppe;
						$.mobile.navigate("hArtEdit.html");
					}
				},
				error: function() {
					window.em.melde("Fehler: Beobachtung nicht gespeichert");
				}
			});
		}
	});
};

window.em.erstelleNeueZeit = function() {
// Neue Zeiten werden erstellt
// ausgelöst durch hZeitListe.html oder hZeitEdit.html
// dies ist der erste Schritt: doc bilden
	var doc = {};
	doc.Typ = "hZeit";
	doc.User = localStorage.Email;
	doc.hProjektId = localStorage.ProjektId;
	doc.hRaumId = localStorage.RaumId;
	doc.hOrtId = localStorage.OrtId;
	doc.zDatum = window.em.erstelleNeuesDatum();
	doc.zUhrzeit = window.em.erstelleNeueUhrzeit();
	// an hZeitEdit.html übergeben
	window.em.hZeit = doc;
	// Variabeln verfügbar machen
	delete localStorage.ZeitId;
	localStorage.Status = "neu";
	// Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	delete window.em.ZeitListe;
	// Vorsicht: Von hZeitEdit.html aus samepage transition!
	if ($("#hZeitEdit").length > 0 && $("#hZeitEdit").attr("data-url") !== "hZeitEdit") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hZeit = JSON.stringify(window.em.hZeit);
		window.open("hZeitEdit.html", target = "_self");
	} else if ($("#hZeitEdit").length > 0 && $("#hZeitEdit").attr("data-url") === "hZeitEdit") {
		//$(":mobile-pagecontainer").pagecontainer("change", "#hZeitEdit.html", { allowSamePageTransition : true });    FUNKTIONIERT NICHT
		localStorage.hZeit = JSON.stringify(window.em.hZeit);
		window.open("hZeitEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hZeitEdit.html");
	}
};

// erstellt einen neuen Ort
// wird aufgerufen von: hOrtEdit.html, hOrtListe.html
// erwartet Username, hProjektId, hRaumId
window.em.erstelleNeuenOrt = function() {
	var doc = {};
	doc.Typ = "hOrt";
	doc.User = localStorage.Email;
	doc.hProjektId = localStorage.ProjektId;
	doc.hRaumId = localStorage.RaumId;
	// an hOrtEdit.html übergeben
	window.em.hOrt = doc;
	// Variabeln verfügbar machen
	delete localStorage.OrtId;
	// Globale Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	window.em.leereStorageOrtListe("mitLatLngListe");
	localStorage.Status = "neu";	// das löst bei initiiereOrtEdit die Verortung aus
	// Vorsicht: Von hOrtEdit.html aus samepage transition!
	if ($("#hOrtEdit").length > 0 && $("#hOrtEdit").attr("data-url") !== "hOrtEdit") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hOrt = JSON.stringify(window.em.hOrt);
		window.open("hOrtEdit.html", target = "_self");
	} else if ($("#hOrtEdit").length > 0 && $("#hOrtEdit").attr("data-url") === "hOrtEdit") {
		//$(":mobile-pagecontainer").pagecontainer("change", "#hOrtEdit.html", {allowSamePageTransition : true});    FUNKTIONIERT NICHT
		localStorage.hOrt = JSON.stringify(window.em.hOrt);
		window.open("hOrtEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hOrtEdit.html");
	}
};

window.em.erstelleNeuenRaum = function() {
	var doc = {};
	doc.Typ = "hRaum";
	doc.User = localStorage.Email;
	doc.hProjektId = localStorage.ProjektId;
	// in Objekt speichern, das an hRaumEdit.html übergeben wird
	window.em.hRaum = doc;
	// Variabeln verfügbar machen
	delete localStorage.RaumId;
	localStorage.Status = "neu";
	// Globale Variablen für RaumListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	window.em.leereStorageRaumListe("mitLatLngListe");
	// Vorsicht: Von hRaumEdit.html aus same page transition!
	if ($("#hRaumEdit").length > 0 && $("#hRaumEdit").attr("data-url") !== "hRaumEdit") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hRaum = JSON.stringify(window.em.hRaum);
		window.open("hRaumEdit.html", target = "_self");
	} else if ($("#hRaumEdit").length > 0 && $("#hRaumEdit").attr("data-url") === "hRaumEdit") {
		//$(":mobile-pagecontainer").pagecontainer("change", "#hRaumEdit.html", {allowSamePageTransition : "true"});   FUNKTIONIERT NICHT
		localStorage.hRaum = JSON.stringify(window.em.hRaum);
		window.open("hRaumEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hRaumEdit.html");
	}
};

// erstellt ein Objekt für ein neues Projekt und öffnet danach hProjektEdit.html
// das Objekt wird erst von initiiereProjektEdit gespeichert (einen DB-Zugriff sparen)
window.em.erstelleNeuesProjekt = function() {
	var doc = {};
	doc.Typ = "hProjekt";
	doc.User = localStorage.Email;
	// damit hProjektEdit.html die hBeob nicht aus der DB holen muss
	window.em.hProjekt = doc;
	// ProjektId faken, sonst leitet die edit-Seite an die oberste Liste weiter
	delete localStorage.ProjektId;
	localStorage.Status = "neu";
	// Globale Variablen für hProjektListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	window.em.leereStorageProjektListe("mitLatLngListe");
	// Vorsicht: Von hProjektEdit.html aus same page transition!
	if ($("#hProjektEdit").length > 0 && $("#hProjektEdit").attr("data-url") !== "hProjektEdit") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hProjekt = JSON.stringify(window.em.hProjekt);
		window.open("hProjektEdit.html", target = "_self");
	} else if ($("#hProjektEdit").length > 0 && $("#hProjektEdit").attr("data-url") === "hProjektEdit") {
		//$.mobile.navigate($("#hProjektEdit"), {allowSamePageTransition: true});    FUNKTIONIERT NICHT
		localStorage.hProjekt = JSON.stringify(window.em.hProjekt);
		window.open("hProjektEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hProjektEdit.html");
	}
};

window.em.öffneMeineEinstellungen = function() {
	$.mobile.navigate("UserEdit.html");
};

window.em.löscheDokument = function(DocId) {
	$db = $.couch.db("evab");
	return $db.openDoc(DocId, {
		success: function(document) {
			$db.removeDoc(document, {
				success: function(document) {
					return true;
				},
				error: function(document) {
					return false;
				}
			});
		},
		error: function(document) {
			return false;
		}
	});
};

// initiiert Variabeln, fixe Felder und dynamische Felder in BeobEdit.html
// wird aufgerufen von BeobEdit.html und Felder_Beob.html
window.em.initiiereBeobEdit = function() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängeBE').hide();
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.em.FeldlisteBeobEdit) {
		window.em.initiiereBeobEdit_2();
	} else {
		// das dauert länger - hinweisen
		$("#BeobEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeBeob?include_docs=true', {
			success: function(data) {
				// Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				window.em.FeldlisteBeobEdit = data;
				window.em.initiiereBeobEdit_2();
			}
		});
	}
};

// allfällige Beob übernehmen von speichereNeueBeob
// um die DB-Abfrage zu sparen
window.em.initiiereBeobEdit_2 = function() {
	// achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
	if (window.em.Beobachtung && (!localStorage.Von || localStorage.Von !== "BeobEdit")) {
		window.em.initiiereBeobEdit_3();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.BeobId, {
			success: function(data) {
				window.em.Beobachtung = data;
				window.em.initiiereBeobEdit_3();
			}
		});
	}
};

window.em.initiiereBeobEdit_3 = function() {
	// diese (globalen) Variabeln werden in BeobEdit.html gebraucht
	// bei neuen Beob hat das Objekt noch keine ID
	if (window.em.Beobachtung._id) {
		localStorage.BeobId = window.em.Beobachtung._id;
	} else {
		localStorage.BeobId = "neu";
	}
	localStorage.aArtGruppe = window.em.Beobachtung.aArtGruppe;
	localStorage.aArtName = window.em.Beobachtung.aArtName;
	localStorage.aArtId = window.em.Beobachtung.aArtId;
	localStorage.oLongitudeDecDeg = window.em.Beobachtung.oLongitudeDecDeg || "";
	localStorage.oLatitudeDecDeg = window.em.Beobachtung.oLatitudeDecDeg || "";
	localStorage.oLagegenauigkeit = window.em.Beobachtung.oLagegenauigkeit || "";
	localStorage.oXKoord = window.em.Beobachtung.oXKoord;
	localStorage.oYKoord = window.em.Beobachtung.oYKoord;
	window.em.setzeFixeFelderInBeobEdit(window.em.Beobachtung);
	window.em.erstelleDynamischeFelderBeobEdit();
	window.em.blendeMenus();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// und aktualisiert die Links für pagination
// Mitgeben: id der Beobachtung, Username
window.em.erstelleDynamischeFelderBeobEdit = function() {
	var HtmlContainer = window.em.generiereHtmlFuerBeobEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	} else {
		HtmlContainer = "";
	}
	// nötig, weil sonst die dynamisch eingefügten Elemente nicht erscheinen (Felder) bzw. nicht funktionieren (links)
	$("#BeobEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	$("#BeobEdit").trigger("create").trigger("refresh");
};

// setzt die Values in die hart codierten Felder im Formular BeobEdit.html
// erwartet das Objekt Beob, welches die Werte enthält
window.em.setzeFixeFelderInBeobEdit = function() {
	$("[name='aArtGruppe']").selectmenu();
	$("[name='aArtGruppe']").html("<option value='" + window.em.Beobachtung.aArtGruppe + "'>" + window.em.Beobachtung.aArtGruppe + "</option>");
	$("[name='aArtGruppe']").val(window.em.Beobachtung.aArtGruppe);
	$("[name='aArtGruppe']").selectmenu("refresh");
	$("[name='aArtName']").selectmenu();
	$("[name='aArtName']").html("<option value='" + window.em.Beobachtung.aArtName + "'>" + window.em.Beobachtung.aArtName + "</option>");
	$("[name='aArtName']").val(window.em.Beobachtung.aArtName);
	$("[name='aArtName']").selectmenu("refresh");
	$("[name='aAutor']").val(window.em.Beobachtung.aAutor);
	$("[name='oXKoord']").val(window.em.Beobachtung.oXKoord);
	$("[name='oYKoord']").val(window.em.Beobachtung.oYKoord);
	$("[name='oLagegenauigkeit']").val(window.em.Beobachtung.oLagegenauigkeit);
	$("[name='zDatum']").val(window.em.Beobachtung.zDatum);
	$("[name='zUhrzeit']").val(window.em.Beobachtung.zUhrzeit);
};

// generiert das Html für das Formular in BeobEdit.html
// erwartet Feldliste als Objekt; Beob als Objekt, Artgruppe
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerBeobEditForm = function() {
	var Feld = {},
		i,
		FeldName,
		FeldBeschriftung,
		Optionen,
		HtmlContainer = "",
		Status = localStorage.Status,
		ArtGruppe = window.em.Beobachtung.aArtGruppe;
	for (i in window.em.FeldlisteBeobEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.em.FeldlisteBeobEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusEinfach.indexOf(localStorage.Email) !== -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1) {
				// In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
				// vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
				if (Feld.Hierarchiestufe !== "Art" || (typeof Feld.ArtGruppe !== "undefined" && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0)) {
					if (Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
						FeldWert = Feld.Standardwert[localStorage.Email];
						// Objekt Beob um den Standardwert ergänzen, um später zu speichern
						window.em.Beobachtung[FeldName] = FeldWert;
					} else {
						// "" verhindert die Anzeige von undefined im Feld
						FeldWert = window.em.Beobachtung[FeldName] || "";
					}
					FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
					Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
					HtmlContainer += window.em.generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp);
				}
			}
		}
	}
	if (localStorage.Status === "neu") {
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.em.Beobachtung, {
			success: function(data) {
				window.em.Beobachtung._id = data.id;
				window.em.Beobachtung._rev = data.rev;
				localStorage.BeobId = data.id;
				window.em.GetGeolocation(data.id, "Beobachtung");
			}
		});
		delete localStorage.Status;
	} else {
		// Neue Datensätze haben keine Attachments
		window.em.zeigeAttachments(window.em.Beobachtung, "BE");
	}
	return HtmlContainer;
};

// BeobListe in BeobList.html vollständig neu aufbauen
window.em.initiiereBeobliste = function() {
	// hat BeobEdit.html eine BeobListe übergeben?
	if (window.em.BeobListe) {
		// Beobliste aus globaler Variable holen - muss nicht geparst werden
		window.em.initiiereBeobliste_2();
	} else {
		// Beobliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/BeobListe?startkey=["' + localStorage.Email + '",{}]&endkey=["' + localStorage.Email + '"]&descending=true&include_docs=true', {
			success: function(data) {
				// BeobListe für BeobEdit bereitstellen
				window.em.BeobListe = data;
				window.em.initiiereBeobliste_2();
			}
		});
	}
};

window.em.initiiereBeobliste_2 = function() {
	var i,
		anzBeob = window.em.BeobListe.rows.length,
		beob,
		key,
		ListItemContainer = "",
		Titel2,
		artgruppenname;

	// Im Titel der Seite die Anzahl Beobachtungen anzeigen
	Titel2 = " Beobachtungen";
	if (anzBeob === 1) {
		Titel2 = " Beobachtung";
	}
	$("#BeobListePageHeader .BeobListePageTitel").text(anzBeob + Titel2);

	if (anzBeob === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueBeobBeobListe">Erste Beobachtung erfassen</a></li>';
	} else {
		for (i in window.em.BeobListe.rows) {
			if (typeof i !== "function") {
				beob = window.em.BeobListe.rows[i].doc;
				key = window.em.BeobListe.rows[i].key;
				artgruppenname = encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + ".png";
				if (beob.aArtGruppe === "DiverseInsekten") {
					artgruppenname = "unbenannt.png";
				}
				ListItemContainer += "<li class=\"beob ui-li-has-thumb\" id=\"";
				ListItemContainer += beob._id;
				ListItemContainer += "\"><a href=\"BeobEdit.html\"><img class=\"ui-li-thumb\" src=\"";
				ListItemContainer += "Artgruppenbilder/" + artgruppenname;
				ListItemContainer += "\" /><h3 class=\"aArtName\">";
				ListItemContainer += beob.aArtName;
				ListItemContainer += "<\/h3><p class=\"zUhrzeit\">";
				ListItemContainer += beob.zDatum;
				ListItemContainer += "&nbsp; &nbsp;";
				ListItemContainer += beob.zUhrzeit;
				ListItemContainer += "<\/p><\/a> <\/li>";
			}
		}
	}
	$("#BeoblisteBL").html(ListItemContainer);
	$("#BeoblisteBL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#BeobListe").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// löscht Anhänge
// erwartet den Datensatz als Objekt und das Objekt, dass geklickt wurde
window.em.loescheAnhang = function(that, Objekt, id) {
	if (Objekt) {
		// Es wurde ein Objekt übergeben, keine DB-Abfrage nötig
		window.em.loescheAnhang_2(that, Objekt);
	} else {
		// Objekt aus der DB holen
		$db = $.couch.db("evab");
		$db.openDoc(id, {
			success: function(data) {
				window.em[Objekt.Typ] = data;
				window.em.loescheAnhang_2(that, window.em[Objekt.Typ]);
			},
			error: function() {
				window.em.melde("Fehler: Anhang wurde nicht entfernt");
			}
		});
	}
};

window.em.loescheAnhang_2 = function(that, Objekt) {
	var Dateiname = that.id;
	// Anhang aus Objekt entfernen
	delete window.em[Objekt.Typ]._attachments[Dateiname];
	// Objekt in DB speichern
	$db.saveDoc(window.em[Objekt.Typ], {
		success: function(data) {
			// rev im Objekt ergänzen
			// die globale Variable heisst gleich, wie der Typ im Objekt
			window.em[Objekt.Typ]._rev = data.rev;
			// im Formular den Anhang und die Lösch-Schaltfläche entfernen
			$(that).parent().parent().remove();
		},
		error: function() {
			window.em.melde("Fehler: Anhänge werden nicht richtig angezeigt");
		}
	});
};

// initiiert UserEdit.html
window.em.initiiereUserEdit = function() {
	$("#ue_Email").val(localStorage.Email);
	$("[name='Datenverwendung']").checkboxradio();
	if (localStorage.Autor) {
		$("#Autor").val(localStorage.Autor);
	}
	$.couch.userDb(function(db) {
		db.openDoc("org.couchdb.user:" + localStorage.Email, {
			success: function(User) {
				// fixe Felder aktualisieren
				if (User.Datenverwendung) {
					$("#" + User.Datenverwendung).prop("checked",true).checkboxradio("refresh");
					localStorage.Datenverwendung = User.Datenverwendung;
				} else {
					// Standardwert setzen
					$("#JaAber").prop("checked",true).checkboxradio("refresh");
				}
				window.em.blendeMenus();
				window.em.speichereLetzteUrl();
			},
			error: function() {
				console.log('Fehler in window.em.initiiereUserEdit');
				// Standardwert setzen
				$("#JaAber").prop("checked",true).checkboxradio("refresh");
			}
		});
	});
};

// initiiert Installieren.html
// kurz, da keine Daten benötigt werden
window.em.initiiereInstallieren = function() {
	window.em.blendeMenus();
	window.em.speichereLetzteUrl();
};

// generiert in hProjektEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Projekts, Username
// bei neuen Projekten wird das zuvor erzeugte Projekt übernommen, um die DB-Anfrage zu sparen
window.em.initiiereProjektEdit = function() {
	// Anhänge ausblenden, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	//$('#AnhängehPE').hide().trigger('updatelayout');
	// window.em.hProjekt existiert schon bei neuem Projekt
	if (window.em.hProjekt) {
		window.em.initiiereProjektEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hProjekt) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.em.hProjekt = JSON.parse(localStorage.hProjekt);
		delete localStorage.hProjekt;
		window.em.initiiereProjektEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ProjektId, {
			success: function(data) {
				window.em.hProjekt = data;
				window.em.initiiereProjektEdit_2();
			},
			error: function() {
				// hoppla, zu dieser ID gibt es kein Projekt > Speicher löschen und Liste anzeigen
				window.em.leereStorageProjektEdit("mitLatLngListe");
				$.mobile.navigate("hProjektListe.html");
			}
		});
	}
};

window.em.initiiereProjektEdit_2 = function() {
	// fixe Felder aktualisieren
	$("#pName").val(window.em.hProjekt.pName);
	// Variabeln bereitstellen (bei neuen Projekten wird ProjektId später nachgeschoben)
	if (window.em.hProjekt._id) {
		localStorage.ProjektId = window.em.hProjekt._id;
	} else {
		localStorage.ProjektId = "neu";
	}
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.em.FeldlisteProjekt) {
		window.em.initiiereProjektEdit_3();
	} else {
		// das dauert länger - Hinweis einblenden
		$("#hProjektEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// Feldliste aus der DB holen
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeProjekt?include_docs=true', {
			success: function(Feldliste) {
				window.em.FeldlisteProjekt = Feldliste;
				window.em.initiiereProjektEdit_3();
			}
		});
	}
};

window.em.initiiereProjektEdit_3 = function() {
	var HtmlContainer = window.em.generiereHtmlFuerProjektEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hProjektEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	window.em.blendeMenus();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// generiert das Html für das Formular in hProjektEdit.html
// erwartet Feldliste als Objekt; Projekt als Objekt
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerProjektEditForm = function() {
	var i,
		Feld = {},
		FeldName,
		FeldBeschriftung,
		Optionen,
		HtmlContainer = "";
	for (i in window.em.FeldlisteProjekt.rows) {
		if (typeof i !== "function") {
			Feld = window.em.FeldlisteProjekt.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1 && FeldName !== "pName") {
				if (localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
					FeldWert = Feld.Standardwert[localStorage.Email];
					// window.em.hProjekt um den Standardwert ergänzen, um später zu speichern
					window.em.hProjekt[FeldName] = FeldWert;
				} else {
					//"" verhindert die Anzeige von undefined im Feld
					FeldWert = window.em.hProjekt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += window.em.generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp);
			}
		}
	}
	if (localStorage.Status === "neu") {
		$("#pName").focus();
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.em.hProjekt, {
			success: function(data) {
				window.em.hProjekt._id = data.id;
				window.em.hProjekt._rev = data.rev;
				//
				localStorage.ProjektId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// neue Datensätze haben keine Attachments
		window.em.zeigeAttachments(window.em.hProjekt, "hPE");
	}
	return HtmlContainer;
};

// initiiert FeldEdit.html
window.em.initiiereFeldEdit = function() {
	// Bei neuem Feld gibt es Feld schon
	if (window.em.Feld) {
		window.em.initiiereFeldEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function(doc) {
				// Feld bereitstellen
				window.em.Feld = doc;
				window.em.initiiereFeldEdit_2();
			}
		});
	}
};

window.em.initiiereFeldEdit_2 = function() {
	var SichtbarImModusHierarchisch = window.em.Feld.SichtbarImModusHierarchisch,
		SichtbarImModusEinfach = window.em.Feld.SichtbarImModusEinfach,
		Standardwert;

	// alle radio und checkboxen leeren (damit keine voher gewählten Werte verbleiben)
	window.em.checkAllRadiosOfForm("FeldEdit", false);

	// Sichtbarkeit anzeigen
	if (SichtbarImModusHierarchisch && SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1) {
		$("#SichtbarImModusHierarchisch").val("ja");
		$("#SichtbarImModusHierarchisch_ja").prop("checked",true).checkboxradio("refresh");
	} else {
		$("#SichtbarImModusHierarchisch").val("nein");
		$("#SichtbarImModusHierarchisch_nein").prop("checked",true).checkboxradio("refresh");
	}
	if (SichtbarImModusEinfach && SichtbarImModusEinfach.indexOf(localStorage.Email) !== -1) {
		$("#SichtbarImModusEinfach").val("ja");
		$("#SichtbarImModusEinfach_ja").prop("checked",true).checkboxradio("refresh");
	} else {
		$("#SichtbarImModusEinfach").val("nein");
		$("#SichtbarImModusEinfach_nein").prop("checked",true).checkboxradio("refresh");
	}

	// Artgruppe Aufbauen, wenn Hierarchiestufe == Art
	if (window.em.Feld.Hierarchiestufe === "Art") {
		window.em.ArtGruppeAufbauenFeldEdit(window.em.Feld.ArtGruppe);
	}

	// allfälligen Standardwert anzeigen
	// Standardwert ist Objekt, darin werden die Standardwerte aller Benutzer gespeichert
	// darum hier auslesen und setzen
	// Zuerst leeren Wert setzen, sonst bleibt letzter, wenn keiner existiert!
	$("#Standardwert").val("");
	if (window.em.Feld.Standardwert) {
		Standardwert = window.em.Feld.Standardwert[localStorage.Email];
		if (Standardwert) {
			$("#Standardwert").val(Standardwert);
		}
	}

	if (window.em.Feld.FeldName) {
		// fix in Formulare eingebaute Felder: Standardwerte ausblenden und erklären
		if (["aArtGruppe", "aArtName"].indexOf(window.em.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", "Keine Voreinstellung möglich");
			$("#Standardwert").attr("disabled", true);
		// ausschalten, soll jetzt im Feld verwaltet werden
		/*} else if (window.em.Feld.FeldName === "aAutor") {
			$("#Standardwert").attr("placeholder", 'Bitte im Menü "meine Einstellungen" voreinstellen');
			$("#Standardwert").attr("disabled", true);*/
		} else if (["oXKoord", "oYKoord", "oLatitudeDecDeg", "oLongitudeDecDeg", "oLagegenauigkeit"].indexOf(window.em.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", 'Lokalisierung erfolgt automatisch, keine Voreinstellung möglich');
			$("#Standardwert").attr("disabled", true);
		} else if (["zDatum", "zUhrzeit"].indexOf(window.em.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", 'Standardwert ist "jetzt", keine Voreinstellung möglich');
			$("#Standardwert").attr("disabled", true);
		}
	}
	$(".FeldEditHeaderTitel").text(window.em.Feld.Hierarchiestufe + ": " + window.em.Feld.FeldBeschriftung);

	// Radio Felder initiieren (ausser ArtGruppe, das wird dynamisch erzeugt)
	$("input[name='Hierarchiestufe']").checkboxradio();
	$("#" + window.em.Feld.Hierarchiestufe).prop("checked",true).checkboxradio("refresh");
	$("input[name='Formularelement']").checkboxradio();
	$("#" + window.em.Feld.Formularelement).prop("checked",true).checkboxradio("refresh");
	$("input[name='InputTyp']").checkboxradio();
	$("#" + window.em.Feld.InputTyp).prop("checked",true).checkboxradio("refresh");

	// Werte in übrige Felder einfügen
	$("#FeldName").val(window.em.Feld.FeldName);
	$("#FeldBeschriftung").val(window.em.Feld.FeldBeschriftung);
	$("#FeldBeschreibung").val(window.em.Feld.FeldBeschreibung);	// Textarea - anders refreshen?
	$("#Reihenfolge").val(window.em.Feld.Reihenfolge);
	$("#FeldNameEvab").val(window.em.Feld.FeldNameEvab);
	$("#FeldNameZdsf").val(window.em.Feld.FeldNameZdsf);
	$("#FeldNameCscf").val(window.em.Feld.FeldNameCscf);
	$("#FeldNameNism").val(window.em.Feld.FeldNameNism);
	$("#FeldNameWslFlechten").val(window.em.Feld.FeldNameWslFlechten);
	$("#FeldNameWslPilze").val(window.em.Feld.FeldNameWslPilze);
	$("#Optionen").val(window.em.Feld.Optionen);	// Textarea - anders refreshen?
	$("#SliderMinimum").val(window.em.Feld.SliderMinimum);
	$("#SliderMaximum").val(window.em.Feld.SliderMaximum);

	window.em.erstelleSelectFeldFolgtNach();	// BESSER: Nur aufrufen, wenn erstaufbau oder auch Feldliste zurückgesetzt wurde
	window.em.speichereLetzteUrl();
	// abhängige Felder blenden
	window.em.blendeDatentypabhängigeFelder();
	window.em.blendeMenus();
	// Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
	$(":jqmData(role='page')").focus();
};

// wird von FeldEdit.html aufgerufen
// erstellt das Selectmenu, um die Reihenfolge-Position des Felds zu bestimmen
window.em.erstelleSelectFeldFolgtNach = function() {
	// Nur bei eigenen Feldern anzeigen
	if (window.em.Feld.User !== "ZentrenBdKt") {
		if (window.em.Feldliste) {
			// Feldliste aus globaler Variable verwenden - muss nicht geparst werden
			window.em.erstelleSelectFeldFolgtNach_2();
		} else {
			$db = $.couch.db("evab");
			$db.view("evab/FeldListe?include_docs=true", {
				success: function(data) {
					window.em.Feldliste = data;
					window.em.erstelleSelectFeldFolgtNach_2();
				}
			});
		}
	}
};

window.em.erstelleSelectFeldFolgtNach_2 = function() {
	var i,
		TempFeld,
		Optionen = [];
	Optionen.push("");
	for (i in window.em.Feldliste.rows) {
		if (typeof i !== "function") {
			TempFeld = window.em.Feldliste.rows[i].doc;
			// Liste aufbauen
			// Nur eigene Felder und offizielle
			if (TempFeld.User === localStorage.Email || TempFeld.User === "ZentrenBdKt") {
				Optionen.push(TempFeld.FeldName);
			}
		}
	}
	HtmlContainer = window.em.generiereHtmlFuerSelectmenu("FeldFolgtNach", "Feld folgt nach:", "", Optionen, "SingleSelect");
	$("#FeldFolgtNachDiv").html(HtmlContainer).trigger("create").trigger("refresh");
};

// wird benutzt in FeldEdit.html
// von je einer Funktion in FeldEdit.html und evab.js
// Funktion ist zweigeteilt, um wenn möglich Datenbankabfragen zu sparen
window.em.ArtGruppeAufbauenFeldEdit = function(ArtGruppenArrayIn) {
	if (window.em.Artgruppen) {
		// Artgruppen von globaler Variable holen
		window.em.ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else if (localStorage.Artgruppen) {
		// Artgruppen aus localStorage holen und parsen
		window.em.Artgruppen = JSON.parse(localStorage.Artgruppen);
		window.em.ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else {
		// Artgruppen aus DB holen
		$db = $.couch.db("evab");
		$("select#ArtGruppe").empty();
		$db.view("evab/Artgruppen", {
			success: function(data) {
				window.em.Artgruppen = data;
				localStorage.Artgruppen = JSON.stringify(data);
				window.em.ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
			}
		});
	}
};

window.em.ArtGruppeAufbauenFeldEdit_2 = function(ArtGruppenArrayIn) {
	var i,
		ArtGruppe,
		ListItemContainer = "<fieldset data-role='controlgroup'><legend>In diesen Artgruppen kann das Feld angezeigt werden (erforderlich):</legend>",
		listItem,
		ArtGruppenArray = ArtGruppenArrayIn || [];
	for (i in window.em.Artgruppen.rows) {
		if (typeof i !== "function") {
			ArtGruppe = window.em.Artgruppen.rows[i].key;
			listItem = "<input type='checkbox' class='custom Feldeigenschaften' name='ArtGruppe' id='";
			listItem += ArtGruppe;
			listItem += "' value='";
			listItem += ArtGruppe;
			if (ArtGruppenArray.indexOf(ArtGruppe) !== -1) {
				listItem += "' checked='checked";
			}
			listItem += "'/>\n<label for='";
			listItem += ArtGruppe;
			listItem += "'>";
			listItem += ArtGruppe;
			listItem += "</label>";
			ListItemContainer += listItem;
		}
	}
	ListItemContainer += "\n</fieldset>";
	$("#Artgruppenliste_FeldEdit").html(ListItemContainer).trigger("create").trigger("refresh");
};

// initiiert FeldListe.html
window.em.initiiereFeldliste = function() {
	// hat FeldEdit.html eine Feldliste übergeben?
	if (window.em.Feldliste) {
		// Feldliste aus globaler Variable holen - muss nicht geparst werden
		window.em.initiiereFeldliste_2();
	} else {
		// FeldListe aus DB holen
		$db = $.couch.db("evab");
		$db.view("evab/FeldListe?include_docs=true", {
			success: function(data) {
				window.em.Feldliste = data;
				window.em.initiiereFeldliste_2();
			}
		});
	}
};

window.em.initiiereFeldliste_2 = function() {
	var i,
		TempFeld,
		anzFelder = 0,
		ImageLink,
		ListItemContainer = "",
		Hierarchiestufe,
		FeldBeschriftung,
		FeldBeschreibung;
	for (i in window.em.Feldliste.rows) {
		if (typeof i !== "function") {
			TempFeld = window.em.Feldliste.rows[i].doc;
			// Liste aufbauen
			// Nur eigene Felder und offizielle
			if (TempFeld.User === localStorage.Email || TempFeld.User === "ZentrenBdKt") {
				Hierarchiestufe = TempFeld.Hierarchiestufe;
				FeldBeschriftung = TempFeld.FeldBeschriftung || "(ohne Feldbeschriftung)";
				FeldBeschreibung = "";
				if (TempFeld.FeldBeschreibung) {
					FeldBeschreibung = TempFeld.FeldBeschreibung;
				}
				ImageLink = "Hierarchiebilder/" + Hierarchiestufe + ".png";
				ListItemContainer += "<li class=\"Feld ui-li-has-thumb\" FeldId=\"";
				ListItemContainer += TempFeld._id;
				ListItemContainer += "\"><a href=\"#\"><img class=\"ui-li-thumb\" src=\"";
				ListItemContainer += ImageLink + "\" /><h2>";
				ListItemContainer += Hierarchiestufe;
				ListItemContainer += ': ';
				ListItemContainer += FeldBeschriftung;
				ListItemContainer += "<\/h2><p>";
				ListItemContainer += FeldBeschreibung;
				ListItemContainer += "</p><\/a><\/li>";
				// Felder zählen
				anzFelder += 1;
			}
		}
	}
	// Im Titel der Seite die Anzahl Beobachtungen anzeigen
	$("#FeldListeHeader .FeldListeTitel").text(anzFelder + " Felder");
	$("#FeldListeFL").html(ListItemContainer);
	$("#FeldListeFL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#FeldListePage").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// wird benutzt von hOrtEdit.html, BeobEdit.html und Karte.html
// die Felder werden aus localStorage übernommen, die Liste ihrer Namen wird als Array FelderArray überbeben
// die Felder werden in der DB und im übergebenen Objekt "DatensatzObjekt" gespeichert
// und anschliessend in Formularfeldern aktualisiert
// function speichereKoordinaten übernimmt id und den ObjektNamen
// kontrolliert, ob das Objekt existiert
// wenn nein wird es aus der DB geholt
window.em.speichereKoordinaten = function(id, ObjektName) {
	// kontrollieren, ob Ort oder Beob als Objekt vorliegt
	if (window.em[ObjektName]) {
		// ja: Objekt verwenden
		window.em.speichereKoordinaten_2(id, ObjektName);
	} else {
		// nein: Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(id, {
			success: function(data) {
				window.em[ObjektName] = data;
				window.em.speichereKoordinaten_2(id, ObjektName);
			},
			error: function() {
				window.em.melde("Fehler: Koordinaten nicht gespeichert");
			}
		});
	}
};

// setzt das DatensatzObjekt voraus
// aktualisiert darin die Felder, welche in FelderArray aufgelistet sind
// Variablen müssen in Objekt und localStorage denselben Namen verwenden
window.em.speichereKoordinaten_2 = function(id, ObjektName) {
	var FelderArray = ["oLongitudeDecDeg", "oLongitudeDecDeg", "oLatitudeDecDeg", "oXKoord", "oYKoord", "oLagegenauigkeit", "oHöhe", "oHöheGenauigkeit"];
	window.em.speichereFelderAusLocalStorageInObjekt(ObjektName, FelderArray, "FormularAktualisieren");
	// nun die Koordinaten in den Zeiten und Arten dieses Objekts aktualisieren
	window.em.speichereFelderAusLocalStorageInObjektliste("ZeitenVonOrt", FelderArray, "hOrtId", id, "hZeitIdVonOrt");
	window.em.speichereFelderAusLocalStorageInObjektliste("ArtenVonOrt", FelderArray, "hOrtId", id, "hArtIdVonOrt");
};

// übernimmt eine Liste von Feldern und eine Objektliste (via Name)
// sucht in der Objektliste nach den Objekten mit der BezugsId
// aktualisiert diese Objekte
// wird verwendet, um die Koordinaten von Orten in Zeiten und Arten zu schreiben
// im ersten Schritt prüfen, ob die Objektliste vorhanden ist. Wenn nicht, aus DB holen
window.em.speichereFelderAusLocalStorageInObjektliste = function(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert, Querystring) {
	if (window.em[ObjektlistenName]) {
		// vorhandene Objektliste nutzen
		window.em.speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert);
	} else {
		// Objektliste aus DB holen
		var viewname = 'evab/' + Querystring + '?startkey=["' + BezugsIdWert + '"]&endkey=["' + BezugsIdWert + '",{}]&include_docs=true';
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function(data) {
				window.em[ObjektlistenName] = data;
				window.em.speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert);
			}
		});
	}
};

window.em.speichereFelderAusLocalStorageInObjektliste_2 = function(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert) {
	// in allen Objekten in der Objektliste
	var i,
		y,
		DsBulkListe = {},
		Docs = [],
		row;
	// nur machen, wenn rows vorhanden!
	if (window.em[ObjektlistenName].rows.length > 0) {
		for (i in window.em[ObjektlistenName].rows) {
			row = window.em[ObjektlistenName].rows[i].doc;
			if (typeof i !== "function") {
				// Objekte mit dem richtigen Wert in der BezugsId suchen (z.B. die richtige hOrtId)
				if (row[BezugsIdName] && row[BezugsIdName] === BezugsIdWert) {
					// im Objekt alle in FelderArray aufgelisteten Felder suchen
					for (y in FelderArray) {
						if (typeof y !== "function") {
							// und ihre Werte aktualisieren
							if (localStorage[FelderArray[y]]) {
								if (window.em.myTypeOf(localStorage[FelderArray[y]]) === "integer") {
									row[FelderArray[y]] = parseInt(localStorage[FelderArray[y]], 10);
								} else if (window.em.myTypeOf(localStorage[FelderArray[y]]) === "float") {
									row[FelderArray[y]] = parseFloat(localStorage[FelderArray[y]]);
								} else {
									row[FelderArray[y]] = localStorage[FelderArray[y]];
								}
							} else {
								delete row[FelderArray[y]];
							}
						}
					}
					Docs.push(row);
				}
			}
		}
		DsBulkListe.docs = Docs;
		// Objektliste in DB speichern
		$.ajax({
			type: "POST",
			url: "../../_bulk_docs",
			contentType: "application/json",
			data: JSON.stringify(DsBulkListe)
		}).done(function(data) {
			var z,
				k;
			// _rev in den Objekten in Objektliste aktualisieren
			// für alle zurückgegebenen aktualisierten Zeilen
			// offenbar muss data zuerst geparst werden ??!!
			data = JSON.parse(data);
			for (z in data) {
				if (typeof z !== "function") {
					// das zugehörige Objekt in der Objektliste suchen
					for (k in window.em[ObjektlistenName].rows) {
						row = window.em[ObjektlistenName].rows[k].doc;
						if (typeof k !== "function") {
							// und dessen rev aktualisieren
							if (row._id === data[z].id) {
								row._rev = data[z].rev;
								break;
							}
						}
					}
				}
			}
		});
	}
};

// Neue Daten liegen in localStorage vor
// sie werden in Objekt und in DB geschrieben
// Variablen müssen in Objekt und localStorage denselben Namen verwenden
// FelderArray enthält eine Liste der Namen der zu aktualisierenden Felder
// ObjektName ist der Name des zu aktualisierenden Objekts bzw. Datensatzes
window.em.speichereFelderAusLocalStorageInObjekt = function(ObjektName, FelderArray, FormularAktualisieren) {
	// Objekt aktualisieren
	for (var i in FelderArray) {
		if (typeof i !== "function") {
			if (localStorage[FelderArray[i]]) {
				if (window.em.myTypeOf(localStorage[FelderArray[i]]) === "integer") {
					window.em[ObjektName][FelderArray[i]] = parseInt(localStorage[FelderArray[i]], 10);
				} else if (window.em.myTypeOf(localStorage[FelderArray[i]]) === "float") {
					window.em[ObjektName][FelderArray[i]] = parseFloat(localStorage[FelderArray[i]]);
				} else {
					window.em[ObjektName][FelderArray[i]] = localStorage[FelderArray[i]];
				}
			} else {
				delete window.em[ObjektName][FelderArray[i]];
			}
		}
	}
	// in DB speichern
	$db.saveDoc(window.em[ObjektName], {
		success: function(data) {
			window.em[ObjektName]._rev = data.rev;
			if (FormularAktualisieren) {
				window.em.aktualisiereKoordinatenfelderInFormular(ObjektName);
			}
		}
	});
};

// übernimmt ein Objekt (via dessen Namen) und eine Liste von Feldern (FelderArray)
// setzt in alle Felder mit den Namen gemäss FelderArray die Werte gemäss Objekt
window.em.aktualisiereKoordinatenfelderInFormular = function(ObjektName, FelderArray) {
	for (var i in FelderArray) {
		if (typeof i !== "function") {
			$("[name='" + FelderArray[i] + "']").val(window.em[ObjektName][FelderArray[i]] || null);
		}
	}
};

// dient der Unterscheidung von Int und Float
// NICHT BENUTZT
window.em.isInt = function(n) {
	return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
};

// Hilfsfunktion, die typeof ersetzt und ergänzt
// typeof gibt bei input-Feldern immer String zurück!
window.em.myTypeOf = function(Wert) {
	if (typeof Wert === "boolean") {
		return "boolean";
	} else if (parseInt(Wert, 10) && parseFloat(Wert) && parseInt(Wert, 10) != parseFloat(Wert) && parseInt(Wert, 10) == Wert) {
		// es ist eine Float
		return "float";
	} else if (parseInt(Wert, 10) == Wert) {
		// es ist eine Integer
		return "integer";
	} else {
		// als String behandeln
		return "string";
	}
};

// Übernimmt einen Feldnamen, einen Feldwert
// und eine Datensatzliste (z.B. alle Räume eines Projekts) sowie ihren Namen
// speichert das neue Feld in alle Datensätze der Liste in der DB
// und aktualisiert die Liste selber, damit sie das nächste mal nicht in der DB geholt werden muss
// NICHT IM GEBRAUCH
window.em.speichereFeldInDatensatzliste = function(Feldname, Feldwert, DatensatzlisteName) {
	var i,
		DsBulkListe = {},
		Docs = [],
		row;
	// nur machen, wenn Datensätze da sind
	for (i in DatensatzlisteName.rows) {
		row = DatensatzlisteName.rows[i].doc;
		if (Feldwert) {
			if (window.em.myTypeOf(Feldwert) === "float") {
				row[Feldname] = parseFloat(Feldwert);
			} else if (window.em.myTypeOf(Feldwert) === "integer") {
				row[Feldname] = parseInt(Feldwert, 10);
			} else {
				row[Feldname] = Feldwert;
			}
		} else if (row[Feldname]) {
			delete row[Feldname];
		}
		Docs.push(row);
	}
	DsBulkListe.docs = Docs;
	$.ajax({
		type: "POST",
		url: "../../_bulk_docs",
		contentType: "application/json",
		data: JSON.stringify(DsBulkListe)
	});
};

// löscht Datensätze in Massen
// nimmt das Ergebnis einer Abfrage entgegen, welche im key einen Array hat
// Array[0] ist fremde _id (mit der die Abfrage gefiltert wurde),
// Array[1] die _id des zu löschenden Datensatzes und Array[2] dessen _rev
window.em.loescheIdIdRevListe = function(Datensatzobjekt) {
	var i,
		ObjektMitDeleteListe = {},
		Docs = [],
		Datensatz,
		rowkey;
	for (i in Datensatzobjekt.rows) {
		if (typeof i !== "function") {
			// unsere Daten sind im key
			rowkey = Datensatzobjekt.rows[i].key;
			Datensatz = {};
			Datensatz._id = rowkey[1];
			Datensatz._rev = rowkey[2];
			Datensatz._deleted = true;
			Docs.push(Datensatz);
		}
	}
	ObjektMitDeleteListe.docs = Docs;
	$.ajax({
		type: "POST",
		url: "../../_bulk_docs",
		contentType: "application/json",
		data: JSON.stringify(ObjektMitDeleteListe)
	});
};


window.em.initiiereProjektliste = function() {
	// hat hProjektEdit.html eine Projektliste übergeben?
	console.log("Projektliste wird initiiert");
	if (window.em.Projektliste) {
		window.em.initiiereProjektliste_2();
	} else {
		// Daten für die Projektliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hProjListe?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{}]&include_docs=true', {
			success: function(data) {
				// Projektliste für hProjektEdit bereitstellen
				window.em.Projektliste = data;
				window.em.initiiereProjektliste_2();
			}
		});
	}
};

window.em.initiiereProjektliste_2 = function() {
	var i,
		anzProj = window.em.Projektliste.rows.length,
		Proj,
		key,
		pName,
		listItem,
		ListItemContainer = "",
		Titel2;

	// Im Titel der Seite die Anzahl Projekte anzeigen
	Titel2 = " Projekte";
	if (anzProj === 1) {
		Titel2 = " Projekt";
	}
	$("#hProjektListePageHeader .hProjektListePageTitel").text(anzProj + Titel2);

	if (anzProj === 0) {
		ListItemContainer = "<li><a href='#' class='erste NeuesProjektProjektListe'>Erstes Projekt erfassen</a></li>";
	} else {
		for (i in window.em.Projektliste.rows) {			// Liste aufbauen
			if (typeof i !== "function") {
				Proj = window.em.Projektliste.rows[i].doc;
				key = window.em.Projektliste.rows[i].key;
				pName = key[1];
				listItem = "<li ProjektId=\"" + Proj._id + "\" class=\"Projekt\">";
				listItem += "<a href=\"#\">";
				listItem += "<h3>" + pName + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#ProjektlistehPL").html(ListItemContainer);
	$("#ProjektlistehPL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#hProjektListe").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// generiert in hRaumEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Raums, Username
// Bei neuen Räumen wird der Raum übernommen um eine DB-Abfrage zu sparen
window.em.initiiereRaumEdit = function() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehRE').hide();
	if (window.em.hRaum) {
		window.em.initiiereRaumEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hRaum) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.em.hRaum = JSON.parse(localStorage.hRaum);
		delete localStorage.hRaum;
		window.em.initiiereRaumEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.RaumId, {
			success: function(data) {
				window.em.hRaum = data;
				window.em.initiiereRaumEdit_2();
			}
		});
	}
};

window.em.initiiereRaumEdit_2 = function() {
	// fixes Feld setzen
	$("#rName").val(window.em.hRaum.rName);
	// Variabeln bereitstellen
	localStorage.ProjektId = window.em.hRaum.hProjektId;
	// bei neuen Räumen hat das Objekt noch keine ID
	if (window.em.hRaum._id) {
		localStorage.RaumId = window.em.hRaum._id;
	} else {
		localStorage.RaumId = "neu";
	}
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.em.FeldlisteRaumEdit) {
		window.em.initiiereRaumEdit_3();
	} else {
		// das dauert länger - hinweisen
		$("#hRaumEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeRaum?include_docs=true', {
			success: function(Feldliste) {
				// Variabeln bereitstellen
				window.em.FeldlisteRaumEdit = Feldliste;
				window.em.initiiereRaumEdit_3();
			}
		});
	}
};

window.em.initiiereRaumEdit_3 = function() {
	var HtmlContainer = window.em.generiereHtmlFuerRaumEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hRaumEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	window.em.blendeMenus();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// generiert das Html für das Formular in hRaumEdit.html
// erwartet Feldliste als Objekt; window.em.hRaum als Objekt
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerRaumEditForm = function() {
	var Feld = {},
		i,
		FeldName,
		FeldBeschriftung,
		Optionen,
		HtmlContainer = "";
	for (i in window.em.FeldlisteRaumEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.em.FeldlisteRaumEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1 && FeldName !== "rName") {
				if (localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
					FeldWert = Feld.Standardwert[localStorage.Email];
					// Objekt window.em.hRaum um den Standardwert ergänzen, um später zu speichern
					window.em.hRaum[FeldName] = FeldWert;
				} else {
					//"" verhindert die Anzeige von undefined im Feld
					FeldWert = window.em.hRaum[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += window.em.generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp);
			}
		}
	}
	// In neuen Datensätzen allfällige Standardwerte speichern
	if (localStorage.Status === "neu") {
		$("#rName").focus();
		$db = $.couch.db("evab");
		$db.saveDoc(window.em.hRaum, {
			success: function(data) {
				window.em.hRaum._id = data.id;
				window.em.hRaum._rev = data.rev;
				localStorage.RaumId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// Attachments gibt's bei neuen Datensätzen nicht
		window.em.zeigeAttachments(window.em.hRaum, "hRE");
	}
	return HtmlContainer;
};

window.em.initiiereRaumListe = function() {
	// hat hRaumEdit.html eine RaumListe übergeben?
	if (window.em.RaumListe) {
		// Raumliste aus globaler Variable holen - muss nicht geparst werden
		window.em.initiiereRaumListe_2();
	} else {
		// Raumliste aud DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hRaumListe?startkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// RaumListe für haumEdit bereitstellen
				window.em.RaumListe = data;
				window.em.initiiereRaumListe_2();
			}
		});
	}
};

window.em.initiiereRaumListe_2 = function() {
	var i,
		anzRaum = window.em.RaumListe.rows.length,
		Raum,
		key,
		rName,
		listItem,
		ListItemContainer = "",
		Titel2;

	// Im Titel der Seite die Anzahl Räume anzeigen
	Titel2 = " Räume";
	if (anzRaum === 1) {
		Titel2 = " Raum";
	}
	$("#hRaumListePageHeader .hRaumListePageTitel").text(anzRaum + Titel2);

	if (anzRaum === 0) {
		ListItemContainer = '<li><a href="#" name="NeuerRaumRaumListe" class="erste">Ersten Raum erfassen</a></li>';
	} else {
		for (i in window.em.RaumListe.rows) {	// Liste aufbauen
			if (typeof i !== "function") {
				Raum = window.em.RaumListe.rows[i].doc;
				key = window.em.RaumListe.rows[i].key;
				rName = Raum.rName;
				listItem = "<li RaumId=\"" + Raum._id + "\" class=\"Raum\"><a href=\"#\"><h3>" + rName + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#RaumlistehRL").html(ListItemContainer);
	$("#RaumlistehRL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#hRaumListe").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// generiert in hOrtEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Orts
window.em.initiiereOrtEdit = function() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehOE').hide();
	if (window.em.hOrt) {
		window.em.initiiereOrtEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hOrt) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.em.hOrt = JSON.parse(localStorage.hOrt);
		delete localStorage.hOrt;
		window.em.initiiereOrtEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.OrtId, {
			success: function(data) {
				window.em.hOrt = data;
				window.em.initiiereOrtEdit_2();
			}
		});
	}
};

window.em.initiiereOrtEdit_2 = function() {
	// fixe Felder aktualisieren
	$("[name='oName']").val(window.em.hOrt.oName);
	$("[name='oXKoord']").val(window.em.hOrt.oXKoord);
	$("[name='oYKoord']").val(window.em.hOrt.oYKoord);
	$("[name='oLagegenauigkeit']").val(window.em.hOrt.oLagegenauigkeit);
	// Variabeln bereitstellen
	localStorage.ProjektId = window.em.hOrt.hProjektId;
	localStorage.RaumId = window.em.hOrt.hRaumId;
	// bei neuen Orten hat das Objekt noch keine ID
	if (window.em.hOrt._id) {
		localStorage.OrtId = window.em.hOrt._id;
	} else {
		localStorage.OrtId = "neu";
	}
	// Lat Lng werden geholt. Existieren sie nicht, erhalten Sie den Wert ""
	localStorage.oLongitudeDecDeg = window.em.hOrt.oLongitudeDecDeg;
	localStorage.oLatitudeDecDeg = window.em.hOrt.oLatitudeDecDeg;
	localStorage.oLagegenauigkeit = window.em.hOrt.oLagegenauigkeit;
	localStorage.oXKoord = window.em.hOrt.oXKoord;
	localStorage.oYKoord = window.em.hOrt.oYKoord;
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.em.FeldlisteOrtEdit) {
		window.em.initiiereOrtEdit_3();
	} else {
		// das dauert länger - hinweisen
		$("#hOrtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeOrt?include_docs=true', {
			success: function(Feldliste) {
				// Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				window.em.FeldlisteOrtEdit = Feldliste;
				window.em.initiiereOrtEdit_3();
			}
		});
	}
};

window.em.initiiereOrtEdit_3 = function() {
	var HtmlContainer = window.em.generiereHtmlFuerOrtEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hOrtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	window.em.blendeMenus();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// generiert das Html für das Formular in hOrtEdit.html
// erwartet Feldliste als Objekt (aus der globalen Variable); window.em.hOrt als Objekt
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerOrtEditForm = function() {
	var i,
		Feld = {},
		FeldName,
		FeldBeschriftung,
		Optionen,
		HtmlContainer = "";
	for (i in window.em.FeldlisteOrtEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.em.FeldlisteOrtEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.em.hOrt.User) !== -1 && (FeldName !== "oName") && (FeldName !== "oXKoord") && (FeldName !== "oYKoord") && (FeldName !== "oLagegenauigkeit")) {
				if (localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
					FeldWert = Feld.Standardwert[localStorage.Email];
					// Objekt window.em.hOrt um den Standardwert ergänzen, um später zu speichern
					window.em.hOrt[FeldName] = FeldWert;
				} else {
					//"" verhindert die Anzeige von undefined im Feld
					FeldWert = window.em.hOrt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += window.em.generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp);
			}
		}
	}
	// Allfällige Standardwerte speichern
	if (localStorage.Status === "neu") {
		$("[name='oName']").focus();
		$db = $.couch.db("evab");
		$db.saveDoc(window.em.hOrt, {
			success: function(data) {
				window.em.hOrt._id = data.id;
				window.em.hOrt._rev = data.rev;
				localStorage.OrtId = data.id;
				window.em.GetGeolocation(data.id, "hOrt");
			}
		});
		// Status zurücksetzen - es soll nur ein mal verortet werden
		delete localStorage.Status;
	} else {
		// Attachments gibt es bei neuen Orten nicht
		window.em.zeigeAttachments(window.em.hOrt, "hOE");
	}
	return HtmlContainer;
};

// erstellt die Ortliste in hOrtListe.html
window.em.initiiereOrtListe = function() {
	// hat hOrtEdit.html eine OrtListe übergeben?
	if (window.em.OrtListe) {
		// Ortliste aus globaler Variable holen - muss nicht geparst werden
		window.em.initiiereOrtListe_2();
	} else {
		// Ortliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hOrtListe?startkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// OrtListe für hOrtEdit bereitstellen
				window.em.OrtListe = data;
				window.em.initiiereOrtListe_2();
			}
		});
	}
};

window.em.initiiereOrtListe_2 = function() {
	var i,
		anzOrt = window.em.OrtListe.rows.length,
		Ort,
		key,
		listItem,
		ListItemContainer = "",
		Titel2;

	// Im Titel der Seite die Anzahl Orte anzeigen
	Titel2 = " Orte";
	if (anzOrt === 1) {
		Titel2 = " Ort";
	}
	$("#hOrtListePageHeader .hOrtListePageTitel").text(anzOrt + Titel2);

	if (anzOrt === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeuerOrtOrtListe">Ersten Ort erfassen</a></li>';
	} else {
		for (i in window.em.OrtListe.rows) {	// Liste aufbauen
			if (typeof i !== "function") {
				Ort = window.em.OrtListe.rows[i].doc;
				key = window.em.OrtListe.rows[i].key;
				listItem = "<li OrtId=\"" + Ort._id + "\" class=\"Ort\"><a href=\"#\"><h3>" + Ort.oName + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#OrtlistehOL").html(ListItemContainer);
	$("#OrtlistehOL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#hOrtListe").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// generiert in hZeitEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id der Zeit
window.em.initiiereZeitEdit = function() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehZE').hide();
	// hZeit existiert schon bei neuer Zeit
	//alert("window.em.hZeit = " + JSON.stringify(window.em.hZeit));
	if (window.em.hZeit) {
		window.em.initiiereZeitEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hZeit) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.em.hZeit = JSON.parse(localStorage.hZeit);
		delete localStorage.hZeit;
		window.em.initiiereZeitEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ZeitId, {
			success: function(data) {
				window.em.hZeit = data;
				window.em.initiiereZeitEdit_2();
			}
		});
	}
};

window.em.initiiereZeitEdit_2 = function() {
	// fixe Felder aktualisieren
	$("[name='zDatum']").val(window.em.hZeit.zDatum);
	$("[name='zUhrzeit']").val(window.em.hZeit.zUhrzeit);
	// Variabeln bereitstellen
	localStorage.ProjektId = window.em.hZeit.hProjektId;
	localStorage.RaumId = window.em.hZeit.hRaumId;
	localStorage.OrtId = window.em.hZeit.hOrtId;
	// bei neuen Zeiten hat das Objekt noch keine ID
	if (window.em.hZeit._id) {
		localStorage.ZeitId = window.em.hZeit._id;
	}
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.em.FeldlisteZeitEdit) {
		window.em.initiiereZeitEdit_3();
	} else {
		// Feldliste aus der DB holen
		// das dauert länger - hinweisen
		$("#hZeitEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeZeit?include_docs=true', {
			success: function(Feldliste) {
				window.em.FeldlisteZeitEdit = Feldliste;
				window.em.initiiereZeitEdit_3();
			}
		});
	}
};

window.em.initiiereZeitEdit_3 = function() {
	var HtmlContainer = window.em.generiereHtmlFuerZeitEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hZeitEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	window.em.blendeMenus();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// erstellt die Liste der Zeiten in Formular hZeitListe.html
window.em.initiiereZeitListe = function() {
	// hat hZeitEdit.html eine ZeitListe übergeben?
	if (window.em.ZeitListe) {
		// Zeitliste aus globaler Variable holen - muss nicht geparst werden
		window.em.initiiereZeitListe_2();
	} else {
		// Zeitliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hZeitListe?startkey=["' + localStorage.Email + '", "' + localStorage.OrtId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.OrtId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// ZeitListe für hZeitEdit bereitstellen
				window.em.ZeitListe = data;
				window.em.initiiereZeitListe_2();
			}
		});
	}
};

window.em.initiiereZeitListe_2 = function() {
	var i,
		anzZeit = window.em.ZeitListe.rows.length,
		Zeit,
		key,
		listItem,
		ListItemContainer = "",
		Titel2,
		zZeitDatum;

	// Im Titel der Seite die Anzahl Zeiten anzeigen
	Titel2 = " Zeiten";
	if (anzZeit === 1) {
		Titel2 = " Zeit";
	}
	$("#hZeitListePageHeader .hZeitListePageTitel").text(anzZeit + Titel2);

	if (anzZeit === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueZeitZeitListe">Erste Zeit erfassen</a></li>';
	} else {
		for (i in window.em.ZeitListe.rows) {
			if (typeof i !== "function") {
				Zeit = window.em.ZeitListe.rows[i].doc;
				key = window.em.ZeitListe.rows[i].key;
				zZeitDatum = key[2] + "&nbsp; &nbsp;" + key[3];
				listItem = "<li ZeitId=\"" + Zeit._id + "\" class=\"Zeit\"><a href=\"#\"><h3>" + zZeitDatum + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#ZeitlistehZL").html(ListItemContainer);
	$("#ZeitlistehZL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#hZeitListe").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// generiert das Html für das Formular in hZeitEdit.html
// erwartet Feldliste als Objekt; Zeit als Objekt
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerZeitEditForm = function() {
	var Feld = {},
		i,
		FeldName,
		FeldBeschriftung,
		Optionen,
		HtmlContainer = "";
	for (i in window.em.FeldlisteZeitEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.em.FeldlisteZeitEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === window.em.hZeit.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.em.hZeit.User) !== -1 && FeldName !== "zDatum" && FeldName !== "zUhrzeit") {
				if (localStorage.Status === "neu" && Feld.Standardwert && window.em.hZeit[FeldName]) {
					FeldWert = Feld.Standardwert[window.em.hZeit.User] || "";
					// Objekt window.em.hZeit um den Standardwert ergänzen, um später zu speichern
					window.em.hZeit[FeldName] = FeldWert;
				} else {
					FeldWert = window.em.hZeit[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += window.em.generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp);
			}
			// localStorage.Status wird schon im aufrufenden function gelöscht!
		}
	}
	if (localStorage.Status === "neu") {
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.em.hZeit, {
			success: function(data) {
				window.em.hZeit._id = data.id;
				window.em.hZeit._rev = data.rev;
				localStorage.ZeitId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// Neue Datensätze haben keine Attachments
		window.em.zeigeAttachments(window.em.hZeit, "hZE");
	}
	return HtmlContainer;
};

// managt den Aufbau aller Daten und Felder für hBeobEdit.html
// erwartet die hBeobId
// wird aufgerufen von hBeobEdit.html bei pageshow
window.em.initiierehBeobEdit = function() {
	// achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
	if (window.em.hArt && (!localStorage.Von || localStorage.Von !== "hArtEdit")) {
		window.em.initiierehBeobEdit_2(window.em.hArt);
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.hBeobId, {
			success: function(data) {
				window.em.hArt = data;
				window.em.initiierehBeobEdit_2(data);
			}
		});
	}
};

window.em.initiierehBeobEdit_2 = function() {
	// hier werden Variablen gesetzt,
	// in die fixen Felder Werte eingesetzt,
	// die dynamischen Felder aufgebaut
	// und die Nav-Links gesetzt

	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehAE').hide();

	// diese (globalen) Variabeln werden in hArtEdit.html gebraucht
	// Variabeln bereitstellen
	localStorage.ProjektId = window.em.hArt.hProjektId;
	localStorage.RaumId = window.em.hArt.hRaumId;
	localStorage.OrtId = window.em.hArt.hOrtId;
	localStorage.ZeitId = window.em.hArt.hZeitId;
	// bei neuen hBeob hat das Objekt noch keine ID
	if (window.em.hArt._id) {
		localStorage.hBeobId = window.em.hArt._id;
	} else {
		localStorage.hBeobId = "neu";
	}
	localStorage.aArtGruppe = window.em.hArt.aArtGruppe;
	localStorage.aArtName = window.em.hArt.aArtName;
	localStorage.aArtId = window.em.hArt.aArtId;
	// fixe Felder aktualisieren
	$("[name='aArtGruppe']").selectmenu();
	$("[name='aArtGruppe']").val(window.em.hArt.aArtGruppe);
	$("[name='aArtGruppe']").html("<option value='" + window.em.hArt.aArtGruppe + "'>" + window.em.hArt.aArtGruppe + "</option>");
	$("[name='aArtGruppe']").selectmenu("refresh");
	$("[name='aArtName']").selectmenu();
	$("[name='aArtName']").val(window.em.hArt.aArtName);
	$("[name='aArtName']").html("<option value='" + window.em.hArt.aArtName + "'>" + window.em.hArt.aArtName + "</option>");
	$("[name='aArtName']").selectmenu("refresh");
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.em.FeldlistehBeobEdit) {
		window.em.erstelleDynamischeFelderhArtEdit();
	} else {
		// Feldliste aus der DB holen
		// das dauert länger - hinweisen
		$("#hArtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeArt?include_docs=true', {
			success: function(data) {
				window.em.FeldlistehBeobEdit = data;
				window.em.erstelleDynamischeFelderhArtEdit();
			}
		});
	}
};

// generiert dynamisch die Artgruppen-abhängigen Felder
// Mitgeben: Feldliste, Beobachtung
window.em.erstelleDynamischeFelderhArtEdit = function() {
	var HtmlContainer = window.em.generiereHtmlFuerhArtEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hArtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	window.em.blendeMenus();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// generiert das Html für Formular in hArtEdit.html
// erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerhArtEditForm = function() {
	var Feld = {},
		i,
		FeldName,
		FeldBeschriftung,
		Optionen,
		HtmlContainer = "",
		ArtGruppe = window.em.hArt.aArtGruppe;
	for (i in window.em.FeldlistehBeobEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.em.FeldlistehBeobEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			// Vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
			if ((Feld.User === window.em.hArt.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.em.hArt.User) !== -1 && (typeof Feld.ArtGruppe !== "undefined" && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0) && (FeldName !== "aArtId") && (FeldName !== "aArtGruppe") && (FeldName !== "aArtName")) {
				if (window.em.hArt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[window.em.hArt.User]) {
					FeldWert = Feld.Standardwert[window.em.hArt.User];
					// Objekt window.em.hArt um den Standardwert ergänzen, um später zu speichern
					window.em.hArt[FeldName] = FeldWert;
				} else {
					//"" verhindert, dass im Feld undefined erscheint
					FeldWert = window.em.hArt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += window.em.generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp);
			}
		}
	}
	if (localStorage.Status === "neu") {
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.em.hArt, {
			success: function(data) {
				window.em.hArt._id = data.id;
				window.em.hArt._rev = data.rev;
				localStorage.hBeobId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// Neue Datensätze haben keine Anhänge
		window.em.zeigeAttachments(window.em.hArt, "hAE");
	}
	return HtmlContainer;
};

// initiiert BeobListe.html
window.em.initiierehBeobListe = function() {
	// hat hArtEdit.html eine hBeobListe übergeben?
	if (window.em.hBeobListe) {
		// Beobliste aus globaler Variable holen - muss nicht geparst werden
		window.em.initiierehBeobListe_2();
	} else {
		// Beobliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hArtListe?startkey=["' + localStorage.Email + '", "' + localStorage.ZeitId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ZeitId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// Liste bereitstellen, um Datenbankzugriffe zu reduzieren
				window.em.hBeobListe = data;
				window.em.initiierehBeobListe_2();
			}
		});
	}
};

window.em.initiierehBeobListe_2 = function() {
	var i,
		anzArt = window.em.hBeobListe.rows.length,
		ListItemContainer = "",
		Titel2,
		hBeobTemp,
		artgruppenname;

	// Im Titel der Seite die Anzahl Arten anzeigen
	Titel2 = " Arten";
	if (anzArt === 1) {
		Titel2 = " Art";
	}
	$("#hArtListePageHeader .hArtListePageTitel").text(anzArt + Titel2);

	if (anzArt === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueBeobhArtListe">Erste Art erfassen</a></li>';
	} else {
		for (i in window.em.hBeobListe.rows) {
			hBeobTemp = window.em.hBeobListe.rows[i].doc;
			if (hBeobTemp) {
				ListItemContainer += window.em.erstelleHtmlFürBeobInHBeobListe(hBeobTemp);
			}
		}
	}
	$("#ArtlistehAL").html(ListItemContainer);
	$("#ArtlistehAL").listview("refresh");
	window.em.blendeMenus();
	// Fokus in das Suchfeld setzen
	$("#hArtListe").find(".ui-input-search").children("input")[0].focus();
	window.em.speichereLetzteUrl();
};

// übernimmt eine hBeobachtung
// retourniert das html für deren Zeile in der Liste
window.em.erstelleHtmlFürBeobInHBeobListe = function(beob) {
	var artgruppenname = encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + ".png",
		listItem;
	if (beob.aArtGruppe === "DiverseInsekten") {
		// das leere Bild anzeigen
		artgruppenname = "unbenannt.png";
	}
	listItem = "<li class=\"beob ui-li-has-thumb\" hBeobId=\"" + beob._id + "\" aArtGruppe=\"" + beob.aArtGruppe + "\"" + "\" aArtId=\"" + beob.aArtId + "\">" +
		"<a href=\"#\">" +
		"<img class=\"ui-li-thumb\" src=\"Artgruppenbilder/" + artgruppenname + "\" />" +
		"<h3>" + beob.aArtName + "<\/h3>" +
		"<\/a> <\/li>";
	return listItem;
};


// generiert das Html für ein Formularelement
// erwartet diverse Übergabewerte
// der HtmlContainer wird zurück gegeben
window.em.generiereHtmlFuerFormularelement = function(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, InputTyp) {
	var HtmlContainer = "",
		SliderMinimum,
		SliderMinimum;
	// abfangen, wenn Inputtyp vergessen wurde
	InputTyp = InputTyp || "text";
	switch(Feld.Formularelement) {
	case "textinput":
		HtmlContainer = window.em.generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
		break;
	case "textarea":
		HtmlContainer = window.em.generiereHtmlFuerTextarea(FeldName, FeldBeschriftung, FeldWert);
		break;
	/*case "toggleswitch":
		HtmlContainer = window.em.generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert);
		break;*/
	case "checkbox":
		HtmlContainer = window.em.generiereHtmlFuerCheckbox(FeldName, FeldBeschriftung, FeldWert, Optionen);
		break;
	case "selectmenu":
		HtmlContainer = window.em.generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen, "SingleSelect");
		break;
	case "multipleselect":
		HtmlContainer = window.em.generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen, "MultipleSelect");
		break;
	case "slider":
		SliderMinimum = Feld.SliderMinimum || 0;
		SliderMaximum = Feld.SliderMaximum || 100;
		HtmlContainer = window.em.generiereHtmlFuerSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum);
		break;
	case "radio":
		HtmlContainer = window.em.generiereHtmlFuerRadio(FeldName, FeldBeschriftung, FeldWert, Optionen);
		break;
	case null:
		// Abfangen, wenn das Formularelement nicht gewählt wurde
		HtmlContainer = window.em.generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
		break;
	}
	return HtmlContainer;
};

// generiert den html-Inhalt für Textinputs
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerTextinput = function(FeldName, FeldBeschriftung, FeldWert, InputTyp) {
	var HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
	HtmlContainer += FeldName;
	HtmlContainer += '">';
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += ':</label>\n\t<input id="';
	HtmlContainer += FeldName;
	HtmlContainer += '" name="';
	HtmlContainer += FeldName;
	HtmlContainer += '" type="';
	HtmlContainer += InputTyp;
	HtmlContainer += '" value="';
	HtmlContainer += FeldWert;
	HtmlContainer += '" class="speichern"/>\n</div>';
	return HtmlContainer;
}

// generiert den html-Inhalt für Slider
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerSlider = function(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum) {
	var HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
	HtmlContainer += FeldName;
	HtmlContainer += '">';
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += ':</label>\n\t<input class="speichernSlider" type="range" data-highlight="true" name="';
	HtmlContainer += FeldName;
	HtmlContainer += '" id="';
	HtmlContainer += FeldName;
	HtmlContainer += '" value="';
	HtmlContainer += FeldWert;
	HtmlContainer += '" min="';
	HtmlContainer += SliderMinimum;
	HtmlContainer += '" max="';
	HtmlContainer += SliderMaximum;
	HtmlContainer += '"/>\n</div>';
	return HtmlContainer;
};

// generiert den html-Inhalt für Textarea
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerTextarea = function(FeldName, FeldBeschriftung, FeldWert) {
	var HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
	HtmlContainer += FeldName;
	HtmlContainer += '">';
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += ':</label>\n\t<textarea id="';
	HtmlContainer += FeldName;
	HtmlContainer += '" name="';
	HtmlContainer += FeldName;
	HtmlContainer += '" class="speichern">';
	HtmlContainer += FeldWert;
	HtmlContainer += '</textarea>\n</div>';
	return HtmlContainer;
};

/*// generiert den html-Inhalt für Toggleswitch
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerToggleswitch = function(FeldName, FeldBeschriftung, FeldWert) {
	var HtmlContainer = "<div data-role='fieldcontain'><label for='";
	HtmlContainer += FeldName;
	HtmlContainer += "'>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</label><select name='";
	HtmlContainer += FeldName;
	HtmlContainer += "' id='";
	HtmlContainer += FeldName;
	HtmlContainer += "' data-role='flipswitch' value='";
	HtmlContainer += FeldWert;
	HtmlContainer += "' class='speichern flipswitch'><option value='ja'>ja</option><option value='nein'>nein</option></select></div>";
	return HtmlContainer;
};*/

// generiert den html-Inhalt für Checkbox
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerCheckbox = function(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += window.em.generiereHtmlFuerCheckboxOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
};

// generiert den html-Inhalt für Optionen von Checkbox
// wird von generiereHtmlFuerCheckbox aufgerufen
window.em.generiereHtmlFuerCheckboxOptionen = function(FeldName, FeldWert, Optionen) {
	var i,
		HtmlContainer = "",
		Optionn,
		ListItem;
	for (i in Optionen) {
		if (typeof i !== "function") {
			Optionn = Optionen[i];
			ListItem = "\n\t\t\t<label for='";
			ListItem += Optionn;
			ListItem += "'>";
			ListItem += Optionn;
			ListItem += "</label>\n\t\t\t<input type='checkbox' name='";
			ListItem += FeldName;
			ListItem += "' id='";
			ListItem += Optionn;
			ListItem += "' value='";
			ListItem += Optionn;
			ListItem += "' class='custom speichern'";
			if (FeldWert.indexOf(Optionn) >= 0) {
				ListItem += " checked='checked'";
			}
			ListItem += "/>";
			HtmlContainer += ListItem;
		}
	}
	return HtmlContainer;
};

// generiert den html-Inhalt für Radio
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerRadio = function(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += window.em.generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
};

// generiert den html-Inhalt für Optionen von Radio
// wird von generiereHtmlFuerRadio aufgerufen
window.em.generiereHtmlFuerRadioOptionen = function(FeldName, FeldWert, Optionen) {
	var i,
		HtmlContainer = "",
		Optionn,
		ListItem;
	for (i in Optionen) {
		if (typeof i !== "function") {
			Optionn = Optionen[i];
			ListItem = "\n\t\t\t<label for='";
			ListItem += Optionn;
			ListItem += "'>";
			ListItem += Optionn;
			ListItem += "</label>\n\t\t\t<input class='speichern' type='radio' name='";
			ListItem += FeldName;
			ListItem += "' id='";
			ListItem += Optionn;
			ListItem += "' value='";
			ListItem += Optionn;
			if (FeldWert === Optionn) {
				ListItem += "' checked='checked";
			}
			ListItem += "'/>";
			HtmlContainer += ListItem;
		}
	}
	return HtmlContainer;
};

// generiert den html-Inhalt für Selectmenus
// wird von erstellehBeobEdit aufgerufen
window.em.generiereHtmlFuerSelectmenu = function(FeldName, FeldBeschriftung, FeldWert, Optionen, MultipleSingleSelect) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='";
	HtmlContainer += FeldName;
	HtmlContainer += "' class='select'>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</label>\n\t<select name='";
	HtmlContainer += FeldName;
	HtmlContainer += "' id='";
	HtmlContainer += FeldName;
	HtmlContainer += "' value='";
	HtmlContainer += FeldWert.toString();
	HtmlContainer += "' data-native-menu='false'";
	if (MultipleSingleSelect === "MultipleSelect") {
		HtmlContainer += " multiple='multiple'";
	}
	HtmlContainer += " class='speichern'>";
	if (MultipleSingleSelect === "MultipleSelect") {
		HtmlContainer += window.em.generiereHtmlFuerMultipleselectOptionen(FeldName, FeldWert, Optionen);
	} else {
		HtmlContainer += window.em.generiereHtmlFuerSelectmenuOptionen(FeldName, FeldWert, Optionen);
	}
	HtmlContainer += "\n\t</select>\n</div>";
	return HtmlContainer;
};

// generiert den html-Inhalt für Optionen von Selectmenu
// wird von generiereHtmlFuerSelectmenu aufgerufen
window.em.generiereHtmlFuerSelectmenuOptionen = function(FeldName, FeldWert, Optionen) {
	var i,
		HtmlContainer = "<option value=''></option>",
		Optionn,
		ListItem;
	for (i in Optionen) {
		if (typeof i !== "function") {
			Optionn = Optionen[i];
			ListItem = "<option value='";
			ListItem += Optionn;
			ListItem += "' class='speichern'";
			if (FeldWert === Optionn) {
				ListItem += " selected='selected'";
			}
			ListItem += ">";
			ListItem += Optionn;
			ListItem += "</option>";
			HtmlContainer += ListItem;
		}
	}
	return HtmlContainer;
};

// generiert den html-Inhalt für Optionen von MultipleSelect
// wird von generiereHtmlFuerSelectmenu aufgerufen
// FeldWert ist ein Array
window.em.generiereHtmlFuerMultipleselectOptionen = function(FeldName, FeldWert, Optionen) {
	var i,
		HtmlContainer = "<option value=''></option>",
		Optionn,
		ListItem;
	for (i in Optionen) {
		if (typeof i !== "function") {
			Optionn = Optionen[i];
			ListItem = "<option value='";
			ListItem += Optionn;
			ListItem += "' class='speichern'";
			if (FeldWert.indexOf(Optionn) !== -1) {
				ListItem += " selected='selected'";
			}
			ListItem += ">";
			ListItem += Optionn;
			ListItem += "</option>";
			HtmlContainer += ListItem;
		}
	}
	return HtmlContainer;
};

(function($) {
	// friendly helper http://tinyurl.com/6aow6yn
	// Läuft durch alle Felder im Formular
	// Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
	// nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
	$.fn.serializeObject = function() {
		var o = {},
			a = this.serializeArray();
		$.each(a, function() {
			if (this.value) {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value);
				} else {
					if (window.em.myTypeOf(this.value) === "integer") {
						// typ ist Int
						o[this.name] = parseInt(this.value, 10);
					} else if (window.em.myTypeOf(this.value) === "float") {
						// typ ist Float
						o[this.name] = parseFloat(this.value);
					} else {
						// anderer Typ, als String behandeln
						o[this.name] = this.value;
					}
				}
			}
		});
		return o;
	};
	// friendly helper http://tinyurl.com/6aow6yn
	// Läuft durch alle Felder im Formular
	// Feldname und Wert aller Felder werden ins Objekt geschrieben
	// so können auch bei soeben gelöschten Feldinhalten das entsprechende Feld im doc gelöscht werden
	// siehe Beispiel in FeldEdit.html
	// nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
	$.fn.serializeObjectNull = function() {
		var o = {},
			a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value);
			} else {
				if (window.em.myTypeOf(this.value) === "integer") {
					// typ ist Int
					o[this.name] = parseInt(this.value, 10);
				} else if (window.em.myTypeOf(this.value) === "float") {
					// typ ist Float
					o[this.name] = parseFloat(this.value);
				} else {
					// anderer Typ, als String behandeln
					o[this.name] = this.value;
				}
			}
		});
		return o;
	};
})(jQuery);

window.em.checkAllCheckboxesOfForm = function(pagename, checktoggle) {
	var checkboxes = new Array(),
		i; 
	checkboxes = $("#" + pagename).find('input');
	for (i=0; i<checkboxes.length; i++)	{
		if (checkboxes[i].type == 'checkbox')	 {
			checkboxes[i].checked = checktoggle;
			$("#"+checkboxes[i].id).checkboxradio("refresh");
		}
	}
};

window.em.checkAllRadiosOfForm = function(pagename, checktoggle) {
	var radios = new Array(),
		i; 
	radios = $("#" + pagename).find('input');
	for (i=0; i<radios.length; i++)	{
		if (radios[i].type == 'radio')	 {
			radios[i].checked = checktoggle;
			$("#"+radios[i].id).checkboxradio("refresh");
		}
	}
};

// verorted mit Hilfe aller Methoden
// wird benutzt von BeobEdit.html und hOrtEdit.html
// erwartet die docId, um am Ende der Verortung die neuen Koordinaten zu speichern
window.em.GetGeolocation = function(docId, OrtOderBeob) {
	// benötigte Variabeln setzen
	localStorage.docId = docId;
	// Zweck: Genau solange animieren, wie verortet wird
	localStorage.NavbarVerortungAnimieren = "true";
	// übergebene Herkunft (Ort oder Beob) für die listeners bereitstellen
	localStorage.OrtOderBeob = OrtOderBeob;
	// dem Benutzer zeigen, dass verortet wird
	window.em.NavbarVerortungAnimieren();
	// Koordinaten zurücksetzen
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oHöhe;
	delete localStorage.oHöheGenauigkeit;
	// Mit der Verortung beginnen
	window.em.watchID = null;
	window.em.watchID = navigator.geolocation.watchPosition(window.em.onGeolocationSuccess, window.em.onGeolocationError, { frequency: 3000, enableHighAccuracy: true });
	// nach spätestens 20 Sekunden aufhören
	window.em.stop = setTimeout("window.em.stopGeolocation()", 20000);
	return window.em.watchID;
};

// solange verortet wird, 
// wird die Verortung in der Navbar jede Sekunde ein- und ausgeblendet
window.em.NavbarVerortungAnimieren = function() {
	if (localStorage.NavbarVerortungAnimieren && localStorage.NavbarVerortungAnimieren === "true") {
		$(".neu").removeClass("ui-btn-active");
		$(".verorten").addClass("ui-btn-active").fadeToggle("slow");
		setTimeout("window.em.NavbarVerortungAnimieren()", 1000);
	} else {
		$(".verorten").removeClass("ui-btn-active").fadeIn("slow");
		//$(".neu").addClass("ui-btn-active");
	}
};

window.em.GeolocationAuslesen = function(position) {
	localStorage.oLagegenauigkeit = Math.floor(position.coords.accuracy);
	localStorage.oLongitudeDecDeg = position.coords.longitude;
	localStorage.oLatitudeDecDeg = position.coords.latitude;
	localStorage.oXKoord = window.em.DdInChX(position.coords.latitude, position.coords.longitude);
	localStorage.oYKoord = window.em.DdInChY(position.coords.latitude, position.coords.longitude);
	$("[name='oXKoord']").val(localStorage.oXKoord);
	$("[name='oYKoord']").val(localStorage.oYKoord);
	$("[name='oLongitudeDecDeg']").val(position.coords.longitude);
	$("[name='oLatitudeDecDeg']").val(position.coords.latitude);
	$("[name='oLagegenauigkeit']").val(position.coords.accuracy);
	if (position.coords.altitude > 0) {
		$("[name='oHöhe']").val(position.coords.altitude);
		$("[name='oHöheGenauigkeit']").val(position.coords.altitudeAccuracy);
		localStorage.oHöhe = position.coords.altitude;
		localStorage.oHöheGenauigkeit = position.coords.altitudeAccuracy;
	}
	window.em.speichereKoordinaten(localStorage.docId, localStorage.OrtOderBeob);
};

// Position ermitteln war erfolgreich
window.em.onGeolocationSuccess = function(position) {
	// nur erste Position akzeptieren oder solche, die genauer sind als vorige
	if (!localStorage.oLagegenauigkeit || position.coords.accuracy < localStorage.oLagegenauigkeit) {
		if (position.coords.accuracy < 100) {
			window.em.GeolocationAuslesen(position);
			if (position.coords.accuracy <= 5) {
				window.em.stopGeolocation();
			}
		}
	}
};

// Position ermitteln war nicht erfolgreich
// onError Callback receives a PositionError object
window.em.onGeolocationError = function(error) {
	window.em.melde("Keine Position erhalten\n" + error.message);
	window.em.stopGeolocation();
};

// Beendet Ermittlung der Position
window.em.stopGeolocation = function() {
	// Positionssuche beenden
	// wenn keine watchID mehr, wurde sie schon beendet
	// stop timeout stoppen
	clearTimeout(window.em.stop);
	delete window.em.stop;
	delete localStorage.VerortungAbgeschlossen;
	// Vorsicht: In BeobEdit.html und hOrtEdit.html ist watchID nicht defined
	if (typeof window.em.watchID !== "undefined") {
		navigator.geolocation.clearWatch(window.em.watchID);
		delete window.em.watchID;
	}
	// Animation beenden
	delete localStorage.NavbarVerortungAnimieren;
	// auf den Erfolg reagieren
	if (localStorage.oLagegenauigkeit > 30) {
		window.em.melde("Koordinaten nicht sehr genau\nAuf Karte verorten?");
	} else if (!localStorage.oLagegenauigkeit) {
		// Felder leeren
		$("[name='oXKoord']").val("");
		$("[name='oYKoord']").val("");
		$("[name='oLongitudeDecDeg']").val("");
		$("[name='oLatitudeDecDeg']").val("");
		$("[name='oLagegenauigkeit']").val("");
		$("[name='oHöhe']").val("");
		$("[name='oHöheGenauigkeit']").val("");
		// Diesen neuen Stand speichern (allfällige alte Koordinaten werden verworfen)
		window.em.speichereKoordinaten(localStorage.docId, localStorage.OrtOderBeob);
		window.em.melde("Keine genaue Position erhalten");
	}
	// Variablen aufräumen
	delete localStorage.docId;
	delete localStorage.OrtOderBeob;
};

// damit kann bei erneuter Anmeldung window.em.oeffneZuletztBenutzteSeite() die letzte Ansicht wiederherstellen
// host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
window.em.speichereLetzteUrl = function() {
	localStorage.LetzteUrl = window.location.pathname + window.location.search;
};

window.em.holeAutor = function() {
	// aAutor holen
	$db = $.couch.db("evab");
	$db.openDoc("f19cd49bd7b7a150c895041a5d02acb0", {
		success: function(doc) {
			if (doc.Standardwert) {
				if (doc.Standardwert[localStorage.Email]) {
					localStorage.Autor = doc.Standardwert[localStorage.Email];
				}
			}
		}
	});
};

// speichert Anhänge
// setzt ein passendes Formular mit den feldern _rev und _attachments voraus
// nimmt den Formnamen entgegen respektive einen Anhang dazu, damit die Form ID eindeutig sein kann
// wird benutzt von allen Formularen mit Anhängen
window.em.speichereAnhänge = function(id, Objekt, Page) {
	// prüfen, ob der Datensatz als Objekt übergeben wurde
	if (Objekt) {
		// das Objekt verwenden
		window.em.speichereAnhänge_2(id, Objekt, Page);
	} else {
		// Objekt aus der DB holen
		$db = $.couch.db("evab");
		$db.openDoc(id, {
			success: function(data) {
				window.em[Objekt.Typ] = data;
				window.em.speichereAnhänge_2(id, data, Page);
			},
			error: function() {
				window.em.melde("Fehler: Anhang nicht gespeichert");
			}
		});
	}
};

window.em.speichereAnhänge_2 = function(id, Objekt, Page) {
	$("#_rev" + Page).val(window.em[Objekt.Typ]._rev);
	$("#FormAnhänge" + Page).ajaxSubmit({
		url: "/evab/" + id,
		success: function() {
			// doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			$db.openDoc(id, {
				success: function(data2) {
					window.em[Objekt.Typ] = data2;
					// show attachments in form
					window.em.zeigeAttachments(data2, Page);
				},
				error: function() {
					window.em.melde("Uups, Anhang wird erst beim nächsten Mal angezeigt");
				}
			});
		},
		// form.jquery.js meldet einen Fehler, obwohl der Vorgang funktioniert!
		error: function() {
			// doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			$db.openDoc(id, {
				success: function(data3) {
					window.em[Objekt.Typ] = data3;
					window.em.zeigeAttachments(data3, Page);
				},
				error: function() {
					window.em.melde("Uups, Anhang wird erst beim nächsten Mal angezeigt");
				}
			});
		}
	});
};

// zeigt Anhänge im Formular an
// setzt ein passendes Formular mit dem Feld _attachments + Page voraus
// und eine div namens Anhänge + Page, in der die Anhänge angezeigt werden
// wird benutzt von allen (h)Beobachtungs-Edit-Formularen
// erwartet Page, damit sowohl das AttachmentFeld als auch das div um die Anhänge reinzuhängen eindeutig sind 
window.em.zeigeAttachments = function(doc, Page) {
	var HtmlContainer = "",
		url,
		url_zumLöschen;
	$("#_attachments" + Page).val("");
	if (doc._attachments) {
		$.each(doc._attachments, function(Dateiname, val) {
			url = "/evab/" + doc._id + "/" + Dateiname;
			//url_zumLöschen = url + "?" + doc._rev;	// theoretisch kann diese rev bis zum Löschen veraltet sein, praktisch kaum
			HtmlContainer += "<div><a href='";
			HtmlContainer += url;
			HtmlContainer += "' data-inline='true' data-role='button' target='_blank'>";
			HtmlContainer += Dateiname;
			HtmlContainer += "</a><button name='LöscheAnhang' id='";
			HtmlContainer += Dateiname;
			HtmlContainer += "' data-icon='delete' data-inline='true' data-iconpos='notext'/></div>";
		});
	}
	$("#Anhänge" + Page).html(HtmlContainer).trigger("create");
	// Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
	$(":jqmData(role='page')").focus();
};

// initiiert FelderWaehlen.html
// generiert dynamisch die Felder im Checkbox Felder
// checked diejenigen, die der User anzeigen will
window.em.initiiereFelderWaehlen = function() {
	var TextUeberListe_FW,
		FeldlisteViewname;
	// Je nach aufrufender Seite Variabeln setzen
	switch(localStorage.AufrufendeSeiteFW) {
	case "hProjektEdit":
		TextUeberListe_FW = "<h3>Felder für Projekte wählen:</h3>";
		localStorage.FeldlisteFwName = "FeldlisteProjekt";
		FeldlisteViewname = "FeldListeProjekt";
		localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Projekt' && FeldName !== 'pName'";
		break;
	case "hRaumEdit":
		TextUeberListe_FW = "<h3>Felder für Räume wählen:</h3>";
		localStorage.FeldlisteFwName = "FeldlisteRaumEdit";
		FeldlisteViewname = "FeldListeRaum";
		localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Raum' && FeldName !== 'rName'";
		break;
	case "hOrtEdit":
		TextUeberListe_FW = "<h3>Felder für Orte wählen:</h3>";
		localStorage.FeldlisteFwName = "FeldlisteOrtEdit";
		FeldlisteViewname = "FeldListeOrt";
		localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Ort' && FeldName !== 'oName' && FeldName !== 'oXKoord' && FeldName !== 'oYKoord' && FeldName !== 'oLagegenauigkeit'";
		break;
	case "hZeitEdit":
		TextUeberListe_FW = "<h3>Felder für Zeiten wählen:</h3>";
		localStorage.FeldlisteFwName = "FeldlisteZeitEdit";
		FeldlisteViewname = "FeldListeZeit";
		localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Zeit' && Feld.FeldName !== 'zDatum' && Feld.FeldName !== 'zUhrzeit'";
		break;
	case "hArtEdit":
		TextUeberListe_FW = "<h3>Felder für Art wählen:</h3><p>Die Felder der Hierarchiestufe Art werden nur in den in der Feldverwaltung definierten Artgruppen angezeigt!</p>";
		localStorage.FeldlisteFwName = "FeldlistehBeobEdit";
		FeldlisteViewname = "FeldListeArt";
		localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Art' && (Feld.FeldName !== 'aArtGruppe') && (Feld.FeldName !== 'aArtName') && (Feld.FeldName !== 'aArtId')";
		break;
	case "BeobEdit":
		TextUeberListe_FW = "<h3>Felder für Beobachtungen wählen:</h3><p>Die Felder der Hierarchiestufe Art werden nur in den in der Feldverwaltung definierten Artgruppen angezeigt!</p>";
		localStorage.FeldlisteFwName = "FeldlisteBeobEdit";
		FeldlisteViewname = "FeldListeBeob";
		localStorage.KriterienFürZuWählendeFelder = "['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1";
		break;
	}
	$("#TextUeberListe_FW").html(TextUeberListe_FW);
	// Feldliste nur abfragen, wenn sie nicht schon als globale Variable existiert
	// Für FelderWaehlen.html könnte an sich immer die vollständige Liste verwendet werden
	// besser ist aber, dieselbe Liste zu teilen, die in derselben Hierarchiestufe für die Anzeige der Felder verwendet wird
	// darum wird hier für jede Seite eine eigene verwendet
	if (window.em[localStorage.FeldlisteFwName]) {
		window.em.initiiereFelderWaehlen_2();
	} else {
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/' + FeldlisteViewname + '?include_docs=true', {
			success: function(data) {
				window.em[localStorage.FeldlisteFwName] = data;
				window.em.initiiereFelderWaehlen_2();
			}
		});
	}
};

window.em.initiiereFelderWaehlen_2 = function() {
	var i,
		HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>",
		anzFelder = 0,
		Feld,
		FeldName,
		FeldBeschriftung,
		ListItem;
	for (i in window.em[localStorage.FeldlisteFwName].rows) {
		Feld = window.em[localStorage.FeldlisteFwName].rows[i].doc;
		FeldName = Feld.FeldName;
		// Nur eigene und offizielle Felder berücksichtigen
		if (Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") {
			// im Formular fix integrierte Felder nicht aufbauen
			if (eval(localStorage.KriterienFürZuWählendeFelder)) {
				anzFelder += 1;
				FeldBeschriftung = Feld.Hierarchiestufe + ": " + Feld.FeldBeschriftung;
				if (Feld.Hierarchiestufe === "Art" && Feld.ArtGruppe.indexOf(localStorage.aArtGruppe) === -1) {
					FeldBeschriftung += "<span style='font-weight:normal;'> (nicht sichtbar in Artgruppe " + localStorage.aArtGruppe + ")</span>";
				}
				ListItem = "\n\t\t<label for='";
				ListItem += FeldName;
				ListItem += "'>";
				ListItem += FeldBeschriftung;
				ListItem += "</label>\n\t\t<input type='checkbox' name='";
				ListItem += "Felder";
				ListItem += "' id='";
				ListItem += FeldName;
				ListItem += "' FeldId='";
				ListItem += Feld._id;
				ListItem += "' value='";
				ListItem += FeldName;
				ListItem += "' class='custom'";
				if (localStorage.AufrufendeSeiteFW === "BeobEdit") {
					if (Feld.SichtbarImModusEinfach) {
						if (Feld.SichtbarImModusEinfach.indexOf(localStorage.Email) !== -1) {
							// wenn sichtbar, anzeigen
							ListItem += " checked='checked'";
						}
					}
				} else {
					if (Feld.SichtbarImModusHierarchisch) {
						if (Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1) {
							// wenn sichtbar, anzeigen
							ListItem += " checked='checked'";
						}
					}
				}
				ListItem += "/>";
				HtmlContainer += ListItem;
			}
		}
	}
	$("#FelderWaehlenPageHeader .FelderWaehlenPageTitel").text(anzFelder + " Felder");
	HtmlContainer += "\n\t</fieldset>\n</div>";
	$("#FeldlisteFW").html(HtmlContainer).trigger("create");
	$("input[name='Felder']").checkboxradio();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	window.em.speichereLetzteUrl();
};

// kreiert ein neues Feld
// wird benutzt von FeldListe.html und FeldEdit.html
window.em.neuesFeld = function() {
	var NeuesFeld = {},
		hierarchiestufe;
	NeuesFeld.Typ = "Feld";
	NeuesFeld.User = localStorage.Email;
	NeuesFeld.SichtbarImModusEinfach = [];
	NeuesFeld.SichtbarImModusHierarchisch = [];
	// Hierarchiestufe aufgrund der Herkunft wählen
	switch (localStorage.zurueck) {
		case "hProjektEdit.html":
		case "hProjektListe.html":
			hierarchiestufe = "Projekt";
			break;
		case "hRaumEdit.html":
		case "hRaumListe.html":
			hierarchiestufe = "Raum";
			break;
		case "hOrtEdit.html":
		case "hOrtListe.html":
			hierarchiestufe = "Ort";
			break;
		case "hZeitEdit.html":
		case "hZeitListe.html":
			hierarchiestufe = "Zeit";
			break;
		default:
			hierarchiestufe = "Art";
			break;
	}
	NeuesFeld.Hierarchiestufe = hierarchiestufe;
	// Feldtyp vorwählen
	NeuesFeld.Formularelement = "textinput";
	NeuesFeld.InputTyp = "text";
	// gleich sichtbar stellen
	NeuesFeld.SichtbarImModusEinfach.push(localStorage.Email);
	NeuesFeld.SichtbarImModusHierarchisch.push(localStorage.Email);
	$db = $.couch.db("evab");
	$db.saveDoc(NeuesFeld, {
		success: function(data) {
			localStorage.FeldId = data.id;
			NeuesFeld._id = data.id;
			NeuesFeld._rev = data.rev;
			window.em.Feld = NeuesFeld;
			// Feldliste soll neu aufgebaut werden
			window.em.leereStorageFeldListe();
			$(":mobile-pagecontainer").pagecontainer("change", "FeldEdit.html", { allowSamePageTransition : true });
		},
		error: function() {
			window.em.melde("Fehler: Feld nicht erzeugt");
		}
	});
};

// MOMENTAN NICHT BENUTZT
window.em.pruefeAnmeldung = function() {
	// Username Anmeldung überprüfen
	// Wenn angemeldet, globale Variable Username aktualisieren
	// Wenn nicht angemeldet, Anmeldedialog öffnen
	if (!localStorage.Email) {
		$.ajax({
			url: '/_session',
			dataType: 'json',
			async: false
		}).done(function(session) {
			if (session.userCtx.name !== undefined && session.userCtx.name !== null) {
				localStorage.Email = session.userCtx.name;
			} else {
				localStorage.UserStatus = "neu";
				$.mobile.navigate("index.html");
			}
		});
	}
};

// setzt die OrtId, damit hOrtEdit.html am richtigen Ort öffnet
// und ruft dann hOrtEdit.html auf
// wird von den Links in der Karte benutzt
window.em.oeffneOrt = function(OrtId) {
	localStorage.OrtId = OrtId;
	$.mobile.navigate("hOrtEdit.html");
};

// setzt die BeobId, damit BeobEdit.html am richtigen Ort öffnet
// und ruft dann BeobEdit.html auf
// wird von den Links in der Karte auf BeobListe.html benutzt
window.em.oeffneBeob = function(BeobId) {
	localStorage.BeobId = BeobId;
	$.mobile.navigate("BeobEdit.html");
};

// wird benutzt in Artenliste.html
// wird dort aufgerufen aus pageshow und pageinit, darum hierhin verlagert
// erwartet einen filterwert
// Wenn mehrmals nacheinander dieselbe Artenliste aufgerufen wird, soll wenn möglich die alte Liste verwendet werden können
// möglich ist dies wenn diese Faktoren gleich sind: Artgruppe, allfällige Unterauswahl
window.em.initiiereArtenliste = function(filterwert) {
	// wenn alle drei Faktoren gleich sind, direkt die Artenliste erstellen
	// nur wenn eine Artenliste existiert. Grund: window.em.Artenliste lebt nicht so lang wie localStorage
	// aber die Artenliste aus der localStorage zu parsen macht auch keinen sinn
	if (window.em.Artenliste) {
		if (localStorage.aArtGruppeZuletzt === localStorage.aArtGruppe) {
			window.em.erstelleArtenliste(filterwert);
			return;
		}
	}
	// sonst aus der DB holen und die Variabeln aktualisieren
	localStorage.aArtGruppeZuletzt = localStorage.aArtGruppe;
	window.em.holeArtenliste(filterwert);
};

// wird benutzt in Artenliste.html
// aufgerufen von initiiereArtenliste
window.em.holeArtenliste = function(filterwert) {
	var viewname = 'evab/Artliste?startkey=["' + encodeURIComponent(localStorage.aArtGruppe) + '"]&endkey=["' + encodeURIComponent(localStorage.aArtGruppe) + '",{},{}]&include_docs=true';
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function(data) {
			window.em.Artenliste = data.rows;
			window.em.erstelleArtenliste(filterwert);
		}
	});
};

// bekommt eine Artenliste und baut damit im Formular die Artenliste auf
window.em.erstelleArtenliste = function(filterwert) {
	var i,
		html_temp = "",
		html = "",
		ArtBezeichnung,
		Art,
		zähler = 0;
	// gefiltert werden muss nur, wenn mehr als 200 Arten aufgelistet würden
	if (window.em.Artenliste.length > 0) {
		if (filterwert) {
			artenliste_loop:
			for (i=0; i<window.em.Artenliste.length; i++) {
				if (zähler<200) {
					ArtBezeichnung = window.em.Artenliste[i].key[1];
					if (filterwert && ArtBezeichnung.toLowerCase().indexOf(filterwert) > -1) {
						zähler++;
						Art = window.em.Artenliste[i].doc;
						html_temp += window.em.holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
					}
				} else if (zähler === 200) {
					zähler++;
					html += '<li class="artlistenhinweis">' + zähler + ' Arten entsprechen dem Filter.<br>Um Mobilgeräte nicht zu überfordern, <b>werden nur die ersten 200 angezeigt</b>.<br>Versuchen Sie einen strengeren Filter</li>';
					break artenliste_loop;
				}
			}
			if (html_temp === "") {
				html += '<li class="artlistenhinweis">Keine Arten gefunden</li>';
			} else {
				if (zähler <= 200) {
					html += '<li class="artlistenhinweis">' + zähler + ' Arten gefiltert</li>';
				}
				html += html_temp;
			}
		} else {
			// kein Filter gesetzt
			if (window.em.Artenliste.length > 200) {
				// die ersten 200 anzeigen
				artenliste_loop_2:
				for (i=0; i<window.em.Artenliste.length; i++) {
					if (i<200) {
						ArtBezeichnung = window.em.Artenliste[i].key[1];
						Art = window.em.Artenliste[i].doc;
						html_temp += window.em.holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
					} else if (i === 200) {
						html += '<li class="artlistenhinweis">Die Artengruppe hat ' + window.em.Artenliste.length + ' Arten.<br>Um Mobilgeräte nicht zu überfordern, <b>werden nur die ersten 200 angezeigt</b>.<br>Tipp: Setzen Sie einen Filter</li>';
						break artenliste_loop_2;
					}
				}
				html += html_temp;
			} else {
				// weniger als 200 Arten, kein Filter. Alle anzeigen
				html += '<li class="artlistenhinweis">' + window.em.Artenliste.length + ' Arten angezeigt</li>';
				for (i=0; i<window.em.Artenliste.length; i++) {
					ArtBezeichnung = window.em.Artenliste[i].key[1];
					Art = window.em.Artenliste[i].doc;
					html += window.em.holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
				}
			}
		}
	} else {
		//Artenliste.length ==== 0
		html += '<li class="artlistenhinweis">Die Artengruppe enthält keine Arten</li>';
	}
	$("#al_ArtenListe").html(html);
	$("#al_ArtenListe").show();
	$("#al_ArtenListe").listview("refresh");
	// Fokus in das Suchfeld setzen
	$("#Artenliste").find(".ui-input-search").children("input")[0].focus();

};

window.em.holeHtmlFürArtInArtenliste = function(Art, ArtBezeichnung) {
	var html = "<li name=\"ArtListItem\" ArtBezeichnung=\"";
	html += ArtBezeichnung;
	html += "\" ArtId=\"";
	html += Art._id;
	html += "\">";
	html += "<a href=\"#\"><h3>";
	html += ArtBezeichnung;
	html += "<\/h3>";
	if (Art.HinweisVerwandschaft) {
		html += "<p>" + Art.HinweisVerwandschaft + "<\/p>";
	}
	html += "<\/a><\/li>";
	return html;
};

// wird benutzt in Artgruppenliste.html
// aufgerufen von erstelleArtgruppenListe
window.em.erstelleArtgruppenListe = function() {
	// Artgruppenliste verfügbar machen
	if (window.em.Artgruppenliste) {
		window.em.erstelleArtgruppenListe_2();
	} else if (localStorage.Artgruppenliste) {
		window.em.Artgruppenliste = JSON.parse(localStorage.Artgruppenliste);
		window.em.erstelleArtgruppenListe_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/Artgruppen?include_docs=true', {
			success: function(data) {
				// Artgruppenliste bereitstellen
				window.em.Artgruppenliste = data;
				localStorage.Artgruppenliste = JSON.stringify(window.em.Artgruppenliste);
				window.em.erstelleArtgruppenListe_2();
			}
		});
	}
};

// wird benutzt in Artgruppenliste.html
// aufgerufen von erstelleArtgruppenListe
window.em.erstelleArtgruppenListe_2 = function() {
	var i,
		html = "",
		ArtGruppe,
		row,
		AnzArten;
	for (i in window.em.Artgruppenliste.rows) {
		ArtGruppe = window.em.Artgruppenliste.rows[i].key;
		row = window.em.Artgruppenliste.rows[i].doc;
		AnzArten = row.AnzArten;
		html += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
		html += "<a href=\"#\"><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
	}
	$("#agl_ArtgruppenListe").html(html);
	$("#agl_ArtgruppenListe").listview("refresh");
	$("#agl_Hinweistext").empty().remove();
	// Fokus in das Suchfeld setzen
	$("#Artgruppenliste").find(".ui-input-search").children("input")[0].focus();
};

// Stellt die Daten des Users bereit
// In der Regel nach gelungener Anmeldung
// Auch wenn eine Seite direkt geöffnet wird und die Userdaten vermisst
// braucht den Usernamen
window.em.stelleUserDatenBereit = function() {
	window.em.holeAutor();
	$.couch.userDb(function(db) {
		db.openDoc("org.couchdb.user:" + localStorage.Email, {
			success: function (doc) {
				if (doc.Datenverwendung) {
					localStorage.Datenverwendung = doc.Datenverwendung;
				} else {
					// Datenverwendung existiert nicht
					// Kann es sein, dass dieser User sein Konto ursprünglich in ArtenDb erstellt hat
					$.mobile.navigate("UserEdit.html");
					return;
				}
				window.em.oeffneZuletztBenutzteSeite();
			}
		});
	});
};

// wird benutzt von window.em.stelleUserDatenBereit()
// öffnet die zuletzt benutzte Seite oder BeobListe.html
window.em.oeffneZuletztBenutzteSeite = function() {
	// unendliche Schlaufe verhindern, falls LetzteUrl auf diese Seite verweist
	if (localStorage.LetzteUrl && localStorage.LetzteUrl !== "/evab/_design/evab/index.html") {
		LetzteUrl = localStorage.LetzteUrl;
	} else {
		LetzteUrl = "BeobListe.html";
	}
	$.mobile.navigate(LetzteUrl);
};

// die nachfolgenden funktionen bereinigen die localStorage und die globalen Variabeln
// sie entfernen die im jeweiligen Formular ergänzten localStorage-Einträge
// mitLatLngListe gibt an, ob die Liste für die Karte auch entfernt werden soll

window.em.leereAlleVariabeln = function(ohneClear) {
	// ohne clear: nötig, wenn man in FelderWaehlen.html ist und keine aufrufende Seite kennt
	// Username soll erhalten bleiben
	if (!ohneClear) {
		localStorage.clear();
	}
	delete localStorage.Autor;
	window.em.leereStorageProjektListe("mitLatLngListe");
	window.em.leereStorageProjektEdit("mitLatLngListe");
	window.em.leereStorageRaumListe("mitLatLngListe");
	window.em.leereStorageRaumEdit("mitLatLngListe");
	window.em.leereStorageOrtListe("mitLatLngListe");
	window.em.leereStorageOrtEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStoragehBeobListe();
	window.em.leereStoragehBeobEdit();
	window.em.leereStorageBeobListe();
	window.em.leereStorageBeobEdit();
	window.em.leereStorageFeldListe();
	window.em.leereStorageFeldEdit();
};

window.em.leereStorageProjektListe = function(mitLatLngListe) {
	delete window.em.Projektliste;
	if (mitLatLngListe) {
		delete window.em.hOrteLatLngProjektliste;
	}
};

// ohneId wird beim paginaten benutzt, da die ID übermittelt werden muss
window.em.leereStorageProjektEdit = function(mitLatLngListe, ohneId) {
	if (!ohneId) {
		delete localStorage.ProjektId;
	}
	delete window.em.hProjekt;
	if (mitLatLngListe) {
		delete window.em.hOrteLatLngProjekt;
	}
	// hierarchisch tiefere Listen löschen
	delete window.em.RaeumeVonProjekt;
	delete window.em.OrteVonProjekt;
	delete window.em.OrteVonRaum;
	delete window.em.ZeitenVonProjekt;
	delete window.em.ZeitenVonRaum;
	delete window.em.ZeitenVonOrt;
	delete window.em.ArtenVonProjekt;
	delete window.em.ArtenVonRaum;
	delete window.em.ArtenVonOrt;
	delete window.em.ArtenVonZeit;
};

window.em.leereStorageRaumListe = function(mitLatLngListe) {
	delete window.em.RaumListe;
	if (mitLatLngListe) {
		delete window.em.hOrteLatLngProjekt;
	}
	delete window.em.RaeumeVonProjekt;
};

window.em.leereStorageRaumEdit = function(mitLatLngListe, ohneId) {
	if (!ohneId) {
		delete localStorage.RaumId;
	}
	delete window.em.hRaum;
	if (mitLatLngListe) {
		delete window.em.hOrteLatLngRaum;
	}
	// hierarchisch tiefere Listen löschen
	delete window.em.OrteVonProjekt;
	delete window.em.OrteVonRaum;
	delete window.em.ZeitenVonProjekt;
	delete window.em.ZeitenVonRaum;
	delete window.em.ZeitenVonOrt;
	delete window.em.ArtenVonProjekt;
	delete window.em.ArtenVonRaum;
	delete window.em.ArtenVonOrt;
	delete window.em.ArtenVonZeit;
};

window.em.leereStorageOrtListe = function(mitLatLngListe) {
	delete window.em.OrtListe;
	if (mitLatLngListe) {
		delete window.em.hOrteLatLngRaum;
	}
	delete window.em.OrteVonProjekt;
	delete window.em.OrteVonRaum;
};

window.em.leereStorageOrtEdit = function(ohneId) {
	if (!ohneId) {
		delete localStorage.OrtId;
	}
	delete window.em.hOrt;
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.aArtId;
	delete localStorage.aArtName;
	delete localStorage.aArtGruppe;
	// hierarchisch tiefere Listen löschen
	delete window.em.ZeitenVonProjekt;
	delete window.em.ZeitenVonRaum;
	delete window.em.ZeitenVonOrt;
	delete window.em.ArtenVonProjekt;
	delete window.em.ArtenVonRaum;
	delete window.em.ArtenVonOrt;
	delete window.em.ArtenVonZeit;
	// allfällige Lokalisierung abbrechen
	if (typeof window.em.watchID !== "undefined") {
		window.em.stopGeolocation();
	}
};

window.em.leereStorageZeitListe = function() {
	delete window.em.ZeitListe;
	delete window.em.ZeitenVonProjekt;
	delete window.em.ZeitenVonRaum;
	delete window.em.ZeitenVonOrt;
};

window.em.leereStorageZeitEdit = function(ohneId) {
	if (!ohneId) {
		delete localStorage.ZeitId;
	}
	delete window.em.hZeit;
	// hierarchisch tiefere Listen löschen
	delete window.em.ArtenVonProjekt;
	delete window.em.ArtenVonRaum;
	delete window.em.ArtenVonOrt;
	delete window.em.ArtenVonZeit;
};

window.em.leereStoragehBeobListe = function() {
	delete window.em.hBeobListe;
	delete window.em.ArtenVonProjekt;
	delete window.em.ArtenVonRaum;
	delete window.em.ArtenVonOrt;
	delete window.em.ArtenVonZeit;
};

window.em.leereStoragehBeobEdit = function(ohneId) {
	if (!ohneId) {
		delete localStorage.hBeobId;
	}
	delete window.em.hArt;
};

window.em.leereStorageBeobListe = function() {
	delete window.em.BeobListe;
	delete window.em.BeobListeLatLng;
};

window.em.leereStorageBeobEdit = function(ohneId) {
	if (!ohneId) {
		delete localStorage.BeobId;
	}
	delete window.em.Beobachtung;
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.aArtId;
	delete localStorage.aArtName;
	delete localStorage.aArtGruppe;
	// allfällige Lokalisierung abbrechen
	if (typeof window.em.watchID !== "undefined") {
		window.em.stopGeolocation();
	}
};

window.em.leereStorageFeldListe = function() {
	delete window.em.Feldliste;
	delete window.em.FeldlisteBeobEdit;
	delete window.em.FeldlistehBeobEdit;
	delete window.em.FeldlisteZeitEdit;
	delete window.em.FeldlisteOrtEdit;
	delete window.em.FeldlisteRaumEdit;
	delete window.em.FeldlisteProjekt;
};

window.em.leereStorageFeldEdit = function(ohneId) {
	if (!ohneId) {
		delete localStorage.FeldId;
	}
	delete window.em.Feld;
};

// setzt alle Felder im Modus Hierarchisch sichtbar
// Erwartet die Email
// Modus einfach wird hier nicht eingestellt: Die minimalen Felder sind fix programmiert
// wird verwendet in: Signup.html, UserEdit.html
window.em.erstelleSichtbareFelder = function() {
	var viewname = 'evab/FeldListeFeldName?include_docs=true';
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function(data) {
			var i,
				Feld;
			for (i in data.rows) {
				if (typeof i !== "function") {
					Feld = data.rows[i].doc;
					// Nur ausgewählte offizielle Felder berücksichtigen
					// if (Feld.User === "ZentrenBdKt") {
					if (["pBemerkungen", "rBemerkungen", "oLatitudeDecDeg", "oLongitudeDecDeg", "oHöhe", "oHöheGenauigkeit", "oBemerkungen", "zBemerkungen", "aArtNameUnsicher", "aArtNameEigener", "aArtNameBemerkungen", "aMenge", "aBemerkungen"].indexOf(Feld.FeldName) > -1) {
						$db.openDoc(Feld._id, {
							success: function(Feld) {
								var Username = localStorage.Email;
								Feld.SichtbarImModusHierarchisch.push(Username);
								$db.saveDoc(Feld);
							}
						});
					}
				}
			}
		}
	});
};

// erstellt die sichtbaren Felder
// wird benutzt von: Signup.html
window.em.speichereAutorAlsStandardwert = function() {
	$db = $.couch.db("evab");
	$db.openDoc("f19cd49bd7b7a150c895041a5d02acb0", {
		success: function(Feld) {
			// Falls Standardwert noch nicht existiert, 
			// muss zuerst das Objekt geschaffen werden
			if (!Feld.Standardwert) {
				Feld.Standardwert = {};
			}
			Feld.Standardwert[localStorage.Email] = localStorage.Autor;
			$db.saveDoc(Feld, {
				success: function() {
					// Felder sictbar schalten
					window.em.erstelleSichtbareFelder();
					// Feldliste soll neu aufgebaut werden
					window.em.leereStorageFeldListe();
					$.mobile.navigate("BeobListe.html");
				},
				error: function() {
					window.em.erstelleSichtbareFelder();
					window.em.melde("Konto erfolgreich erstellt\nAnmeldung gescheitert\nBitte melden Sie sich neu an");
				}
			});
		},
		error: function() {
			window.em.erstelleSichtbareFelder();
			window.em.melde("Konto erfolgreich erstellt\nAnmeldung gescheitert\nBitte melden Sie sich neu an");
		}
	});
};


/*
*validiert email-adressen
*Quelle: http://stackoverflow.com/questions/2507030/email-validation-using-jquery
*/
window.em.validateEmail = function(email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if( !emailReg.test(email) ) {
		return false;
	} else {
		return true;
	}
};


// testet, ob die lokale Version erreichbar ist
// wenn ja, wird diese geöffnet, sonst arteigenschaften.ch
window.em.oeffneEigenschaftenVonArt = function(id) {
	var url,
		// neues Fenster jetzt schon gründen
		// wenn man window.open nach dem callback ausführt, öffnet das Fenster als popup
		win = window.open("", "_blank");

	$.ajax({
		type: 'HEAD',
		url: 'http://127.0.0.1:5984/artendb/_design/artendb/index.html'
	})
	.done(function() {
		// lokale db ist erreichbar, diese verwenden
		url = "http://127.0.0.1:5984/artendb/_design/artendb/index.html?id=" + id;
		// url des im neuen tab geöffneten Fensters anpassen
		win.location.href = url;
	})
	.fail(function() {
		// lokale db ist nicht erreichbar
		url = "http://arteigenschaften.ch/artendb/_design/artendb/index.html?id=" + id;
		// url des im neuen tab geöffneten Fensters anpassen
		win.location.href = url;
	});
};

// wenn Artenliste.html initiiert wird
window.em.handleAlPageinit = function() {
	$(document).on("keypress", window.em.handleAlKeypress);

	$("#Artenliste").on("click", "#al_filter_setzen", window.em.handleAlAlFilterClick);

	$("#Artenliste").on("click", ".ui-icon-delete", window.em.handleAlUiIconDeleteClick);

	$("#Artenliste").on("click", "#al_standardgruppe", window.em.handleAlAlStandardgruppeClick);

	$("#al_ArtenListe").on("click", "[name='ArtListItem']", function(event) {
		event.preventDefault();
		window.em.handleAlArtListItemClick(this);
	});
};

// wenn Artenliste.html gezeigt wird
window.em.handleAlPageshow = function() {
	window.em.initiiereArtenliste("");
	if (window.em.gruppe_merken) {
		$("#al_standardgruppe").removeClass('ui-disabled');
	} else {
		$("#al_standardgruppe").addClass('ui-disabled');
	}
};

// wenn Artenliste.html verschwindet
window.em.handleAlPagehide = function() {
	$("#al_ArtenListe").hide();
};

// wenn in Artenliste.html eine Taste gedrückt wird
window.em.handleAlKeypress = function() {
	if (event.which == 13) {
		var filterwert = $("#al_filter").val().toLowerCase();
		window.em.initiiereArtenliste(filterwert);
	}
};

// wenn in Artenliste.html #al_filter_setzen geklickt wird
window.em.handleAlAlFilterClick = function() {
	var filterwert = $("#al_filter").val().toLowerCase();
	window.em.initiiereArtenliste(filterwert);
};

// wenn in Artenliste.html .ui-icon-delete geklickt wird
window.em.handleAlUiIconDeleteClick = function() {
	var filterwert = "";
	window.em.initiiereArtenliste(filterwert);
};

// wenn in Artenliste.html #al_standardgruppe geklickt wird
window.em.handleAlAlStandardgruppeClick = function() {
	delete window.em.gruppe_merken;
	$.mobile.navigate("Artgruppenliste.html");
};

// wenn in Artenliste.html [name='ArtListItem'] geklickt wird
window.em.handleAlArtListItemClick = function(that) {
	var ArtBezeichnung = $(that).attr("ArtBezeichnung"),
		artid = $(that).attr("artid"),
		art_schon_erfasst = false,
		i;

	// kontrollieren, ob diese Art schon erfasst wurde
	// Vorsicht: window.em.hBeobListe existiert nicht, wenn in hBeobEdit F5 gedrückt wurde!
	if (window.em.hBeobListe && window.em.hBeobListe.rows) {
		_.each(window.em.hBeobListe.rows, function(row) {
			if (row.doc.aArtId == artid) {
				art_schon_erfasst = true;
			}
		});
	}

	if (art_schon_erfasst) {
		window.em.melde("Diese Art wurde bereits erfasst");
	} else {
		localStorage.aArtId = artid;
		if (localStorage.Status === "neu") {
			window.em.speichereNeueBeob(ArtBezeichnung);
		} else {
			window.em.speichereBeobNeueArtgruppeArt(ArtBezeichnung);
		}
	}
};

// wenn Artgruppenliste.html erscheint
window.em.handleAglPageshow = function() {
	window.em.erstelleArtgruppenListe();
	delete window.em.gruppe_merken;
};

// wenn Artgruppenliste.html verschwindet
window.em.handleAglPagehide = function() {
	$("#agl_standardgruppe").html("nächste Gruppe merken");
};

// wenn Artgruppenliste.html initiiert wird
window.em.handleAglPageinit = function() {
	// Vorsicht: Genauer als body funktioniert hier nicht,
	// weil die nested List im DOM jedes mal eine eigene Page aufbaut
	$("body").on("click", "[name='ArtgruppenListItem']", function(event) {
		event.preventDefault();
		window.em.handleAglArtgruppenListItemClick(this);
	});

	$("#Artgruppenliste").on("click", "#agl_standardgruppe", window.em.handleAglAglStandardgruppeClick);
};

// wenn in Artgruppenliste.html [name='ArtgruppenListItem'] geklickt wird
window.em.handleAglArtgruppenListItemClick = function(that) {
	localStorage.aArtGruppe = $(that).attr("ArtGruppe");
	// wenn die Gruppe gemerkt werden soll, sie als globale Variable speichern
	if (window.em.gruppe_merken) {
		window.em.gruppe_merken = $(that).attr("ArtGruppe");
	}
	$.mobile.navigate("Artenliste.html");
};

// wenn in Artgruppenliste.html #agl_standardgruppe geklickt wird
window.em.handleAglAglStandardgruppeClick = function() {
	if ($(this).html() === "nächste Gruppe merken") {
		window.em.gruppe_merken = true;
		$(this).html("nächste Gruppe wird gemerkt");
	} else {
		delete window.em.gruppe_merken;
		$(this).html("nächste Gruppe merken");
	}
};

// wenn BeobEdit.html erscheint
window.em.handleBeobEditPageshow = function() {
	// Sollte keine id vorliegen, zu BeobListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.BeobId || localStorage.BeobId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
		return;
	}
	window.em.initiiereBeobEdit();
};

// wenn BeobEdit.html verschwindet
window.em.handleBeobEditPagehide = function() {
	if (typeof window.em.watchID !== "undefined") {
		window.em.stopGeolocation();
	}
};

// wenn BeobEdit.html initiiert wird
window.em.handleBeobEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.BeobId || localStorage.BeobId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
		return;
	}

	$("#BeobEditHeader").on("click", "#OeffneBeobListeBeobEdit", window.em.handleOeffneBeobListeBeobEditClick);

	$("#BeobEditPageFooterNavbar").on("click", "#NeueBeobBeobEdit", function(event) {
		event.preventDefault();
		window.em.handleNeueBeobBeobEditClick();
	});

	$("#BeobEditForm").on("click", "[name='aArtGruppe']", function(event) {
		event.preventDefault();
		window.em.handleBeobEditAArtGruppeClick();
	});

	$("#BeobEditPageFooterNavbar").on("click", "#waehleFelderBeobEdit", function(event) {
		event.preventDefault();
		window.em.handleWaehleFelderBeobEditClick();
	});

	$("#BeobEditForm").on('click', '[name="aArtName"]', function(event) {
		event.preventDefault();
		window.em.handleBeobEditAArtnameClick();
	});

	$("#BeobEditForm").on("change", ".speichern", window.em.handleBeobEditSpeichernChange);

	// Eingabe im Zahlenfeld abfangen (blur)
	// Ende des Schiebens abfangen (slidestop)
	$("#BeobEditForm").on("blur slidestop", '.speichernSlider', window.em.speichereBeob);

	// Klicken auf den Pfeilen im Zahlenfeld abfangen
	$("#BeobEditForm").on("mouseup", '.ui-slider-input', window.em.speichereBeob);

	$("#FormAnhängeBE").on("change", ".speichernAnhang", window.em.handleBeobEditSpeichernAnhangChange);

	$("#BeobEditPageFooterNavbar").on('click', "#OeffneKarteBeobEdit", function(event) {
		event.preventDefault();
		window.em.handleBeobEditOeffneKarteClick();
	});

	$("#BeobEditPageFooterNavbar").on('click', "#verorteBeobBeobEdit", function(event) {
		event.preventDefault();
		window.em.GetGeolocation(localStorage.BeobId, "Beob");
	});

	$('#BeobEditPageFooterNavbar').on('click', '#LoescheBeobBeobEdit', function(event) {
		event.preventDefault();
		$("#beob_löschen_meldung").popup("open");
	});

	$("#beob_löschen_meldung").on("click", "#beob_löschen_meldung_ja_loeschen", window.em.löscheBeob);

	$("#BeobEdit").on("swipeleft", "#BeobEditContent", window.em.handleBeobEditContentSwipeleft);

	$("#BeobEdit").on("swiperight", "#BeobEditContent", window.em.handleBeobEditContentSwiperight);

	$("#BeobEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		// zum vorigen Datensatz wechseln
		window.em.nächsteVorigeBeob('vorige');
	});

	$("#BeobEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		// zum nächsten Datensatz wechseln
		window.em.nächsteVorigeBeob('nächste');
	});

	$("#BeobEdit").on("keyup", function(event) {
		// Wechsel zwischen Datensätzen via Pfeiltasten steuern
		// nicht in separate Funktion auslagern, weil IE9 event.preventDefault nicht kenn (und hier jQuery das abfängt)
		// nur reagieren, wenn BeobEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#BeobEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.nächsteVorigeBeob('vorige');
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.nächsteVorigeBeob('nächste');
				event.preventDefault();
			}
		}
	});

	$("#FormAnhängeBE").on("click", "[name='LöscheAnhang']", function(event) {
		event.preventDefault();
		window.em.loescheAnhang(this, window.em.Beobachtung, localStorage.BeobId);
	});

	$('#MenuBeobEdit').on('click', '.menu_arteigenschaften', window.em.handleBeobEditMenuArteigenschaftenClick);

	$('#MenuBeobEdit').on('click', '.menu_hierarchischer_modus', window.em.handleBeobEditMenuHierarchischerModusClick);

	$('#MenuBeobEdit').on('click', '.menu_felder_verwalten', window.em.handleBeobEditMenuFelderVerwaltenClick);

	$('#MenuBeobEdit').on('click', '.menu_beob_exportieren', window.em.handleBeobEditMenuBeobExportierenClick);

	$('#MenuBeobEdit').on('click', '.menu_einstellungen', window.em.handleBeobEditMenuEinstellungenClick);

	$('#MenuBeobEdit').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuBeobEdit').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuBeobEdit').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuBeobEdit').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn in BeobEdit.html #OeffneBeobListeBeobEdit geklickt wird
window.em.handleOeffneBeobListeBeobEditClick = function() {
	window.em.leereStorageBeobEdit();
	$.mobile.navigate("BeobListe.html");
};

// wenn in BeobEdit.html #NeueBeobBeobEdit geklickt wird
// neue Beobachtung erfassen
window.em.handleNeueBeobBeobEditClick = function() {
	// Globale Variable für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	window.em.leereStorageBeobListe();
	localStorage.Status = "neu";
	localStorage.Von = "BeobEdit";
	if (window.em.gruppe_merken) {
		// Artgruppenliste auslassen
		// localStorage.ArtGruppe ist schon gesetzt
		$.mobile.navigate("Artenliste.html");
	} else {
		$.mobile.navigate("Artgruppenliste.html");
	}
};

// wenn in BeobEdit.html [name='aArtGruppe'] geklickt wird
// Editieren von Beobachtungen managen, ausgehend von Artgruppe
window.em.handleBeobEditAArtGruppeClick = function() {
	// Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	window.em.leereStorageBeobListe();
	delete localStorage.Status;	// ja kein Status neu
	localStorage.Von = "BeobEdit";
	if (window.em.gruppe_merken) {
		// Artgruppenliste auslassen
		// localStorage.aArtGruppe ist schon gesetzt
		$.mobile.navigate("Artenliste.html");
	} else {
		$.mobile.navigate("Artgruppenliste.html");
	}
};

// wenn in BeobEdit.html #waehleFelderBeobEdit geklickt wird
// sichtbare Felder wählen
window.em.handleWaehleFelderBeobEditClick = function() {
	localStorage.AufrufendeSeiteFW = "BeobEdit";
	$.mobile.navigate("FelderWaehlen.html");
};

// wenn in BeobEdit.html [name="aArtName"] geklickt wird
// Editieren von Beobachtungen managen, ausgehend von ArtName
window.em.handleBeobEditAArtnameClick = function() {
	// Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	window.em.leereStorageBeobListe();
	localStorage.Von = "BeobEdit";
	$.mobile.navigate("Artenliste.html");
};

// wenn in BeobEdit.html .speichern geändert wird
// Für jedes Feld bei Änderung speichern
window.em.handleBeobEditSpeichernChange = function() {
	if (['oXKoord', 'oYKoord'].indexOf(this.name) > -1 && $("[name='oXKoord']").val() && $("[name='oYKoord']").val()) {
		// Wenn Koordinaten und beide erfasst
		localStorage.oXKoord = $("[name='oXKoord']").val();
		localStorage.oYKoord = $("[name='oYKoord']").val();
		// Längen- und Breitengrade berechnen
		localStorage.oLongitudeDecDeg = window.em.CHtoWGSlng(localStorage.oYKoord, localStorage.oXKoord);
		localStorage.oLatitudeDecDeg = window.em.CHtoWGSlat(localStorage.oYKoord, localStorage.oXKoord);
		localStorage.oLagegenauigkeit = null;
		// und Koordinaten speichern
		window.em.speichereKoordinaten(localStorage.BeobId, "Beobachtung");
	} else {
		window.em.speichereBeob(this);
	}
};

// wenn in BeobEdit.html .speichernAnhang geändert wird
// Änderungen im Formular für Anhänge speichern
window.em.handleBeobEditSpeichernAnhangChange = function() {
	var _attachments = $("#_attachmentsBE").val();
	if (_attachments && _attachments.length !== 0) {
		window.em.speichereAnhänge(localStorage.BeobId, window.em.Beobachtung, "BE");
	}
};

// wenn in BeobEdit.html #OeffneKarteBeobEdit geklickt wird
window.em.handleBeobEditOeffneKarteClick = function() {
	localStorage.zurueck = "BeobEdit";
	$.mobile.navigate("Karte.html");
};

// wenn in BeobEdit.html auf #BeobEditContent nach links gewischt wird
window.em.handleBeobEditContentSwipeleft = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsteVorigeBeob("nächste");
	}
};

// wenn in BeobEdit.html auf #BeobEditContent nach rechts gewischt wird
window.em.handleBeobEditContentSwiperight = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsteVorigeBeob("vorige");
	}
};

// wenn in BeobEdit.html .menu_arteigenschaften geklickt wird
window.em.handleBeobEditMenuArteigenschaftenClick = function() {
	window.em.oeffneEigenschaftenVonArt(localStorage.aArtId);
};

// wenn in BeobEdit.html .menu_hierarchischer_modus geklickt wird
window.em.handleBeobEditMenuHierarchischerModusClick = function() {
	window.em.leereStorageBeobEdit();
	$.mobile.navigate("hProjektListe.html");
};

// wenn in BeobEdit.html .menu_felder_verwalten geklickt wird
window.em.handleBeobEditMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "BeobEdit.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in BeobEdit.html .menu_beob_exportieren geklickt wird
window.em.handleBeobEditMenuBeobExportierenClick = function() {
	window.open('_list/ExportBeob/ExportBeob?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuBeobEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuBeobEdit").popup("close");
};

// wenn in BeobEdit.html .menu_einstellungen geklickt wird
window.em.handleBeobEditMenuEinstellungenClick = function() {
	localStorage.zurueck = "BeobEdit.html";
	window.em.öffneMeineEinstellungen();
};

// wenn BeobListe.html erscheint
window.em.handleBeobListePageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	}
	window.em.initiiereBeobliste();
};

// Wenn BeobListe.html initiiert wird
window.em.handleBeobListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	}

	$("#BeoblisteBL").on("swipeleft click", ".beob", window.em.handleBeobListeBeobSwipeleftClick);

	$("#BeoblisteBL").on("taphold", ".beob", window.em.handleBeobListeBeobTaphold);

	$("#BeobListePageFooter").on('click', '#OeffneKarteBeobListe', function(event) {
		event.preventDefault();
		window.em.handleBeobListeOeffneKarteBeobListeClick();
	});

	$("#BeobListePageHeader").on('click', "#OeffneProjektListeBeobListe", function(event) {
		event.preventDefault();
		$.mobile.navigate("hProjektListe.html");
	});

	$("#BeobListe").on("click", ".NeueBeobBeobListe", function(event) {
		event.preventDefault();
		window.em.erstelleNeueBeob_1_Artgruppenliste();
	});

	$("#BeoblisteBL").on("swipeleft", ".erste", window.em.erstelleNeueBeob_1_Artgruppenliste);

	$("#BeobListe").on("swiperight", "#BeobListePageContent", window.em.handleBeobListeBeobListePageContentSwiperight);

	$('#MenuBeobListe').on('click', '.menu_hierarchischer_modus', window.em.handleBeobListeMenuHierarchischerModusClick);

	$('#MenuBeobListe').on('click', '.menu_felder_verwalten', window.em.handleBeobListeMenuFelderVerwaltenClick);

	$('#MenuBeobListe').on('click', '.menu_beob_exportieren', window.em.handleBeobListeMenuBeobExportierenClick);

	$('#MenuBeobListe').on('click', '.menu_einstellungen', window.em.handleBeobListeMenuEinstellungenClick);

	$('#MenuBeobListe').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuBeobListe').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuBeobListe').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuBeobListe').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn in BeobListe.html .beob geklickt oder nach links geswiped wird
window.em.handleBeobListeBeobSwipeleftClick = function() {
	localStorage.BeobId = $(this).attr('id');
	$.mobile.navigate("BeobEdit.html");
};

// wenn in BeobListe.html .beob taphold
window.em.handleBeobListeBeobTaphold = function() {
	// FUNKTIONIERT NICHT, WEIL JQUERY MOBILE NACH TAPHOLD IMMER EINEN TAP AUSFÜHRT!!!!!!!!!!!!!!!	
	console.log('taphold');
};

// wenn in BeobListe.html #OeffneKarteBeobListe geklickt wird
window.em.handleBeobListeOeffneKarteBeobListeClick = function() {
	localStorage.zurueck = "BeobListe";
	$.mobile.navigate("Karte.html");
};

// wenn in BeobListe.html #BeobListePageContent nach rechts gewischt wird
window.em.handleBeobListeBeobListePageContentSwiperight = function() {
	$.mobile.navigate("hProjektListe.html");
};

// wenn in BeobListe.html .menu_hierarchischer_modus geklickt wird
window.em.handleBeobListeMenuHierarchischerModusClick = function() {
	$.mobile.navigate("hProjektListe.html");
};

// wenn in BeobListe.html .menu_felder_verwalten geklickt wird
window.em.handleBeobListeMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "BeobListe.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in BeobListe.html .menu_beob_exportieren geklickt wird
window.em.handleBeobListeMenuBeobExportierenClick = function() {
	window.open('_list/ExportBeob/ExportBeob?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuBeobListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuBeobListe").popup("close");
};

// wenn in BeobListe.html .menu_einstellungen geklickt wird
window.em.handleBeobListeMenuEinstellungenClick = function() {
	localStorage.zurueck = "BeobListe.html";
	window.em.öffneMeineEinstellungen();
};

// wenn FeldEdit.html erscheint
// Sollte keine id vorliegen, zu FeldListe.html wechseln
// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
window.em.handleFeldEditPageshow = function() {
	console.log("feldedit pageshow");
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.FeldId || localStorage.FeldId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		window.em.geheZurueckFE();
	}
	window.em.initiiereFeldEdit();
};

// wenn FeldEdit.html initiiert wird
// Code, der nur beim ersten Aufruf der Seite laufen soll
window.em.handleFeldEditPageinit = function() {
	console.log("feldedit pageinit");
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.FeldId || localStorage.FeldId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
	}

	$("#FeldEditContent").on("change", ".Feldeigenschaften", window.em.handleFeldEditFeldeigenschaftenChange);

	$("#FeldEditForm").on("change", "#FeldFolgtNach", window.em.handleFeldEditFeldFolgtNachChange);

	$("#FeldEditFooter").on("click", "#NeuesFeldFeldEdit", function(event) {
		event.preventDefault();
		window.em.neuesFeld();
	});

	$("#UserFeldForm").on("change", "#Standardwert", window.em.handleFeldEditStandardwertChange);

	$('#FeldEditFooter').on('click', '#LoescheFeldFeldEdit', function(event) {
		event.preventDefault();
		window.em.handleFeldEditLoescheFeldFeldEditClick();
	});

	$("#fe_löschen_meldung").on("click", "#fe_löschen_meldung_ja_loeschen", window.em.handleFeldEditFeLoeschenMeldungJaClick);

	$('#MenuFeldEdit').on('click', '.menu_datenfelder_exportieren', window.em.handleFeldEditMenuDatenfelderExportierenClick);

	$("#FeldEditHeader").on('click', '#zurueckFeldEdit', function(event) {
		event.preventDefault();
		window.em.geheZurueckFE();
	});

	$("#FeldEdit").on("swipeleft", "#FeldEditContent", window.em.geheZumNächstenFeld);

	$("#FeldEdit").on("swiperight", "#FeldEditContent", window.em.geheZumVorigenFeld);

	$("#FeldEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		window.em.geheZumVorigenFeld();
	});

	$("#FeldEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		window.em.geheZumNächstenFeld();
	});

	$("#FeldEdit").on("keyup", function(event) {
		// wenn in FeldEdit.htm eine Taste gedrückt wird
		// mit Pfeiltasten Datensätze wechseln
		// nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#FeldEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.geheZumVorigenFeld();
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.geheZumNächstenFeld();
				event.preventDefault();
			}
		}
	});
};

// wenn in FeldEdit.htm .Feldeigenschaften geändert wird
// jedes Feld aus Feldeigenschaften bei Änderung speichern
window.em.handleFeldEditFeldeigenschaftenChange = function() {
	localStorage.FeldWert = this.value;
	if (this.name) {
		localStorage.FeldName = this.name;
		localStorage.AlterFeldWert = window.em.Feld[this.name];
	} else {
		localStorage.FeldName = this.id;
		localStorage.AlterFeldWert = window.em.Feld[this.id];
	}
	// Felder der Datenzentren dürfen nicht verändert werden
	// ausser Standardwert, dessen Änderung wird aber in einer anderen Funktion verarbeitet
	if (window.em.Feld.User === "ZentrenBdKt" && !$(this).hasClass('meineEinstellungen')) {
		// Feldwert zurücksetzen	
		if (localStorage.AlterFeldWert) {
			$("#" + localStorage.FeldName).val(localStorage.AlterFeldWert);
		} else {
			$("#" + localStorage.FeldName).val("");
		}
		delete localStorage.FeldName;
		delete localStorage.FeldWert;
		delete localStorage.AlterFeldWert;
		window.em.melde("Dies ist ein geschütztes Feld eines öffentlichen Datenzentrums<br><br>Statt dieses zu ändern können Sie ein eigenes Feld erstellen");
	} else if (localStorage.FeldName === "FeldName") {
		// Wenn eigener Feldname verändert wird, kontrollieren, dass er nicht schon verwendet wurde
		// ohne explizit auf undefined zu prüfen, akzeptierte die Bedingung einen alten Feldwert von 
		// undefined als o.k.!!!!
		if (localStorage.AlterFeldWert !== "undefined" && localStorage.AlterFeldWert) {
			// wenn ein alter Feldname existiert,
			// zählen, in wievielen Datensätzen das Feld verwendet wird
			$db = $.couch.db("evab");
			$db.view('evab/FeldSuche?key="' + localStorage.Email + '"&include_docs=true', {
				success: function(data) {
					var i,
						anzVorkommen = 0,
						Datensatz,
						feldname,
						ds;
					// zählen, in wievielen Datensätzen das bisherige Feld verwendet wird
					for (i in data.rows) {
						Datensatz = data.rows[i].doc;
						feldname = Datensatz[localStorage.AlterFeldWert];
						if (feldname) {
							anzVorkommen += 1;
						}
					}
					if (anzVorkommen === 0) {
						// alter Feldname wurde noch in keinem Datensatz verwendet
						// prüfen, ob der neue Feldname schon existiert
						// wenn ja: melden, zurückstellen
						// wenn nein: speichern
						window.em.pruefeFeldNamen();
					} else {
						// Feldname wird schon verwendet > melden, zurückstellen
						ds = "Datensätzen";
						if (anzVorkommen === 1) {
							ds = "Datensatz";
						}
						$("#FeldName").val(localStorage.AlterFeldWert);
						delete localStorage.FeldName;
						delete localStorage.FeldWert;
						delete localStorage.AlterFeldWert;
						window.em.melde("Dieses Feld wird in " + anzVorkommen + " " + ds + " verwendet.<br>Es kann deshalb nicht verändert werden.<br>Bereinigen Sie zuerst die Daten.");
					}
				}
			});
		} else {
			// Vorher gab es keinen Feldnamen
			// prüfen, ob der neue Feldname schon existiert
			// wenn ja: melden, zurückstellen
			// wenn nein: speichern
			window.em.pruefeFeldNamen();
		}
	} else if (localStorage.FeldName === "Hierarchiestufe" && localStorage.FeldWert === "Art") {
		$(".FeldEditHeaderTitel").text(localStorage.FeldWert + ": " + window.em.Feld.FeldBeschriftung);
		window.em.leereStorageFeldListe();
		window.em.speichereFeldeigenschaften();
		// Wenn die Hierarchiestufe zu Art geändert wird, muss das Feld für die Artgruppe aufgebaut werden
		window.em.ArtGruppeAufbauenFeldEdit();
		window.em.melde("Jetzt müssen Sie wählen, in welchen Artgruppen dieses Feld angezeigt werden kann");
	} else if (localStorage.FeldName === "Hierarchiestufe" && localStorage.FeldWert !== "Art") {
		$(".FeldEditHeaderTitel").text(localStorage.FeldWert + ": " + window.em.Feld.FeldBeschriftung);
		if (window.em.Feld.Hierarchiestufe === "Art") {
			// Wenn die Hierarchiestufe Art war und geändert wird, muss das Feld für die Artgruppe entfernt werden
			$("#Artgruppenliste_FeldEdit").empty();
		}
		window.em.leereStorageFeldListe();
		window.em.speichereFeldeigenschaften();
	} else {
		if (localStorage.FeldName === "FeldBeschriftung") {
			$(".FeldEditHeaderTitel").text(window.em.Feld.Hierarchiestufe + ": " + localStorage.FeldWert);
		}
		window.em.speichereFeldeigenschaften();
	}
	window.em.blendeDatentypabhängigeFelder();
}

window.em.blendeDatentypabhängigeFelder = function() {
	switch (window.em.Feld.Formularelement) {
		case "textinput":
			$("#feldedit_inputtyp").show();
			$("#feldedit_optionen").hide();
			$(".feldedit_slider").hide();
			break;
		case "selectmenu":
		case "multipleselect":
		case "radio":
		case "checkbox":
			$("#feldedit_optionen").show();
			$("#feldedit_inputtyp").hide();
			$(".feldedit_slider").hide();
			break;
		case "slider":
			$(".feldedit_slider").show();
			$("#feldedit_inputtyp").hide();
			$("#feldedit_optionen").hide();
			break;
		default:
			$(".feldedit_slider").hide();
			$("#feldedit_inputtyp").hide();
			$("#feldedit_optionen").hide();
			break;
	}
}

// wenn in FeldEdit.htm #FeldFolgtNach geändert wird
window.em.handleFeldEditFeldFolgtNachChange = function() {
	window.em.setzeReihenfolgeMitVorgaenger(this.value);
	// Feldliste soll neu aufgebaut werden
	delete window.em.Feldliste;
};

// wenn in FeldEdit.htm #Standardwert geändert wird
window.em.handleFeldEditStandardwertChange = function() {
	var Optionen = $("#Optionen").val() || [],	// undefined verhindern
		Feldwert = this.value || [],	// undefined verhindern
		LetzterFeldwert, 
		Formularelement, 
		StandardwertOptionen;
	if (Optionen.length > 0) {
		// es gibt Optionen. Der Standardwert muss eine oder allenfalls mehrere Optionen sein
		LetzterFeldwert = [];
		if (window.em.Feld.Standardwert) {
			if (window.em.Feld.Standardwert[localStorage.Email]) {
				LetzterFeldwert = window.em.Feld.Standardwert[localStorage.Email];
			}
		}
		// Standardwert in Array verwandeln
		StandardwertOptionen = [];
		if (Feldwert.length > 0) {
			// Fehler verhindern, falls Feldwert undefined ist
			StandardwertOptionen = Feldwert.split(",");
		}
		if (["multipleselect", "checkbox"].indexOf(window.em.Feld.Formularelement) > -1) {
			// alle StandardwertOptionen müssen Optionen sein
			for (i in StandardwertOptionen) {
				if (typeof i !== "function") {
					if (Optionen.indexOf(StandardwertOptionen[i]) === -1) {
						// ein Wert ist keine Option, abbrechen
						$("#Standardwert").val(LetzterFeldwert);
						window.em.melde("Bitte wählen Sie eine oder mehrere der Optionen");
						return;
					}
				}
			}
			// alle Werte sind Optionen
			window.em.speichereStandardwert();
		} else if (["toggleswitch", "selectmenu", "radio"].indexOf(window.em.Feld.Formularelement) > -1) {
			// Array darf nur ein Element enthalten
			if (StandardwertOptionen.length > 1) {
				// Array enthält mehrere Optionen, nicht zulässig
				$("#Standardwert").val(LetzterFeldwert);
				window.em.melde("Bitte wählen Sie nur EINE der Optionen");
			} else {
				// Array enthält eine einzige Option
				for (i in StandardwertOptionen) {
					if (typeof i !== "function") {
						if (Optionen.indexOf(StandardwertOptionen[i]) === -1) {
							// der Wert ist keine Option, abbrechen
							$("#Standardwert").val(LetzterFeldwert);
							window.em.melde("Bitte wählen Sie eine der Optionen");
							return;
						}
					}
				}
				// alle Werte sind Optionen
				window.em.speichereStandardwert();
				return;
			}
		} else {
			// Optionen sind erfasst, Feld braucht aber keine. Alle Werte akzeptieren
			window.em.speichereStandardwert();
		}
	} else {
		// Es gibt keine Optionen. Alle Standardwerte akzeptieren
		window.em.speichereStandardwert();
	}
};

// wenn in FeldEdit.htm #LoescheFeldFeldEdit geklickt wird
// Beim Löschen rückfragen
window.em.handleFeldEditLoescheFeldFeldEditClick = function() {
	if (window.em.Feld.User === "ZentrenBdKt") {
		window.em.melde("Dies ist ein Feld eines nationalen Datenzentrums<br><br>Es kann nicht gelöscht werden<br><br>Sie können es ausblenden");
	} else {
		$("#fe_löschen_meldung").popup("open");
	}
};

// wenn in FeldEdit.htm #fe_löschen_meldung_ja_loeschen geklickt wird
window.em.handleFeldEditFeLoeschenMeldungJaClick = function() {
	if (!window.em.Feld.FeldName) {
		// Ohne Feldname kann nicht kontrolliert werden, in wievielen Datensätzen das Feld vorkommt
		window.em.loescheFeld();
	} else {
		$db = $.couch.db("evab");
		// zählen, in wievielen Datensätzen das Feld verwendet wird
		$db.view('evab/FeldSuche?key="' + localStorage.Email + '"&include_docs=true', {
			success: function(data) {
				var i,
					anzVorkommen = 0,
					Datensatz,
					feldname,
					ds;
				for (i in data.rows) {
					if (typeof i !== "function") {
						Datensatz = data.rows[i].doc;
						feldname = Datensatz[window.em.Feld.FeldName];
						if (feldname) {
							anzVorkommen += 1;
						}
					}
				}
				if (anzVorkommen === 0) {
					window.em.loescheFeld();
				} else {
					ds = "Datensätzen";
					if (anzVorkommen === 1) {
						ds = "Datensatz";
					}
					window.em.melde("Löschen abgebrochen:<br>Dieses Feld wird in " + anzVorkommen + " " + ds + " verwendet<br>Bereinigen Sie zuerst die Daten");
				}
			}
		});
	}
};

// wenn in FeldEdit.htm .menu_datenfelder_exportieren geklickt wird
window.em.handleFeldEditMenuDatenfelderExportierenClick = function() {
	window.open("_list/FeldExport/FeldListe?include_docs=true");
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuFeldEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuFeldEdit").popup("close");
};

// wenn FelderWaehlen.html erscheint
window.em.handleFelderWaehlenPageshow = function() {
	// Sollte keine id vorliegen, zu BeobListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.AufrufendeSeiteFW || localStorage.AufrufendeSeiteFW === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
		return;
	}
	window.em.initiiereFelderWaehlen();
};

// wenn FelderWaehlen.html verschwindet
window.em.handleFelderWaehlenPagehide = function() {
	// globale Variabeln aufräumen
	delete localStorage.FeldlisteFwName;
	delete localStorage.KriterienFürZuWählendeFelder;
	// ausgeschaltet, weil es das braucht, wenn man von FelderWahlen direkt nach FeldEdit springt und dann zu FeldWaehlen zurück
	//delete localStorage.AufrufendeSeiteFW;
	// verhindern, dass beim nächsten Mal zuerst die alten Felder angezeigt werden
	$("#FeldlisteFW").empty();
};

// wenn FelderWaehlen.html initiiert wird
window.em.handleFelderWaehlenPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if (!localStorage.AufrufendeSeiteFW || localStorage.AufrufendeSeiteFW === "undefined") {
		// oh, kein zurück bekannt
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
	}

	$("#FelderWaehlenPage").on("click", "#FelderWaehlenPage_back", function(event) {
		event.preventDefault();
		$.mobile.navigate(localStorage.AufrufendeSeiteFW + ".html");
	});

	$("#FeldlisteFW").on("change", "input[name='Felder']", window.em.handleFelderWaehlenInputFelderChange);

	// aus unbekanntem Grund funktioniert .on nicht aber .bind schon
	$("#FeldlisteFW").bind("taphold", "input[name='Felder']", function(event) {
		event.preventDefault();
		// event.target ist immer das label
		var FeldName = $(event.target).prop("for");
		window.em.öffneFeld(FeldName);
	});
};

// wenn in FelderWaehlen.html input[name='Felder'] geändert wird
// Felder speichern (checkbox)
window.em.handleFelderWaehlenInputFelderChange = function() {
	var i,
		FeldName = $(this).prop("id"),
		FeldId = $(this).attr("feldid"),
		Feld,
		FeldPosition,
		SichtbarImModusX,
		idx;
	for (i in window.em[localStorage.FeldlisteFwName].rows) {
		if (typeof window.em[localStorage.FeldlisteFwName] !== "function") {
			if (window.em[localStorage.FeldlisteFwName].rows[i].doc._id === FeldId) {
				Feld = window.em[localStorage.FeldlisteFwName].rows[i].doc;
				FeldPosition = parseInt(i);
				break;
			}
		}
	}
	// Bei BeobEdit.html muss SichtbarImModusEinfach gesetzt werden, sonst SichtbarImModusHierarchisch
	if (localStorage.AufrufendeSeiteFW === "BeobEdit") {
		SichtbarImModusX = "SichtbarImModusEinfach";
	} else {
		SichtbarImModusX = "SichtbarImModusHierarchisch";
	}
	SichtbarImModusX = Feld[SichtbarImModusX] || [];
	if ($("#" + FeldName).prop("checked") === true) {
		SichtbarImModusX.push(localStorage.Email);
	} else {
		idx = SichtbarImModusX.indexOf(localStorage.Email);
		if (idx !== -1) {
			SichtbarImModusX.splice(idx, 1);
		}
	}
	Feld[SichtbarImModusX] = SichtbarImModusX;
	// Änderung in DB speichern
	$db.saveDoc(Feld, {
		success: function(data) {
			// neue rev holen
			Feld._rev = data.rev;
			// Änderung in Feldliste-Objekt speichern
			window.em[localStorage.FeldlisteFwName].rows[FeldPosition].doc = Feld;
		},
		error: function() {
			window.em.melde("Fehler: nicht gespeichert<br>Vielleicht klicken Sie zu schnell?");
		}
	});
};

window.em.öffneFeld = function(FeldName) {
	$db = $.couch.db("evab");
	$db.view('evab/FeldListeFeldName?key="' + FeldName + '"&include_docs=true', {
		success: function(data) {
			localStorage.FeldId = data.rows[0].doc._id;
			localStorage.zurueck = "FelderWaehlen.html";
			$.mobile.navigate("FeldEdit.html");
		}
	});
};

// wenn FeldListe.html erscheint
window.em.handleFeldListePageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}
	window.em.initiiereFeldliste();
};

// wenn FeldListe.html initiiert wird
window.em.handleFeldListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}

	// sicherstellen, dass zurueck nie leer ist
	if (!localStorage.zurueck) {
		localStorage.zurueck = "BeobListe.html";
	}

	$("#FeldListeFL").on('click', '.Feld', function(event) {
		event.preventDefault();
		window.em.handleFeldListeFeldClick(this);
	});

	$("#FeldListeFooter").on("click", "#NeuesFeldFeldListe", function(event) {
		event.preventDefault();
		window.em.neuesFeld();
	});

	$('#MenuFeldListe').on('click', '.menu_datenfelder_exportieren', window.em.handleFeldListeMenuDatenfelderExportierenClick);

	$("#FeldListeHeader").on('click', '#FeldListeBackButton', function(event) {
		event.preventDefault();
		window.em.handleFeldListeBackButtonClick();
	});
};

// wenn in FeldListe.html .Feld geklickt wird
// Feld öffnen
window.em.handleFeldListeFeldClick = function(that) {
	localStorage.FeldId = $(that).attr('FeldId');
	$.mobile.navigate("FeldEdit.html");
};

// wenn in FeldListe.html .menu_datenfelder_exportieren geklickt wird
window.em.handleFeldListeMenuDatenfelderExportierenClick = function() {
	window.open("_list/FeldExport/FeldListe?include_docs=true");
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuFeldListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuFeldListe").popup("close");
};

// wenn in FeldListe.html #FeldListeBackButton geklickt wird
window.em.handleFeldListeBackButtonClick = function() {
	$.mobile.navigate(localStorage.zurueck);
	delete localStorage.zurueck;
};

// wenn hArtEdit.html erscheint
window.em.handleHArtEditPageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.Status && !localStorage.hBeobId) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiierehBeobEdit();
};

// wenn hArtEdit.html initiiert wird
window.em.handleHArtEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.hBeobId || localStorage.hBeobId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	$("#hArtEditPageHeader").on("click", "[name='OeffneArtListehArtEdit']", function(event) {
		event.preventDefault();
		window.em.handleHArtEditOeffneArtListehArtEditClick();
	});

	$("#hArtEditPageHeader").on("click", "#OeffneZeithArtEdit", function(event) {
		event.preventDefault();
		window.em.handleHArtEditOeffneZeithArtEditClick();
	});

	$("#hArtEditPageHeader").on("click", "#OeffneOrthArtEdit", function(event) {
		event.preventDefault();
		window.em.handleHArtEditOeffneOrthArtEditClick();
	});

	$("#hArtEditPageHeader").on("click", "#OeffneRaumhArtEdit", function(event) {
		event.preventDefault();
		window.em.handleHArtEditOeffneRaumhArtEditClick();
	});

	$("#hArtEditPageHeader").on("click", "#OeffneProjekthArtEdit", function(event) {
		event.preventDefault();
		window.em.handleHArtEditOeffneProjekthArtEditClick();
	});

	// Für jedes Feld bei Änderung speichern
	$("#hArtEditForm").on("change", ".speichern", window.em.speichereHArt);

	// ungelöstes Problem: swipe reagiert!
	// Eingabe im Zahlenfeld abfangen
	$("#hArtEditForm").on("blur", '.speichernSlider', window.em.speichereHArt);

	// Klicken auf den Pfeilen im Zahlenfeld abfangen
	$("#hArtEditForm").on("mouseup", '.ui-slider-input', window.em.speichereHArt);

	// Ende des Schiebens abfangen
	$("#hArtEditForm").on("slidestop", '.speichernSlider', window.em.speichereHArt);

	// Änderungen im Formular für Anhänge speichern
	$("#FormAnhängehAE").on("change", ".speichernAnhang", window.em.handleHArtEditSpeichernAnhangChange);

	// Neue Beobachtung managen
	$("#hArtEditPageFooter").on("click", "#NeueBeobhArtEdit", function(event) {
		event.preventDefault();
		window.em.handleHArtEditNeueBeobhArtEditClick();
	});

	// Editieren von Beobachtungen managen, ausgehend von Artgruppe
	$("#hArtEditForm").on("click", "[name='aArtGruppe']", function(event) {
		event.preventDefault();
		window.em.zuArtgruppenliste();
	});

	// Editieren von Beobachtungen managen, ausgehend von ArtName
	$("#hArtEditForm").on("click", "[name='aArtName']", function(event) {
		event.preventDefault();
		window.em.zuArtliste();
	});

	// sichtbare Felder wählen
	$("#hArtEditPageFooter").on("click", "#waehleFelderhBeobEdit", function(event) {
		event.preventDefault();
		window.em.handleHArtEditWaehleFelderClick();
	});

	// Code für den Art-Löschen-Dialog
	$("#hArtEditPageFooter").on('click', '#LoescheBeobhArtEdit', function(event) {
		event.preventDefault();
		$("#hae_löschen_meldung").popup("open");
	});

	$("#hae_löschen_meldung").on("click", "#hae_löschen_meldung_ja_loeschen", window.em.löscheHBeob);

	$("#hArtEdit").on("swipeleft", window.em.handleHArtEditSwipeleft);

	$("#hArtEdit").on("swiperight", window.em.handleHArtEditSwiperight);

	// Pagination Pfeil voriger initialisieren
	$("#hArtEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		window.em.nächsteVorigeArt("vorige");
	});

	// Pagination Pfeil nächster initialisieren
	$("#hArtEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		window.em.nächsteVorigeArt("nächste");
	});

	// Pagination Pfeiltasten initialisieren
	$("#hArtEdit").on("keyup", function(event) {
		// nur reagieren, wenn hArtEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#hArtEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.nächsteVorigeArt("vorige");
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.nächsteVorigeArt("nächste");
				event.preventDefault();
			}
		}
	});

	$("#FormAnhängehAE").on("click", "[name='LöscheAnhang']", function(event) {
		event.preventDefault();
		window.em.handleHArtEditLoescheAnhangClick(this);
	});

	$('#MenuhBeobEdit').on('click', '.menu_arteigenschaften', window.em.handleHArtEditMenuArteigenschaftenClick);

	$('#MenuhBeobEdit').on('click', '.menu_einfacher_modus', window.em.handleHArtEditMenuEinfacherModusClick);

	$('#MenuhBeobEdit').on('click', '.menu_felder_verwalten', window.em.handleHArtEditMenuFelderVerwaltenClick);

	$('#MenuhBeobEdit').on('click', '.menu_beob_exportieren', window.em.handleHArtEditMenuBeobExportierenClick);

	$('#MenuhBeobEdit').on('click', '.menu_einstellungen', window.em.handleHArtEditMenuEinstellungenClick);

	$('#MenuhBeobEdit').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuhBeobEdit').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuhBeobEdit').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuhBeobEdit').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn hArtListe.html erscheint
window.em.handleHArtListePageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.ZeitId || localStorage.ZeitId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiierehBeobListe();
};

// wenn hArtListe.html initiiert wird
window.em.handleHArtListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.ZeitId || localStorage.ZeitId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	// Link zu Raum in Navbar und Titelleiste
	$("#hArtListePageHeader").on("click", "[name='OeffneZeithArtListe']", function(event) {
		event.preventDefault();
		window.em.handleHArtListeOeffneZeitClick();
	});

	$("#hArtListePageHeader").on("click", "#OeffneOrthArtListe", function(event) {
		event.preventDefault();
		window.em.handleHArtListeOeffneOrtClick();
	});

	$("#hArtListePageHeader").on("click", "#OeffneRaumhArtListe", function(event) {
		event.preventDefault();
		window.em.handleHArtListeOeffneRaumClick();
	});

	$("#hArtListePageHeader").on("click", "#OeffneProjekthArtListe", function(event) {
		event.preventDefault();
		window.em.handleHArtListeOeffneProjektClick();
	});

	// Neue Beobachtung managen
	$("#hArtListe").on("click", ".NeueBeobhArtListe", function(event) {
		event.preventDefault();
		window.em.öffneArtgruppenliste_hal();
	});

	$("#ArtlistehAL").on("swipeleft", ".erste", window.em.öffneArtgruppenliste_hal);

	$("#ArtlistehAL").on("swipeleft click", ".beob", window.em.handleHArtListeBeobClick);

	$("#hArtListe").on("swiperight", window.em.handleHArtListeSwiperight);

	$('#MenuhBeobListe').on('click', '.menu_einfacher_modus', window.em.handleHArtListeMenuEinfacherModusClick);

	$('#MenuhBeobListe').on('click', '.menu_felder_verwalten', window.em.handleHArtListeMenuFelderVerwaltenClick);

	$('#MenuhBeobListe').on('click', '.menu_beob_exportieren', window.em.handleHArtListeMenuFelderVerwaltenClick);

	$('#MenuhBeobListe').on('click', '.menu_einstellungen', window.em.handleHArtListeMenuEinstellungenClick);

	$('#MenuhBeobListe').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuhBeobListe').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuhBeobListe').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuhBeobListe').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn in hArtListe.html [name='OeffneZeithArtListe'] geklickt wird
window.em.handleHArtListeOeffneZeitClick = function() {
	window.em.leereStoragehBeobListe();
	$.mobile.navigate("hZeitEdit.html");
};

// wenn in hArtListe.html #OeffneOrthArtListe geklickt wird
window.em.handleHArtListeOeffneOrtClick = function() {
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	$.mobile.navigate("hOrtEdit.html");
};

// wenn in hArtListe.html #OeffneRaumhArtListe geklickt wird
window.em.handleHArtListeOeffneRaumClick = function() {
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	$.mobile.navigate("hRaumEdit.html");
};

// wenn in hArtListe.html #OeffneProjekthArtListe geklickt wird
window.em.handleHArtListeOeffneProjektClick = function() {
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

// wenn in hArtListe.html .beob geklickt wird
window.em.handleHArtListeBeobClick = function() {
	localStorage.hBeobId = $(this).attr('hBeobId');
	$.mobile.navigate("hArtEdit.html");
};

// wenn in hArtListe.html nach rechts gewischt wird
window.em.handleHArtListeSwiperight = function() {
	$.mobile.navigate("hZeitListe.html");
};

// wenn in hArtListe.html .menu_einfacher_modus geklickt wird
window.em.handleHArtListeMenuEinfacherModusClick = function() {
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

// wenn in hArtListe.html .menu_felder_verwalten geklickt wird
window.em.handleHArtListeMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hArtListe.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in hArtListe.html .menu_beob_exportieren geklickt wird
window.em.handleHArtListeMenuBeobExportierenClick = function() {
	window.open('_list/ExportBeob/ExportBeob?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuhBeobListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuhBeobListe").popup("close");
};

// wenn in hArtListe.html .menu_einstellungen geklickt wird
window.em.handleHArtListeMenuEinstellungenClick = function() {
	localStorage.zurueck = "hArtListe.html";
	window.em.öffneMeineEinstellungen();
};

// wenn hOrtEdit.html erscheint
window.em.handleHOrtEditPageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.OrtId || localStorage.OrtId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiiereOrtEdit();
};

// wenn hOrtEdit.html verschwindet
window.em.handleHOrtEditPagehide = function() {
	if (typeof window.em.watchID !== "undefined") {
		window.em.stopGeolocation();
	}
};

// wenn hOrtEdit.html initiiert wird
window.em.handleHOrtEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.OrtId || localStorage.OrtId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	// inaktive tabs inaktivieren
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$("#OrtEditHeader").on("click", "[name='OeffneOrtListeOrtEdit']", function(event) {
		event.preventDefault();
		window.em.handleHOrtEditOeffneOrtListeClick();
	});

	$("#OrtEditHeader").on("click", "#OeffneRaumOrtEdit", function(event) {
		event.preventDefault();
		window.em.handleHOrtEditOeffneRaumClick();
	});

	$("#OrtEditHeader").on("click", "#OeffneZeitListeOrtEdit", function(event) {
		event.preventDefault();
		$.mobile.navigate("hZeitListe.html");
	});

	$("#OrtEditHeader").on("click", "#OeffneProjektOrtEdit", function(event) {
		event.preventDefault();
		window.em.handleHOrtEditOeffneProjektClick();
	});

	// Für jedes Feld bei Änderung speichern
	$("#hOrtEditForm").on("change", ".speichern", window.em.handleHOrtEditSpeichernChange);

	// ungelöstes Problem: swipe reagiert!
	// Eingabe im Zahlenfeld abfangen
	$("#hOrtEditForm").on("blur", '.speichernSlider', window.em.speichereHOrtEdit);

	// Klicken auf den Pfeilen im Zahlenfeld abfangen
	$("#hOrtEditForm").on("mouseup", '.ui-slider-input', window.em.speichereHOrtEdit);

	// Ende des Schiebens abfangen
	$("#hOrtEditForm").on("slidestop", '.speichernSlider', window.em.speichereHOrtEdit);

	// Änderungen im Formular für Anhänge speichern
	$("#FormAnhängehOE").on("change", ".speichernAnhang", window.em.handleHOrtEditSpeichernAnhangChange);

	// neuen Ort erstellen
	$("#OrtEditFooter").on('click', '#NeuerOrtOrtEdit', function(event) {
		event.preventDefault();
		window.em.erstelleNeuenOrt();
	});

	// sichtbare Felder wählen
	$("#OrtEditFooter").on("click", "#waehleFelderOrtEdit", function(event) {
		event.preventDefault();
		window.em.handleHOrtEditWaehleFelderClick();
	});

	// Code für den Ort-Löschen-Dialog
	$('#OrtEditFooter').on('click', '#LoescheOrtOrtEdit', function(event) {
		event.preventDefault();
		window.em.handleHOrtEditLoescheOrtClick(this);
	});

	$("#hoe_löschen_meldung").on("click", "#hoe_löschen_meldung_ja_loeschen", window.em.handleHOrtEditLoeschenMeldungJaClick);

	// Karte managen
	$('#OrtEditFooter').on('click', '#KarteOeffnenOrtEdit', function(event) {
		event.preventDefault();
		window.em.handleHOrtEditKarteOeffnenClick();
	});

	$('#OrtEditFooter').on('click', '#VerortungOrtEdit', function(event) {
		event.preventDefault();
		window.em.GetGeolocation(localStorage.OrtId, "Ort");
	});
	
	$("#hOrtEdit").on("swipeleft", "#OrtEditContent", window.em.handleHOrtEditContentSwipeleft);

	$("#hOrtEdit").on("swiperight", "#OrtEditContent", window.em.handleHOrtEditContentSwiperight);

	// Pagination Pfeil voriger initialisieren
	$("#hOrtEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		window.em.nächsterVorigerOrt("voriger");
	});

	// Pagination Pfeil nächster initialisieren
	$("#hOrtEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		window.em.nächsterVorigerOrt("nächster");
	});

	// Pagination Pfeiltasten initialisieren
	$("#hOrtEdit").on("keyup", function(event) {
		// nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#hOrtEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.nächsterVorigerOrt("voriger");
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.nächsterVorigerOrt("nächster");
				event.preventDefault();
			}
		}
	});

	$("#FormAnhängehOE").on("click", "[name='LöscheAnhang']", function(event) {
		event.preventDefault();
		window.em.loescheAnhang(this, window.em.hOrt, localStorage.OrtId);
	});

	$('#MenuOrtEdit').on('click', '.menu_einfacher_modus', window.em.handleHOrtEditMenuEinfacherModusClick);

	$('#MenuOrtEdit').on('click', '.menu_felder_verwalten', window.em.handleHOrtEditMenuFelderVerwaltenClick);

	$('#MenuOrtEdit').on('click', '.menu_orte_exportieren', window.em.handleHOrtEditMenuOrteExportierenClick);

	$('#MenuOrtEdit').on('click', '.menu_einstellungen', window.em.handleHOrtEditMenuEinstellungenClick);

	$('#MenuOrtEdit').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuOrtEdit').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuOrtEdit').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn in hOrtEdit.html [name='OeffneOrtListeOrtEdit'] geklickt wird
window.em.handleHOrtEditOeffneOrtListeClick = function() {
	window.em.leereStorageOrtEdit();
	$.mobile.navigate("hOrtListe.html");
};

// wenn in hOrtEdit.html #OeffneRaumOrtEdit geklickt wurde
window.em.handleHOrtEditOeffneRaumClick = function() {
	// sonst wird bei Rückkehr die alte Liste angezeigt, egal von welchem Raum man kommt!
	window.em.leereStorageOrtListe();
	$.mobile.navigate("hRaumEdit.html");
};

// wenn in hOrtEdit.html #OeffneProjektOrtEdit geklickt wird
window.em.handleHOrtEditOeffneProjektClick = function() {
	// sonst wird bei Rückkehr die alte Liste angezeigt, egal von welchem Raum man kommt!
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

// wenn in hOrtEdit.html .speichern geändert wird
window.em.handleHOrtEditSpeichernChange = function() {
	var Feldname = this.name;
	if (['oXKoord', 'oYKoord'].indexOf(Feldname) > -1 && $("[name='oXKoord']").val() && $("[name='oYKoord']").val()) {
		// Wenn Koordinaten und beide erfasst
		localStorage.oXKoord = $("[name='oXKoord']").val();
		localStorage.oYKoord = $("[name='oYKoord']").val();
		// Längen- und Breitengrade berechnen
		localStorage.oLongitudeDecDeg = window.em.CHtoWGSlng(localStorage.oYKoord, localStorage.oXKoord);
		localStorage.oLatitudeDecDeg = window.em.CHtoWGSlat(localStorage.oYKoord, localStorage.oXKoord);
		localStorage.oLagegenauigkeit = null;
		// und Koordinaten speichern
		window.em.speichereKoordinaten(localStorage.OrtId, "hOrt");
	} else {
		window.em.speichereHOrtEdit(this);
	}
};

// wenn in hOrtEdit.html .speichernAnhang ändert
window.em.handleHOrtEditSpeichernAnhangChange = function() {
	var _attachments = $("#_attachmentshOE").val();
	if (_attachments && _attachments.length !== 0) {
		window.em.speichereAnhänge(localStorage.OrtId, window.em.hOrt, "hOE");
	}
};

// wenn in hOrtEdit.html #waehleFelderOrtEdit geklickt wird
window.em.handleHOrtEditWaehleFelderClick = function() {
	localStorage.AufrufendeSeiteFW = "hOrtEdit";
	$.mobile.navigate("FelderWaehlen.html");
};

// wenn in hOrtEdit.html #LoescheOrtOrtEdit geklickt wird
window.em.handleHOrtEditLoescheOrtClick = function(that) {
	// Anzahl Zeiten von Ort zählen
	$db = $.couch.db("evab");
	$db.view('evab/hZeitIdVonOrt?startkey=["' + localStorage.OrtId + '"]&endkey=["' + localStorage.OrtId + '",{},{}]', {
		success: function(Zeiten) {
			var anzZeiten = Zeiten.rows.length;
			$db.view('evab/hArtIdVonOrt?startkey=["' + localStorage.OrtId + '"]&endkey=["' + localStorage.OrtId + '",{},{}]', {
				success: function(Arten) {
					var anzArten = Arten.rows.length, 
						div = $("#hoe_löschen_meldung"),
						zeiten_text = (anzZeiten === 1 ? ' Zeit und ' : ' Zeiten und '),
						arten_text = (anzArten === 1 ? ' Art' : ' Arten'), 
						meldung = 'Ort inklusive ' + anzZeiten + zeiten_text + anzArten + arten_text + ' löschen?';
					$("#hoe_löschen_meldung_meldung").html(meldung);
					// Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
					div.data('Arten', Arten);
					div.data('Zeiten', Zeiten);
					// popup öffnen
					$("#hoe_löschen_meldung").popup("open");
				}
			});
		}
	});
};

// wenn in hOrtEdit.html #hoe_löschen_meldung_ja_loeschen geklickt wird
window.em.handleHOrtEditLoeschenMeldungJaClick = function() {
	var div = $("#hoe_löschen_meldung")[0];
	window.em.löscheOrt($.data(div, 'Arten'), $.data(div, 'Zeiten'));
};

// wenn in hOrtEdit.html #KarteOeffnenOrtEdit geklickt wird
window.em.handleHOrtEditKarteOeffnenClick = function() {
	localStorage.zurueck = "hOrtEdit";
	$.mobile.navigate("Karte.html");
};

// wenn in hOrtEdit.html #OrtEditContent nach links gewischt wird
window.em.handleHOrtEditContentSwipeleft = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsterVorigerOrt("nächster");
	}
};

// wenn in hOrtEdit.html #OrtEditContent nach rechts gewischt wird
window.em.handleHOrtEditContentSwiperight = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsterVorigerOrt("voriger");
	}
};

// wenn in hOrtEdit.html .menu_einfacher_modus geklickt wird
window.em.handleHOrtEditMenuEinfacherModusClick = function() {
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

// wenn in hOrtEdit.html .menu_felder_verwalten geklickt wird
window.em.handleHOrtEditMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hOrtEdit.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in hOrtEdit.html .menu_orte_exportieren geklickt wird
window.em.handleHOrtEditMenuOrteExportierenClick = function() {
	window.open('_list/ExportOrt/ExportOrt?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuOrtEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuOrtEdit").popup("close");
};

// wenn in hOrtEdit.html .menu_einstellungen geklickt wird
window.em.handleHOrtEditMenuEinstellungenClick = function() {
	localStorage.zurueck = "hOrtEdit.html";
	window.em.öffneMeineEinstellungen();
};

// wenn hOrtListe.html erscheint
window.em.handleHOrtListePageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.RaumId || localStorage.RaumId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiiereOrtListe();
};

// wenn hOrtListe.html initiiert wird
window.em.handleHOrtListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.RaumId || localStorage.RaumId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	// inaktive tabs inaktivieren
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});
	
	// Link zu Raum in Navbar und Titelleiste
	$("#hOrtListePageHeader").on("click", "[name='OeffneRaumOrtListe']", function(event) {
		event.preventDefault();
		window.em.handleHOrtListeOeffneRaumClick();
	});

	$("#hOrtListePageHeader").on("click", "#OeffneProjektOrtListe", function(event) {
		event.preventDefault();
		window.em.handleHOrtListeOeffneProjektClick();
	});

	// neuen Ort erstellen
	$("#hOrtListe").on("click", ".NeuerOrtOrtListe", function(event) {
		event.preventDefault();
		window.em.erstelleNeuenOrt();
	});

	$("#OrtlistehOL").on("swipeleft", ".Ort", window.em.handleHOrtListeSwipeleft);

	$("#OrtlistehOL").on("click", ".Ort", function(event) {
		event.preventDefault();
		window.em.handleHOrtListeOrtClick(this);
	});

	$("#OrtlistehOL").on("swipeleft", ".erste", window.em.erstelleNeuenOrt);

	$("#hOrtListe").on("swiperight", "#hOrtListePageContent", window.em.handleHOrtListePageContentSwiperight);

	$("#hOrtListePageFooter").on('click', '#OeffneKarteOrtListe', function(event) {
		event.preventDefault();
		window.em.handleHOrtListeOeffneKarteClick();
	});

	$('#MenuOrtListe').on('click', '.menu_einfacher_modus', window.em.handleHOrtListeMenuEinfacherModusClick);

	$('#MenuOrtListe').on('click', '.menu_felder_verwalten', window.em.handleHOrtListeMenuFelderVerwaltenClick);

	$('#MenuOrtListe').on('click', '.menu_orte_exportieren', window.em.handleHOrtListeMenuOrteExportierenClick);

	$('#MenuOrtListe').on('click', '.menu_einstellungen', window.em.handleHOrtListeMenuEinstellungenClick);

	$('#MenuOrtListe').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuOrtListe').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuOrtListe').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn in hOrtListe.html [name='OeffneRaumOrtListe'] geklickt wird
window.em.handleHOrtListeOeffneRaumClick = function() {
	window.em.leereStorageOrtListe();
	$.mobile.navigate("hRaumEdit.html");
};

// wenn in hOrtListe.html #OeffneProjektOrtListe geklickt wird
window.em.handleHOrtListeOeffneProjektClick = function() {
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

// wenn in hOrtListe.html nach links gewischt wird
window.em.handleHOrtListeSwipeleft = function() {
	localStorage.OrtId = $(this).attr('OrtId');
	$.mobile.navigate("hZeitListe.html");
};

// wenn in hOrtListe.html .Ort geklickt wird
window.em.handleHOrtListeOrtClick = function(that) {
	localStorage.OrtId = $(that).attr('OrtId');
	$.mobile.navigate("hOrtEdit.html");
};

// wenn in hOrtListe.html #hOrtListePageContent nach rechts gewischt wird
window.em.handleHOrtListePageContentSwiperight = function() {
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	$.mobile.navigate("hRaumListe.html");
};

// wenn in hOrtListe.html #OeffneKarteOrtListe geklickt wird
window.em.handleHOrtListeOeffneKarteClick = function() {
	localStorage.zurueck = "hOrtListe";
	$.mobile.navigate("Karte.html");
};

// wenn in hOrtListe.html .menu_einfacher_modus geklickt wird
window.em.handleHOrtListeMenuEinfacherModusClick = function() {
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

// wenn in hOrtListe.html .menu_felder_verwalten geklickt wird
window.em.handleHOrtListeMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hOrtListe.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in hOrtListe.html .menu_orte_exportieren geklickt wird
window.em.handleHOrtListeMenuOrteExportierenClick = function() {
	window.open('_list/ExportOrt/ExportOrt?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuOrtListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuOrtListe").popup("close");
};

// wenn in hOrtListe.html .menu_einstellungen geklickt wird
window.em.handleHOrtListeMenuEinstellungenClick = function() {
	localStorage.zurueck = "hOrtListe.html";
	window.em.öffneMeineEinstellungen();
};

// wenn hProjektEdit.html angezeigt wird
window.em.handleHProjektEditPageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.ProjektId || localStorage.ProjektId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiiereProjektEdit();
};

// wenn hProjektEdit.html initiiert wird
window.em.handleHProjektEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.ProjektId || localStorage.ProjektId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	// inaktive tabs inaktivieren
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	$("#hProjektEditHeader").on("click", "[name='OeffneProjektListeProjektEdit']", function(event) {
		event.preventDefault();
		window.em.handleHProjektEditOeffneProjektListeClick();
	});

	$("#hProjektEditHeader").on("click", "#OeffneRaumListeProjektEdit", function(event) {
		event.preventDefault();
		$.mobile.navigate("hRaumListe.html");
	});

	// Für jedes Feld bei Änderung speichern
	$("#hProjektEditForm").on("change", ".speichern", window.em.speichereHProjektEdit);

	// Eingabe im Zahlenfeld abfangen
	// Ende des Schiebens abfangen
	$("#hProjektEditForm").on("blur slidestop", '.speichernSlider', window.em.speichereHProjektEdit);

	// Klicken auf den Pfeilen im Zahlenfeld abfangen
	$("#hProjektEditForm").on("mouseup", '.ui-slider-input', window.em.speichereHProjektEdit);

	// Änderungen im Formular für Anhänge speichern
	$("#FormAnhängehPE").on("change", ".speichernAnhang", window.em.handleHProjektEditSpeichernAnhangChange);
	
	// Code für den Projekt-Löschen-Dialog
	$('#hProjektEditFooter').on('click', '#LöscheProjektProjektEdit', function(event) {
		event.preventDefault();
		window.em.handleHProjektEditLöscheProjektClick(this);
	});

	$("#hpe_löschen_meldung").on("click", "#hpe_löschen_meldung_ja_loeschen", window.em.handleHProjektEditLoeschenMeldungJaClick);

	// neues Projekt erstellen
	$("#hProjektEditFooter").on("click", "#NeuesProjektProjektEdit", function(event) {
		event.preventDefault();
		window.em.erstelleNeuesProjekt();
	});

	// sichtbare Felder wählen
	$("#hProjektEditFooter").on("click", "#waehleFelderProjektEdit", function(event) {
		event.preventDefault();
		window.em.handleHProjektEditWaehleFelderClick();
	});

	$("#hProjektEdit").on("swipeleft", "#hProjektEditContent", window.em.handleHProjektEditContentSwipeleft);

	$("#hProjektEdit").on("swiperight", "#hProjektEditContent", window.em.handleHProjektEditContentSwiperight);

	// Pagination Pfeil voriger initialisieren
	$("#hProjektEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		window.em.nächstesVorigesProjekt("voriges");
	});

	// Pagination Pfeil nächster initialisieren
	$("#hProjektEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		window.em.nächstesVorigesProjekt("nächstes");
	});

	// Pagination Pfeiltasten initialisieren
	$("#hProjektEdit").on("keyup", function(event) {
		// nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#hProjektEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.nächstesVorigesProjekt("voriges");
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.nächstesVorigesProjekt("nächstes");
				event.preventDefault();
			}
		}
	});

	$('#hProjektEditFooter').on('click', '#KarteOeffnenProjektEdit', function(event) {
		event.preventDefault();
		window.em.handleHProjektEditKarteOeffnenClick();
	});

	$("#FormAnhängehPE").on("click", "[name='LöscheAnhang']", function(event) {
		event.preventDefault();
		window.em.loescheAnhang(this, window.em.hProjekt, localStorage.ProjektId);
	});

	$('#MenuProjektEdit').on('click', '.menu_einfacher_modus', window.em.handleHProjektEditMenuEinfacherModusClick);

	$('#MenuProjektEdit').on('click', '.menu_felder_verwalten', window.em.handleHProjektEditMenuFelderVerwaltenClick);

	$('#MenuProjektEdit').on('click', '.menu_projekte_exportieren', window.em.handleHProjektEditMenuProjekteExportierenClick);

	$('#MenuProjektEdit').on('click', '.menu_einstellungen', window.em.handleHProjektEditMenuEinstellungenClick);

	$('#MenuProjektEdit').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuProjektEdit').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuProjektEdit').on('click', '.menu_admin', window.em.öffneAdmin);
};

// wenn in hProjektEdit.html [name='OeffneProjektListeProjektEdit'] geklickt wird
window.em.handleHProjektEditOeffneProjektListeClick = function() {
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("hProjektListe.html");
};

// wenn in hProjektEdit.html .speichernAnhang geändert wird
window.em.handleHProjektEditSpeichernAnhangChange = function() {
	var _attachments = $("#_attachmentshPE").val();
	if (_attachments && _attachments.length > 0) {
		window.em.speichereAnhänge(localStorage.ProjektId, window.em.hProjekt, "hPE");
	}
};

// wenn in hProjektEdit.html #LöscheProjektProjektEdit geklickt wird
window.em.handleHProjektEditLöscheProjektClick = function(that) {
	// Anzahl Räume des Projekts zählen
	// die Abfrage verwenden, um die Datensätze später direkt zu löschen, ohne weitere DB-Abfrage
	$db = $.couch.db("evab");
	$db.view('evab/hRaumIdVonProjekt?startkey=["' + localStorage.ProjektId + '"]&endkey=["' + localStorage.ProjektId + '",{},{}]', {
		success: function(Raeume) {
			var anzRaeume = Raeume.rows.length;
			// Anzahl Orte des Projekts zählen
			$db.view('evab/hOrtIdVonProjekt?startkey=["' + localStorage.ProjektId + '"]&endkey=["' + localStorage.ProjektId + '",{},{}]', {
				success: function(Orte) {
					var anzOrte = Orte.rows.length;
					// Anzahl Zeiten des Projekts zählen
					$db.view('evab/hZeitIdVonProjekt?startkey=["' + localStorage.ProjektId + '"]&endkey=["' + localStorage.ProjektId + '",{},{}]', {
						success: function(Zeiten) {
							var anzZeiten = Zeiten.rows.length;
							// Anzahl Arten des Projekts zählen
							$db.view('evab/hArtIdVonProjekt?startkey=["' + localStorage.ProjektId + '"]&endkey=["' + localStorage.ProjektId + '",{},{}]', {
								success: function(Arten) {
									var anzArten = Arten.rows.length, 
										div = $("#hpe_löschen_meldung"),
										räume_text = (anzRaeume === 1 ? ' Raum, ' : ' Räume, '),
										orte_text = (anzOrte === 1 ? ' Ort, ' : ' Orte, '),
										zeiten_text = (anzZeiten === 1 ? ' Zeit und ' : ' Zeiten und '),
										arten_text = (anzArten === 1 ? ' Art' : ' Arten'), 
										meldung = 'Projekt inklusive ' + anzRaeume + räume_text + anzOrte + orte_text + anzZeiten + zeiten_text + anzArten + arten_text + ' löschen?';
									$("#hpe_löschen_meldung_meldung").html(meldung);
									// Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
									div.data('Arten', Arten);
									div.data('Zeiten', Zeiten);
									div.data('Orte', Orte);
									div.data('Raeume', Raeume);
									// popup öffnen
									$("#hpe_löschen_meldung").popup("open");
								}
							});
						}
					});
				}
			});
		}
	});
};

// wenn in hProjektEdit.html #hpe_löschen_meldung_ja_loeschen geklickt wird
window.em.handleHProjektEditLoeschenMeldungJaClick = function() {
	var div = $("#hpe_löschen_meldung")[0];
	window.em.löscheProjekt(jQuery.data(div, 'Arten'), jQuery.data(div, 'Zeiten'), jQuery.data(div, 'Orte'), jQuery.data(div, 'Raeume'));
};

// wenn in hProjektEdit.html #waehleFelderProjektEdit geklickt wird
window.em.handleHProjektEditWaehleFelderClick = function() {
	localStorage.AufrufendeSeiteFW = "hProjektEdit";
	$.mobile.navigate("FelderWaehlen.html");
};

// wenn in hProjektEdit.html #hProjektEditContent nach links gewischt wird
window.em.handleHProjektEditContentSwipeleft = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächstesVorigesProjekt("nächstes");
	}
};

// wenn in hProjektEdit.html #hProjektEditContent nach rechts gewischt wird
window.em.handleHProjektEditContentSwiperight = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächstesVorigesProjekt("voriges");
	}
};

// wenn in hProjektEdit.html #KarteOeffnenProjektEdit geklickt wird
window.em.handleHProjektEditKarteOeffnenClick = function() {
	localStorage.zurueck = "hProjektEdit";
	$.mobile.navigate("Karte.html");
};

// wenn in hProjektEdit.html .menu_einfacher_modus geklickt wird
window.em.handleHProjektEditMenuEinfacherModusClick = function() {
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

// wenn in hProjektEdit.html .menu_felder_verwalten geklickt wird
window.em.handleHProjektEditMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hProjektEdit.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in hProjektEdit.html .menu_projekte_exportieren geklickt wird
window.em.handleHProjektEditMenuProjekteExportierenClick = function() {
	window.open('_list/ExportProjekt/ExportProjekt?startkey=["' + localStorage.Email + '",{},{},{},{},{}]&endkey=["' + localStorage.Email + '"]&descending=true&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuProjektEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuProjektEdit").popup("close");
};

// wenn in hProjektEdit.html .menu_einstellungen geklickt wird
window.em.handleHProjektEditMenuEinstellungenClick = function() {
	localStorage.zurueck = "hProjektEdit.html";
	window.em.öffneMeineEinstellungen();
};

// Öffnet das vorige oder nächste Projekt
// voriges des ersten => hProjektListe.html
// nächstes des letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
// wird benutzt in hProjektEdit.html
window.em.nächstesVorigesProjekt = function(NächstesOderVoriges) {
	// prüfen, ob Projektliste schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.em.Projektliste) {
		// globale Variable Projektliste existiert noch
		window.em.nächstesVorigesProjekt_2(NächstesOderVoriges);
	} else {
		// keine Projektliste übergeben
		// neu aus DB erstellen
		$db = $.couch.db("evab");
		$db.view('evab/hProjListe?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{}]&include_docs=true', {
			success: function(data) {
				// Projektliste bereitstellen
				window.em.Projektliste = data;
				window.em.nächstesVorigesProjekt_2(NächstesOderVoriges);
			}
		});
	}
};

window.em.nächstesVorigesProjekt_2 = function(NächstesOderVoriges) {
	var i,
		ProjIdAktuell,
		AnzProj;
	for (i in window.em.Projektliste.rows) {
		ProjIdAktuell = window.em.Projektliste.rows[i].doc._id;
		AnzProj = window.em.Projektliste.rows.length -1;  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (ProjIdAktuell === localStorage.ProjektId) {
			switch (NächstesOderVoriges) {
			case "nächstes":
				if (parseInt(i) < AnzProj) {
					localStorage.ProjektId = window.em.Projektliste.rows[parseInt(i)+1].doc._id;
					window.em.leereStorageProjektEdit("mitLatLngListe", "ohneId");
					window.em.initiiereProjektEdit();
					return;
				} else {
					window.em.melde("Das ist das letzte Projekt");
					return;
				}
				break;
			case "voriges":
				if (parseInt(i) > 0) {
					localStorage.ProjektId = window.em.Projektliste.rows[parseInt(i)-1].doc._id;
					window.em.leereStorageProjektEdit("mitLatLngListe", "ohneId");
					window.em.initiiereProjektEdit();
					return;
				} else {
					window.em.leereStorageProjektEdit();
					$.mobile.navigate("hProjektListe.html");
					return;
				}
				break;
			}
		}
	}
};

// wird benutzt in hProjektEdit.html
window.em.löscheProjekt = function(Arten, Zeiten, Orte, Raeume) {
	// nur löschen, wo Datensätze vorkommen
	if (Raeume.rows.length > 0) {
		window.em.loescheIdIdRevListe(Raeume);
	}
	if (Orte.rows.length > 0) {
		window.em.loescheIdIdRevListe(Orte);
	}
	if (Zeiten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Zeiten);
	}
	if (Arten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Arten);
	}
	// zuletzt das Projekt
	if (window.em.hProjekt) {
		// Objekt verwenden
		window.em.löscheProjekt_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ProjektId, {
			success: function(data) {
				window.em.hProjekt = data;
				window.em.löscheProjekt_2();
			},
			error: function() {
				window.em.melde("Fehler: Projekt nicht gelöscht");
			}
		});
	}
};

window.em.löscheProjekt_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.hProjekt, {
		success: function(data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.Projektliste) {
				for (i in window.em.Projektliste.rows) {
					if (window.em.Projektliste.rows[i].doc._id === data.id) {
						window.em.Projektliste.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine Projektliste mehr. Storage löschen
				window.em.leereStorageProjektListe("mitLatLngListe");
			}
			// Projektedit zurücksetzen
			window.em.leereStorageProjektEdit("mitLatLngListe");
			console.log("jetzt hProjektListe anzeigen");
			$.mobile.navigate("hProjektListe.html");
			//$(":mobile-pagecontainer").pagecontainer("change", "hProjektListe.html");
			//$(":mobile-pagecontainer").pagecontainer("change", "hProjektListe.html", {reload: true});
		},
		error: function() {
			window.em.melde("Fehler: Projekt nicht gelöscht");
		}
	});
};

// wird benutzt in hProjektEdit.html
window.em.validierehProjektEdit = function() {
	if (!$("[name='pName']").val()) {
		window.em.melde("Bitte Projektnamen eingeben");
		setTimeout(function() { 
			$("[name='pName']").focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	return true;
};

// wird benutzt in hProjektEdit.html
window.em.speichereHProjektEdit = function() {
	var that = this;
	if (window.em.hProjekt) {
		window.em.speichereHProjektEdit_2(that);
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ProjektId, {
			success: function(data) {
				window.em.hProjekt = data;
				window.em.speichereHProjektEdit_2(that);
			},
			error: function() {
				window.em.melde("Fehler: Änderung in " + that.name + " nicht gespeichert");
			}
		});
	}
};

window.em.speichereHProjektEdit_2 = function(that) {
	var Feldname,
		Feldjson,
		Feldwert;
	if (window.em.myTypeOf($(that).attr("aria-valuenow")) !== "string") {
		// slider
		Feldname = $(that).attr("aria-labelledby").slice(0, ($(that).attr("aria-labelledby").length -6));
		Feldwert = $(that).attr("aria-valuenow");
	} else {
		// alle anderen Feldtypen
		Feldname = that.name;
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject();
		Feldwert = Feldjson[Feldname];
	}
	if (window.em.validierehProjektEdit()) {
		if (Feldname === "pName") {
			// Variablen für Projektliste zurücksetzen, damit sie beim nächsten Aufruf neu aufgebaut wird
			window.em.leereStorageProjektListe("mitLatLngListe");
		}
		if (Feldwert) {
			if (window.em.myTypeOf(Feldwert) === "float") {
				window.em.hProjekt[Feldname] = parseFloat(Feldwert);
			} else if (window.em.myTypeOf(Feldwert) === "integer") {
				window.em.hProjekt[Feldname] = parseInt(Feldwert);
			} else {
				window.em.hProjekt[Feldname] = Feldwert;
			}
		} else if (window.em.hProjekt[Feldname]) {
			delete window.em.hProjekt[Feldname]
		}
		// alles speichern
		$db.saveDoc(window.em.hProjekt, {
			success: function(data) {
				window.em.hProjekt._rev = data.rev;
				// window.ZuletztGespeicherteProjektId wird benutzt, damit auch nach einem
				// Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
				// Zuletzt gespeicherte ProjektId NACH dem speichern setzen
				// sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
				// darum zwischenspeichern
				window.em.hProjektIdZwischenspeicher = localStorage.ProjektId;
				//setTimeout("window.ZuletztGespeicherteProjektId = window.em.hProjektIdZwischenspeicher", 1000);	AUSGESCHALTET, DA ZuletztGespeicherteProjektId NIRGENDS VERWENDET WIRD
				setTimeout("delete window.em.hProjektIdZwischenspeicher", 1500);
				// nicht aktualisierte hierarchisch tiefere Listen löschen
				delete window.em.OrteVonRaum;
				delete window.em.ZeitenVonRaum;
				delete window.em.ZeitenVonOrt;
				delete window.em.ArtenVonRaum;
				delete window.em.ArtenVonOrt;
				delete window.em.ArtenVonZeit;
			},
			error: function() {
				console.log('fehler in function speichereHProjektEdit_2(that)');
				//melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
			}
		});
	}
};

// Öffnet den vorigen oder nächsten Ort
// voriger des ersten => OrtListe
// nächster des letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
// wird benutzt in hOrtEdit.html
window.em.nächsterVorigerOrt = function(NächsterOderVoriger) {
	// prüfen, ob OrtListe schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.em.OrtListe) {
		// Ortliste liegt als Variable vor
		window.em.nächsterVorigerOrt_2(NächsterOderVoriger);
	} else {
		// keine Ortliste vorhanden
		// neu aus DB erstellen
		$db = $.couch.db("evab");
		$db.view('evab/hOrtListe?startkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// OrtListe für hOrtListe.html bereitstellen
				window.em.OrtListe = data;
				window.em.nächsterVorigerOrt_2(NächsterOderVoriger);
			}
		});
	}
};

window.em.nächsterVorigerOrt_2 = function(NächsterOderVoriger) {
	var i,
		OrtIdAktuell,
		AnzOrt;
	for (i in window.em.OrtListe.rows) {
		OrtIdAktuell = window.em.OrtListe.rows[i].doc._id;
		AnzOrt = window.em.OrtListe.rows.length -1;  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (OrtIdAktuell === localStorage.OrtId) {
			switch (NächsterOderVoriger) {
			case "nächster":
				if (parseInt(i) < AnzOrt) {
					localStorage.OrtId = window.em.OrtListe.rows[parseInt(i)+1].doc._id;
					window.em.leereStorageOrtEdit("ohneId");
					window.em.initiiereOrtEdit();
					return;
				} else {
					window.em.melde("Das ist der letzte Ort");
					return;
				}
				break;
			case "voriger":
				if (parseInt(i) > 0) {
					localStorage.OrtId = window.em.OrtListe.rows[parseInt(i)-1].doc._id;
					window.em.leereStorageOrtEdit("ohneId");
					window.em.initiiereOrtEdit();
					return;
				} else {
					window.em.leereStorageOrtEdit();
					$.mobile.navigate("hOrtListe.html");
					return;
				}
				break;
			}
		}
	}
};

// wird benutzt in hOrtEdit.html
window.em.validatehOrtEdit = function() {
	if (!$("[name='oName']").val()) {
		window.em.melde("Bitte Ortnamen eingeben");
		setTimeout(function() { 
			$("[name='oName']").focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	return true;
};

// wird benutzt in hOrtEdit.html
window.em.speichereHOrtEdit = function(that) {
	// die eventhandler übergeben this nicht über die Klammer
	var _this = that || this;
	// prüfen, ob Ort existiert
	if (window.em.hOrt) {
		// bestehedes Objekt verwenden
		window.em.speichereHOrtEdit_2(_this);
	} else {
		// kein Ort > aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.OrtId, {
			success: function(data) {
				window.em.hOrt = data;
				window.em.speichereHOrtEdit_2(_this);
			},
			error: function() {
				console.log('fehler in function speichereHOrtEdit');
				//melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
			}
		});
	}
};

window.em.speichereHOrtEdit_2 = function(that) {
	var Feldname,
		Feldjson,
		Feldwert;
	if (window.em.myTypeOf($(that).attr("aria-valuenow")) !== "string") {
		// slider
		Feldname = $(that).attr("aria-labelledby").slice(0, ($(that).attr("aria-labelledby").length -6));
		Feldwert = $(that).attr("aria-valuenow");
	} else {
		// alle anderen Feldtypen
		Feldname = that.name;
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject();
		Feldwert = Feldjson[Feldname];
	}
	if (window.em.validatehOrtEdit()) {
		if (Feldname === "oName") {
			// Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
			window.em.leereStorageOrtListe("mitLatLngListe");
		}
		// Werte aus dem Formular aktualisieren
		if (Feldwert) {
			if (window.em.myTypeOf(Feldwert) === "float") {
				window.em.hOrt[Feldname] = parseFloat(Feldwert);
			} else if (window.em.myTypeOf(Feldwert) === "integer") {
				window.em.hOrt[Feldname] = parseInt(Feldwert);
			} else {
				window.em.hOrt[Feldname] = Feldwert;
			}
		} else if (window.em.hOrt[Feldname]) {
			delete window.em.hOrt[Feldname]
		}
		// alles speichern
		$db.saveDoc(window.em.hOrt, {
			success: function(data) {
				window.em.hOrt._rev = data.rev;
				// window.ZuletztGespeicherteOrtId wird benutzt, damit auch nach einem
				// Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
				// Zuletzt gespeicherte OrtId NACH dem speichern setzen
				// sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
				// darum zwischenspeichern
				window.em.OrtIdZwischenspeicher = localStorage.OrtId;
				//setTimeout("window.ZuletztGespeicherteOrtId = window.em.OrtIdZwischenspeicher", 1000);	AUSGESCHALTET, DA ZuletztGespeicherteOrtId NIRGENDS BENUTZT WIRD
				setTimeout("delete window.em.OrtIdZwischenspeicher", 1500);
				// nicht aktualisierte hierarchisch tiefere Listen löschen
				delete window.em.ZeitenVonProjekt;
				delete window.em.ZeitenVonRaum;
				delete window.em.ArtenVonProjekt;
				delete window.em.ArtenVonRaum;
				delete window.em.ArtenVonZeit;
			},
			error: function() {
				console.log('fehler in function speichereHOrtEdit_2(that)');
				//melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
			}
		});
	}
};

// wird benutzt in hOrtEdit.html
window.em.löscheOrt = function(Arten, Zeiten) {
	// nur löschen, wo Datensätze vorkommen
	if (Zeiten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Zeiten);
	}
	if (Arten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Arten);
	}
	// zuletzt den Ort löschen
	if (window.em.hOrt) {
		// Objekt nutzen
		window.em.löscheOrt_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.OrtId, {
			success: function(data) {
				window.em.hOrt = data;
				window.em.löscheOrt_2();
			},
			error: function() {
				window.em.melde("Fehler: Der Ort wurde nicht gelöscht");
			}
		});
	}
};

window.em.löscheOrt_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.hOrt, {
		success: function(data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.OrtListe) {
				for (i in window.em.OrtListe.rows) {
					if (window.em.OrtListe.rows[i].doc._id === data.id) {
						window.em.OrtListe.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine Ortliste mehr. Storage löschen
				window.em.leereStorageOrtListe("mitLatLngListe");
			}
			window.em.leereStorageOrtEdit("mitLatLngListe");
			$.mobile.navigate('hOrtListe.html');
		},
		error: function() {
			window.em.melde("Fehler: Der Ort wurde nicht gelöscht");
		}
	});
};

// wird verwendet in hArtListe.html
window.em.öffneArtgruppenliste_hal = function() {
	// Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	//window.em.leereStoragehBeobListe();
	localStorage.Status = "neu";
	localStorage.Von = "hArtListe";
	delete localStorage.aArtGruppe;	// verhindern, dass eine Artgruppe übergeben wird
	$.mobile.navigate("Artgruppenliste.html");
};

// wenn in hArtEdit.html auf [name='OeffneArtListehArtEdit'] geklickt wird
window.em.handleHArtEditOeffneArtListehArtEditClick = function() {
	window.em.leereStoragehBeobEdit();
	$.mobile.navigate("hArtListe.html");
};

// wenn in hArtEdit.html auf #OeffneZeithArtEdit geklickt wird
window.em.handleHArtEditOeffneZeithArtEditClick = function() {
	window.em.leereStoragehBeobEdit();
	window.em.leereStoragehBeobListe();
	$.mobile.navigate("hZeitEdit.html");
};

// wenn in hArtEdit.html #OeffneOrthArtEdit geklickt wird
window.em.handleHArtEditOeffneOrthArtEditClick = function() {
	window.em.leereStoragehBeobEdit();
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	$.mobile.navigate("hOrtEdit.html");
};

// wenn in hArtEdit.html #OeffneRaumhArtEdit geklickt wird
window.em.handleHArtEditOeffneRaumhArtEditClick = function() {
	window.em.leereStoragehBeobEdit();
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	$.mobile.navigate("hRaumEdit.html");
};

// wenn in hArtEdit.html #OeffneProjekthArtEdit geklickt wird
window.em.handleHArtEditOeffneProjekthArtEditClick = function() {
	window.em.leereStoragehBeobEdit();
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

// wenn in hArtEdit.html .speichernAnhang geändert wird
window.em.handleHArtEditSpeichernAnhangChange = function() {
	var _attachments = $("#_attachmentshAE").val();
	if (_attachments && _attachments.length !== 0) {
		window.em.speichereAnhänge(localStorage.hBeobId, window.em.hArt, "hAE");
	}
};

// wenn in hArtEdit.html #NeueBeobhArtEdit geklickt wird
window.em.handleHArtEditNeueBeobhArtEditClick = function() {
	localStorage.Status = "neu";
	window.em.zuArtgruppenliste();
};

// wenn in hArtEdit.html #waehleFelderhBeobEdit geklickt wird
window.em.handleHArtEditWaehleFelderClick = function() {
	localStorage.AufrufendeSeiteFW = "hArtEdit";
	$.mobile.navigate("FelderWaehlen.html");
};

// wenn in hArtEdit.html nach links gewischt wird
window.em.handleHArtEditSwipeleft = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsteVorigeArt("nächste");
	}
};

// wenn in hArtEdit.html nach rechts gewischt wird
window.em.handleHArtEditSwiperight = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsteVorigeArt("vorige");
	}
};

// wenn in hArtEdit.html [name='LöscheAnhang'] geklickt wird
window.em.handleHArtEditLoescheAnhangClick = function(that) {
	window.em.loescheAnhang(that, window.em.hArt, localStorage.hBeobId);
};

// wenn in hArtEdit.html .menu_arteigenschaften geklickt wird
window.em.handleHArtEditMenuArteigenschaftenClick = function() {
	window.em.oeffneEigenschaftenVonArt(window.em.hArt.aArtId);
};

// wenn in hArtEdit.html .menu_einfacher_modus geklickt wird
window.em.handleHArtEditMenuEinfacherModusClick = function() {
	window.em.leereStoragehBeobEdit();
	window.em.leereStoragehBeobListe();
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

// wenn in hArtEdit.html .menu_felder_verwalten geklickt wird
window.em.handleHArtEditMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hArtEdit.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in hArtEdit.html .menu_beob_exportieren geklickt wird
window.em.handleHArtEditMenuBeobExportierenClick = function() {
	window.open('_list/ExportBeob/ExportBeob?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuhBeobEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuhBeobEdit").popup("close");
};

// wenn in hArtEdit.html .menu_einstellungen geklickt wird
window.em.handleHArtEditMenuEinstellungenClick = function() {
	localStorage.zurueck = "hArtEdit.html";
	window.em.öffneMeineEinstellungen();
};

// wenn hProjektListe erscheint
window.em.handleHProjektListePageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	}
	window.em.initiiereProjektliste();
};

// wenn hProjektListe initiiert wird
window.em.handleHProjektListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	}

	$("#hProjektListePageHeader").on('click', '#OeffneProjektListeProjektListe', function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	// inaktive tabs inaktivieren
	// BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF id des header NICHT FUNKTIONIERTE!!!???
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	// neues Projekt erstellen
	$("#hProjektListe").on("click", ".NeuesProjektProjektListe", function(event) {
		event.preventDefault();
		window.em.erstelleNeuesProjekt();
	});

	$("#ProjektlistehPL").on("swipeleft", ".Projekt", window.em.handleProjektListeSwipeleft);

	$("#ProjektlistehPL").on("click", ".Projekt", function(event) {
		event.preventDefault();
		window.em.handleProjektListeProjektClick(this);
	});

	$("#ProjektlistehPL").on("swipeleft", ".erste", window.em.erstelleNeuesProjekt);

	$("#hProjektListePageHeader").on('click', '#OeffneBeobListeProjektListe', function(event) {
		event.preventDefault();
		$.mobile.navigate("BeobListe.html");
	});

	$("#hProjektListe").on("swiperight", window.em.handleProjektListeSwiperight);

	$('#ProjektListePageFooter').on('click', '#OeffneKarteProjektListe', function(event) {
		event.preventDefault();
		window.em.handleProjektListeOeffneKarteClick();
	});

	$('#MenuProjektListe').on('click', '.menu_einfacher_modus', window.em.handleProjektListeMenuEinfacherModusClick);

	$('#MenuProjektListe').on('click', '.menu_felder_verwalten', window.em.handleProjektListeMenuFelderVerwaltenClick);

	$('#MenuProjektListe').on('click', '.menu_projekte_exportieren', window.em.handleHProjektListeMenuProjekteExportierenClick);

	$('#MenuProjektListe').on('click', '.menu_einstellungen', window.em.handleProjektListeMenuEinstellungenClick);

	$('#MenuProjektListe').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuProjektListe').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuProjektListe').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuProjektListe').on('click', '.menu_admin', window.em.öffneAdmin);
};

window.em.handleProjektListeSwipeleft = function() {
	localStorage.ProjektId = $(this).attr('ProjektId');
	$.mobile.navigate("hRaumListe.html");
};

window.em.handleProjektListeProjektClick = function(that) {
	localStorage.ProjektId = $(that).attr('ProjektId');
	$.mobile.navigate("hProjektEdit.html");
};

window.em.handleProjektListeSwiperight = function() {
	$.mobile.navigate("BeobListe.html");
};

window.em.handleProjektListeOeffneKarteClick = function() {
	localStorage.zurueck = "hProjektListe";
	$.mobile.navigate("Karte.html");
};

window.em.handleProjektListeMenuEinfacherModusClick = function() {
	$.mobile.navigate("BeobListe.html");
};

window.em.handleProjektListeMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hProjektListe.html";
	$.mobile.navigate("FeldListe.html");
};

// wenn in hProjektListe.html .menu_projekte_exportieren geklickt wird
window.em.handleHProjektListeMenuProjekteExportierenClick = function() {
	window.open('_list/ExportProjekt/ExportProjekt?startkey=["' + localStorage.Email + '",{},{},{},{},{}]&endkey=["' + localStorage.Email + '"]&descending=true&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuProjektListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuProjektListe").popup("close");
};

window.em.handleProjektListeMenuEinstellungenClick = function() {
	localStorage.zurueck = "hProjektListe.html";
	window.em.öffneMeineEinstellungen();
};

// wenn hRaumEdit erscheint
window.em.handleRaumEditPageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.RaumId || localStorage.RaumId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiiereRaumEdit();
};

// wenn hRaumEdit initiiert wird
window.em.handleRaumEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.RaumId || localStorage.RaumId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	$("#RaumEditHeader").on("click", "[name='OeffneRaumListeRaumEdit']", function(event) {
		event.preventDefault();
		window.em.handleRaumEditOeffneRaumListeClick();
	});

	// Für jedes Feld bei Änderung speichern
	$("#hRaumEditForm").on("change", ".speichern", window.em.speichereRaum);

	// Eingabe im Zahlenfeld abfangen
	$("#hRaumEditForm").on("blur", '.speichernSlider', window.em.speichereRaum);

	// Klicken auf den Pfeilen im Zahlenfeld abfangen
	$("#hRaumEditForm").on("mouseup", '.ui-slider-input', window.em.speichereRaum);

	// Ende des Schiebens abfangen
	$("#hRaumEditForm").on("slidestop", '.speichernSlider', window.em.speichereRaum);

	// Änderungen im Formular für Anhänge speichern
	$("#FormAnhängehRE").on("change", ".speichernAnhang", window.em.handleRaumEditSpeichernAnhangChange);

	// Code für den Raum-Löschen-Dialog
	$('#hRaumEditFooter').on('click', '#LoescheRaumRaumEdit', function(event) {
		event.preventDefault();
		window.em.handleRaumEditLoescheRaumClick();
	});

	$("#hre_löschen_meldung").on("click", "#hre_löschen_meldung_ja_loeschen", function(event) {
		var div = $("#hre_löschen_meldung")[0];
		window.em.löscheRaum(jQuery.data(div, 'Arten'), jQuery.data(div, 'Zeiten'), jQuery.data(div, 'Orte'));
	});

	// Link zu Projekt in Navbar und Titelleiste
	$("#RaumEditHeader").on("click", "#ProjektOeffnenRaumEdit", function(event) {
		event.preventDefault();
		window.em.handleRaumEditProjektOeffnenClick();
	});

	// inaktive tabs inaktivieren
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	// Link zu Ortliste in Navbar
	$("#RaumEditHeader").on("click", "#OrtListeOeffnenRaumEdit", function(event) {
		event.preventDefault();
		$.mobile.navigate("hOrtListe.html");
	});

	// neuen Raum erstellen
	$("#hRaumEditFooter").on("click", "#NeuerRaumRaumEdit", function(event) {
		event.preventDefault();
		window.em.erstelleNeuenRaum();
	});

	// sichtbare Felder wählen
	$("#hRaumEditFooter").on("click", "#waehleFelderRaumEdit", function(event) {
		event.preventDefault();
		window.em.handleRaumEditWaehleFelderClick();
	});

	$("#hRaumEdit").on("swipeleft", "#hRaumEditContent", window.em.handleRaumEditContentSwipreleft);

	$("#hRaumEdit").on("swiperight", "#hRaumEditContent", window.em.handleRaumEditContentSwiperight);

	// Pagination Pfeil voriger initialisieren
	$("#hRaumEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		window.em.nächsterVorigerRaum("voriger");
	});

	// Pagination Pfeil nächster initialisieren
	$("#hRaumEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		window.em.nächsterVorigerRaum("nächster");
	});

	// Pagination Pfeiltasten initialisieren
	$("#hRaumEdit").on("keyup", function(event) {
		// nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#hRaumEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.nächsterVorigerRaum("voriger");
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.nächsterVorigerRaum("nächster");
				event.preventDefault();
			}
		}
	});

	$("#hRaumEditFooter").on("click", "#KarteOeffnenRaumEdit", function(event) {
		event.preventDefault();
		window.em.handleRaumEditOeffneKarteClick();
	});

	$("#FormAnhängehRE").on("click", "[name='LöscheAnhang']", function(event) {
		event.preventDefault();
		window.em.loescheAnhang(this, window.em.hRaum, localStorage.RaumId);
	});

	$('#MenuRaumEdit').on('click', '.menu_einfacher_modus', window.em.handleRaumEditMenuEinfacherModusClick);

	$('#MenuRaumEdit').on('click', '.menu_felder_verwalten', window.em.handleRaumEditMenuFelderVerwaltenClick);

	$('#MenuRaumEdit').on('click', '.menu_raeume_exportieren', window.em.handleRaumEditMenuExportierenClick);

	$('#MenuRaumEdit').on('click', '.menu_einstellungen', window.em.handleRaumEditMenuEinstellungenClick);

	$('#MenuRaumEdit').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuRaumEdit').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuRaumEdit').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuRaumEdit').on('click', '.menu_admin', window.em.öffneAdmin);
};

window.em.handleRaumEditOeffneRaumListeClick = function() {
	window.em.leereStorageRaumEdit();
	$.mobile.navigate("hRaumListe.html");
};

window.em.handleRaumEditSpeichernAnhangChange = function() {
	var _attachments = $("#_attachmentshRE").val();
	if (_attachments && _attachments.length > 0) {
		window.em.speichereAnhänge(localStorage.RaumId, window.em.hRaum, "hRE");
	}
};

window.em.handleRaumEditLoescheRaumClick = function() {
	// Anzahl Orte des Raums zählen
	$db = $.couch.db("evab");
	$db.view('evab/hOrtIdVonRaum?startkey=["' + localStorage.RaumId + '"]&endkey=["' + localStorage.RaumId + '",{},{}]', {
		success: function(Orte) {
			var anzOrte = Orte.rows.length;
			// Anzahl Zeiten des Raums zählen
			$db.view('evab/hZeitIdVonRaum?startkey=["' + localStorage.RaumId + '"]&endkey=["' + localStorage.RaumId + '",{},{}]', {
				success: function(Zeiten) {
					var anzZeiten = Zeiten.rows.length;
					// Anzahl Arten des Raums zählen
					$db.view('evab/hArtIdVonRaum?startkey=["' + localStorage.RaumId + '"]&endkey=["' + localStorage.RaumId + '",{},{}]', {
						success: function(Arten) {
							var anzArten = Arten.rows.length,
								div = $("#hre_löschen_meldung"),
								orte_text = (anzOrte === 1 ? ' Ort, ' : ' Orte, '),
								zeiten_text = (anzZeiten === 1 ? ' Zeit und ' : ' Zeiten und '),
								arten_text = (anzArten === 1 ? ' Art' : ' Arten'),
								meldung = 'Raum inklusive ' + anzOrte + orte_text + anzZeiten + zeiten_text + anzArten + arten_text + ' löschen?';
							$("#hre_löschen_meldung_meldung").html(meldung);
							// Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
							div.data('Arten', Arten);
							div.data('Zeiten', Zeiten);
							div.data('Orte', Orte);
							// popup öffnen
							$("#hre_löschen_meldung").popup("open");
						}
					});
				}
			});
		}
	});
};

window.em.handleRaumEditProjektOeffnenClick = function() {
	window.em.leereStorageRaumListe("mitLatLngListe");
	$.mobile.navigate("hProjektEdit.html");
};

window.em.handleRaumEditWaehleFelderClick = function() {
	localStorage.AufrufendeSeiteFW = "hRaumEdit";
	$.mobile.navigate("FelderWaehlen.html");
};

window.em.handleRaumEditContentSwipreleft = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsterVorigerRaum("nächster");
	}
};

window.em.handleRaumEditContentSwiperight = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsterVorigerRaum("voriger");
	}
};

window.em.handleRaumEditOeffneKarteClick = function() {
	localStorage.zurueck = "hRaumEdit";
	$.mobile.navigate("Karte.html");
};

window.em.handleRaumEditMenuEinfacherModusClick = function() {
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

window.em.handleRaumEditMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hRaumEdit.html";
	$.mobile.navigate("FeldListe.html");
};

window.em.handleRaumEditMenuExportierenClick = function() {
	window.open('_list/ExportRaum/ExportRaum?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuRaumEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuRaumEdit").popup("close");
};

window.em.handleRaumEditMenuEinstellungenClick = function() {
	localStorage.zurueck = "hRaumEdit.html";
	window.em.öffneMeineEinstellungen();
};

window.em.löscheRaum = function(Arten, Zeiten, Orte) {
	// nur löschen, wo Datensätze vorkommen
	if (Orte.rows.length > 0) {
		window.em.loescheIdIdRevListe(Orte);
	}
	if (Zeiten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Zeiten);
	}
	if (Arten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Arten);
	}
	if (window.em.hRaum) {
		// Objekt benutzen
		window.em.löscheRaum_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.RaumId, {
			success: function(data) {
				window.em.hRaum = data;
				window.em.löscheRaum_2();
			},
			error: function() {
				window.em.melde("Fehler: Raum nicht gelöscht");
			}
		});
	}
};

window.em.löscheRaum_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.hRaum, {
		success: function(data) {
			var i;
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.RaumListe) {
				for (i in window.em.RaumListe.rows) {
					if (window.em.RaumListe.rows[i].doc._id === data.id) {
						window.em.RaumListe.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine Raumliste mehr. Storage löschen
				window.em.leereStorageRaumListe("mitLatLngListe");
			}
			// RaumListe zurücksetzen, damit sie beim nächsten Aufruf neu aufgebaut wird
			window.em.leereStorageRaumEdit("mitLatLngListe");
			$.mobile.navigate('hRaumListe.html');
		},
		error: function() {
			window.em.melde("Fehler: Raum nicht gelöscht");
		}
	});
};

window.em.validierehRaumEdit = function() {
	if (!$("#rName").val()) {
		window.em.melde("Bitte Raumnamen eingeben");
		setTimeout(function() { 
			$('#rName').focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	return true;
};

window.em.speichereRaum = function() {
	var that = this;
	// prüfen, ob Objekt Raum existiert
	// fehlt z.B. nach refresh
	if (window.em.hRaum) {
		window.em.speichereRaum_2(that);
	} else {
		// kein Raum > aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.RaumId, {
			success: function(data) {
				window.em.hRaum = data;
				window.em.speichereRaum_2(that);
			},
			error: function() {
				window.em.melde("Fehler: Änderung in " + that.name + " nicht gespeichert");
			}
		});
	}

};

window.em.speichereRaum_2 = function(that) {
	var Feldname,
		Feldjson,
		Feldwert;
	if (window.em.myTypeOf($(that).attr("aria-valuenow")) !== "string") {
		// slider
		Feldname = $(that).attr("aria-labelledby").slice(0, ($(that).attr("aria-labelledby").length -6));
		Feldwert = $(that).attr("aria-valuenow");
	} else {
		// alle anderen Feldtypen
		Feldname = that.name;
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject();
		Feldwert = Feldjson[Feldname];
	}
	if (window.em.validierehRaumEdit()) {
		if (Feldname === "rName") {
			// RaumListe zurücksetzen, damit sie beim nächsten Aufruf neu aufgebaut wird
			window.em.leereStorageRaumListe("mitLatLngListe");
		}
		if (Feldwert) {
			if (window.em.myTypeOf(Feldwert) === "float") {
				window.em.hRaum[Feldname] = parseFloat(Feldwert);
			} else if (window.em.myTypeOf(Feldwert) === "integer") {
				window.em.hRaum[Feldname] = parseInt(Feldwert);
			} else {
				window.em.hRaum[Feldname] = Feldwert;
			}
		} else if (window.em.hRaum[Feldname]) {
			delete window.em.hRaum[Feldname];
		}
		// alles speichern
		$db.saveDoc(window.em.hRaum, {
			success: function(data) {
				window.em.hRaum._rev = data.rev;
				// window.ZuletztGespeicherteRaumId wird benutzt, damit auch nach einem
				// Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
				// Zuletzt gespeicherte RaumId NACH dem speichern setzen
				// sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
				// darum zwischenspeichern
				window.em.RaumIdZwischenspeicher = localStorage.RaumId;
				//setTimeout("window.ZuletztGespeicherteRaumId = window.em.RaumIdZwischenspeicher", 1000);	AUSGESCHALTET, DA ZuletztGespeicherteRaumId NIRGENDS GEBRAUCHT
				setTimeout("delete window.em.RaumIdZwischenspeicher", 1500);
				// nicht aktualisierte hierarchisch tiefere Listen löschen
				delete window.em.OrteVonProjekt;
				delete window.em.ZeitenVonProjekt;
				delete window.em.ZeitenVonOrt;
				delete window.em.ArtenVonProjekt;
				delete window.em.ArtenVonOrt;
				delete window.em.ArtenVonZeit;
			},
			error: function() {
				console.log('fehler in function speichereRaum_2(that)');
			}
		});
	}
};

// Öffnet den vorigen oder nächsten Raum
// voriger des ersten => RaumListe
// nächster des letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
window.em.nächsterVorigerRaum = function(NächsterOderVoriger) {
	// prüfen, ob RaumListe schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.em.RaumListe) {
		// globale Variable RaumListe existiert noch
		window.em.nächsterVorigerRaum_2(NächsterOderVoriger);
	} else {
		// keine Raumliste übergeben
		// neu aus DB erstellen
		$db = $.couch.db("evab");
		$db.view('evab/hRaumListe?startkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// RaumListe bereitstellen
				window.em.RaumListe = data;
				window.em.nächsterVorigerRaum_2(NächsterOderVoriger);
			}
		});
	}
};

window.em.nächsterVorigerRaum_2 = function(NächsterOderVoriger) {
	var i,
		RaumIdAktuell,
		AnzRaum;
	for (i in window.em.RaumListe.rows) {
		RaumIdAktuell = window.em.RaumListe.rows[i].doc._id;
		AnzRaum = window.em.RaumListe.rows.length -1;  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (RaumIdAktuell === localStorage.RaumId) {
			switch (NächsterOderVoriger) {
			case "nächster":
				if (parseInt(i) < AnzRaum) {
					localStorage.RaumId = window.em.RaumListe.rows[parseInt(i)+1].doc._id;
					window.em.leereStorageRaumEdit("mitLatLngListe", "ohneId");
					window.em.initiiereRaumEdit();
					return;
				} else {
					window.em.melde("Das ist der letzte Raum");
					return;
				}
				break;
			case "voriger":
				if (parseInt(i) > 0) {
					localStorage.RaumId = window.em.RaumListe.rows[parseInt(i)-1].doc._id;
					window.em.leereStorageRaumEdit("mitLatLngListe", "ohneId");
					window.em.initiiereRaumEdit();
					return;
				} else {
					window.em.leereStorageRaumEdit();
					$.mobile.navigate("hRaumListe.html");
					return;
				}
				break;
			}
		}
	}
};

// wenn hRaumListe erscheint
window.em.handleHRaumListePageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.ProjektId || localStorage.ProjektId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiiereRaumListe();
};

// wenn hRaumListe initiiert wird
window.em.handleHRaumListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.ProjektId || localStorage.ProjektId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	// inaktive tabs inaktivieren
	// BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF id des header NICHT FUNKTIONIERTE!!!???
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	// Link zu Projekt in Navbar und Titelleiste
	$("#hRaumListePageHeader").on("click", "[name='ProjektEditOeffnenRaumListe']", function(event) {
		event.preventDefault();
		window.em.handleRaumListeOeffneProjektEditClick();
	});

	// neuen Raum erstellen
	$("#hRaumListe").on("click", "[name='NeuerRaumRaumListe']", function(event) {
		event.preventDefault();
		window.em.erstelleNeuenRaum();
	});

	$("#RaumlistehRL").on("swipeleft", ".Raum", window.em.handleRaumListeSwipeleft);

	$("#RaumlistehRL").on("click", ".Raum", function(event) {
		event.preventDefault();
		window.em.handleRaumListeRaumClick(this);
	});

	$("#RaumlistehRL").on("swipeleft", ".erste", window.em.erstelleNeuenRaum);

	$("#hRaumListe").on("swiperight", '#hRaumListePageContent', window.em.handleRaumListeContentSwiperight);

	$("#hRaumListePageFooter").on("click", "#KarteOeffnenRaumListe", function(event) {
		event.preventDefault();
		window.em.handleRaumListeOeffneKarteClick();
	});

	$('#MenuRaumListe').on('click', '.menu_einfacher_modus', window.em.handleHRaumListeMenuEinfacherModusClick);

	$('#MenuRaumListe').on('click', '.menu_felder_verwalten', window.em.handleRaumListeMenuFelderVerwaltenClick);

	$('#MenuRaumListe').on('click', '.menu_raeume_exportieren', window.em.handleHRaumListeMenuExportierenClick);

	$('#MenuRaumListe').on('click', '.menu_einstellungen', window.em.handleRaumListeMenuEinstellungenClick);

	$('#MenuRaumListe').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuRaumListe').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuRaumListe').on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren);

	$('#MenuRaumListe').on('click', '.menu_admin', window.em.öffneAdmin);
};

window.em.handleRaumListeOeffneProjektEditClick = function() {
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

window.em.handleRaumListeSwipeleft = function() {
	localStorage.RaumId = $(this).attr('RaumId');
	$.mobile.navigate("hOrtListe.html");
};

window.em.handleRaumListeRaumClick = function(that) {
	localStorage.RaumId = $(that).attr('RaumId');
	$.mobile.navigate("hRaumEdit.html");
};

window.em.handleRaumListeContentSwiperight = function() {
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektListe.html");
};

window.em.handleRaumListeOeffneKarteClick = function() {
	localStorage.zurueck = "hRaumListe";
	$.mobile.navigate("Karte.html");
};

window.em.handleHRaumListeMenuEinfacherModusClick = function() {
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

window.em.handleRaumListeMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hRaumListe.html";
	$.mobile.navigate("FeldListe.html");
};

window.em.handleRaumListeMenuEinstellungenClick = function() {
	localStorage.zurueck = "hRaumListe.html";
	window.em.öffneMeineEinstellungen();
};

window.em.handleHRaumListeMenuExportierenClick = function() {
	window.open('_list/ExportRaum/ExportRaum?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuRaumListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuRaumListe").popup("close");
};

// wenn hZeitEdit.html erscheint
window.em.handleHZeitEditPageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.ZeitId || localStorage.ZeitId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
	}
	window.em.initiiereZeitEdit();
};

// wenn hZeitEdit.html initiiert wird
window.em.handleHZeitEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.ZeitId || localStorage.ZeitId === "undefined")) {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
	}

	$("#ZeitEditPageHeader").on("click", "[name='OeffneZeitListeZeitEdit']", function(event) {
		event.preventDefault();
		window.em.leereStorageZeitEdit();
		$.mobile.navigate("hZeitListe.html");
	});

	$("#ZeitEditPageHeader").on("click", "#OeffneOrtZeitEdit", function(event) {
		event.preventDefault();
		window.em.handleZeitEditOeffneOrtClick();
	});


	$("#ZeitEditPageHeader").on("click", "#OeffneArtListeZeitEdit", function(event) {
		event.preventDefault();
		$.mobile.navigate("hArtListe.html");
	});

	$("#ZeitEditPageHeader").on("click", "#OeffneRaumZeitEdit", function(event) {
		event.preventDefault();
		window.em.handleZeitEditOeffneRaumClick();
	});

	$("#ZeitEditPageHeader").on("click", "#OeffneProjektZeitEdit", function(event) {
		event.preventDefault();
		window.em.handleZeitEditOeffneProjektClick();
	});

	// Für jedes Feld bei Änderung speichern
	$("#hZeitEditForm").on("change", ".speichern", window.em.speichereHZeitEdit);

	// Eingabe im Zahlenfeld abfangen
	$("#hZeitEditForm").on("blur", '.speichernSlider', window.em.speichereHZeitEdit);

	// Klicken auf den Pfeilen im Zahlenfeld abfangen
	$("#hZeitEditForm").on("mouseup", '.ui-slider-input', window.em.speichereHZeitEdit);

	// Ende des Schiebens abfangen
	$("#hZeitEditForm").on("slidestop", '.speichernSlider', window.em.speichereHZeitEdit);

	// Änderungen im Formular für Anhänge speichern
	$("#FormAnhängehZE").on("change", ".speichernAnhang", window.em.handleZeitEditSpeichernAnhangChange);

	// Neue Zeit erstellen
	$('#ZeitEditPageFooter').on('click', '#NeueZeitZeitEdit', function(event) {
		event.preventDefault();
		window.em.handleZeitEditNeuClick();
	});

	// sichtbare Felder wählen
	$("#ZeitEditPageFooter").on("click", "#waehleFelderZeitEdit", function(event) {
		event.preventDefault();
		window.em.handleZeitEditWaehleFelderClick();
	});

	// Code für den Zeit-Löschen-Dialog
	$('#ZeitEditPageFooter').on('click', '#LoescheZeitZeitEdit', function(event) {
		event.preventDefault();
		window.em.handleZeitEditLoescheClick();
	});

	$("#hze_löschen_meldung").on("click", "#hze_löschen_meldung_ja_loeschen", window.em.handleZeitEditLoeschenMeldungJaClick);

	$("#hZeitEdit").on("swipeleft", '#ZeitEditPageContent', window.em.handleZeitEditContentSwipeleft);

	$("#hZeitEdit").on("swiperight", '#ZeitEditPageContent', window.em.handleZeitEditContentSwiperight);

	// Pagination Pfeil voriger initialisieren
	$("#hZeitEdit").on("vclick", ".ui-pagination-prev", function(event) {
		event.preventDefault();
		window.em.nächsteVorigeZeit("vorige");
	});

	// Pagination Pfeil nächster initialisieren
	$("#hZeitEdit").on("vclick", ".ui-pagination-next", function(event) {
		event.preventDefault();
		window.em.nächsteVorigeZeit("nächste");
	});

	// Pagination Pfeiltasten initialisieren
	$("#hZeitEdit").on("keyup", function(event) {
		// nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
		if (!$(event.target).is("input, textarea, select, button") && $('#hZeitEdit').is(':visible')) {
			// Left arrow
			if (event.keyCode === $.mobile.keyCode.LEFT) {
				window.em.nächsteVorigeZeit("vorige");
				event.preventDefault();
			}
			// Right arrow
			else if (event.keyCode === $.mobile.keyCode.RIGHT) {
				window.em.nächsteVorigeZeit("nächste");
				event.preventDefault();
			}
		}
	});

	$("#FormAnhängehZE").on("click", "[name='LöscheAnhang']", function(event) {
		event.preventDefault();
		window.em.loescheAnhang(this, window.em.hZeit, localStorage.ZeitId);
	});

	$('#MenuZeitEdit').on('click', '.menu_einfacher_modus', window.em.handleZeitEditMenuEinfacherModusClick);

	$('#MenuZeitEdit').on('click', '.menu_felder_verwalten', window.em.handleZeitEditMenuFelderVerwaltenClick);

	$('#MenuZeitEdit').on('click', '.menu_zeiten_exportieren', window.em.handleZeitEditMenuExportierenClick);

	$('#MenuZeitEdit').on('click', '.menu_einstellungen', window.em.handleZeitEditMenuEinstellungenClick);

	$('#MenuZeitEdit').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuZeitEdit').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuZeitEdit').on('click', '.menu_admin', window.em.öffneAdmin);
};

window.em.handleZeitEditOeffneOrtClick = function() {
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	$.mobile.navigate("hOrtEdit.html");
};

window.em.handleZeitEditOeffneRaumClick = function() {
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	$.mobile.navigate("hRaumEdit.html");
};

window.em.handleZeitEditOeffneProjektClick = function() {
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

window.em.handleZeitEditSpeichernAnhangChange = function() {
	var _attachments = $("#_attachmentshZE").val();
	if (_attachments && _attachments.length > 0) {
		window.em.speichereAnhänge(localStorage.ZeitId, window.em.hZeit, "hZE");
	}
};

window.em.handleZeitEditNeuClick = function() {
	// Globale Variablen für ZeitListe zurücksetzen, damit die Liste neu aufgebaut wird
	window.em.leereStorageZeitListe();
	window.em.erstelleNeueZeit();
};

window.em.handleZeitEditWaehleFelderClick = function() {
	localStorage.AufrufendeSeiteFW = "hZeitEdit";
	$.mobile.navigate("FelderWaehlen.html");
};

window.em.handleZeitEditLoescheClick = function() {
	// Anzahl Zeiten von Ort zählen
	$db = $.couch.db("evab");
	$db.view('evab/hArtIdVonZeit?startkey=["' + localStorage.ZeitId + '"]&endkey=["' + localStorage.ZeitId + '",{},{}]', {
		success: function(Arten) {
			var anzArten = Arten.rows.length, 
				div = $("#hze_löschen_meldung"),
				arten_text = (anzArten === 1 ? ' Art' : ' Arten'),
				meldung = 'Zeit inklusive ' + anzArten + arten_text + ' löschen?';
			$("#hze_löschen_meldung_meldung").html(meldung);
			// Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
			div.data('Arten', Arten);
			// popup öffnen
			$("#hze_löschen_meldung").popup("open");
		}
	});
};

window.em.handleZeitEditLoeschenMeldungJaClick = function() {
	var div = $("#hze_löschen_meldung")[0];
	window.em.löscheZeit(jQuery.data(div, 'Arten'));
};

window.em.handleZeitEditContentSwipeleft = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsteVorigeZeit("nächste");
	}
};

window.em.handleZeitEditContentSwiperight = function() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		window.em.nächsteVorigeZeit("vorige");
	}
};

window.em.handleZeitEditMenuEinfacherModusClick = function() {
	window.em.leereStorageZeitEdit();
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	$.mobile.navigate("BeobListe.html");
};

window.em.handleZeitEditMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hZeitEdit.html";
	$.mobile.navigate("FeldListe.html");
};

window.em.handleZeitEditMenuExportierenClick = function() {
	window.open('_list/ExportZeit/ExportZeit?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuZeitEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuZeitEdit").popup("close");
};

window.em.handleZeitEditMenuEinstellungenClick = function() {
	localStorage.zurueck = "hZeitEdit.html";
	window.em.öffneMeineEinstellungen();
};

window.em.löscheZeit = function(Arten) {
	// nur löschen, wo Datensätze vorkommen
	if (Arten.rows.length > 0) {
		window.em.loescheIdIdRevListe(Arten);
	}
	// dann die Zeit
	if (window.em.hZeit) {
		// Objekt nutzen
		window.em.löscheZeit_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ZeitId, {
			success: function(data) {
				window.em.hZeit = data;
				window.em.löscheZeit_2();
			},
			error: function() {
				window.em.melde("Fehler: Zeit nicht gelöscht");
			}
		});
	}
};

window.em.löscheZeit_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.hZeit, {
		success: function(data) {
			var i;
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.ZeitListe) {
				for (i in window.em.ZeitListe.rows) {
					if (window.em.ZeitListe.rows[i].doc._id === data.id) {
						window.em.ZeitListe.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine ZeitListe mehr. Storage löschen
				window.em.leereStorageZeitListe();
			}
			window.em.leereStorageZeitEdit();
			$.mobile.navigate('hZeitListe.html');
		},
		error: function() {
			window.em.melde("Fehler: Zeit nicht gelöscht");
		}
	});
};

window.em.validierehZeitEdit = function() {
	if (!$("[name='zDatum']").val()) {
		window.em.melde("Bitte Datum erfassen");
		setTimeout(function() { 
			$("[name='zDatum']").focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	if (!$("[name='zUhrzeit']").val()) {
		window.em.melde("Bitte Zeit erfassen");
		setTimeout(function() { 
			$("[name='zUhrzeit']").focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	return true;
};

// speichert nach jedem change event in einem Feld mit Class speichern
// den Wert in die DB
// erwartet das Feld als Objekt
window.em.speichereHZeitEdit = function() {
	var that = this;
	// prüfen, ob die Zeit als Objekt vorliegt
	if (window.em.hZeit) {
		// dieses verwenden
		window.em.speichereHZeitEdit_2(that);
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ZeitId, {
			success: function(data) {
				window.em.hZeit = data;
				window.em.speichereHZeitEdit_2(that);
			},
			error: function() {
				console.log('fehler in function speichereHZeitEdit(that)');
				//window.em.melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
			}
		});
	}

};

window.em.speichereHZeitEdit_2 = function(that) {
	var Feldname,
		Feldjson,
		Feldwert;
	if (window.em.myTypeOf($(that).attr("aria-valuenow")) !== "string") {
		// slider
		Feldname = $(that).attr("aria-labelledby").slice(0, ($(that).attr("aria-labelledby").length -6));
		Feldwert = $(that).attr("aria-valuenow");
	} else {
		// alle anderen Feldtypen
		Feldname = that.name;
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject();
		Feldwert = Feldjson[Feldname];
	}
	if (window.em.validierehZeitEdit()) {
		if (Feldname === "zDatum" || Feldname === "zUhrzeit") {
			// Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
			window.em.leereStorageZeitListe();
		}
		// Werte aus dem Formular aktualisieren
		if (Feldwert) {
			if (window.em.myTypeOf(Feldwert) === "float") {
				window.em.hZeit[Feldname] = parseFloat(Feldwert);
			} else if (window.em.myTypeOf(Feldwert) === "integer") {
				window.em.hZeit[Feldname] = parseInt(Feldwert);
			} else {
				window.em.hZeit[Feldname] = Feldwert;
			}
		} else if (window.em.hZeit[Feldname]) {
			delete window.em.hZeit[Feldname];
		}
		// alles speichern
		$db.saveDoc(window.em.hZeit, {
			success: function(data) {
				window.em.hZeit._rev = data.rev;
				// window.ZuletztGespeicherteZeitId wird benutzt, damit auch nach einem
				// Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
				// Zuletzt gespeicherte ZeitId NACH dem speichern setzen
				// sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
				// darum zwischenspeichern
				window.em.ZeitIdZwischenspeicher = localStorage.ZeitId;
				//setTimeout("window.ZuletztGespeicherteZeitId = window.em.ZeitIdZwischenspeicher", 1000);	AUSGESCHALTET, DA ZuletztGespeicherteZeitId NIRGENDS BENUTZT
				setTimeout("delete window.em.ZeitIdZwischenspeicher", 1500);
				// nicht aktualisierte hierarchisch tiefere Listen löschen
				delete window.em.ArtenVonProjekt;
				delete window.em.ArtenVonRaum;
				delete window.em.ArtenVonOrt;
			},
			error: function() {
				console.log('fehler in function speichereHZeitEdit_2(that)');
				//window.em.melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
			}
		});
	}
};

// Öffnet die vorige oder nächste Zeit
// vorige der ersten => ZeitListe
// nächste der letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
window.em.nächsteVorigeZeit = function(NächsteOderVorige) {
	// prüfen, ob ZeitListe schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.em.ZeitListe) {
		window.em.nächsteVorigeZeit_2(NächsteOderVorige);
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/hZeitListe?startkey=["' + localStorage.Email + '", "' + localStorage.OrtId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.OrtId + '" ,{}]&include_docs=true', {
			success: function(data) {
				window.em.ZeitListe = data;
				window.em.nächsteVorigeZeit_2(NächsteOderVorige);
			}
		});
	}
};

window.em.nächsteVorigeZeit_2 = function(NächsteOderVorige) {
	var i,
		ZeitIdAktuell,
		AnzZeit;
	for (i in window.em.ZeitListe.rows) {
		ZeitIdAktuell = window.em.ZeitListe.rows[i].doc._id;
		AnzZeit = window.em.ZeitListe.rows.length -1;  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (ZeitIdAktuell === localStorage.ZeitId) {
			switch (NächsteOderVorige) {
			case "nächste":
				if (parseInt(i) < AnzZeit) {
					localStorage.ZeitId = window.em.ZeitListe.rows[parseInt(i)+1].doc._id;
					window.em.leereStorageZeitEdit("ohneId");
					window.em.initiiereZeitEdit();
					return;
				} else {
					window.em.melde("Das ist die letzte Zeit");
					return;
				}
				break;
			case "vorige":
				if (parseInt(i) > 0) {
					localStorage.ZeitId = window.em.ZeitListe.rows[parseInt(i)-1].doc._id;
					window.em.leereStorageZeitEdit("ohneId");
					window.em.initiiereZeitEdit();
					return;
				} else {
					window.em.leereStorageZeitEdit();
					$.mobile.navigate("hZeitListe.html");
					return;
				}
				break;
			}
		}
	}
};

window.em.handleZeitListePageshow = function() {
	// Sollte keine id vorliegen, zu hProjektListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.OrtId || localStorage.OrtId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}
	window.em.initiiereZeitListe();
};

window.em.handleZeitListePageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.OrtId || localStorage.OrtId === "undefined") {
		window.em.leereAlleVariabeln("ohneClear");
		$.mobile.navigate("hProjektListe.html");
		return;
	}

	// inaktive tabs inaktivieren
	// BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF hZeitListePageHeader NICHT FUNKTIONIERTE!!!???
	$(document).on("click", ".tab_inaktiv", function(event) {
		event.preventDefault();
		event.stopPropagation();
	});

	// Link zu Raum in Navbar und Titelleiste
	$("#hZeitListePageHeader").on("click", "[name='OeffneOrtZeitListe']", function(event) {
		event.preventDefault();
		window.em.handleZeitListeOeffneOrtClick();
	});

	$("#hZeitListePageHeader").on("click", "#OeffneRaumZeitListe", function(event) {
		event.preventDefault();
		window.em.handleZeitListeOeffneRaumClick();
	});

	$("#hZeitListePageHeader").on("click", "#OeffneProjektZeitListe", function(event) {
		event.preventDefault();
		window.em.handleZeitListeOeffneProjektClick();
	});

	// Neue Zeit erstellen, erste Zeit und fixer button
	$("#hZeitListe").on("click", ".NeueZeitZeitListe", function(event) {
		event.preventDefault();
		window.em.erstelleNeueZeit(); 
	});

	$("#ZeitlistehZL").on("swipeleft", ".Zeit", window.em.handleZeitListeSwipeleftZeit);

	$("#ZeitlistehZL").on("click", ".Zeit", function(event) {
		event.preventDefault();
		window.em.handleZeitListeZeitClick(this);
	});

	$("#ZeitlistehZL").on("swipeleft", ".erste", window.em.erstelleNeueZeit);

	$("#hZeitListe").on("swiperight", window.em.handleZeitListeSwiperight);

	$('#MenuZeitListe').on('click', '.menu_einfacher_modus', window.em.handleZeitListeMenuEinfacherModusClick);

	$('#MenuZeitListe').on('click', '.menu_felder_verwalten', window.em.handleZeitListeMenuFelderVerwaltenClick);

	$('#MenuZeitListe').on('click', '.menu_zeiten_exportieren', window.em.handleZeitListeMenuZeitenExportierenClick);

	$('#MenuZeitListe').on('click', '.menu_einstellungen', window.em.handleZeitListeMenuEinstellungenClick);

	$('#MenuZeitListe').on('click', '.menu_neu_anmelden', window.em.meldeNeuAn);

	$('#MenuZeitListe').on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren);

	$('#MenuZeitListe').on('click', '.menu_admin', window.em.öffneAdmin);
};

window.em.handleZeitListeOeffneOrtClick = function() {
	window.em.leereStorageZeitListe();
	$.mobile.navigate("hOrtEdit.html");
};

window.em.handleZeitListeOeffneRaumClick = function() {
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	$.mobile.navigate("hRaumEdit.html");
};

window.em.handleZeitListeOeffneProjektClick = function() {
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	$.mobile.navigate("hProjektEdit.html");
};

window.em.handleZeitListeSwipeleftZeit = function() {
	localStorage.ZeitId = $(this).attr('ZeitId');
	$.mobile.navigate("hArtListe.html");
};

window.em.handleZeitListeZeitClick = function(that) {
	localStorage.ZeitId = $(that).attr('ZeitId');
	$.mobile.navigate("hZeitEdit.html");
};

window.em.handleZeitListeSwiperight = function() {
	$.mobile.navigate("hOrtListe.html");
};

window.em.handleZeitListeMenuEinfacherModusClick = function() {
	window.em.leereStorageZeitListe();
	window.em.leereStorageOrtEdit();
	window.em.leereStorageOrtListe();
	window.em.leereStorageRaumEdit();
	window.em.leereStorageRaumListe();
	window.em.leereStorageProjektEdit();
	window.em.leereStorageOrtListe();
	$.mobile.navigate("BeobListe.html");
};

window.em.handleZeitListeMenuFelderVerwaltenClick = function() {
	localStorage.zurueck = "hZeitListe.html";
	$.mobile.navigate("FeldListe.html");
};

window.em.handleZeitListeMenuZeitenExportierenClick = function() {
	window.open('_list/ExportZeit/ExportZeit?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuZeitListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuZeitListe").popup("close");
};

window.em.handleZeitListeMenuEinstellungenClick = function() {
	localStorage.zurueck = "hZeitListe.html";
	window.em.öffneMeineEinstellungen();
};

window.em.handleIndexPageshow = function() {
	// Wenn möglich localStorage.Email für die Anmeldung verwenden
	// ausser User hat via Menü bewusst neu anmelden wollen
	// localStorage muss bei Neuanmeldung geleert werden, sonst werden die Beobachtungen des alten Users gezeigt
	if (localStorage.length > 0) {
		if (localStorage.Email) {
			if (localStorage.UserStatus !== "neu") {
				if (localStorage.Email && localStorage.Autor) {
					window.em.oeffneZuletztBenutzteSeite();
					return;
				} else {
					// Userdaten bereitstellen und danach die zuletzt benutzte Seite öffnen
					window.em.stelleUserDatenBereit();
					return;
				}
			}
		}
	}
	// Wenn localStorage.UserStatus neu ist, müssen alle Variabeln entfernt werden, inkl. Username
	window.em.leereAlleVariabeln();
		
	if (!("autofocus" in document.createElement("input"))) {
		$("#Email").focus();
	}
};

window.em.handleIndexPageinit = function() {
	$("#indexFooter").on("click", "#index_submit_button", function (event) {
		event.preventDefault();
		window.em.meldeUserAn();
	});

	// Reaktion auf Enter-Taste
	$("#indexForm").on("keydown", "#Passwort", function (event) {
		if (event.keyCode === 13) {
			window.em.meldeUserAn();
			event.preventDefault();
		}
	});

	$("#indexFooter").on("click", "#index_signup_button", function (event) {
		var email = $("#Email").val(),
			passwort = $("#Passwort").val();
		if (email) {
			sessionStorage.prov_email = email;
		}
		if (passwort) {
			sessionStorage.prov_passwort = passwort;
		}
		event.preventDefault();
		$.mobile.navigate("Signup.html");
	})
};

window.em.validiereUserIndex = function() {
	var Email = $('input[name=Email]').val(),
		Passwort = $('input[name=Passwort]').val();
	if (!Email) {
		setTimeout(function () { 
			$('#Email').focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		window.em.melde("Bitte Benutzernamen eingeben");
		return false;
	} else if (!Passwort) {
		setTimeout(function () { 
			$('#Passwort').focus(); 
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		window.em.melde("Bitte Passwort eingeben");
		return false;
	}
	return true;
};

window.em.meldeUserAn = function() {
	var Email = $('input[name=Email]').val(),
		Passwort = $('input[name=Passwort]').val();
	// sicherstellen, dass die localStorage leer ist
	window.em.leereAlleVariabeln();
	if (window.em.validiereUserIndex) {
		$.couch.login({
			name : Email,
			password : Passwort,
			success : function (r) {
				localStorage.Email = Email;
				if (r.roles.indexOf("_admin") !== -1) {
					// das ist ein admin
					console.log("hallo admin");
					localStorage.admin = true;
				} else {
					delete localStorage.admin;
				}
				window.em.blendeMenus();
				// Userdaten bereitstellen und an die zuletzt benutzte Seite weiterleiten
				window.em.stelleUserDatenBereit();
				delete localStorage.UserStatus;
			},
			error: function () {
				window.em.melde("Anmeldung gescheitert.<br>Sie müssen ev. ein Konto erstellen?");
			}
		});
	}
};

window.em.blendeMenus = function() {
	if (localStorage.admin) {
		$(".popup").find(".admin").show();
	} else {
		$(".popup").find(".admin").hide();
	}
};

window.em.handleKartePageshow = function() {
	// Karten müssen in pageshow erstellt werden, weil sie sonst in Chrome nicht erscheinen
	var viewname;
	// In diesem Array werden alle Marker gespeichert, damit sie gelöscht werden können
	// wird benutzt von: hOrtEdit.html, BeobEdit.html
	window.em.markersArray = [],
	window.em.InfoWindowArray = [];

	// sicherstellen, dass localStorage.zurueck existiert (gibt sonst später Fehler)
	if (!localStorage.zurueck) {
		$.mobile.navigate("BeobListe.html");
	}

	// Je nachdem, welche Seite die Karte aufruft, muss unterschiedlich vorgegangen werden
	switch(localStorage.zurueck) {
		case "hProjektListe":
			viewname = 'evab/hProjektlisteOrteFuerKarte?key="' + localStorage.Email + '"&include_docs=true';
			window.em.KeinOrtMeldung = "Es gibt keine Orte mit Koordinaten";
			window.em.erstelleKarteH(viewname);
			break;
		case "hProjektEdit":	// gleich wie hRaumListe
		case "hRaumListe":
			viewname = 'evab/hProjektOrteFuerKarte?startkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '" ,{}]&include_docs=true';
			window.em.KeinOrtMeldung = "Es gibt keine Orte mit Koordinaten";
			window.em.erstelleKarteH(viewname);
			break;
		case "hRaumEdit":	// gleich wie hOrtListe
		case "hOrtListe":
			viewname = 'evab/hRaumOrteFuerKarte?startkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '" ,{}]&include_docs=true';
			window.em.KeinOrtMeldung = "Es gibt keine Orte mit Koordinaten";
			window.em.erstelleKarteH(viewname);
			break;
		case "hOrtEdit":
			OrtOderBeob = "Ort";
			window.em.erstelleKartehOrtEdit();
			break;
		case "BeobListe":
			window.em.erstelleKarteBeobListe();
			break;
		case "BeobEdit":
			window.em.erstelleKarteBeobEdit();
			break;
	}
};

window.em.handleKartePageinit = function() {
	// zurück-Button steuern
	$("#KarteHeader").on('click', '#ZurueckKarte', function (event) {
		event.preventDefault();
		window.em.handleKarteZurueckClick();
	});
};

window.em.handleKartePagehide = function() {
	// leeren, damit bei erneuten Öffnen die Karte nicht zweimal aufgebaut wird
	$("#MapCanvas").html("");
};

window.em.handleKarteZurueckClick = function() {
	var zurueck;
	if (localStorage.zurueck) {
		zurueck = localStorage.zurueck + ".html";
	} else {
		zurueck = "BeobListe.html";
	}
	$.mobile.navigate(zurueck);
	delete localStorage.zurueck;
};

// erstellt Karten für hProjektListe bis hOrtListe
// im ersten Teil wird die Liste aller Orte erstellt und an den zweiten Teil übergeben
window.em.erstelleKarteH = function(viewname) {

	// Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
	var contentHeight = $(window).height() - 44,
		hOrtLatLngListe;

	$("#MapCanvas").css("height", contentHeight + "px");
	// zuständige hOrtLatLngListe ermitteln
	switch (localStorage.zurueck) {
		case "hProjektListe":
		hOrtLatLngListe = "hOrteLatLngProjektliste";
		break;
	case "hProjektEdit":
	case "hRaumListe":
		hOrtLatLngListe = "hOrteLatLngProjekt";
		break;
	case "hRaumEdit":
	case "hOrtListe":
		hOrtLatLngListe = "hOrteLatLngRaum";
		break;
	}

	// Liste der Orte holen. Prüfen, ob sie noch als Variable vorliegt
	if (window.em[hOrtLatLngListe]) {
		window.em.erstelleKarteH_2(window.em[hOrtLatLngListe]);
	} else {
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function (data) {
				window.em[hOrtLatLngListe] = data;
				window.em.erstelleKarteH_2(data);
			}
		});
	}
};

window.em.erstelleKarteH_2 = function(hOrteLatLng) {
	var anzOrt = 0,
		Ort,
		lat,
		lng,
		latlng,
		options,
		map,
		pName,
		rName,
		bounds,
		markers,
		hOrtId,
		latlng2,
		marker,
		contentString,
		mcOptions,
		markerCluster,
		i;

	// Orte zählen
	if (hOrteLatLng.rows) {
		anzOrt = hOrteLatLng.rows.length;
	}

	if (anzOrt === 0) {
		// Keine Orte: Hinweis
		window.em.melde(window.em.KeinOrtMeldung);
	} else {
		// Orte vorhanden: Karte aufbauen
		// mal auf Zürich zentrieren, falls in den hOrteLatLng.rows keine Koordinaten kommen
		// auf die die Karte ausgerichtet werden kann
		lat = 47.383333;
		lng = 8.533333;
		latlng = new google.maps.LatLng(lat, lng);
		options = {
			zoom: 15,
			center: latlng,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.HYBRID
		};
		map = new google.maps.Map(document.getElementById("MapCanvas"),options);
		//google.maps.event.trigger(map,'resize');
		bounds = new google.maps.LatLngBounds();
		// für alle Orte Marker erstellen
		markers = [];
		for (i in hOrteLatLng.rows) {
			Ort = hOrteLatLng.rows[i].doc;
			hOrtId = Ort._id;

			// Infos für Infowindow holen
			pName = "";
			rName = "";
			if (window.em.hProjekt && window.em.hProjekt.pName) {
				pName = window.em.hProjekt.pName;
			}
			if (window.em.hRaum && window.em.hRaum.rName) {
				rName = window.em.hRaum.rName;
			}

			latlng2 = new google.maps.LatLng(Ort.oLatitudeDecDeg, Ort.oLongitudeDecDeg);
			if (anzOrt === 1) {
				// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
				latlng = latlng2;
			} else {
				// Kartenausschnitt um diese Koordinate erweitern
				bounds.extend(latlng2);
			}
			marker = new MarkerWithLabel({ 
				map: map,
				position: latlng2,
				// title muss String sein
				title: Ort.oName.toString() || "",
				labelContent: Ort.oName,
				labelAnchor: new google.maps.Point(22, 0),
				labelClass: "MapLabel", // the CSS class for the label
				labelStyle: {opacity: 0.75}
			});
			markers.push(marker);
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<div id="bodyContent" class="GmInfowindow">'+
				'<p>Projekt: ' + pName + '</p>'+
				'<p>Raum: ' + rName + '</p>'+
				'<p>Ort: ' + Ort.oName + '</p>'+
				'<p>Koordinaten: ' + Ort.oXKoord + ' / ' + Ort.oYKoord + '</p>'+
				"<p><a href=\"#\" onclick=\"window.em.oeffneOrt('" + hOrtId + "')\">bearbeiten<\/a></p>"+
				'</div>'+
				'</div>';
			window.em.makeMapListener(map, marker, contentString);
		}
		mcOptions = {maxZoom: 17};
		markerCluster = new MarkerClusterer(map, markers, mcOptions);
		if (anzOrt === 1) {
			// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
			map.setCenter(latlng);
			map.setZoom(18);
		} else {
			// Karte auf Ausschnitt anpassen
			map.fitBounds(bounds);
		}
	}
};

window.em.makeMapListener = function(map, marker, contentString) {
	var infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(contentString);
		infowindow.open(map,marker);
	});
};

// wird benutzt in hOrtEdit.html
window.em.erstelleKartehOrtEdit = function() {
	var map,
		verorted,
		lat,
		lng,
		ZoomLevel,
		latlng,
		options,
		// title muss String sein
		title = "",
		pName = "",
		rName = "",
		oName = "",
		marker,
		contentString,
		infowindow,
		// Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
		contentHeight = $(window).height() - 44;
	// Fehlermeldung verhindern, falls kein window.em.hOrt existiert
	if (window.em.hOrt && window.em.hOrt.oName) {
		title = window.em.hOrt.oName.toString();
		oName = window.em.hOrt.oName;
	}
	if (window.em.hProjekt && window.em.hProjekt.pName) {
		pName = window.em.hProjekt.pName;
	}
	if (window.em.hRaum && window.em.hRaum.rName) {
		rName = window.em.hRaum.rName;
	}
	$("#MapCanvas").css("height", contentHeight + "px");
	if (localStorage.oLatitudeDecDeg && localStorage.oLongitudeDecDeg) {
		lat = localStorage.oLatitudeDecDeg;
		lng = localStorage.oLongitudeDecDeg;
		ZoomLevel = 15;
		verorted = true;
	} else {
		lat = 47.360566;
		lng = 8.542829;
		ZoomLevel = 12;
		verorted = false;
	}
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: ZoomLevel,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	map = new google.maps.Map(document.getElementById("MapCanvas"),options);
	if (verorted === true) {
		marker = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: title,
			draggable: true
		});
		// Marker in Array speichern, damit er gelöscht werden kann
		window.em.markersArray.push(marker);
		contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<div id="bodyContent" class="GmInfowindow">'+
				'<p>Projekt: ' + pName + '</p>'+
				'<p>Raum: ' + rName + '</p>'+
				'<p>Ort: ' + oName + '</p>'+
				'<p>Koordinaten: ' + localStorage.oXKoord + " / " + localStorage.oYKoord + '</p>' +
				'</div>'+
				'</div>';
		infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		window.em.InfoWindowArray.push(infowindow);
		google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map,marker);
		});
		google.maps.event.addListener(marker, "dragend", function (event) {
			window.em.SetLocationhOrtEdit(event.latLng, map, marker);
		});
	}
	google.maps.event.addListener(map, 'click', function (event) {
		window.em.placeMarkerhOrtEdit(event.latLng, map, marker);
	});
};

// wird benutzt in BeobListe.html
window.em.erstelleKarteBeobListe = function() {
	// Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
	var contentHeight = $(window).height() - 44;
	$("#MapCanvas").css("height", contentHeight + "px");
	// Beobachtungen holen. Prüfen, ob die Liste noch da ist
	if (window.em.BeobListeLatLng) {
		window.em.erstelleKarteBeobListe_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/BeobListeLatLng?key="' + localStorage.Email + '"&include_docs=true', {
			success: function (data) {
				window.em.BeobListeLatLng = data;
				window.em.erstelleKarteBeobListe_2();
			}
		});
	}
};

window.em.erstelleKarteBeobListe_2 = function() {
	var i,
		anzBeob = window.em.BeobListeLatLng.rows.length,
		beob,
		image,
		lat,
		lng,
		latlng,
		latlng2,
		options,
		map,
		bounds,
		marker,
		markers,
		contentString,
		mcOptions,
		markerCluster,
		artgruppenname;
	if (anzBeob === 0) {
		// Keine Beobachtungen: Hinweis und zurück
		window.em.melde("Es wurden noch keine Beobachtungen mit Koordinaten erfasst");
		$.mobile.navigate("BeobListe.html");
	} else {
		// Beobachtungen vorhanden: Karte aufbauen
		lat = 47.383333;
		lng = 8.533333;
		latlng = new google.maps.LatLng(lat, lng);
		options = {
			zoom: 15,
			center: latlng,
			streetViewControl: false,
			mapTypeId: google.maps.MapTypeId.HYBRID
		};
		map = new google.maps.Map(document.getElementById("MapCanvas"),options);
		//google.maps.event.trigger(map,'resize');
		bounds = new google.maps.LatLngBounds();
		// für alle Beobachtungen Marker erstellen
		markers = [];
		for (i in window.em.BeobListeLatLng.rows) {
			beob = window.em.BeobListeLatLng.rows[i].doc;
			artgruppenname = encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + ".png";
			if (beob.aArtGruppe === "DiverseInsekten") {
				artgruppenname = "unbenannt.png";
			}
			image = "Artgruppenbilder/" + artgruppenname;
			latlng2 = new google.maps.LatLng(beob.oLatitudeDecDeg, beob.oLongitudeDecDeg);
			if (anzBeob === 1) {
				// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
				latlng = latlng2;
			} else {
				// Kartenausschnitt um diese Koordinate erweitern
				bounds.extend(latlng2);
			}
			marker = new MarkerWithLabel({ 
				map: map,
				position: latlng2,
				// title muss String sein
				title: beob.aArtName.toString() || "",
				icon: image,
				labelContent: beob.aArtName,
				labelAnchor: new google.maps.Point(22, 0),
				labelClass: "MapLabel", // the CSS class for the label
				labelStyle: {opacity: 0.75}
			});
			markers.push(marker);
			contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<h4 id="firstHeading" class="GmInfowindow">' + beob.aArtName + '</h4>'+
				'<div id="bodyContent" class="GmInfowindow">'+
				'<p>Art-Gruppe: ' + beob.aArtGruppe + '</p>'+
				'<p>Autor: ' + beob.aAutor + '</p>'+
				'<p>Datum: ' + beob.zDatum + '</p>'+
				'<p>Zeit: ' + beob.zUhrzeit + '</p>'+
				'<p>Koordinaten: ' + beob.oXKoord + " / " + beob.oYKoord + '</p>' +
				"<p><a <a href=\"#\" onclick=\"window.em.oeffneBeob('" + beob._id + "')\">bearbeiten<\/a></p>"+
				'</div>'+
				'</div>';
			window.em.makeMapListener(map, marker, contentString);
		}
		mcOptions = {maxZoom: 17};
		markerCluster = new MarkerClusterer(map, markers, mcOptions);
		if (anzBeob === 1) {
			// map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
			map.setCenter(latlng);
			map.setZoom(18);
		} else {
			// Karte auf Ausschnitt anpassen
			map.fitBounds(bounds);
		}
	}
};

window.em.erstelleKarteBeobEdit = function() {
	var map,
		verorted,
		lat,
		lng,
		ZoomLevel,
		latlng,
		options,
		mapcanvas,
		image,
		marker,
		contentString,
		infowindow,
		// Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
		contentHeight = $(window).height() - 44,
		artgruppenname;
	$("#MapCanvas").css("height", contentHeight + "px");
	if (localStorage.oLatitudeDecDeg && localStorage.oLongitudeDecDeg) {
		lat = localStorage.oLatitudeDecDeg;
		lng = localStorage.oLongitudeDecDeg;
		ZoomLevel = 15;
		verorted = true;
	} else {
		lat = 47.360566;
		lng = 8.542829;
		ZoomLevel = 12;
		verorted = false;
	}
	latlng = new google.maps.LatLng(lat, lng);
	options = {
		zoom: ZoomLevel,
		center: latlng,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	mapcanvas = $('#MapCanvas');
	map = new google.maps.Map(mapcanvas[0],options);
	//google.maps.event.trigger(map,'resize');
	artgruppenname = encodeURIComponent(localStorage.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + ".png";
	if (localStorage.aArtGruppe === "DiverseInsekten") {
		artgruppenname = "unbenannt.png";
	}
	image = "Artgruppenbilder/" + artgruppenname;
	if (verorted === true) {
		marker = new google.maps.Marker({
			position: latlng, 
			map: map,
			// title muss String sein
			title: localStorage.aArtName.toString() || "",
			icon: image,
			draggable: true
		});
		// Marker in Array speichern, damit er gelöscht werden kann
		window.em.markersArray.push(marker); 
		contentString = '<div id="content">'+
			'<h4 id="firstHeading" class="GmInfowindow">' + localStorage.aArtName + '</h4>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<p>Art-Gruppe: ' + localStorage.aArtGruppe + '</p>'+
			'<p>Autor: ' + window.em.Beobachtung.aAutor + '</p>'+
			'<p>Datum: ' + window.em.Beobachtung.zDatum + '</p>'+
			'<p>Zeit: ' + window.em.Beobachtung.zUhrzeit + '</p>'+
			'<p>Koordinaten: ' + localStorage.oXKoord + "/" + localStorage.oYKoord + '</p>' +
			'</div>'+
			'</div>';
		infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		window.em.InfoWindowArray.push(infowindow);
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(map,marker);
		});
		google.maps.event.addListener(marker, "dragend", function (event) {
			window.em.SetLocationBeobEdit(event.latLng, map, marker);
		});
	}
	google.maps.event.addListener(map, 'click', function (event) {
		window.em.placeMarkerBeobEdit(event.latLng, map, marker, image);
	});
};

// wird benutzt in hOrtEdit.html
window.em.placeMarkerhOrtEdit = function(location, map, marker) {
	// zuerst bisherige Marker löschen
	//window.em.clearMarkers();
	marker = new google.maps.Marker({
		position: location, 
		map: map,
		// title muss String sein
		title: window.em.hOrt.oName.toString() || "",
		draggable: true
	});
	// Marker in Array speichern, damit er gelöscht werden kann
	window.em.markersArray.push(marker);
	google.maps.event.addListener(marker, "dragend", function (event) {
		window.em.SetLocationhOrtEdit(event.latLng, map, marker);
	});
	window.em.SetLocationhOrtEdit(location, map, marker);
};

window.em.placeMarkerBeobEdit = function(location, map, marker, image) {
	// zuerst bisherigen Marker löschen
	//window.em.clearMarkers();
	marker = new google.maps.Marker({
		position: location, 
		map: map,
		// title muss String sein
		title: localStorage.aArtName.toString() || "",
		icon: image,
		draggable: true
	});
	// Marker in Array speichern, damit er gelöscht werden kann
	window.em.markersArray.push(marker);
	google.maps.event.addListener(marker, "dragend", function (event) {
		window.em.SetLocationBeobEdit(event.latLng, map, marker);
	});
	window.em.SetLocationBeobEdit(location, map, marker);
};

// wird benutzt in hOrtEdit.html
window.em.SetLocationhOrtEdit = function(LatLng, map, marker) {
	var lat = LatLng.lat(),
		lng = LatLng.lng(),
		contentString,
		infowindow;
	localStorage.oLatitudeDecDeg = lat;
	localStorage.oLongitudeDecDeg = lng;
	localStorage.oXKoord = window.em.DdInChX(lat, lng);
	localStorage.oYKoord = window.em.DdInChY(lat, lng);
	localStorage.oLagegenauigkeit = "Auf Luftbild markiert";
	window.em.clearInfoWindows();
	contentString = '<div id="content">'+
				'<div id="siteNotice">'+
				'</div>'+
				'<div id="bodyContent" class="GmInfowindow">'+
				'<p>Projekt: ' + window.em.hOrt.pName + '</p>'+
				'<p>Raum: ' + window.em.hOrt.rName + '</p>'+
				'<p>Ort: ' + window.em.hOrt.oName + '</p>'+
				'<p>Koordinaten: ' + localStorage.oXKoord + " / " + localStorage.oYKoord + '</p>' +
				'</div>'+
				'</div>';
	infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	window.em.InfoWindowArray.push(infowindow);
	google.maps.event.addListener(marker, 'click', function () {
	infowindow.open(map,marker);
	});
	window.em.speichereKoordinaten(localStorage.OrtId, "hOrt");
};

// wird benutzt in BeobEdit.html
window.em.SetLocationBeobEdit = function(LatLng, map, marker) {
	var lat = LatLng.lat(),
		lng = LatLng.lng(),
		contentString,
		infowindow;
	localStorage.oLatitudeDecDeg = lat;
	localStorage.oLongitudeDecDeg = lng;
	localStorage.oXKoord = window.em.DdInChX(lat, lng);
	localStorage.oYKoord = window.em.DdInChY(lat, lng);
	localStorage.oLagegenauigkeit = "Auf Luftbild markiert";
	window.em.clearInfoWindows();
	contentString = '<div id="content">'+
			'<h4 id="firstHeading" class="GmInfowindow">' + localStorage.aArtName + '</h4>'+
			'<div id="bodyContent" class="GmInfowindow">'+
			'<p>Art-Gruppe: ' + localStorage.aArtGruppe + '</p>'+
			'<p>Autor: ' + $("#aAutorBE").val() + '</p>'+
			'<p>Datum: ' + $("#zDatumBE").val() + '</p>'+
			'<p>Zeit: ' + $("#zUhrzeitBE").val() + '</p>'+
			'<p>Koordinaten: ' + localStorage.oXKoord + " / " + localStorage.oYKoord + '</p>' +
			'</div>'+
			'</div>';
	infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	window.em.InfoWindowArray.push(infowindow);
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.open(map,marker);
	});
	window.em.speichereKoordinaten(localStorage.BeobId, "Beobachtung");
};

// GoogleMap: alle Marker löschen
// benutzt wo in GoogleMaps Marker gesetzt und verschoben werden
window.em.clearMarkers = function() {
	var i;
	if (window.em.markersArray) {
		for (i in window.em.markersArray) {
			window.em.markersArray[i].setMap(null);
		}
	}
};

// GoogleMap: alle InfoWindows löschen
// benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
window.em.clearInfoWindows = function() {
	var i;
	if (window.em.InfoWindowArray) {
		for (i in window.em.InfoWindowArray) {
			window.em.InfoWindowArray[i].setMap(null);
		}
	}
};

window.em.handleSignupPageshow = function() {
	// sicherstellen, dass nichts vom letzten User übrig bleibt
	window.em.leereAlleVariabeln();
	// Datenverwendung managen: Wenn der User nichts angibt, jaAber setzen
	localStorage.Datenverwendung = "JaAber";
	// wenn der Benutzer vom Login her kommt und bereits Benutzername und Passwort erfasst hat: übernehmen
	if (sessionStorage.prov_email) {
		$("#su_Email").val(sessionStorage.prov_email);
		delete sessionStorage.prov_email;
		if (sessionStorage.prov_passwort) {
			$("#su_Passwort").val(sessionStorage.prov_passwort);
			delete sessionStorage.prov_passwort;
			$("#su_Passwort2").focus();
		} else {
			$("#su_Passwort").focus();
		}
	}
};

window.em.handleSignupPageinit = function() {
	$("#SignupFooter").on("click", "#SubmitButton", function (event) {
		event.preventDefault();
		window.em.handleSignupSubmitButtonClick();
	});

	$("#SignupForm").on("change", "[name='Datenverwendung']", function () {
		localStorage.Datenverwendung = $(this).attr("id");
	});
};

window.em.handleSignupSubmitButtonClick = function() {
	if (window.em.validiereUserSignup()) {
		window.em.erstelleKonto();
	}
};

// kontrollierren, ob die erforderlichen Felder etwas enthalten
// wenn ja wird true retourniert, sonst false
window.em.validiereUserSignup = function() {
	var Email = $("#su_Email").val(),
		Passwort = $("#su_Passwort").val(),
		su_Passwort2 = $("#su_Passwort2").val(),
		Autor = $("#Autor").val();
	if (!Email) {
		window.em.melde("Bitte Email eingeben");
		setTimeout(function() {
			$("#su_Email").focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	} else if (!window.em.validateEmail(Email)) {
		window.em.melde("Bitte gültige Email-Adresse eingeben");
		setTimeout(function() {
			$("#su_Email").focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	} else if (!Passwort) {
		window.em.melde("Bitte Passwort eingeben");
		setTimeout(function() {
			$("#su_Passwort").focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	} else if (!su_Passwort2) {
		window.em.melde("Bitte Passwort bestätigen");
		setTimeout(function() {
			$("#su_Passwort2").focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	} else if (Passwort !== su_Passwort2) {
		window.em.melde("Passwort ist falsch bestätigt");
		setTimeout(function() {
			$("#su_Passwort2").focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	} else if (!Autor) {
		window.em.melde("Bitte Autor eingeben");
		setTimeout(function() {
			$("#Autor").focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	return true;
};

window.em.erstelleKonto = function() {
	// User in _user eintragen
	$.couch.signup({
			name: $('#su_Email').val(),
			Datenverwendung: localStorage.Datenverwendung || "JaAber"
		}, $('#su_Passwort').val(), {
		success : function (r) {
			localStorage.Email = $('#su_Email').val();
			localStorage.Autor = $("#Autor").val();
			window.em.speichereAutorAlsStandardwert();
		},
		error : function () {
			window.em.melde("Fehler: Das Konto wurde nicht erstellt");
		}
	});
};

window.em.handleUserEditPageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}
	window.em.initiiereUserEdit();
};

window.em.handleUserEditPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}

	// zurück-Button steuern
	$("#UserEditHeader").on('click', '#zurückUserEdit', function (event) {
		event.preventDefault();
		window.em.handleUserEditZurückClick();
	});

	// jedes Feld bei Änderung speichern
	$("#UserEditForm").on("change", ".Feld", window.em.handleUserEditFeldChange);

	$("#UserEditForm").on("change", "[name='Datenverwendung']", function () {
		localStorage.Datenverwendung = $(this).attr("id");
	});

	// Autor bei Änderung speichern
	$("#UserEditForm").on("change", "#Autor", window.em.handleUserEditAutorChange);
};

window.em.handleUserEditZurückClick = function() {
	// sicherstellen, dass er immer ein zurück kennt
	if (!localStorage.zurueck) {
		localStorage.zurueck = "BeobListe.html";
	}
	$.mobile.navigate(localStorage.zurueck);
	delete localStorage.zurueck;
};

window.em.handleUserEditFeldChange = function() {
	var Feldname = this.name,
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject(),
		Feldwert = Feldjson[Feldname];
	if (window.em.validiereUserUserEdit()) {
		window.em.speichereUser(Feldname, Feldwert);
	}
};

window.em.handleUserEditAutorChange = function() {
	$db = $.couch.db("evab");
	$db.openDoc("f19cd49bd7b7a150c895041a5d02acb0", {
		success: function (doc) {
			if ($("#Autor").val()) {
				// Wenn Autor erfasst ist, speichern
				// Falls Standardwert noch nicht existiert, 
				// uss zuerst das Objekt geschaffen werden
				if (!doc.Standardwert) {
					doc.Standardwert = {};
				}
				doc.Standardwert[localStorage.Email] = $("#Autor").val();
			} else {
				// Wenn kein Autor erfasst ist, einen allfälligen löschen
				if (doc.Standardwert) {
					delete doc.Standardwert[localStorage.Email];
				}
			}
			$db.saveDoc(doc, {
				success: function () {
					// Feldliste soll neu aufgebaut werden
					window.em.leereStorageFeldListe();
					localStorage.Autor = $("#Autor").val();
				},
				error: function () {
					window.em.melde("Fehler: Änderung am Autor nicht gespeichert");
				}
			});
		},
		error: function () {
			window.em.melde("Fehler: Änderung am Autor nicht gespeichert");
		}
	});
};

// kontrollierren, ob die erforderlichen Felder etwas enthalten
// wenn ja wird true retourniert, sonst false
window.em.validiereUserUserEdit = function() {
	if (!$("#Autor").val()) {
		window.em.melde("Bitte Autor eingeben");
		setTimeout(function() { 
			$('#Autor').focus();
		}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
		return false;
	}
	return true;
};

window.em.speichereUser = function(Feldname, Feldwert) {
	if (localStorage.Datenverwendung) {
		$.couch.userDb(function(db) {
			db.openDoc("org.couchdb.user:" + localStorage.Email, {
				success: function (doc) {
						if (Feldwert) {
							doc[Feldname] = Feldwert;
						} else if (doc[Feldname]) {
							delete doc[Feldname];
						}
					db.saveDoc(doc, {
						error: function () {
							console.log('fehler in function window.em.speichereUser: Datenverwendung nicht gespeichert");');
						}
					});
				},
				error: function () {
					console.log('fehler in function window.em.speichereUser: Datenverwendung nicht gespeichert");');
				}
			});
		});
	} else {
		// es gibt noch keine User-Doc
		// vielleicht hatte der User ein Konto bei ArtenDb erstellt und ist das erste mal in Evab
		console.log("Fehler: Datenverwendung nicht gespeichert");
	}
};

// wird in hArtEdit.html verwendet
window.em.zuArtgruppenliste = function() {
	// Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	//window.em.leereStoragehBeobListe();
	localStorage.Von = "hArtEdit";
	if (window.em.gruppe_merken) {
		// Artgruppenliste auslassen
		// localStorage.aArtGruppe ist schon gesetzt
		$.mobile.navigate("Artenliste.html");
	} else {
		$.mobile.navigate("Artgruppenliste.html");
	}
};

// wird in hArtEdit.html verwendet
window.em.zuArtliste = function() {
	// Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	//window.em.leereStoragehBeobListe();
	localStorage.Von = "hArtEdit";
	$.mobile.navigate("Artenliste.html");
};

// Speichert alle Daten
// wird in hArtEdit.html verwendet
window.em.speichereHArt = function() {
	var that = this;
	// prüfen, ob hBeob als Objekt vorliegt
	if (window.em.hArt) {
		// dieses verwenden
		window.em.speichereHArt_2(that);
	} else {
		// Objekt aud DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.hBeobId, {
			success: function(data) {
				window.em.hArt = data;
				window.em.speichereHArt_2(that);
			},
			error: function() {
				console.log('fehler in function speichereHArt');
				//window.em.melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
			}
		});
	}
};

window.em.speichereHArt_2 = function(that) {
	var Feldname,
		Feldjson,
		Feldwert;
	if (window.em.myTypeOf($(that).attr("aria-valuenow")) !== "string") {
		// slider
		Feldname = $(that).attr("aria-labelledby").slice(0, ($(that).attr("aria-labelledby").length -6));
		Feldwert = $(that).attr("aria-valuenow");
	} else {
		// alle anderen Feldtypen
		Feldname = that.name;
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject();
		Feldwert = Feldjson[Feldname];
	}
	// Werte aus dem Formular aktualisieren
	if (Feldwert) {
		if (window.em.myTypeOf(Feldwert) === "float") {
			window.em.hArt[Feldname] = parseFloat(Feldwert);
		} else if (window.em.myTypeOf(Feldwert) === "integer") {
			window.em.hArt[Feldname] = parseInt(Feldwert);
		} else {
			window.em.hArt[Feldname] = Feldwert;
		}
	} else if (window.em.hArt[Feldname]) {
		delete window.em.hArt[Feldname];
	}
	window.em.hArt.aArtId = localStorage.aArtId;
	window.em.hArt.aArtName = localStorage.aArtName;
	window.em.hArt.aArtGruppe = localStorage.aArtGruppe;
	$db.saveDoc(window.em.hArt, {
		success: function(data) {
			window.em.hArt._rev = data.rev;
			localStorage.hBeobId = data.id;
		},
		error: function() {
			console.log('fehler in function speichereHArt_2');
			//window.em.melde("Fehler: Änderung in " + Feldname + " nicht gespeichert");
		}
	});
};

// Öffnet die vorige oder nächste Art
// vorige der ersten => ArtListe
// nächste der letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
// wird in hArtEdit.html verwendet
window.em.nächsteVorigeArt = function(NächsteOderVorige) {
	// prüfen, ob hBeobListe schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.em.hBeobListe) {
		// hBeobListe liegt als Variable vor
		window.em.nächsteVorigeArt_2(NächsteOderVorige);
	} else {
		// keine Ortliste vorhanden, neu aus DB erstellen
		$db = $.couch.db("evab");
		$db.view('evab/hArtListe?startkey=["' + localStorage.Email + '", "' + localStorage.ZeitId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ZeitId + '" ,{}]&include_docs=true', {
			success: function(data) {
				// Liste bereitstellen, um Datenbankzugriffe zu reduzieren
				window.em.hBeobListe = data;
				window.em.nächsteVorigeArt_2(NächsteOderVorige);
			}
		});
	}
};

window.em.nächsteVorigeArt_2 = function(NächsteOderVorige) {
	var i,
		ArtIdAktuell,
		AnzArt;
	for (i in window.em.hBeobListe.rows) {
		ArtIdAktuell = window.em.hBeobListe.rows[i].doc._id;
		AnzArt = window.em.hBeobListe.rows.length -1;  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (ArtIdAktuell === localStorage.hBeobId) {
			switch (NächsteOderVorige) {
			case "nächste":
				if (parseInt(i) < AnzArt) {
					localStorage.hBeobId = window.em.hBeobListe.rows[parseInt(i)+1].doc._id;
					window.em.leereStoragehBeobEdit("ohneId");
					window.em.initiierehBeobEdit();
					return;
				} else {
					window.em.melde("Das ist die letzte Art");
					return;
				}
				break;
			case "vorige":
				if (parseInt(i) > 0) {
					localStorage.hBeobId = window.em.hBeobListe.rows[parseInt(i)-1].doc._id;
					window.em.leereStoragehBeobEdit("ohneId");
					window.em.initiierehBeobEdit();
					return;
				} else {
					window.em.leereStoragehBeobEdit();
					$.mobile.navigate("hArtListe.html");
					return;
				}
				break;
			}
		}
	}
};

// wird in hArtEdit.html benutzt
// löscht eine Beobachtung
window.em.löscheHBeob = function() {
	if (window.em.hArt) {
		// vorhandenes Objekt nutzen
		window.em.löscheHBeob_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.hBeobId, {
			success: function(data) {
				window.em.hArt = data;
				window.em.löscheHBeob_2();
			},
			error: function() {
				window.em.melde("Fehler: Art nicht gelöscht");
			}
		});
	}
};

window.em.löscheHBeob_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.hArt, {
		success: function(data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.hBeobListe) {
				for (i in window.em.hBeobListe.rows) {
					if (window.em.hBeobListe.rows[i].doc._id === data.id) {
						window.em.hBeobListe.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine Beobliste mehr. Storage löschen
				window.em.leereStoragehBeobListe();
			}
			window.em.leereStoragehBeobEdit();
			$.mobile.navigate("hArtListe.html");
		},
		error: function() {
			window.em.melde("Fehler: Art nicht gelöscht");
		}
	});
};

// prüft neue oder umbenannte Feldnamen
// prüft, ob der neue Feldname schon existiert
// wenn ja: melden, zurückstellen
// wenn nein: speichern
// wird in FeldEdit.html verwendet
window.em.pruefeFeldNamen = function() {
	$db = $.couch.db("evab");
	$db.view('evab/FeldNamen?key="' + localStorage.FeldWert + '"&include_docs=true', {
		success: function(data) {
			var i,
			TempFeld,
			AnzEigeneOderOffizielleFelderMitSelbemNamen = 0;
			// durch alle Felder mit demselben Artnamen laufen
			// prüfen, ob sie eigene oder offielle sind
			if (data.rows) {
				for (i in data.rows) {
					if (typeof i !== "function") {
						if (data.rows[i].doc) {
							TempFeld = data.rows[i].doc;
							// ist es ein eigenes oder ein offizielles?
							if (TempFeld.User === localStorage.Email || TempFeld.User === "ZentrenBdKt") {
								// ja > dieser Name ist nicht zulässig
								AnzEigeneOderOffizielleFelderMitSelbemNamen += 1;
							}
						}
					}
				}
			}
			if (AnzEigeneOderOffizielleFelderMitSelbemNamen === 0) {
				// Feldname ist neu, somit zulässig > speichern
				// und alten FeldNamen aus der Liste der anzuzeigenden Felder entfernen
				$("#SichtbarImModusHierarchisch").val("ja");
				$("#SichtbarImModusHierarchisch_ja").prop("checked",true).checkboxradio("refresh");
				window.em.speichereFeldeigenschaften();
			} else {
				// Feldname kommt bei diesem User schon vor
				// Wert im Feld zurücksetzen
				if (localStorage.AlterFeldWert) {
					$("#FeldName").val(localStorage.AlterFeldWert);
				} else {
					$("#FeldName").val("");
				}
				setTimeout(function() { 
					$('#FeldName').focus(); 
				}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
				window.em.melde("Feldname " + localStorage.FeldWert + "existiert schon<br>Wählen Sie einen anderen");
				delete localStorage.FeldName;
				delete localStorage.FeldWert;
				delete localStorage.AlterFeldWert;
			}
		},
		error: function() {
			// Wert im Feld zurücksetzen
			if (localStorage.AlterFeldWert) {
				$("#FeldName").val(localStorage.AlterFeldWert);
			} else {
				$("#FeldName").val("");
			}
			window.em.melde("Fehler: Änderung in " + localStorage.FeldName + " nicht gespeichert");
			delete localStorage.FeldName;
			delete localStorage.FeldWert;
			delete localStorage.AlterFeldWert;
		}
	});
};

// löscht Felder
// wird in FeldEdit.html verwendet
window.em.loescheFeld = function() {
	if (window.em.Feld) {
		// Objekt nutzen
		window.em.loescheFeld_2();
	} else {
		// Feld aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(window.em.Feld._id, {
			success: function(data) {
				window.em.Feld = data;
				window.em.loescheFeld_2();
			},
			error: function() {
				window.em.melde("Fehler: nicht gelöscht");
			}
		});
	}
};

window.em.loescheFeld_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.Feld, {
		success: function(data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.Feldliste) {
				for (i in window.em.Feldliste.rows) {
					if (window.em.Feldliste.rows[i].doc._id === data.id) {
						window.em.Feldliste.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine Feldliste mehr. Storage löschen
				window.em.leereStorageFeldListe();
			}
			window.em.leereStorageFeldEdit();
			$.mobile.navigate("FeldListe.html");
		},
		error: function() {
			window.em.melde("Fehler: nicht gelöscht");
		}
	});
};

// Öffnet das nächste Feld
// nächstes des letzten => melden
// erwartet die ID des aktuellen Datensatzes
// wird in FeldEdit.html verwendet
window.em.geheZumNächstenFeld = function() {
	if (window.em.Feldliste) {
		// Feldliste aus globaler Variable verwenden - muss nicht geparst werden
		window.em.geheZumNächstenFeld_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/FeldListe?include_docs=true', {
			success: function(data) {
				window.em.Feldliste = data;
				window.em.geheZumNächstenFeld_2();
			}
		});
	}
};

window.em.geheZumNächstenFeld_2 = function() {
	var i,
		y,
		FeldIdAktuell,
		FeldIdNächstes,
		AnzFelder = window.em.Feldliste.rows.length -1,
		AktFeld_i,
		AktFeld_y;
	for (i in window.em.Feldliste.rows) {
		if (typeof i !== "function") {
			// alle Felder durchlaufen, aktuelles eigenes oder offizielles suchen
			AktFeld_i = window.em.Feldliste.rows[i].doc;
			// vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
			if (AktFeld_i.User === localStorage.Email || AktFeld_i.User === "ZentrenBdKt") {
				// Nur eigene und offizielle Felder berücksichtigen
				FeldIdAktuell = window.em.Feldliste.rows[i].doc._id;
				if (FeldIdAktuell === localStorage.FeldId) {
					// das ist das aktuelle Feld
					// von hier aus vorwärts das nächste eigene oder offizielle suchen
					if (parseInt(i) < AnzFelder) {
						// das aktuelle Feld ist nicht das letzte
						for (y = parseInt(i)+1; y <= AnzFelder; y++) {
							// alle verbleibenden Felder durchlaufen, eigenes suchen
							AktFeld_y = window.em.Feldliste.rows[y].doc;
							// Nur eigene Felder und offizielle berücksichtigen
							if (AktFeld_y.User === localStorage.Email || AktFeld_y.User === "ZentrenBdKt") {
								// das ist das nächste eigene Feld > öffnen
								localStorage.FeldId = window.em.Feldliste.rows[parseInt(i)+1].doc._id;
								window.em.leereStorageFeldEdit("ohneId");
								window.em.initiiereFeldEdit();
								return;
							} else {
								if (y === AnzFelder) {
									// am letzten Feld angelangt und es ist kein eigenes
									window.em.melde("Das ist das letzte Feld");
									return;
								}
							}
						}
					} else {
						// das aktuelle Feld ist das letzte
						window.em.melde("Das ist das letzte Feld");
						return;
					}
				}
			}
		}
	}
};

// Öffnet das vorige Feld
// voriges des ersten => FeldListe
// erwartet die ID des aktuellen Datensatzes
// wird in FeldEdit.html verwendet
window.em.geheZumVorigenFeld = function() {
	if (window.em.Feldliste) {
		// Feldliste aus globaler Variable verwenden - muss nicht geparst werden
		window.em.geheZumVorigenFeld_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/FeldListe?include_docs=true', {
			success: function(data) {
				window.em.Feldliste = data;
				window.em.geheZumVorigenFeld_2();
			}
		});
	}
};

window.em.geheZumVorigenFeld_2 = function() {
	var i,
		y,
		FeldIdAktuell,
		FeldIdVoriges,
		AnzFelder = window.em.Feldliste.rows.length -1,
		AktFeld_i,
		AktFeld_y;
	for (i in window.em.Feldliste.rows) {
		if (typeof i !== "function") {
			// alle Felder durchlaufen, aktuelles eigenes oder offizielles suchen
			AktFeld_i = window.em.Feldliste.rows[i].doc;
			// vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
			if (AktFeld_i.User === localStorage.Email || AktFeld_i.User === "ZentrenBdKt") {
				// Nur eigene und offizielle Felder berücksichtigen
				FeldIdAktuell = window.em.Feldliste.rows[i].doc._id;
				if (FeldIdAktuell === localStorage.FeldId) {
					// das ist das aktuelle Feld
					// von hier aus rückwärts das nächste eigene oder offizielle suchen
					if (parseInt(i) > 0) {
						// das aktuelle Feld ist nicht das erste 
						for (y = parseInt(i)-1; y >= 0; y--) {
							// alle vorhergehenden Felder durchlaufen, eigenes suchen
							AktFeld_y = window.em.Feldliste.rows[y].doc;
							// Nur eigene Felder und offizielle berücksichtigen
							if (AktFeld_y.User === localStorage.Email || AktFeld_y.User === "ZentrenBdKt") {
								// das ist das nächstvorherige eigene Feld > öffnen
								FeldIdVoriges = window.em.Feldliste.rows[parseInt(i)-1].doc._id;
								localStorage.FeldId = FeldIdVoriges;
								window.em.leereStorageFeldEdit("ohneId");
								window.em.initiiereFeldEdit();
								return;
							} else {
								if (y === 1) {
									// am ersten Feld angelangt und es ist kein eigenes
									// wir gehen zur Feldliste
									window.em.geheZurueckFE();
									return;
								}
							}
						}
					} else {
						// das aktuelle Feld ist das erste
						// wir gehen zur Feldliste
						window.em.geheZurueckFE();
						return;
					}
				}
			}
		}
	}
};

// empfängt den Feldnamen des gewählten Vorgängers
// ermittelt dessen Reihenfolge
// sucht das nächste eigene Feld und setzt als Reihenfolge den Mittelwert der zwei Reihenfolgen
// Wenn kein weiteres eigenes Feld kommt, wird als Reihenfolge der nächste um mindestens 1 höhere ganzzahlige Wert gesetzt
// wird in FeldEdit.html verwendet
window.em.setzeReihenfolgeMitVorgaenger = function(FeldNameVorgaenger) {
	var viewname = 'evab/FeldListeFeldName?key="' + FeldNameVorgaenger + '"&include_docs=true';
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function(data) {
			var ReihenfolgeVorgaenger = data.rows[0].doc.Reihenfolge;
			$("#Reihenfolge").val(Math.floor(ReihenfolgeVorgaenger + 1));
			window.em.speichereFeldeigenschaften();
		}
	});
};

// speichert, dass ein Wert als Standardwert verwendet werden soll
// wird in FeldEdit.html verwendet
window.em.speichereStandardwert = function() {
	// Prüfen, ob Feld als Objekt vorliegt
	if (window.em.Feld) {
		// dieses verwenden
		window.em.speichereStandardwert_2();
	} else {
		// aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function(doc) {
				window.em.Feld = doc;
				window.em.speichereStandardwert_2();
			},
			error: function() {
				window.em.melde("Fehler: Feld nicht gespeichert");
			}
		});
	}

};

window.em.speichereStandardwert_2 = function() {
	var Feldwert = $("#Standardwert").val();
	// Standardwert managen
	// Standardwert ist Objekt, in dem die Werte für jeden User gespeichert werden
	// darum manuell für diesen User updaten
	if (window.em.Feld.Standardwert) {
		// Standardwert existierte
		if (Feldwert) {
			// neuen Standardwert setzen
			window.em.Feld.Standardwert[localStorage.Email] = Feldwert;
		} else {
			// Standardwert ist leer
			if (window.em.Feld.Standardwert[localStorage.Email]) {
				// bisherigen Standardwert löschen
				delete window.em.Feld.Standardwert[localStorage.Email];
			}
		}
	} else {
		// Bisher gab es noch keinen Standardwert
		if (Feldwert) {
			// Objekt für Standardwert schaffen und neuen Wert setzen
			window.em.Feld.Standardwert = {};
			window.em.Feld.Standardwert[localStorage.Email] = Feldwert;
		}
	}
	$db.saveDoc(window.em.Feld, {
		success: function(data) {
			window.em.Feld._rev = data.rev;
			localStorage.FeldId = data.id;
			// Feldlisten leeren, damit Standardwert sofort verwendet werden kann!
			window.em.leereStorageFeldListe();
		},
		error: function() {
			window.em.melde("Fehler: Feld nicht gespeichert");
		}
	});
};

// speichert Feldeigenschaften
// wird in FeldEdit.html verwendet
window.em.speichereFeldeigenschaften = function() {
	// prüfen, ob das Feld als Objekt vorliegt
	if (window.em.Feld) {
		// bestehendes Objekt verwenden
		window.em.speichereFeldeigenschaften_2();
	} else {
		// Objekt aus der DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function(data) {
				window.em.Feld = data;
				window.em.speichereFeldeigenschaften_2();
			},
			error: function() {
				window.em.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
			}
		});
	}
};

window.em.speichereFeldeigenschaften_2 = function() {
	var Formularfelder = $("#FeldEditForm").serializeObjectNull(),
		idx1,
		idx2;
	// Felder mit Arrays: Kommagetrennte Werte in Arrays verwandeln
	if (Formularfelder.Optionen) {
		Formularfelder.Optionen = Formularfelder.Optionen.split(",");
	}
	// Wenn Beschriftung fehlt und Name existiert: Beschriftung = Name
	if (!Formularfelder.FeldBeschriftung && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
		Formularfelder.FeldBeschriftung = Formularfelder.FeldName;
		// Feldliste soll neu aufgebaut werden
		window.em.leereStorageFeldListe();
	}
	// Es braucht eine Reihenfolge
	if (!Formularfelder.Reihenfolge && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
		Formularfelder.Reihenfolge = 1;
		// Feldliste soll neu aufgebaut werden
		window.em.leereStorageFeldListe();
	}
	// Wenn Feldtyp von textinput weg geändert wurde, sollte InputTyp entfernt werden
	if (Formularfelder.Formularelement !== "textinput" && Formularfelder.InputTyp) {
		delete Formularfelder.InputTyp;
		$("#" + window.em.Feld.InputTyp).prop("checked",false).checkboxradio("refresh");
	}
	// Wenn Feldtyp textinput gesetzt wurde, muss ein InputTyp existieren. Wenn er nicht gesetzt wurde, text setzen
	if (Formularfelder.Formularelement === "textinput" && !Formularfelder.InputTyp) {
		Formularfelder.InputTyp = "text";
		$("#" + window.em.Feld.InputTyp).prop("checked",true).checkboxradio("refresh");
	}
	// Sichtbarkeitseinstellungen: In einem Array werden die User aufgelistet, welche das Feld sehen
	// Es muss geprüft werden, ob der aktuelle User in diesem Array enthalten ist
	// Soll das Feld im Modus einfach sichtbar sein?
	idx1 = window.em.Feld.SichtbarImModusEinfach.indexOf(localStorage.Email);
	if ($("#SichtbarImModusEinfach_ja").prop("checked") === true) {
		// User ergänzen, wenn noch nicht enthalten
		if (idx1 === -1) {
			window.em.Feld.SichtbarImModusEinfach.push(localStorage.Email);
		}
	} else {
		// User entfernen, wenn enthalten
		if (idx1 !== -1) {
			window.em.Feld.SichtbarImModusEinfach.splice(idx1, 1);
		}
	}
	// Soll das Feld im Modus hierarchisch sichtbar sein?
	idx2 = window.em.Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email);
	if ($("#SichtbarImModusHierarchisch_ja").prop("checked") === true) {
		// User ergänzen, wenn noch nicht enthalten
		if (idx2 === -1) {
			window.em.Feld.SichtbarImModusHierarchisch.push(localStorage.Email);
		}
	} else {
		// User entfernen, wenn enthalten
		if (idx2 !== -1) {
			window.em.Feld.SichtbarImModusHierarchisch.splice(idx2, 1);
		}
	}
	// Formularfelder in Dokument schreiben
	// setzt Vorhandensein von Feldnamen voraus!
	for (i in Formularfelder) {
		if (typeof i !== "function") {
			if (Formularfelder[i]) {
				if (i === "Reihenfolge" || i === "SliderMinimum" || i === "SliderMaximum") {
					// Zahl wird sonst in Text verwandelt und falsch sortiert
					window.em.Feld[i] = parseInt(Formularfelder[i]);
				} else {
					window.em.Feld[i] = Formularfelder[i];
				}
			} else {
				// leere Felder entfernen, damit werden auch soeben gelöschte Felder entfernt
				delete window.em.Feld[i];
			}
		}
	}
	$db.saveDoc(window.em.Feld, {
		success: function(data) {
			// rev aktualisieren
			window.em.Feld._rev = data.rev;
			localStorage.FeldId = data.id;
			// Feldliste soll neu aufbauen
			window.em.leereStorageFeldListe();
		},
		error: function() {
			window.em.melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
		}
	});
	delete localStorage.FeldName;
	delete localStorage.FeldWert;
	delete localStorage.AlterFeldWert;
};

// wird in BeobListe.html verwendet
// eigene Funktion, weil auch die Beobliste darauf verweist, wenn noch keine Art erfasst wurde
window.em.erstelleNeueBeob_1_Artgruppenliste = function() {
	// Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	window.em.leereStorageBeobListe();
	localStorage.Status = "neu";
	localStorage.Von = "BeobListe";
	delete localStorage.aArtGruppe;	// verhindern, dass eine Artgruppe übergeben wird
	$.mobile.navigate("Artgruppenliste.html");
};


// wird in BeobEdit.html benutzt
// Öffnet die vorige oder nächste Beobachtung
// vorige der ersten => BeobListe
// nächste der letzten => melden
// erwartet ob nächster oder voriger gesucht wird
window.em.nächsteVorigeBeob = function(NächsteOderVorige) {
	// prüfen, ob BeobListe schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.em.BeobListe) {
		// globale Variable BeobListe existiert noch
		window.em.nächsteVorigeBeob_2(NächsteOderVorige);
	} else {
		// keine Projektliste übergeben
		// neu aus DB erstellen
		$db = $.couch.db("evab");
		$db.view('evab/BeobListe?startkey=["' + localStorage.Email + '",{}]&endkey=["' + localStorage.Email + '"]&descending=true&include_docs=true', {
			success: function(data) {
				// Globale Variable erstellen, damit Abfrage ab dem zweiten Mal nicht mehr nötig ist
				// bei neuen/Löschen von Beobachtungen wird BeobListe wieder auf undefined gesetzt
				window.em.BeobListe = data;
				window.em.nächsteVorigeBeob_2(NächsteOderVorige);
			}
		});
	}
};

window.em.nächsteVorigeBeob_2 = function(NächsteOderVorige) {
	var i,
		BeobIdAktuell,
		AnzBeob;
	for (i in window.em.BeobListe.rows) {
		BeobIdAktuell = window.em.BeobListe.rows[i].doc._id;
		AnzBeob = window.em.BeobListe.rows.length -1;		// vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (BeobIdAktuell === localStorage.BeobId) {
			switch (NächsteOderVorige) {
			case "nächste":
				if (parseInt(i) < AnzBeob) {
					localStorage.BeobId = window.em.BeobListe.rows[parseInt(i)+1].doc._id;
					window.em.leereStorageBeobEdit("ohneId");
					window.em.initiiereBeobEdit();
					return;
				} else {
					window.em.melde("Das ist die letzte Beobachtung");
					return;
				}
				break;
			case "vorige":
				if (parseInt(i) > 0) {
					localStorage.BeobId = window.em.BeobListe.rows[parseInt(i)-1].doc._id;
					window.em.leereStorageBeobEdit("ohneId");
					window.em.initiiereBeobEdit();
					return;
				} else {
					window.em.leereStorageBeobEdit();
					$.mobile.navigate("BeobListe.html");
					return;
				}
				break;
			}
		}
	}
};

// wird in BeobEdit.html benutzt
// löscht eine Beobachtung
window.em.löscheBeob = function() {
	if (window.em.Beobachtung) {
		// vorhandenes Objekt nutzen
		window.em.löscheBeob_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.BeobId, {
			success: function(data) {
				window.em.Beobachtung = data;
				window.em.löscheBeob_2();
			},
			error: function() {
				window.em.melde("Fehler: Beobachtung nicht gelöscht");
			}
		});
	}
};

window.em.löscheBeob_2 = function() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.em.Beobachtung, {
		success: function(data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.em.BeobListe) {
				for (var i in window.em.BeobListe.rows) {
					if (window.em.BeobListe.rows[i].doc._id === data.id) {
						window.em.BeobListe.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine BeobListe mehr. Storage löschen
				window.em.leereStorageBeobListe;
			}
			window.em.leereStorageBeobEdit();
			$.mobile.navigate("BeobListe.html");
		},
		error: function() {
			window.em.melde("Fehler: Beobachtung nicht gelöscht");
		}
	});
};

// Speichert alle Daten in BeobEdit.html
window.em.speichereBeob = function(that) {
	// eventhandler übergeben this nicht in der Klammer
	var _this = that || this;
	// prüfen, ob Beob als Objekt vorliegt
	if (window.em.Beobachtung) {
		// ja: dieses Objekt verwenden
		window.em.speichereBeob_2(_this);
	} else {
		// nein: Beob aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.BeobId, {
			success: function(data) {
				window.em.Beobachtung = data;
				window.em.speichereBeob_2(_this);
			},
			error: function() {
				console.log('fehler in function speichereBeob_2(_this)');
			}
		});
	}
};

window.em.speichereBeob_2 = function(that) {
	var Feldname,
		Feldjson,
		Feldwert;
	if (window.em.myTypeOf($(that).attr("aria-valuenow")) !== "string") {
		// slider
		Feldname = $(that).attr("aria-labelledby").slice(0, ($(that).attr("aria-labelledby").length -6));
		Feldwert = $(that).attr("aria-valuenow");
	} else {
		// alle anderen Feldtypen
		Feldname = that.name;
		// nötig, damit Arrays richtig kommen
		Feldjson = $("[name='" + Feldname + "']").serializeObject();
		Feldwert = Feldjson[Feldname];
	}
	// Werte aus dem Formular aktualisieren
	if (Feldwert) {
		if (window.em.myTypeOf(Feldwert) === "float") {
			window.em.Beobachtung[Feldname] = parseFloat(Feldwert);
		} else if (window.em.myTypeOf(Feldwert) === "integer") {
			window.em.Beobachtung[Feldname] = parseInt(Feldwert);
		} else {
			window.em.Beobachtung[Feldname] = Feldwert;
		}
	} else if (window.em.Beobachtung[Feldname]) {
		delete window.em.Beobachtung[Feldname]
	}
	window.em.Beobachtung.aArtGruppe = localStorage.aArtGruppe;
	window.em.Beobachtung.aArtName = localStorage.aArtName;
	window.em.Beobachtung.aArtId = localStorage.aArtId;
	// alles speichern
	$db.saveDoc(window.em.Beobachtung, {
		success: function(data) {
			window.em.Beobachtung._rev = data.rev;
		},
		error: function(data) {
			console.log('fehler in function speichereBeob_2(that)');
		}
	});
};

window.em.meldeNeuAn = function() {
	localStorage.UserStatus = "neu";
	$.mobile.changePage("index.html");
	// Felder zurücksetzen, sonst ist hier noch die alte Anmeldung drin
	$("#Email").val("");
	$("#Passwort").val("");
};





window.em.handleArtenImportierenPageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}
	window.em.initiiereArtenImportieren();
};

window.em.handleArtenImportierenPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}

	// zurück-Button steuern
	$("#ArtenImportierenHeader").on('click', '#zurückArtenImportieren', function (event) {
		event.preventDefault();
		window.em.handleArtenImportierenZurückClick();
	});

	$("#ArtenImportierenContent").on('click', '#ai_arten_ohne_artgruppe_entfernen', window.em.entferneArtenOhneArtgruppe);

	$("#ArtenImportierenContent").on('click', '#ai_gemeinsam_anzarten_aktualisieren', window.em.aktualisiereAnzahlArtenVonArten);

	$("#ArtenImportierenContent").on('click', '#ai_fehlen_in_evab_importieren', window.em.importiereFehlendeArten);

	$("#ArtenImportierenContent").on('click', '#ai_fehlen_in_artendb_exportieren', window.em.exportiereBeobVonInArtendbFehlendenArten);
};

window.em.importiereFehlendeArten = function() {
	if (window.em.arten_fehlen_in_evab.length === 0) {
		window.em.melde("Aktion abgebrochen: Es gibt in arteigenschaften.ch keine Arten, die in artbeobachtungen.ch fehlen");
		return;
	}
	$db = $.couch.db("evab");
	_.each(window.em.arten_fehlen_in_evab, function(art) {
		$db.saveDoc(art, {
			success: function() {
				//window.em.initiiereArtenImportieren();
			},
			error: function() {
				window.em.melde("Fehler: Art " + art.Artname + " nicht importiert");
			}
		});
	});
};

window.em.aktualisiereAnzahlArtenVonArten = function() {
	window.em.melde("Diese Funktion ist noch nicht implementiert");
};

window.em.exportiereBeobVonInArtendbFehlendenArten = function() {
	window.em.melde("Diese Funktion ist noch nicht implementiert");
};

// PROVISORISCH, NACH BENUTZUNG ENTFERNEN
window.em.entferneArtenOhneArtgruppe = function() {
	$db = $.couch.db("evab");
	$db.view('evab/ArtenOhneArtgruppe?include_docs=true', {
		success: function(data) {
			if (data.rows.length === 0) {
				window.em.melde("Es gibt keine Arten ohne Artgruppe");
				return;
			}
			var arten_ohne_artgruppe = _.map(data.rows, function(objekt) {
					return objekt.doc;
				});
			_.each(arten_ohne_artgruppe, function(art) {
				$db.removeDoc(art, {
					error: function() {
						console.log("Fehler: " + art.Artname + " nicht gelöscht");
					}
				});
			});
		}
	});
};

window.em.handleArtenImportierenZurückClick = function() {
	// sicherstellen, dass er immer ein zurück kennt
	if (!localStorage.zurueck) {
		localStorage.zurueck = "BeobListe";
	}
	$.mobile.navigate(localStorage.zurueck + ".html");
	delete localStorage.zurueck;
};

window.em.initiiereArtenImportieren = function() {
	// aktuelle aus evm holen
	$.ajax({
		type: "GET",
		url: "http://arteigenschaften.ch/_list/export_evm_arten/evab_arten?include_docs=true",
		contentType: "application/json"
	})
	.done(function(data) {
		data = JSON.parse(data);
		window.em.arten_artendb = data.docs;
		var arten_artendb_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_artendb);
		// Tabelle aufbauen
		$("#ai_artendb").html(window.em.erstelleTabelle(arten_artendb_reduziert, "reflow", "ai_artendb_tabelle"));
		// initialisieren
		$("#ai_artendb_tabelle").table();
		// Anzahl anzeigen
		$("#ai_artendb_titel").html("Erste 50 von " + window.em.arten_artendb.length + " Arten aus arteigenschaften.ch:");

		// eigene Arten holen
		console.log("hole Arten aus evab");
		$db = $.couch.db("evab");
		$db.view('evab/Artliste?include_docs=true', {
			success: function(data) {
				// Arten in evab ermitteln
				console.log("verarbeite Arten aus evab");
				window.em.arten_evab = _.map(data.rows, function(objekt) {
					return objekt.doc;
				});
				var arten_evab_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_evab);
				// Tabelle aufbauen
				$("#ai_evab").html(window.em.erstelleTabelle(arten_evab_reduziert, "reflow", "ai_evab_tabelle"));
				// initialisieren
				$("#ai_evab_tabelle").table();
				// Anzahl anzeigen
				$("#ai_evab_titel").html("Erste 50 von " + window.em.arten_evab.length + " Arten aus artbeobachtungen.ch:");

				// gemeinsame Arten mit unterschiedlichem Namen oder Artgruppe ermitteln
				console.log("suche Arten mit Unterschieden");
				window.em.arten_gemeinsam_unterschiedlich = _.filter(window.em.arten_artendb, function(art_artendb) {
					for (var i in window.em.arten_evab) {
						var art_evab = window.em.arten_evab[i];
						if (art_evab._id === art_artendb._id && (art_evab.ArtGruppe !== art_artendb.ArtGruppe || art_evab.Artname !== art_artendb.Artname)) {
							return true;
						}
					}
				});
				if (window.em.arten_gemeinsam_unterschiedlich.length > 0) {
					var arten_gemeinsam_unterschiedlich_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_gemeinsam_unterschiedlich);
					// Tabelle aufbauen
					$("#ai_arten_gemeinsam_unterschiedlich").html(window.em.erstelleTabelle(arten_gemeinsam_unterschiedlich_reduziert, "reflow", "ai_arten_gemeinsam_unterschiedlich_tabelle"));
					// initialisieren
					$("#ai_arten_gemeinsam_unterschiedlich_tabelle").table();
					// Schaltfläche einschalten
					$("#ai_arten_gemeinsam_unterschiedlich_aktualisieren").button("enable");
				} else {
					// p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
					$("#ai_arten_gemeinsam_unterschiedlich").html("<p>Erfolg:<br>Alle gemeinsamen Arten haben denselben Namen und dieselbe Artgruppe!</p>");
					$("#ai_arten_gemeinsam_unterschiedlich_aktualisieren").button("disable");
				}
				// Anzahl anzeigen
				$("#ai_arten_gemeinsam_unterschiedlich_titel").html("Erste 50 von " + window.em.arten_gemeinsam_unterschiedlich.length + " gemeinsamen Arten<br>mit unterschiedlicher Artgruppe oder Artname:");

				// Arten aus artendb, die in evab fehlen
				console.log("suche Arten, die in evab fehlen");
				window.em.arten_fehlen_in_evab = _.reject(window.em.arten_artendb, function(art_artendb) {
					for (var i in window.em.arten_evab) {
						if (window.em.arten_evab[i]._id === art_artendb._id) {
							return true;
						}
					}
				});
				if (window.em.arten_fehlen_in_evab.length > 0) {
					var arten_fehlen_in_evab_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_fehlen_in_evab);
					// Tabelle aufbauen
					$("#ai_fehlen_in_evab").html(window.em.erstelleTabelle(arten_fehlen_in_evab_reduziert, "reflow", "ai_fehlen_in_evab_tabelle"));
					// initialisieren
					$("#ai_fehlen_in_evab_tabelle").table();
					// Schaltfläche einschalten
					$("#ai_fehlen_in_evab_importieren").button("enable");
				} else {
					// p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
					$("#ai_fehlen_in_evab").html("<p>Erfolg:<br>artbeobachtungen.ch enthält schon alle Arten aus arteigenschaften.ch!</p>");
					$("#ai_fehlen_in_evab_importieren").button("disable");
				}
				// Anzahl anzeigen
				$("#ai_fehlen_in_evab_titel").html("Erste 50 von " + window.em.arten_fehlen_in_evab.length + " Arten aus arteigenschaften.ch, die in artbeobachtungen.ch fehlen:");

				// Arten aus evab, die in artendb fehlen
				console.log("suche Arten, die in artendb fehlen");
				window.em.arten_fehlen_in_artendb = _.reject(window.em.arten_evab, function(art_evab) {
					// eigene und unbekannte Arten ignorieren
					if (art_evab.Artname.substring(0, 6) === "Eigene" || art_evab.Artname.substring(0, 9) === "Unbekannt") {
						return true;
					}
					for (var i in window.em.arten_artendb) {
						if (window.em.arten_artendb[i]._id === art_evab._id) {
							return true;
						}
					}
				});
				if (window.em.arten_fehlen_in_artendb.length > 0) {
					var arten_fehlen_in_artendb_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_fehlen_in_artendb);
					// Tabelle aufbauen
					$("#ai_fehlen_in_artendb").html(window.em.erstelleTabelle(arten_fehlen_in_artendb_reduziert, "reflow", "ai_fehlen_in_artendb_tabelle"));
					// initialisieren
					$("#ai_fehlen_in_artendb_tabelle").table();
					// Schaltfläche einschalten
					$("#ai_fehlen_in_artendb_exportieren").button("enable");
					$("#ai_fehlen_in_artendb_exportieren_hinweis").show();
				} else {
					// p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
					$("#ai_fehlen_in_artendb").html("<p>Erfolg:<br>artbeobachtungen.ch enthält keine Arten, die in arteigenschaften.ch nicht vorkommen!</p>");
					$("#ai_fehlen_in_artendb_exportieren").button("disable");
					$("#ai_fehlen_in_artendb_exportieren_hinweis").hide();
				}
				// Anzahl anzeigen
				$("#ai_fehlen_in_artendb_titel").html("Erste 50 von " + window.em.arten_fehlen_in_artendb.length + " Arten aus artbeobachtungen.ch, die in arteigenschaften.ch fehlen:");
			}
		});
	})
	.fail(function() {
		console.log("Fehler: keine Arten erhalten");
	});
};

window.em.reduziereArtenfelderAufArtgruppeUndName = function(arten) {
	// da es soviele Arten gibt, nur die ersten 50 verarbeiten und anzeigen
	var erste_fünfzig_arten = _.first(arten, 50);
	return _.map(erste_fünfzig_arten, function(art) {
		var art_return = {};
		art_return.Artgruppe = art.ArtGruppe;
		art_return.Artname = art.Artname;
		return art_return;
	});
};

window.em.handleArtengruppenImportierenPageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}
	window.em.initiiereArtengruppenImportieren();
};

window.em.handleArtengruppenImportierenPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}

	// zurück-Button steuern
	$("#ArtengruppenImportierenHeader").on('click', '#zurückArtengruppenImportieren', function (event) {
		event.preventDefault();
		window.em.handleArtengruppenImportierenZurückClick();
	});

	$(document).on('click', '#agi_gemeinsam_anzarten_aktualisieren', window.em.aktualisiereAnzahlArtenVonArtengruppen);

	$("#ArtengruppenImportierenContent").on('click', '#agi_fehlen_in_evab_importieren', window.em.importiereFehlendeArtengruppen);

	$("#ArtengruppenImportierenContent").on('click', '#agi_fehlen_in_artendb_exportieren', window.em.exportiereBeobVonInArtendbFehlendenArtengruppen);
};

window.em.exportiereBeobVonInArtendbFehlendenArtengruppen = function() {
	console.log("window.em.exportiereBeobVonInArtendbFehlendenArtengruppen");
};

window.em.importiereFehlendeArtengruppen = function() {
	console.log("window.em.importiereFehlendeArtengruppen");
	if (window.em.artgruppen_fehlen_in_evab.length === 0) {
		window.em.melde("Aktion abgebrochen: Es gibt in arteigenschaften.ch keine Artengruppen, die in artbeobachtungen.ch fehlen");
		return;
	}
	$db = $.couch.db("evab");
	_.each(window.em.artgruppen_fehlen_in_evab, function(artgruppe) {
		$db.saveDoc(artgruppe, {
			success: function() {
				window.em.initiiereArtengruppenImportieren();
			},
			error: function() {
				window.em.melde("Fehler: Artgruppe " + artgruppe_artendb.ArtGruppe + " nicht aktualisiert");
			}
		});
	});
};

window.em.aktualisiereAnzahlArtenVonArtengruppen = function() {
	if (window.em.artgruppen_gemeinsam_anzarten.length === 0) {
		window.em.melde("Aktion abgebrochen: Es gibt keine gemeinsamen Artengruppen mit unterschiedlicher Anzahl Arten");
		return;
	}
	$db = $.couch.db("evab");
	_.each(window.em.artgruppen_gemeinsam_anzarten, function(artgruppe_artendb) {
		$db.openDoc(artgruppe_artendb._id, {
			success: function(artgruppe_evab) {
				artgruppe_evab.AnzArten = artgruppe_artendb.AnzArten;
				$db.saveDoc(artgruppe_evab, {
					success: function() {
						window.em.initiiereArtengruppenImportieren();
					},
					error: function() {
						window.em.melde("Fehler: Artgruppe " + artgruppe_artendb.ArtGruppe + " nicht aktualisiert");
					}
				});
			},
			error: function() {
				window.em.melde("Fehler: Artgruppe " + artgruppe_artendb.ArtGruppe + " nicht aktualisiert");
			}
		});
				
	});
};

window.em.handleArtengruppenImportierenZurückClick = function() {
	// sicherstellen, dass er immer ein zurück kennt
	if (!localStorage.zurueck) {
		localStorage.zurueck = "BeobListe";
	}
	$.mobile.navigate(localStorage.zurueck + ".html");
	delete localStorage.zurueck;
};

window.em.öffneArtengruppenImportieren = function() {
	localStorage.zurueck = $("body").pagecontainer("getActivePage").attr("id");
	$.mobile.navigate("ArtengruppenImportieren.html");
}

window.em.öffneAdmin = function() {
	localStorage.zurueck = $("body").pagecontainer("getActivePage").attr("id");
	$.mobile.navigate("admin.html");
}

window.em.handleAdminPageshow = function() {
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}
	//window.em.initiiereAdmin();
};

window.em.handleAdminPageinit = function() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		window.em.leereAlleVariabeln();
		$.mobile.navigate("index.html");
	}

	// zurück-Button steuern
	$("#AdminHeader").on('click', '#zurückAdmin', function (event) {
		event.preventDefault();
		window.em.handleAdminZurückClick();
	});

	$("#AdminContent").on('click', '#admin_beob_eines_users_entfernen', window.em.entferneDokumenteEinesUsers);

	$("#AdminContent").on('click', '#admin_user_entfernen', window.em.entferneUser);
};

window.em.handleAdminZurückClick = function() {
	// sicherstellen, dass er immer ein zurück kennt
	if (!localStorage.zurueck) {
		localStorage.zurueck = "BeobListe";
	}
	$.mobile.navigate(localStorage.zurueck + ".html");
	delete localStorage.zurueck;
};

window.em.entferneDokumenteEinesUsers = function() {
	var user = $("#admin_beob_eines_users_entfernen_user").val();
	if (!user) {
		window.em.melde("Bitte User eingeben");
		return;
	}
	$db = $.couch.db("evab");
	$db.view('evab/UserDocs?startkey=["' + user + '",{}]&endkey=["' + user + '"]&descending=true&include_docs=true', {
		success: function(data) {
			var dokumenten = data.rows,
				fehler = 0,
				gelöscht = 0;
			$("#admin_user_entfernen_rückmeldung").html("Dokumente: Gelöscht: " + gelöscht + ", Fehler: " + fehler + " von " + dokumenten.length);
			_.each(dokumenten, function (doc) {
				$db.removeDoc(doc.doc, {
					success: function() {
						gelöscht ++;
						$("#admin_user_entfernen_rückmeldung").html("Dokumente: Gelöscht: " + gelöscht + ", Fehler: " + fehler + " von " + dokumenten.length);
					},
					error: function() {
						fehler ++;
						$("#admin_user_entfernen_rückmeldung").html("Dokumente: Gelöscht: " + gelöscht + ", Fehler: " + fehler + " von " + dokumenten.length);

					}
				});
			});

			// Bezug zu Usern aus Feldern entfernen (username in Arrays)
			$db = $.couch.db("evab");
			$db.view('evab/UserFelderMitDaten?startkey=["' + user + '",{}]&endkey=["' + user + '"]&descending=true&include_docs=true', {
				success: function(data) {
					var felder = data.rows,
						indexpos_einfach,
						indexpos_hierarchisch,
						fehler = 0,
						gelöscht = 0;

					$("#admin_user_entfernen_rückmeldung2").html("Einstellungen in Feldern: Gelöscht: " + gelöscht + ", Fehler: " + fehler + " von " + felder.length);

					_.each(felder, function(feld) {
						feld = feld.doc;

						// User aus SichtbarImModusEinfach entfernen
						if (feld.SichtbarImModusEinfach && feld.SichtbarImModusEinfach.length > 0) {
							indexpos_einfach = feld.SichtbarImModusEinfach.indexOf(user);
							if (indexpos_einfach > -1) {
								feld.SichtbarImModusEinfach.splice(indexpos_einfach, 1);
							}
						}

						// User aus SichtbarImModusHierarchisch entfernen
						if (feld.SichtbarImModusHierarchisch && feld.SichtbarImModusHierarchisch.length > 0) {
							indexpos_hierarchisch = feld.SichtbarImModusHierarchisch.indexOf(user);
							if (indexpos_hierarchisch > -1) {
								feld.SichtbarImModusHierarchisch.splice(indexpos_hierarchisch, 1);
							}
						}

						// User aus Standardwert entfernen
						if (feld.Standardwert && feld.Standardwert[user]) {
							delete feld.Standardwert[user];
						}

						$db.saveDoc(feld, {
							success: function() {
								gelöscht ++;
								$("#admin_user_entfernen_rückmeldung2").html("Einstellungen in Feldern: Gelöscht: " + gelöscht + ", Fehler: " + fehler + " von " + felder.length);
							},
							error: function() {
								fehler ++;
								$("#admin_user_entfernen_rückmeldung2").html("Einstellungen in Feldern: Gelöscht: " + gelöscht + ", Fehler: " + fehler + " von " + felder.length);
							}
						});
					});
				},
				error: function() {
					window.em.melde("Die Felder konnten nicht abgerufen werden");
				}
			});

		},
		error: function() {
			window.em.melde("Die Dokumente des Benutzers konnten nicht abgerufen werden");
		}
	});
};

window.em.entferneUser = function() {
	var user = $("#admin_user_entfernen_user").val();
	if (!user) {
		window.em.melde("Bitte User eingeben");
		return;
	}
	// TODO: Kontrollieren, ob der User noch Dokumente hat
	$db = $.couch.db("evab");
	$db.view('evab/UserDocs?startkey=["' + user + '",{}]&endkey=["' + user + '"]&descending=true&include_docs=true', {
		success: function(data) {
			if (data.rows.length > 0) {
				window.em.melde("Dieser User hat noch Dokumente. Bitte diese zuerst entfernen");
				return;
			}
			// kontrollieren, ob der User noch Feldeinstellungen hat
			$db = $.couch.db("evab");
			$db.view('evab/UserFelderMitDaten?startkey=["' + user + '",{}]&endkey=["' + user + '"]&descending=true&include_docs=true', {
				success: function(data) {
					if (data.rows.length > 0) {
						window.em.melde("Dieser User hat noch Einstellungen in Feldern. Bitte diese zuerst entfernen");
						return;
					}
					// der Benutzer hat keine Daten mehr. Benutzer entfernen
					$.couch.userDb(function(db) {
						db.openDoc("org.couchdb.user:" + user, {
							success: function (doc) {
								db.removeDoc(doc, {
									success: function() {
										window.em.melde("Benutzer " + user + " wurde entfernt");
									},
									error: function() {
										window.em.melde("Fehler: Benutzer " + user + " wurde nicht entfernt");
									}
								});
							},
							error: function () {
								window.em.melde('Fehler: User wurde nicht gefunden');
							}
						});
					});
				},
				error: function() {
					window.em.melde("Die Felder konnten nicht abgerufen werden");
				}
			});
		},
		error: function() {
			window.em.melde("Fehler: Es konnte nicht kontrolliert werden, ob der Benutzer noch Beobachtungen hat");
		}
	});	
};

window.em.initiiereArtengruppenImportieren = function() {
	// aktuelle aus evm holen
	$.ajax({
		type: "GET",
		url: "http://arteigenschaften.ch/_list/export_evm_artgruppen/artgruppen?group_level=1",
		contentType: "application/json"
	})
	.done(function(data) {
		data = JSON.parse(data);
		window.em.artgruppen_artendb = data.docs;
		var artgruppen_artendb_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_artendb);
		// Tabelle aufbauen
		$("#agi_artendb").html(window.em.erstelleTabelle(artgruppen_artendb_reduziert, "reflow", "agi_artendb_tabelle"));
		// initialisieren
		$("#agi_artendb_tabelle").table();
		// Anzahl anzeigen
		$("#agi_artendb_titel").html("In arteigenschaften.ch<br>vorhandene Artengruppen (" + artgruppen_artendb_reduziert.length + "):");
		// eigene Artgruppen holen
		$db = $.couch.db("evab");
		$db.view('evab/Artgruppen?include_docs=true', {
			success: function(data) {
				// Artgruppen in evab ermitteln
				window.em.artgruppen_evab = _.map(data.rows, function(objekt) {
					return objekt.doc;
				});
				var artgruppen_evab_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_evab);
				// Tabelle aufbauen
				$("#agi_evab").html(window.em.erstelleTabelle(artgruppen_evab_reduziert, "reflow", "agi_evab_tabelle"));
				// initialisieren
				$("#agi_evab_tabelle").table();
				// Anzahl anzeigen
				$("#agi_evab_titel").html("In artbeobachtungen.ch<br>vorhandene Artengruppen (" + artgruppen_evab_reduziert.length + "):");

				// gemeinsame Artgruppen ermitteln
				window.em.artgruppen_gemeinsam = _.filter(window.em.artgruppen_evab, function(artgruppe_evab) {
					return _.filter(window.em.artgruppen_artendb, _.matches(artgruppe_evab));
				});
				if (window.em.artgruppen_gemeinsam.length > 0) {
					var artgruppen_gemeinsam_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_gemeinsam);
					// Tabelle aufbauen
					$("#agi_gemeinsam").html(window.em.erstelleTabelle(artgruppen_gemeinsam_reduziert, "reflow", "agi_gemeinsam_tabelle"));
					// initialisieren
					$("#agi_gemeinsam_tabelle").table();
				} else {
					$("#agi_gemeinsam").html("<p>Oops: Es gibt keine gemeinsamen Artgruppen!</p>");
				}
				// Anzahl anzeigen
				$("#agi_gemeinsam_titel").html("Gemeinsame<br>Artengruppen (" + window.em.artgruppen_gemeinsam.length + "):");

				// gemeinsame Artengruppen mit unterschiedlicher Anzahl Arten ermitteln
				window.em.artgruppen_gemeinsam_anzarten = _.filter(window.em.artgruppen_artendb, function(artgruppe_artendb) {
					for (var i in window.em.artgruppen_evab) {
						if (window.em.artgruppen_evab[i].ArtGruppe === artgruppe_artendb.ArtGruppe && window.em.artgruppen_evab[i].AnzArten !== artgruppe_artendb.AnzArten) {
							return true;
						}
					}
				});
				var artgruppen_gemeinsam_anzarten_reduziert = _.map(window.em.artgruppen_gemeinsam_anzarten, function(artgruppe) {
					var artgruppe_return = {};
					artgruppe_return.Artgruppe = artgruppe.ArtGruppe;
					return artgruppe_return;
				});
				if (window.em.artgruppen_gemeinsam_anzarten.length > 0) {
					// Tabelle aufbauen
					$("#agi_gemeinsam_anzarten").html(window.em.erstelleTabelle(artgruppen_gemeinsam_anzarten_reduziert, "reflow", "agi_gemeinsam_anzarten_tabelle"));
					// initialisieren
					$("#agi_gemeinsam_anzarten_tabelle").table();
					// Schaltfläche einschalten
					$("#agi_gemeinsam_anzarten_aktualisieren").button("enable");
				} else {
					// p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
					$("#agi_gemeinsam_anzarten").html("<p>Erfolg:<br>Alle gemeinsamen Artengruppen weisen dieselbe Anzahl Arten aus!</p>");
					$("#agi_gemeinsam_anzarten_aktualisieren").button("disable");
				}
				// Anzahl anzeigen
				$("#agi_gemeinsam_anzarten_titel").html("Gemeinsame Artengruppen<br>mit unterschiedlicher Anz. Arten (" + window.em.artgruppen_gemeinsam_anzarten.length + "):");

				// Artengruppen aus artendb, die in evab fehlen
				window.em.artgruppen_fehlen_in_evab = _.reject(window.em.artgruppen_artendb, function(artgruppe_artendb) {
					for (var i in window.em.artgruppen_evab) {
						if (window.em.artgruppen_evab[i].ArtGruppe === artgruppe_artendb.ArtGruppe) {
							return true;
						}
					}
				});
				if (window.em.artgruppen_fehlen_in_evab.length > 0) {
					var artgruppen_fehlen_in_evab_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_fehlen_in_evab);
					// Tabelle aufbauen
					$("#agi_fehlen_in_evab").html(window.em.erstelleTabelle(artgruppen_fehlen_in_evab_reduziert, "reflow", "agi_fehlen_in_evab_tabelle"));
					// initialisieren
					$("#agi_fehlen_in_evab_tabelle").table();
					// Schaltfläche einschalten
					$("#agi_fehlen_in_evab_importieren").button("enable");
				} else {
					// p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
					$("#agi_fehlen_in_evab").html("<p>Erfolg:<br>artbeobachtungen.ch enthält schon alle Artgruppen aus arteigenschaften.ch!</p>");
					$("#agi_fehlen_in_evab_importieren").button("disable");
				}
				// Anzahl anzeigen
				$("#agi_fehlen_in_evab_titel").html("Artengruppen aus arteigenschaften.ch,<br>die in artbeobachtungen.ch fehlen (" + window.em.artgruppen_fehlen_in_evab.length + "):");

				// Artengruppen aus evab, die in artendb fehlen
				window.em.artgruppen_fehlen_in_artendb = _.reject(window.em.artgruppen_evab, function(artgruppe_evab) {
					for (var i in window.em.artgruppen_artendb) {
						if (window.em.artgruppen_artendb[i].ArtGruppe === artgruppe_evab.ArtGruppe) {
							return true;
						}
					}
				});
				if (window.em.artgruppen_fehlen_in_artendb.length > 0) {
					var artgruppen_fehlen_in_artendb_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_fehlen_in_artendb);
					// Tabelle aufbauen
					$("#agi_fehlen_in_artendb").html(window.em.erstelleTabelle(artgruppen_fehlen_in_artendb_reduziert, "reflow", "agi_fehlen_in_artendb_tabelle"));
					// initialisieren
					$("#agi_fehlen_in_artendb_tabelle").table();
					// Schaltfläche einschalten
					$("#agi_fehlen_in_artendb_exportieren").button("enable");
					$("#agi_fehlen_in_artendb_exportieren_hinweis").show();
				} else {
					// p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
					$("#agi_fehlen_in_artendb").html("<p>Erfolg:<br>artbeobachtungen.ch enthält keine Artgruppen, die in arteigenschaften.ch nicht vorkommen!</p>");
					$("#agi_fehlen_in_artendb_exportieren").button("disable");
					$("#agi_fehlen_in_artendb_exportieren_hinweis").hide();
				}
				// Anzahl anzeigen
				$("#agi_fehlen_in_artendb_titel").html("Artengruppen aus artbeobachtungen.ch,<br>die in arteigenschaften.ch fehlen (" + window.em.artgruppen_fehlen_in_artendb.length + "):");
			}
		});
	})
	.fail(function() {
		console.log("Fehler: keine Artgruppen erhalten");
	});
};

window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl = function(artgruppen) {
	return _.map(artgruppen, function(artgruppe) {
		var artgruppe_return = {};
		artgruppe_return.Artgruppe = artgruppe.ArtGruppe;
		artgruppe_return["Anz. Arten"] = artgruppe.AnzArten;
		return artgruppe_return;
	})
};

// baut Tabellen auf
// objekte: Array von Objekten, welche die darzustellenden Felder enthalten
// datamode: gemäss jqm, standard = reflow
// table_id: die ID wird benötigt, damit die Tabelle nach ihrer Erstellung initiiert werden kann
// class: Klasse, welche die Darstellung bestimmt. Standard ist: tabelle_gestreift
window.em.erstelleTabelle = function(objekte, datamode, table_id, css_class) {
	var html,
		datamode = datamode || "reflow",
		css_class = css_class || "tabelle_gestreift";
	// html für Tabellen-div
	html = '<table data-role="table"';
	if (table_id) {
		html += ' id="' + table_id + '"';
	}
	html += ' data-mode="' + datamode + '" class="ui-responsive ' + css_class + '">';
	// html für die erste Zeile beginnen
	html += '<thead><tr>';
	// html für die Spalten, Biespiel: <th>Artgruppe</th><th>Anzahl Arten</th>
	_.each(_.first(objekte), function(value, key, list) {
		html += '<th>' + key + '</th>';
	});
	// html für die erste Zeile abschliessen
	html += '</tr></thead>';
	// Tabellenbody beginnen
	html += '<tbody>';
	// jede Zeile 
	_.each(objekte, function(objekt) {
		html += '<tr>';
		// alle Spalten
		_.each(objekt, function(value, key, list) {
			html += '<td>' + value + '</td>';
		});
		html += '</tr>';
	});
	// Tabellen-body und div abschliessen
	html += '</tbody></table>';
	return html;
};



window.em.öffneArtenImportieren = function() {
	localStorage.zurueck = $("body").pagecontainer("getActivePage").attr("id");
	$.mobile.navigate("ArtenImportieren.html");
};

window.em.aktualisiereArten = function() {
	console.log("window.em.aktualisiereArten");
	// neue von arteigenschaften.ch holen

	// auflisten:
	// bisherige unverändert (keine Aktion)
	// bisherige verändert: aktualisieren
	// zusätzliche: importieren
	// nicht mehr vorhandene: 
	//    1. zugehörige Beobachtungen exportieren (um sie anzupassen) 
	//    2. löschen
};


/*!
* jQuery Mobile Framework : drag pagination plugin
* Copyright (c) Filament Group, Inc
* Authored by Scott Jehl, scott@filamentgroup.com
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function($, undefined) {

	// auto-init on pagecreate
	$(document).bind("pagecreate", function(e) {
		$(":jqmData(role='pagination')", e.target).pagination();
	});

	var pageTitle = "";

	// create widget
	$.widget("mobile.pagination", $.mobile.widget, {
		_create: function() {
			var $el			= this.element,
				$page		= $el.closest(".ui-page"),
				$links		= $el.find("a"),
				$origin		= $.mobile.pageContainer,
				classNS		= "ui-pagination",
				prevLIClass	= classNS + "-prev",
				nextLIClass	= classNS + "-next",
				prevPClass	= "ui-page-prev",
				nextPClass	= "ui-page-next",
				snapClass	= classNS + "-snapping",
				dragClass	= classNS + "-dragging",
				dragClassOn	= false,
				$nextPage,
				$prevPage;

			$el.addClass(classNS);

			// set up next and prev buttons

			$links.each(function() {
				var reverse = $(this).closest("." + prevLIClass).length;

				$(this)
					.buttonMarkup({
						"role"		: "button",
						"theme"		: "d",
						"iconpos"	: "notext",
						"icon"		: "arrow-" + (reverse ? "l" : "r")
					});
			});
		}
	});

}( jQuery ));


/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = "="; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length * chrsz));}
function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length * chrsz));}
function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length * chrsz));}
function hex_hmac_sha1(key, data){ return binb2hex(core_hmac_sha1(key, data));}
function b64_hmac_sha1(key, data){ return binb2b64(core_hmac_sha1(key, data));}
function str_hmac_sha1(key, data){ return binb2str(core_hmac_sha1(key, data));}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test() {
	return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1(x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32);
  x[((len + 64 >> 9) << 4) + 15] = len;

  var w = Array(80);
  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;
  var e = -1009589776;

  for(var i = 0; i < x.length; i += 16)
  {
	var olda = a;
	var oldb = b;
	var oldc = c;
	var oldd = d;
	var olde = e;

	for(var j = 0; j < 80; j++)
	{
	  if(j < 16) w[j] = x[i + j];
	  else w[j] = rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
	  var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
					   safe_add(safe_add(e, w[j]), sha1_kt(j)));
	  e = d;
	  d = c;
	  c = rol(b, 30);
	  b = a;
	  a = t;
	}

	a = safe_add(a, olda);
	b = safe_add(b, oldb);
	c = safe_add(c, oldc);
	d = safe_add(d, oldd);
	e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft(t, b, c, d)
{
  if(t < 20) return (b & c) | ((~b) & d);
  if(t < 40) return b ^ c ^ d;
  if(t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt(t)
{
  return (t < 20) ?  1518500249 : (t < 40) ?  1859775393 :
		 (t < 60) ? -1894007588 : -899497514;
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1(key, data)
{
  var bkey = str2binb(key);
  if(bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
	ipad[i] = bkey[i] ^ 0x36363636;
	opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
	bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i%32);
  return bin;
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
	str += String.fromCharCode((bin[i>>5] >>> (32 - chrsz - i%32)) & mask);
  return str;
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
	str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
		   hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
	var triplet = (((binarray[i   >> 2] >> 8 * (3 -  i   %4)) & 0xFF) << 16)
				| (((binarray[i+1 >> 2] >> 8 * (3 - (i+1)%4)) & 0xFF) << 8 )
				|  ((binarray[i+2 >> 2] >> 8 * (3 - (i+2)%4)) & 0xFF);
	for(var j = 0; j < 4; j++)
	{
	  if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
	  else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
	}
  }
  return str;
}

/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Translation by: Chris P. Vigelius <me@cv.gd>, Pascal Hofmann <crowdin>
 *
 */

jQuery.extend(jQuery.mobile.datebox.prototype.options.lang, {
	'de': {
		setDateButtonLabel: "speichern",
		setTimeButtonLabel: "speichern",
		setDurationButtonLabel: "speichern",
		calTodayButtonLabel: "heute",
		titleDateDialogLabel: "Datum wählen",
		titleTimeDialogLabel: "Zeit wählen",
		daysOfWeek: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
		daysOfWeekShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
		monthsOfYear: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
		monthsOfYearShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"],
		durationLabel: ["Tage", "Stunden", "Minuten", "Sekunden"],
		durationDays: ["Tag", "Tage"],
		tooltip: "Kalender öffnen",
		nextMonth: "Nächster Monat",
		prevMonth: "Vorheriger Monat",
		timeFormat: 24,
		//headerFormat: '%A, %B %-d, %Y',
		headerFormat: '%Y-%m-%d',
		dateFieldOrder: ['d','m','y'],
		timeFieldOrder: ['h', 'i', 'a'],
		slideFieldOrder: ['y', 'm', 'd'],
		dateFormat: "%Y-%m-%d",
		useArabicIndic: false,
		isRTL: false,
		calStartDay: 1,
		clearButton: "löschen",
		durationOrder: ['d', 'h', 'i', 's'],
		meridiem: ["AM", "PM"],
		timeOutput: "%k:%M",
		durationFormat: "%Dd %DA, %Dl:%DM:%DS",
		calDateListLabel: "Weitere Termine"
	}
});
jQuery.extend(jQuery.mobile.datebox.prototype.options, {
	useLang: 'de'
});
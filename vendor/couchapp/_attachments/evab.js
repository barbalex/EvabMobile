/*
Diese Funktionen werden in evab auf mehreren Seiten benutzt
*/

function erstelleNeuesDatum() {
	var jetzt = new Date(),
		Jahr = jetzt.getFullYear(),
		Mnt = jetzt.getMonth()+1,
		MntAusgabe = ((Mnt < 10) ? "0" + Mnt : Mnt),
		Tag = jetzt.getDate(),
		TagAusgabe = ((Tag < 10) ? "0" + Tag : Tag),
		Datum = Jahr + "-" + MntAusgabe + "-" + TagAusgabe;
	return Datum;
}

function erstelleNeueUhrzeit() {
	var jetzt = new Date(),
		Std = jetzt.getHours(),
		StdAusgabe = ((Std < 10) ? "0" + Std : Std),
		Min = jetzt.getMinutes(),
		MinAusgabe = ((Min < 10) ? "0" + Min : Min),
		Sek = jetzt.getSeconds(),
		SekAusgabe = ((Sek < 10) ? "0" + Sek : Sek),
		Zeit = StdAusgabe + ":" + MinAusgabe + ":" + SekAusgabe;
	return Zeit;
}

// wandelt decimal degrees (vom GPS) in WGS84 um
function DdInWgs84BreiteGrad(Breite) {
	return Math.floor(Breite);
}

function DdInWgs84BreiteMin(Breite) {
	var BreiteGrad = Math.floor(Breite),
		BreiteMin = Math.floor((Breite-BreiteGrad)*60);
	return BreiteMin;
}

function DdInWgs84BreiteSec(Breite) {
	var BreiteGrad = Math.floor(Breite),
		BreiteMin = Math.floor((Breite-BreiteGrad)*60),
		BreiteSec = Math.round((((Breite - BreiteGrad) - (BreiteMin/60)) * 60 * 60) * 100) / 100;
	return BreiteSec;
}

function DdInWgs84LaengeGrad(Laenge) {
	return Math.floor(Laenge);
}

function DdInWgs84LaengeMin(Laenge) {
	var LaengeGrad = Math.floor(Laenge),
		LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
	return LaengeMin;
}

function DdInWgs84LaengeSec(Laenge) {
	var LaengeGrad = Math.floor(Laenge),
		LaengeMin = Math.floor((Laenge-LaengeGrad)*60),
		LaengeSec = Math.round((((Laenge - LaengeGrad) - (LaengeMin/60)) * 60 * 60) * 100 ) / 100;
	return LaengeSec;
}

// Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
function Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
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
}

// Wandelt WGS84 in CH-Landeskoordinaten um
function Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
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
}

// wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
function DdInChX(Breite, Laenge) {
	var BreiteGrad = DdInWgs84BreiteGrad(Breite),
		BreiteMin = DdInWgs84BreiteMin(Breite),
		BreiteSec = DdInWgs84BreiteSec(Breite),
		LaengeGrad = DdInWgs84LaengeGrad(Laenge),
		LaengeMin = DdInWgs84LaengeMin(Laenge),
		LaengeSec = DdInWgs84LaengeSec(Laenge),
		x = Math.floor(Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return x;
}

function DdInChY(Breite, Laenge) {
	var BreiteGrad = DdInWgs84BreiteGrad(Breite),
		BreiteMin = DdInWgs84BreiteMin(Breite),
		BreiteSec = DdInWgs84BreiteSec(Breite),
		LaengeGrad = DdInWgs84LaengeGrad(Laenge),
		LaengeMin = DdInWgs84LaengeMin(Laenge),
		LaengeSec = DdInWgs84LaengeSec(Laenge),
		y = Math.floor(Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return y;
}

// von CH-Landeskoord zu DecDeg

// Convert CH y/x to WGS lat
function CHtoWGSlat(y, x) {
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
}

// Convert CH y/x to WGS long
function CHtoWGSlng(y, x) {
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
}

function melde(Meldung) {
	$("<div id='meldung' data-role='popup' class='ui-content' data-overlay-theme='a'><a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right'>Close</a>"+Meldung+"</div>")
		.css({"line-height": "95%", "font-weight": "bold"})
		.appendTo($.mobile.pageContainer);
	$("#meldung").popup({
		afterclose: function (event, ui) {
			// Meldung wieder aus pageContainer entfernen
			$("#meldung").remove();
		}
	});
	$("#meldung").popup("open");
}

// wird in FeldEdit.html verwendet
function geheZurueckFE() {
	leereStorageFeldEdit();
	if (localStorage.zurueck && localStorage.zurueck !== "FelderWaehlen.html") {
		// via die Feldliste zurück
		leereStorageFeldEdit();
		$.mobile.navigate("FeldListe.html");
	} else if (localStorage.zurueck && localStorage.zurueck === "FelderWaehlen.html") {
		// direkt zurück, Feldliste auslassen
		leereStorageFeldEdit();
		leereStorageFeldListe();
		$.mobile.navigate(localStorage.zurueck);
		delete localStorage.zurueck;
	} else {
		// uups, kein zurück vorhanden
		leereAlleVariabeln();
		$.mobile.navigate("BeobListe.html");
	}
}

// Neue Beobachtungen werden gespeichert
// ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
// aufgerufen bloss von Artenliste.html
function speichereNeueBeob(aArtBezeichnung) {
	var doc;
	doc = {};
	doc.User = localStorage.Email;
	doc.aAutor = localStorage.Autor;
	doc.aArtGruppe = localStorage.aArtGruppe;
	delete localStorage.aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = localStorage.aArtId;
	if (localStorage.Von === "hArtListe" || localStorage.Von === "hArtEdit") {
		doc.Typ = "hArt";
		doc.hProjektId = localStorage.ProjektId;
		doc.hRaumId = localStorage.RaumId;
		doc.hOrtId = localStorage.OrtId;
		doc.hZeitId = localStorage.ZeitId;
		doc.aArtId = localStorage.aArtId;
		// Bei hierarchischen Beobachtungen wollen wir jetzt die Felder der höheren hierarchischen Ebenen anfügen
		speichereNeueBeob_02(doc);
	} else {
		//localStorage.Von == "BeobListe" || localStorage.Von == "BeobEdit"
		doc.Typ = "Beobachtung";
		doc.zDatum = erstelleNeuesDatum();
		doc.zUhrzeit = erstelleNeueUhrzeit();
		speichereNeueBeob_02(doc);
	}
}

// Neue Beobachtungen werden gespeichert
// ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
// dies ist der letzte Schritt:
// Autor anfügen und weiter zum Edit-Formular
function speichereNeueBeob_02(doc) {
	$db.saveDoc(doc, {
		success: function (data) {
			// doc um id und rev ergänzen
			doc._id = data.id;
			doc._rev = data.rev;
			if (doc.Typ === 'hArt') {
				// Variabeln verfügbar machen
				localStorage.hBeobId = data.id;
				// damit hArtEdit.html die hBeob nicht aus der DB holen muss
				window.hArt = doc;
				// Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
				leereStoragehBeobListe();
				$.mobile.navigate("hArtEdit.html");
			} else {
				// Variabeln verfügbar machen
				localStorage.BeobId = data.id;
				// damit BeobEdit.html die Beob nicht aus der DB holen muss
				window.Beobachtung = doc;
				// Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
				leereStorageBeobListe();
				$.mobile.navigate("BeobEdit.html");
			}
		},
		error: function () {
			melde("Beobachtung nicht gespeichert.");
		}
	});
}

// Speichert, wenn in BeobEdit oder hArtEdit eine neue Art und ev. auch eine neue Artgruppe gewählt wurde
// erwartet localStorage.Von = von welchem Formular aufgerufen wurde
function speichereBeobNeueArtgruppeArt(aArtName) {
	var docId;
	if (localStorage.Von === "BeobListe" || localStorage.Von === "BeobEdit") {
		docId = localStorage.BeobId;
	} else {
		docId = localStorage.hBeobId;
	}
	$db = $.couch.db("evab");
	$db.openDoc(docId, {
		success: function (doc) {
			if (localStorage.aArtGruppe) {
				doc.aArtGruppe = localStorage.aArtGruppe;
				delete localStorage.aArtGruppe;
			}
			doc.aArtName = aArtName;
			doc.aArtId = sessionStorage.ArtId;
			$db.saveDoc(doc, {
				success: function (data) {
					if (localStorage.Von === "BeobListe" || localStorage.Von === "BeobEdit") {
						// Variabeln verfügbar machen
						localStorage.BeobId = data.id;
						// Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						leereStorageBeobListe();
						$.mobile.navigate("BeobEdit.html");
					} else {
						// Variabeln verfügbar machen
						localStorage.hBeobId = data.id;
						// Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						leereStoragehBeobListe();
						$.mobile.navigate("hArtEdit.html");
					}
				},
				error: function () {
					melde("Fehler: Beobachtung nicht gespeichert");
				}
			});
		}
	});
}

function erstelleNeueZeit() {
// Neue Zeiten werden erstellt
// ausgelöst durch hZeitListe.html oder hZeitEdit.html
// dies ist der erste Schritt: doc bilden
	var doc;
	doc = {};
	doc.Typ = "hZeit";
	doc.User = localStorage.Email;
	doc.hProjektId = localStorage.ProjektId;
	doc.hRaumId = localStorage.RaumId;
	doc.hOrtId = localStorage.OrtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	// an hZeitEdit.html übergeben
	window.hZeit = doc;
	// Variabeln verfügbar machen
	delete localStorage.ZeitId;
	localStorage.Status = "neu";
	// Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	delete window.ZeitListe;
	// Vorsicht: Von hZeitEdit.html aus samepage transition!
	if ($("#ZeitEditPage").length > 0 && $("#ZeitEditPage").attr("data-url") !== "ZeitEditPage") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hZeit = JSON.stringify(window.hZeit);
		window.open("hZeitEdit.html", target = "_self");
	} else if ($("#ZeitEditPage").length > 0 && $("#ZeitEditPage").attr("data-url") === "ZeitEditPage") {
		//$(":mobile-pagecontainer").pagecontainer("change", "#ZeitEditPage.html", { allowSamePageTransition : true });    FUNKTIONIERT NICHT
		localStorage.hZeit = JSON.stringify(window.hZeit);
		window.open("hZeitEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hZeitEdit.html");
	}
}

// erstellt einen neuen Ort
// wird aufgerufen von: hOrtEdit.html, hOrtListe.html
// erwartet Username, hProjektId, hRaumId
function erstelleNeuenOrt() {
	var doc;
	doc = {};
	doc.Typ = "hOrt";
	doc.User = localStorage.Email;
	doc.hProjektId = localStorage.ProjektId;
	doc.hRaumId = localStorage.RaumId;
	// an hOrtEdit.html übergeben
	window.hOrt = doc;
	// Variabeln verfügbar machen
	delete localStorage.OrtId;
	// Globale Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	leereStorageOrtListe("mitLatLngListe");
	localStorage.Status = "neu";	// das löst bei initiiereOrtEdit die Verortung aus
	// Vorsicht: Von hOrtEdit.html aus samepage transition!
	if ($("#OrtEditPage").length > 0 && $("#OrtEditPage").attr("data-url") !== "OrtEditPage") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hOrt = JSON.stringify(window.hOrt);
		window.open("hOrtEdit.html", target = "_self");
	} else if ($("#OrtEditPage").length > 0 && $("#OrtEditPage").attr("data-url") === "OrtEditPage") {
		//$(":mobile-pagecontainer").pagecontainer("change", "#OrtEditPage.html", {allowSamePageTransition : true});    FUNKTIONIERT NICHT
		localStorage.hOrt = JSON.stringify(window.hOrt);
		window.open("hOrtEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hOrtEdit.html");
	}
}

function erstelleNeuenRaum() {
	var doc;
	doc = {};
	doc.Typ = "hRaum";
	doc.User = localStorage.Email;
	doc.hProjektId = localStorage.ProjektId;
	// in Objekt speichern, das an hRaumEdit.html übergeben wird
	window.hRaum = doc;
	// Variabeln verfügbar machen
	delete localStorage.RaumId;
	localStorage.Status = "neu";
	// Globale Variablen für RaumListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	leereStorageRaumListe("mitLatLngListe");
	// Vorsicht: Von hRaumEdit.html aus same page transition!
	if ($("#RaumEditPage").length > 0 && $("#RaumEditPage").attr("data-url") !== "RaumEditPage") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		console.log("var 1");
		localStorage.hRaum = JSON.stringify(window.hRaum);
		window.open("hRaumEdit.html", target = "_self");
	} else if ($("#RaumEditPage").length > 0 && $("#RaumEditPage").attr("data-url") === "RaumEditPage") {
		console.log("var 2");
		//$(":mobile-pagecontainer").pagecontainer("change", "#RaumEditPage.html", {allowSamePageTransition : "true"});   FUNKTIONIERT NICHT
		localStorage.hRaum = JSON.stringify(window.hRaum);
		window.open("hRaumEdit.html", target = "_self");
	} else {
		console.log("var 3");
		$.mobile.navigate("hRaumEdit.html");
	}
}

// erstellt ein Objekt für ein neues Projekt und öffnet danach hProjektEdit.html
// das Objekt wird erst von initiiereProjektEdit gespeichert (einen DB-Zugriff sparen)
function erstelleNeuesProjekt() {
	var doc;
	doc = {};
	doc.Typ = "hProjekt";
	doc.User = localStorage.Email;
	// damit hProjektEdit.html die hBeob nicht aus der DB holen muss
	window.hProjekt = doc;
	// ProjektId faken, sonst leitet die edit-Seite an die oberste Liste weiter
	delete localStorage.ProjektId;
	localStorage.Status = "neu";
	// Globale Variablen für ProjektListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	leereStorageProjektListe("mitLatLngListe");
	// Vorsicht: Von hProjektEdit.html aus same page transition!
	if ($("#ProjektEditPage").length > 0 && $("#ProjektEditPage").attr("data-url") !== "ProjektEditPage") {
		// Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		// das Objekt muss über die localStorage übermittelt werden
		localStorage.hProjekt = JSON.stringify(window.hProjekt);
		window.open("hProjektEdit.html", target = "_self");
	} else if ($("#ProjektEditPage").length > 0 && $("#ProjektEditPage").attr("data-url") === "ProjektEditPage") {
		//$.mobile.navigate($("#ProjektEditPage"), {allowSamePageTransition: true});    FUNKTIONIERT NICHT
		localStorage.hProjekt = JSON.stringify(window.hProjekt);
		window.open("hProjektEdit.html", target = "_self");
	} else {
		$.mobile.navigate("hProjektEdit.html");
	}
}

function öffneMeineEinstellungen() {
	$.mobile.navigate("UserEdit.html");
}

function löscheDokument(DocId) {
	$db = $.couch.db("evab");
	return $db.openDoc(DocId, {
		success: function (document) {
			$db.removeDoc(document, {
				success: function (document) {
					return true;
				},
				error: function (document) {
					return false;
				}
			});
		},
		error: function (document) {
			return false;
		}
	});
}

// initiiert Variabeln, fixe Felder und dynamische Felder in BeobEdit.html
// wird aufgerufen von BeobEdit.html und Felder_Beob.html
function initiiereBeobEdit() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängeBE').hide();
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.FeldlisteBeobEdit) {
		initiiereBeobEdit_2();
	} else {
		// das dauert länger - hinweisen
		$("#BeobEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeBeob?include_docs=true', {
			success: function (data) {
				// Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				window.FeldlisteBeobEdit = data;
				initiiereBeobEdit_2();
			}
		});
	}
}

// allfällige Beob übernehmen von speichereNeueBeob
// um die DB-Abfrage zu sparen
function initiiereBeobEdit_2() {
	// achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
	if (window.Beobachtung && (!localStorage.Von || localStorage.Von !== "BeobEdit")) {
		initiiereBeobEdit_3();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.BeobId, {
			success: function (data) {
				window.Beobachtung = data;
				initiiereBeobEdit_3();
			}
		});
	}
}

function initiiereBeobEdit_3() {
	// diese (globalen) Variabeln werden in BeobEdit.html gebraucht
	// bei neuen Beob hat das Objekt noch keine ID
	if (window.Beobachtung._id) {
		localStorage.BeobId = window.Beobachtung._id;
	} else {
		localStorage.BeobId = "neu";
	}
	localStorage.aArtGruppe = window.Beobachtung.aArtGruppe;
	localStorage.aArtName = window.Beobachtung.aArtName;
	localStorage.aArtId = window.Beobachtung.aArtId;
	localStorage.oLongitudeDecDeg = window.Beobachtung.oLongitudeDecDeg || "";
	localStorage.oLatitudeDecDeg = window.Beobachtung.oLatitudeDecDeg || "";
	localStorage.oLagegenauigkeit = window.Beobachtung.oLagegenauigkeit || "";
	localStorage.oXKoord = window.Beobachtung.oXKoord;
	localStorage.oYKoord = window.Beobachtung.oYKoord;
	setzeFixeFelderInBeobEdit(window.Beobachtung);
	erstelleDynamischeFelderBeobEdit();
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

// generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// und aktualisiert die Links für pagination
// Mitgeben: id der Beobachtung, Username
function erstelleDynamischeFelderBeobEdit() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerBeobEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	} else {
		HtmlContainer = "";
	}
	// nötig, weil sonst die dynamisch eingefügten Elemente nicht erscheinen (Felder) bzw. nicht funktionieren (links)
	$("#BeobEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	$("#BeobEditPage").trigger("create").trigger("refresh");
}

// setzt die Values in die hart codierten Felder im Formular BeobEdit.html
// erwartet das Objekt Beob, welches die Werte enthält
function setzeFixeFelderInBeobEdit() {
	$("[name='aArtGruppe']").selectmenu();
	$("[name='aArtGruppe']").html("<option value='" + window.Beobachtung.aArtGruppe + "'>" + window.Beobachtung.aArtGruppe + "</option>");
	$("[name='aArtGruppe']").val(window.Beobachtung.aArtGruppe);
	$("[name='aArtGruppe']").selectmenu("refresh");
	$("[name='aArtName']").selectmenu();
	$("[name='aArtName']").html("<option value='" + window.Beobachtung.aArtName + "'>" + window.Beobachtung.aArtName + "</option>");
	$("[name='aArtName']").val(window.Beobachtung.aArtName);
	$("[name='aArtName']").selectmenu("refresh");
	$("[name='aAutor']").val(window.Beobachtung.aAutor);
	$("[name='oXKoord']").val(window.Beobachtung.oXKoord);
	$("[name='oYKoord']").val(window.Beobachtung.oYKoord);
	$("[name='oLagegenauigkeit']").val(window.Beobachtung.oLagegenauigkeit);
	$("[name='zDatum']").val(window.Beobachtung.zDatum);
	$("[name='zUhrzeit']").val(window.Beobachtung.zUhrzeit);
}

// generiert das Html für das Formular in BeobEdit.html
// erwartet Feldliste als Objekt; Beob als Objekt, Artgruppe
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerBeobEditForm () {
	var Feld, i, FeldName, FeldBeschriftung, SliderMaximum, SliderMinimum, ListItem, HtmlContainer, Status, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = localStorage.Status;
	ArtGruppe = window.Beobachtung.aArtGruppe;
	for (i in FeldlisteBeobEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteBeobEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusEinfach.indexOf(localStorage.Email) !== -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1) {
				// In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
				// vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
				if (Feld.Hierarchiestufe !== "Art" || (typeof Feld.ArtGruppe !== "undefined" && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0)) {
					if (window.Beobachtung[FeldName] && Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
						FeldWert = Feld.Standardwert[localStorage.Email];
						// Objekt Beob um den Standardwert ergänzen, um später zu speichern
						window.Beobachtung[FeldName] = FeldWert;
					} else {
						// "" verhindert die Anzeige von undefined im Feld
						FeldWert = window.Beobachtung[FeldName] || "";
					}
					FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
					Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
					HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
				}
			}
		}
	}
	if (localStorage.Status === "neu") {
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.Beobachtung, {
			success: function (data) {
				window.Beobachtung._id = data.id;
				window.Beobachtung._rev = data.rev;
				localStorage.BeobId = data.id;
				GetGeolocation(data.id, "Beobachtung");
			}
		});
		delete localStorage.Status;
	} else {
		// Neue Datensätze haben keine Attachments
		zeigeAttachments(window.Beobachtung, "BE");
	}
	return HtmlContainer;
}

// BeobListe in BeobList.html vollständig neu aufbauen
function initiiereBeobliste() {
	// hat BeobEdit.html eine BeobListe übergeben?
	if (window.BeobListe) {
		// Beobliste aus globaler Variable holen - muss nicht geparst werden
		initiiereBeobliste_2();
	} else {
		// Beobliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/BeobListe?startkey=["' + localStorage.Email + '",{}]&endkey=["' + localStorage.Email + '"]&descending=true&include_docs=true', {
			success: function (data) {
				// BeobListe für BeobEdit bereitstellen
				window.BeobListe = data;
				initiiereBeobliste_2();
			}
		});
	}
}

function initiiereBeobliste_2() {
	var anzBeob, beob, ListItemContainer, Titel2;
	anzBeob = BeobListe.rows.length;
	ListItemContainer = "";

	// Im Titel der Seite die Anzahl Beobachtungen anzeigen
	Titel2 = " Beobachtungen";
	if (anzBeob === 1) {
		Titel2 = " Beobachtung";
	}
	$("#BeobListePageHeader .BeobListePageTitel").text(anzBeob + Titel2);

	if (anzBeob === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueBeobBeobListe">Erste Beobachtung erfassen</a></li>';
	} else {
		for (var i in window.BeobListe.rows) {
			if (typeof i !== "function") {
				beob = window.BeobListe.rows[i].doc;
				key = window.BeobListe.rows[i].key;
				ListItemContainer += "<li class=\"beob ui-li-has-thumb\" id=\"";
				ListItemContainer += beob._id;
				ListItemContainer += "\"><a href=\"BeobEdit.html\"><img class=\"ui-li-thumb\" src=\"";
				ListItemContainer += "Artgruppenbilder/" + encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + ".png";
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
	speichereLetzteUrl();
}

// löscht Anhänge
// erwartet den Datensatz als Objekt und das Objekt, dass geklickt wurde
function loescheAnhang(that, Objekt, id) {
	if (Objekt) {
		// Es wurde ein Objekt übergeben, keine DB-Abfrage nötig
		loescheAnhang_2(that, Objekt);
	} else {
		// Objekt aus der DB holen
		$db = $.couch.db("evab");
		$db.openDoc(id, {
			success: function (data) {
				window[Objekt.Typ] = data;
				loescheAnhang_2(that, window[Objekt.Typ]);
			},
			error: function () {
				melde("Fehler: Anhang wurde nicht entfernt");
			}
		});
	}
}

function loescheAnhang_2(that, Objekt) {
	var Dateiname;
	Dateiname = that.id;
	// Anhang aus Objekt entfernen
	delete window[Objekt.Typ]._attachments[Dateiname];
	// Objekt in DB speichern
	$db.saveDoc(window[Objekt.Typ], {
		success: function (data) {
			// rev im Objekt ergänzen
			// die globale Variable heisst gleich, wie der Typ im Objekt
			window[Objekt.Typ]._rev = data.rev;
			// im Formular den Anhang und die Lösch-Schaltfläche entfernen
			$(that).parent().parent().remove();
		},
		error: function () {
			melde("Fehler: Anhänge werden nicht richtig angezeigt");
		}
	});
}

// initiiert UserEdit.html
function initiiereUserEdit() {
	$("#ue_Email").val(localStorage.Email);
	$("[name='Datenverwendung']").checkboxradio();
	if (localStorage.Autor) {
		$("#Autor").val(localStorage.Autor);
	}
	$db = $.couch.db("evab");
	$db.openDoc(localStorage.Email, {
		success: function (User) {
			// fixe Felder aktualisieren
			if (User.Datenverwendung) {
				$("#" + User.Datenverwendung).prop("checked",true).checkboxradio("refresh");
				localStorage.Datenverwendung = User.Datenverwendung;
			} else {
				// Standardwert setzen
				$("#JaAber").prop("checked",true).checkboxradio("refresh");
			}
			speichereLetzteUrl();
		},
		error: function () {
			console.log('User hat kein User-Dokument');
			// Standardwert setzen
			$("#JaAber").prop("checked",true).checkboxradio("refresh");
		}
	});
}

// initiiert Installieren.html
// kurz, da keine Daten benötigt werden
function initiiereInstallieren() {
	speichereLetzteUrl();
}

// generiert in hProjektEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Projekts, Username
// bei neuen Projekten wird das zuvor erzeugte Projekt übernommen, um die DB-Anfrage zu sparen
function initiiereProjektEdit() {
	// Anhänge ausblenden, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	//$('#AnhängehPE').hide().trigger('updatelayout');
	// window.hProjekt existiert schon bei neuem Projekt
	if (window.hProjekt) {
		initiiereProjektEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hProjekt) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.hProjekt = JSON.parse(localStorage.hProjekt);
		delete localStorage.hProjekt;
		initiiereProjektEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ProjektId, {
			success: function (data) {
				window.hProjekt = data;
				initiiereProjektEdit_2();
			}
		});
	}
}

function initiiereProjektEdit_2() {
	// fixe Felder aktualisieren
	$("#pName").val(window.hProjekt.pName);
	// Variabeln bereitstellen (bei neuen Projekten wird ProjektId später nachgeschoben)
	if (window.hProjekt._id) {
		localStorage.ProjektId = window.hProjekt._id;
	} else {
		localStorage.ProjektId = "neu";
	}
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.FeldlisteProjekt) {
		initiiereProjektEdit_3();
	} else {
		// das dauert länger - Hinweis einblenden
		$("#hProjektEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// Feldliste aus der DB holen
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeProjekt?include_docs=true', {
			success: function (Feldliste) {
				window.FeldlisteProjekt = Feldliste;
				initiiereProjektEdit_3();
			}
		});
	}
}

function initiiereProjektEdit_3() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerProjektEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hProjektEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

// generiert das Html für das Formular in hProjektEdit.html
// erwartet Feldliste als Objekt; Projekt als Objekt
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerProjektEditForm () {
	var Feld, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (var i in FeldlisteProjekt.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteProjekt.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1 && FeldName !== "pName") {
				if (window.hProjekt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
					FeldWert = Feld.Standardwert[localStorage.Email];
					// window.hProjekt um den Standardwert ergänzen, um später zu speichern
					window.hProjekt[FeldName] = FeldWert;
				} else {
					//"" verhindert die Anzeige von undefined im Feld
					FeldWert = window.hProjekt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	if (localStorage.Status === "neu") {
		$("#pName").focus();
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.hProjekt, {
			success: function (data) {
				window.hProjekt._id = data.id;
				window.hProjekt._rev = data.rev;
				//
				localStorage.ProjektId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// neue Datensätze haben keine Attachments
		zeigeAttachments(window.hProjekt, "hPE");
	}
	return HtmlContainer;
}

// initiiert FeldEdit.html
function initiiereFeldEdit() {
	// Bei neuem Feld gibt es Feld schon
	if (window.Feld) {
		initiiereFeldEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function (doc) {
				// Feld bereitstellen
				window.Feld = doc;
				initiiereFeldEdit_2();
			}
		});
	}
}

function initiiereFeldEdit_2() {
	var SichtbarImModusHierarchisch, SichtbarImModusEinfach, Standardwert;
	// korrekte Werte in Felder SichtbarImModusEinfach und -Hierarchisch setzen
	SichtbarImModusHierarchisch = window.Feld.SichtbarImModusHierarchisch;
	SichtbarImModusEinfach = window.Feld.SichtbarImModusEinfach;
	// Vorsicht: Bei neuen Feldern gibt es window.Feld.SichtbarImModusHierarchisch noch nicht
	if (SichtbarImModusHierarchisch && SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1) {
		$("#SichtbarImModusHierarchisch").val("ja");
	} else {
		$("#SichtbarImModusHierarchisch").val("nein");
	}
	$("select#SichtbarImModusHierarchisch").slider();
	$("select#SichtbarImModusHierarchisch").slider("refresh");
	// Vorsicht: Bei neuen Feldern gibt es window.Feld.SichtbarImModusEinfach noch nicht
	if (SichtbarImModusEinfach && SichtbarImModusEinfach.indexOf(localStorage.Email) !== -1) {
		$("select#SichtbarImModusEinfach").val("ja");
	} else {
		$("select#SichtbarImModusEinfach").val("nein");
	}
	$("select#SichtbarImModusEinfach").slider();
	$("select#SichtbarImModusEinfach").slider("refresh");
	// Artgruppe Aufbauen, wenn Hierarchiestufe == Art
	if (window.Feld.Hierarchiestufe === "Art") {
		ArtGruppeAufbauenFeldEdit(window.Feld.ArtGruppe);
	}

	// allfälligen Standardwert anzeigen
	// Standardwert ist Objekt, darin werden die Standardwerte aller Benutzer gespeichert
	// darum hier auslesen und setzen
	// Zuerst leeren Wert setzen, sonst bleibt letzter, wenn keiner existiert!
	$("#Standardwert").val("");
	if (window.Feld.Standardwert) {
		Standardwert = window.Feld.Standardwert[localStorage.Email];
		if (Standardwert) {
			$("#Standardwert").val(Standardwert);
		}
	}

	if (window.Feld.FeldName) {
		// fix in Formulare eingebaute Felder: Standardwerte ausblenden und erklären
		if (["aArtGruppe", "aArtName"].indexOf(window.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", "Keine Voreinstellung möglich");
			$("#Standardwert").attr("disabled", true);
		// ausschalten, soll jetzt im Feld verwaltet werden
		/*} else if (window.Feld.FeldName === "aAutor") {
			$("#Standardwert").attr("placeholder", 'Bitte im Menü "meine Einstellungen" voreinstellen');
			$("#Standardwert").attr("disabled", true);*/
		} else if (["oXKoord", "oYKoord", "oLatitudeDecDeg", "oLongitudeDecDeg", "oLagegenauigkeit"].indexOf(window.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", 'Lokalisierung erfolgt automatisch, keine Voreinstellung möglich');
			$("#Standardwert").attr("disabled", true);
		} else if (["zDatum", "zUhrzeit"].indexOf(window.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", 'Standardwert ist "jetzt", keine Voreinstellung möglich');
			$("#Standardwert").attr("disabled", true);
		}
	}
	$(".FeldEditHeaderTitel").text(window.Feld.Hierarchiestufe + ": " + window.Feld.FeldBeschriftung);

	// Radio Felder initiieren (ausser ArtGruppe, das wird dynamisch erzeugt)
	$("input[name='Hierarchiestufe']").checkboxradio();
	$("#" + window.Feld.Hierarchiestufe).prop("checked",true).checkboxradio("refresh");
	$("input[name='Formularelement']").checkboxradio();
	$("#" + window.Feld.Formularelement).prop("checked",true).checkboxradio("refresh");
	$("input[name='InputTyp']").checkboxradio();
	$("#" + window.Feld.InputTyp).prop("checked",true).checkboxradio("refresh");

	// Werte in übrige Felder einfügen
	$("#FeldName").val(window.Feld.FeldName);
	$("#FeldBeschriftung").val(window.Feld.FeldBeschriftung);
	$("#FeldBeschreibung").val(window.Feld.FeldBeschreibung);	// Textarea - anders refreshen?
	$("#Reihenfolge").val(window.Feld.Reihenfolge);
	$("#FeldNameEvab").val(window.Feld.FeldNameEvab);
	$("#FeldNameZdsf").val(window.Feld.FeldNameZdsf);
	$("#FeldNameCscf").val(window.Feld.FeldNameCscf);
	$("#FeldNameNism").val(window.Feld.FeldNameNism);
	$("#FeldNameWslFlechten").val(window.Feld.FeldNameWslFlechten);
	$("#FeldNameWslPilze").val(window.Feld.FeldNameWslPilze);
	$("#Optionen").val(window.Feld.Optionen);	// Textarea - anders refreshen?
	$("#SliderMinimum").val(window.Feld.SliderMinimum);
	$("#SliderMaximum").val(window.Feld.SliderMaximum);

	erstelleSelectFeldFolgtNach();	// BESSER: Nur aufrufen, wenn erstaufbau oder auch Feldliste zurückgesetzt wurde
	speichereLetzteUrl();
	// Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
	$(":jqmData(role='page')").focus();
}

// wird von FeldEdit.html aufgerufen
// erstellt das Selectmenu, um die Reihenfolge-Position des Felds zu bestimmen
function erstelleSelectFeldFolgtNach() {
	// Nur bei eigenen Feldern anzeigen
	if (Feld.User !== "ZentrenBdKt") {
		if (window.Feldliste) {
			// Feldliste aus globaler Variable verwenden - muss nicht geparst werden
			erstelleSelectFeldFolgtNach_2();
		} else {
			$db = $.couch.db("evab");
			$db.view("evab/FeldListe?include_docs=true", {
				success: function (data) {
					window.Feldliste = data;
					erstelleSelectFeldFolgtNach_2();
				}
			});
		}
	}
}

function erstelleSelectFeldFolgtNach_2() {
	var i, TempFeld, Optionen;
	Optionen = [];
	Optionen.push("");
	for (i in window.Feldliste.rows) {
		if (typeof i !== "function") {
			TempFeld = window.Feldliste.rows[i].doc;
			// Liste aufbauen
			// Nur eigene Felder und offizielle
			if (TempFeld.User === localStorage.Email || TempFeld.User === "ZentrenBdKt") {
				Optionen.push(TempFeld.FeldName);
			}
		}
	}
	HtmlContainer = generiereHtmlFuerSelectmenu("FeldFolgtNach", "Feld folgt nach:", "", Optionen, "SingleSelect");
	$("#FeldFolgtNachDiv").html(HtmlContainer).trigger("create").trigger("refresh");
}

// wird benutzt in FeldEdit.html
// von je einer Funktion in FeldEdit.html und evab.js
// Funktion ist zweigeteilt, um wenn möglich Datenbankabfragen zu sparen
function ArtGruppeAufbauenFeldEdit(ArtGruppenArrayIn) {
	if (window.Artgruppen) {
		// Artgruppen von globaler Variable holen
		ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else if (localStorage.Artgruppen) {
		// Artgruppen aus localStorage holen und parsen
		window.Artgruppen = JSON.parse(localStorage.Artgruppen);
		ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else {
		// Artgruppen aus DB holen
		$db = $.couch.db("evab");
		$("select#ArtGruppe").empty();
		$db.view("evab/Artgruppen", {
			success: function (data) {
				window.Artgruppen = data;
				localStorage.Artgruppen = JSON.stringify(data);
				ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
			}
		});
	}
}

function ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn) {
	var i, ArtGruppe, ListItemContainer, listItem, ArtGruppenArray;
	ListItemContainer = "<fieldset data-role='controlgroup'>\n\t<legend>Artgruppen:</legend>";
	ArtGruppenArray = ArtGruppenArrayIn || [];
	for (i in Artgruppen.rows) {
		if (typeof i !== "function") {
			ArtGruppe = Artgruppen.rows[i].key;
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
	$("#Artgruppenliste").html(ListItemContainer).trigger("create").trigger("refresh");
}

// initiiert FeldListe.html
function initiiereFeldliste() {
	// hat FeldEdit.html eine Feldliste übergeben?
	if (window.Feldliste) {
		// Feldliste aus globaler Variable holen - muss nicht geparst werden
		initiiereFeldliste_2();
	} else {
		// FeldListe aus DB holen
		$db = $.couch.db("evab");
		$db.view("evab/FeldListe?include_docs=true", {
			success: function (data) {
				window.Feldliste = data;
				initiiereFeldliste_2();
			}
		});
	}
}

function initiiereFeldliste_2() {
	var i, TempFeld, anzFelder, ImageLink, externalPage, ListItemContainer, Hierarchiestufe, FeldBeschriftung, FeldBeschreibung;
	ListItemContainer = "";
	anzFelder = 0;
	for (i in window.Feldliste.rows) {
		if (typeof i !== "function") {
			TempFeld = window.Feldliste.rows[i].doc;
			// Liste aufbauen
			// Nur eigene Felder und offizielle
			if (TempFeld.User === localStorage.Email || TempFeld.User === "ZentrenBdKt") {
				Hierarchiestufe = TempFeld.Hierarchiestufe;
				FeldBeschriftung = TempFeld.FeldBeschriftung;
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
	speichereLetzteUrl();
}

// wird benutzt von hOrtEdit.html, BeobEdit.html und Karte.html
// die Felder werden aus localStorage übernommen, die Liste ihrer Namen wird als Array FelderArray überbeben
// die Felder werden in der DB und im übergebenen Objekt "DatensatzObjekt" gespeichert
// und anschliessend in Formularfeldern aktualisiert
// function speichereKoordinaten übernimmt id und den ObjektNamen
// kontrolliert, ob das Objekt existiert
// wenn nein wird es aus der DB geholt
function speichereKoordinaten(id, ObjektName) {
	// kontrollieren, ob Ort oder Beob als Objekt vorliegt
	if (window[ObjektName]) {
		// ja: Objekt verwenden
		speichereKoordinaten_2(id, ObjektName);
	} else {
		// nein: Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(id, {
			success: function (data) {
				window[ObjektName] = data;
				speichereKoordinaten_2(id, ObjektName);
			},
			error: function () {
				melde("Fehler: Koordinaten nicht gespeichert");
			}
		});
	}
}

// setzt das DatensatzObjekt voraus
// aktualisiert darin die Felder, welche in FelderArray aufgelistet sind
// Variablen müssen in Objekt und localStorage denselben Namen verwenden
function speichereKoordinaten_2(id, ObjektName) {
	var FelderArray;
	FelderArray = ["oLongitudeDecDeg", "oLongitudeDecDeg", "oLatitudeDecDeg", "oXKoord", "oYKoord", "oLagegenauigkeit", "oHöhe", "oHöheGenauigkeit"];
	speichereFelderAusLocalStorageInObjekt(ObjektName, FelderArray, "FormularAktualisieren");
	// nun die Koordinaten in den Zeiten und Arten dieses Objekts aktualisieren
	speichereFelderAusLocalStorageInObjektliste("ZeitenVonOrt", FelderArray, "hOrtId", id, "hZeitIdVonOrt");
	speichereFelderAusLocalStorageInObjektliste("ArtenVonOrt", FelderArray, "hOrtId", id, "hArtIdVonOrt");
}

// übernimmt eine Liste von Feldern und eine Objektliste (via Name)
// sucht in der Objektliste nach den Objekten mit der BezugsId
// aktualisiert diese Objekte
// wird verwendet, um die Koordinaten von Orten in Zeiten und Arten zu schreiben
// im ersten Schritt prüfen, ob die Objektliste vorhanden ist. Wenn nicht, aus DB holen
function speichereFelderAusLocalStorageInObjektliste(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert, Querystring) {
	var viewname;
	if (window[ObjektlistenName]) {
		// vorhandene Objektliste nutzen
		speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert);
	} else {
		// Objektliste aus DB holen
		viewname = 'evab/' + Querystring + '?startkey=["' + BezugsIdWert + '"]&endkey=["' + BezugsIdWert + '",{}]&include_docs=true';
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function (data) {
				window[ObjektlistenName] = data;
				speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert);
			}
		});
	}
}

function speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert) {
	// in allen Objekten in der Objektliste
	var DsBulkListe, Docs, row;
	// nur machen, wenn rows vorhanden!
	if (window[ObjektlistenName].rows.length > 0) {
		DsBulkListe = {};
		Docs = [];
		for (var i in window[ObjektlistenName].rows) {
			row = window[ObjektlistenName].rows[i].doc;
			if (typeof i !== "function") {
				// Objekte mit dem richtigen Wert in der BezugsId suchen (z.B. die richtige hOrtId)
				if (row[BezugsIdName] && row[BezugsIdName] === BezugsIdWert) {
					// im Objekt alle in FelderArray aufgelisteten Felder suchen
					for (i in FelderArray) {
						if (typeof i !== "function") {
							// und ihre Werte aktualisieren
							if (localStorage[FelderArray[i]]) {
								if (myTypeOf(localStorage[FelderArray[i]]) === "integer") {
									row[FelderArray[i]] = parseInt(localStorage[FelderArray[i]], 10);
								} else if (myTypeOf(localStorage[FelderArray[i]]) === "float") {
									row[FelderArray[i]] = parseFloat(localStorage[FelderArray[i]]);
								} else {
									row[FelderArray[i]] = localStorage[FelderArray[i]];
								}
							} else {
								delete row[FelderArray[i]];
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
			data: JSON.stringify(DsBulkListe),
			success: function(data) {
				// _rev in den Objekten in Objektliste aktualisieren
				// für alle zurückgegebenen aktualisierten Zeilen
				// offenbar muss data zuerst geparst werden ??!!
				data = JSON.parse(data);
				for (var y in data) {
					if (typeof y !== "function") {
						// das zugehörige Objekt in der Objektliste suchen
						for (var i in window[ObjektlistenName].rows) {
							row = window[ObjektlistenName].rows[i].doc;
							if (typeof i !== "function") {
								// und dessen rev aktualisieren
								if (row._id === data[y].id) {
									row._rev = data[y].rev;
									break;
								}
							}
						}
					}
				}
			}
		});
	}
}

// Neue Daten liegen in localStorage vor
// sie werden in Objekt und in DB geschrieben
// Variablen müssen in Objekt und localStorage denselben Namen verwenden
// FelderArray enthält eine Liste der Namen der zu aktualisierenden Felder
// ObjektName ist der Name des zu aktualisierenden Objekts bzw. Datensatzes
function speichereFelderAusLocalStorageInObjekt(ObjektName, FelderArray, FormularAktualisieren) {
	// Objekt aktualisieren
	for (var i in FelderArray) {
		if (typeof i !== "function") {
			if (localStorage[FelderArray[i]]) {
				if (myTypeOf(localStorage[FelderArray[i]]) === "integer") {
					window[ObjektName][FelderArray[i]] = parseInt(localStorage[FelderArray[i]], 10);
				} else if (myTypeOf(localStorage[FelderArray[i]]) === "float") {
					window[ObjektName][FelderArray[i]] = parseFloat(localStorage[FelderArray[i]]);
				} else {
					window[ObjektName][FelderArray[i]] = localStorage[FelderArray[i]];
				}
			} else {
				delete window[ObjektName][FelderArray[i]];
			}
		}
	}
	// in DB speichern
	$db.saveDoc(window[ObjektName], {
		success: function (data) {
			window[ObjektName]._rev = data.rev;
			if (FormularAktualisieren) {
				aktualisiereKoordinatenfelderInFormular(ObjektName);
			}
		}
	});
}

// übernimmt ein Objekt (via dessen Namen) und eine Liste von Feldern (FelderArray)
// setzt in alle Felder mit den Namen gemäss FelderArray die Werte gemäss Objekt
function aktualisiereKoordinatenfelderInFormular(ObjektName, FelderArray) {
	for (var i in FelderArray) {
		if (typeof i !== "function") {
			$("[name='" + FelderArray[i] + "']").val(window[ObjektName][FelderArray[i]] || null);
		}
	}
}

// dient der Unterscheidung von Int und Float
function isInt(n) {
	return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
}

// Hilfsfunktion, die typeof ersetzt und ergänzt
// typeof gibt bei input-Feldern immer String zurück!
function myTypeOf(Wert) {
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
}

// Übernimmt einen Feldnamen, einen Feldwert
// und eine Datensatzliste (z.B. alle Räume eines Projekts) sowie ihren Namen
// speichert das neue Feld in alle Datensätze der Liste in der DB
// und aktualisiert die Liste selber, damit sie das nächste mal nicht in der DB geholt werden muss
function speichereFeldInDatensatzliste(Feldname, Feldwert, DatensatzlisteName) {
	var DsBulkListe, Docs, row;
	// nur machen, wenn Datensätze da sind
	DsBulkListe = {};
	Docs = [];
	for (var i in window[DatensatzlisteName].rows) {
		row = window[DatensatzlisteName].rows[i].doc;
		if (Feldwert) {
			if (myTypeOf(Feldwert) === "float") {
				row[Feldname] = parseFloat(Feldwert);
			} else if (myTypeOf(Feldwert) === "integer") {
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
}

// löscht Datensätze in Massen
// nimmt das Ergebnis einer Abfrage entgegen, welche im key einen Array hat
// Array[0] ist fremde _id (mit der die Abfrage gefiltert wurde),
// Array[1] die _id des zu löschenden Datensatzes und Array[2] dessen _rev
function loescheIdIdRevListe(Datensatzobjekt) {
	var ObjektMitDeleteListe, Docs, Datensatz, rowkey;
	ObjektMitDeleteListe = {};
	Docs = [];
	for (var i in Datensatzobjekt.rows) {
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
}


function initiiereProjektliste() {
	// hat ProjektEdit.html eine Projektliste übergeben?
	if (window.Projektliste) {
		initiiereProjektliste_2();
	} else {
		// Daten für die Projektliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hProjListe?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{}]&include_docs=true', {
			success: function (data) {
				// Projektliste für ProjektEdit bereitstellen
				window.Projektliste = data;
				initiiereProjektliste_2();
			}
		});
	}
}

function initiiereProjektliste_2() {
	var i, anzProj, Proj, externalPage, listItem, ListItemContainer, Titel2;
	ListItemContainer = "";
	anzProj = Projektliste.rows.length;

	// Im Titel der Seite die Anzahl Projekte anzeigen
	Titel2 = " Projekte";
	if (anzProj === 1) {
		Titel2 = " Projekt";
	}
	$("#hProjektListePageHeader .hProjektListePageTitel").text(anzProj + Titel2);

	if (anzProj === 0) {
		ListItemContainer = "<li><a href='#' class='erste NeuesProjektProjektListe'>Erstes Projekt erfassen</a></li>";
	} else {
		for (i in Projektliste.rows) {			// Liste aufbauen
			if (typeof i !== "function") {
				Proj = Projektliste.rows[i].doc;
				key = Projektliste.rows[i].key;
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
	speichereLetzteUrl();
}

// generiert in hRaumEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Raums, Username
// Bei neuen Räumen wird der Raum übernommen um eine DB-Abfrage zu sparen
function initiiereRaumEdit() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehRE').hide();
	if (window.hRaum) {
		initiiereRaumEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hRaum) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.hRaum = JSON.parse(localStorage.hRaum);
		delete localStorage.hRaum;
		initiiereRaumEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.RaumId, {
			success: function (data) {
				window.hRaum = data;
				initiiereRaumEdit_2();
			}
		});
	}
}

function initiiereRaumEdit_2() {
	// fixes Feld setzen
	$("#rName").val(window.hRaum.rName);
	// Variabeln bereitstellen
	localStorage.ProjektId = window.hRaum.hProjektId;
	// bei neuen Räumen hat das Objekt noch keine ID
	if (window.hRaum._id) {
		localStorage.RaumId = window.hRaum._id;
	} else {
		localStorage.RaumId = "neu";
	}
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.FeldlisteRaumEdit) {
		initiiereRaumEdit_3();
	} else {
		// das dauert länger - hinweisen
		$("#hRaumEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeRaum?include_docs=true', {
			success: function (Feldliste) {
				// Variabeln bereitstellen
				window.FeldlisteRaumEdit = Feldliste;
				initiiereRaumEdit_3();
			}
		});
	}
}

function initiiereRaumEdit_3() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerRaumEditForm ();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hRaumEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

// generiert das Html für das Formular in hRaumEdit.html
// erwartet Feldliste als Objekt; window.hRaum als Objekt
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerRaumEditForm () {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteRaumEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteRaumEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email) !== -1 && FeldName !== "rName") {
				if (window.hRaum[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
					FeldWert = Feld.Standardwert[localStorage.Email];
					// Objekt window.hRaum um den Standardwert ergänzen, um später zu speichern
					window.hRaum[FeldName] = FeldWert;
				} else {
					//"" verhindert die Anzeige von undefined im Feld
					FeldWert = window.hRaum[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	// In neuen Datensätzen allfällige Standardwerte speichern
	if (localStorage.Status === "neu") {
		$("#rName").focus();
		$db = $.couch.db("evab");
		$db.saveDoc(window.hRaum, {
			success: function (data) {
				window.hRaum._id = data.id;
				window.hRaum._rev = data.rev;
				localStorage.RaumId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// Attachments gibt's bei neuen Datensätzen nicht
		zeigeAttachments(window.hRaum, "hRE");
	}
	return HtmlContainer;
}

function initiiereRaumListe() {
	// hat hRaumEdit.html eine RaumListe übergeben?
	if (window.RaumListe) {
		// Raumliste aus globaler Variable holen - muss nicht geparst werden
		initiiereRaumListe_2();
	} else {
		// Raumliste aud DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hRaumListe?startkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ProjektId + '" ,{}]&include_docs=true', {
			success: function (data) {
				// RaumListe für haumEdit bereitstellen
				window.RaumListe = data;
				initiiereRaumListe_2();
			}
		});
	}
}

function initiiereRaumListe_2() {
	var i, anzRaum, Raum, externalPage, listItem, ListItemContainer, Titel2;
	anzRaum = RaumListe.rows.length;
	ListItemContainer = "";

	// Im Titel der Seite die Anzahl Räume anzeigen
	Titel2 = " Räume";
	if (anzRaum === 1) {
		Titel2 = " Raum";
	}
	$("#hRaumListePageHeader .hRaumListePageTitel").text(anzRaum + Titel2);

	if (anzRaum === 0) {
		ListItemContainer = '<li><a href="#" name="NeuerRaumRaumListe" class="erste">Ersten Raum erfassen</a></li>';
	} else {
		for (i in RaumListe.rows) {	// Liste aufbauen
			if (typeof i !== "function") {
				Raum = RaumListe.rows[i].doc;
				key = RaumListe.rows[i].key;
				rName = Raum.rName;
				listItem = "<li RaumId=\"" + Raum._id + "\" class=\"Raum\"><a href=\"#\"><h3>" + rName + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#RaumlistehRL").html(ListItemContainer);
	$("#RaumlistehRL").listview("refresh");
	speichereLetzteUrl();
}

// generiert in hOrtEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Orts
function initiiereOrtEdit() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehOE').hide();
	if (window.hOrt) {
		initiiereOrtEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hOrt) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.hOrt = JSON.parse(localStorage.hOrt);
		delete localStorage.hOrt;
		initiiereOrtEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.OrtId, {
			success: function (data) {
				window.hOrt = data;
				initiiereOrtEdit_2();
			}
		});
	}
}

function initiiereOrtEdit_2() {
	// fixe Felder aktualisieren
	$("[name='oName']").val(window.hOrt.oName);
	$("[name='oXKoord']").val(window.hOrt.oXKoord);
	$("[name='oYKoord']").val(window.hOrt.oYKoord);
	$("[name='oLagegenauigkeit']").val(window.hOrt.oLagegenauigkeit);
	// Variabeln bereitstellen
	localStorage.ProjektId = window.hOrt.hProjektId;
	localStorage.RaumId = window.hOrt.hRaumId;
	// bei neuen Orten hat das Objekt noch keine ID
	if (window.hOrt._id) {
		localStorage.OrtId = window.hOrt._id;
	} else {
		localStorage.OrtId = "neu";
	}
	// Lat Lng werden geholt. Existieren sie nicht, erhalten Sie den Wert ""
	localStorage.oLongitudeDecDeg = window.hOrt.oLongitudeDecDeg;
	localStorage.oLatitudeDecDeg = window.hOrt.oLatitudeDecDeg;
	localStorage.oLagegenauigkeit = window.hOrt.oLagegenauigkeit;
	localStorage.oXKoord = window.hOrt.oXKoord;
	localStorage.oYKoord = window.hOrt.oYKoord;
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.FeldlisteOrtEdit) {
		initiiereOrtEdit_3();
	} else {
		// das dauert länger - hinweisen
		$("#hOrtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeOrt?include_docs=true', {
			success: function (Feldliste) {
				// Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				window.FeldlisteOrtEdit = Feldliste;
				initiiereOrtEdit_3();
			}
		});
	}
}

function initiiereOrtEdit_3() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerOrtEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hOrtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");

	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();

}

// generiert das Html für das Formular in hOrtEdit.html
// erwartet Feldliste als Objekt (aus der globalen Variable); window.hOrt als Objekt
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerOrtEditForm () {
	var Feld, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (var i in FeldlisteOrtEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteOrtEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Email || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.hOrt.User) !== -1 && (FeldName !== "oName") && (FeldName !== "oXKoord") && (FeldName !== "oYKoord") && (FeldName !== "oLagegenauigkeit")) {
				if (window.hOrt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Email]) {
					FeldWert = Feld.Standardwert[localStorage.Email];
					// Objekt window.hOrt um den Standardwert ergänzen, um später zu speichern
					window.hOrt[FeldName] = FeldWert;
				} else {
					//"" verhindert die Anzeige von undefined im Feld
					FeldWert = window.hOrt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	// Allfällige Standardwerte speichern
	if (localStorage.Status === "neu") {
		$("[name='oName']").focus();
		$db = $.couch.db("evab");
		$db.saveDoc(window.hOrt, {
			success: function (data) {
				window.hOrt._id = data.id;
				window.hOrt._rev = data.rev;
				localStorage.OrtId = data.id;
				GetGeolocation(data.id, "hOrt");
			}
		});
		// Status zurücksetzen - es soll nur ein mal verortet werden
		delete localStorage.Status;
	} else {
		// Attachments gibt es bei neuen Orten nicht
		zeigeAttachments(window.hOrt, "hOE");
	}
	return HtmlContainer;
}

// erstellt die Ortliste in hOrtListe.html
function initiiereOrtListe() {
	// hat hOrtEdit.html eine OrtListe übergeben?
	if (window.OrtListe) {
		// Ortliste aus globaler Variable holen - muss nicht geparst werden
		initiiereOrtListe_2();
	} else {
		// Ortliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hOrtListe?startkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.RaumId + '" ,{}]&include_docs=true', {
			success: function (data) {
				// OrtListe für hOrtEdit bereitstellen
				window.OrtListe = data;
				initiiereOrtListe_2();
			}
		});
	}
}

function initiiereOrtListe_2() {
	var i, anzOrt, Ort, externalPage, listItem, ListItemContainer, Titel2;
	anzOrt = OrtListe.rows.length;
	ListItemContainer = "";

	// Im Titel der Seite die Anzahl Orte anzeigen
	Titel2 = " Orte";
	if (anzOrt === 1) {
		Titel2 = " Ort";
	}
	$("#hOrtListePageHeader .hOrtListePageTitel").text(anzOrt + Titel2);

	if (anzOrt === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeuerOrtOrtListe">Ersten Ort erfassen</a></li>';
	} else {
		for (i in OrtListe.rows) {	// Liste aufbauen
			if (typeof i !== "function") {
				Ort = OrtListe.rows[i].doc;
				key = OrtListe.rows[i].key;
				listItem = "<li OrtId=\"" + Ort._id + "\" class=\"Ort\"><a href=\"#\"><h3>" + Ort.oName + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#OrtlistehOL").html(ListItemContainer);
	$("#OrtlistehOL").listview("refresh");
	speichereLetzteUrl();
}

// generiert in hZeitEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id der Zeit
function initiiereZeitEdit() {
	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehZE').hide();
	// hZeit existiert schon bei neuer Zeit
	//alert("window.hZeit = " + JSON.stringify(window.hZeit));
	if (window.hZeit) {
		initiiereZeitEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hZeit) {
		// wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
		window.hZeit = JSON.parse(localStorage.hZeit);
		delete localStorage.hZeit;
		initiiereZeitEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.ZeitId, {
			success: function (data) {
				window.hZeit = data;
				initiiereZeitEdit_2();
			}
		});
	}
}

function initiiereZeitEdit_2() {
	// fixe Felder aktualisieren
	$("[name='zDatum']").val(window.hZeit.zDatum);
	$("[name='zUhrzeit']").val(window.hZeit.zUhrzeit);
	// Variabeln bereitstellen
	localStorage.ProjektId = window.hZeit.hProjektId;
	localStorage.RaumId = window.hZeit.hRaumId;
	localStorage.OrtId = window.hZeit.hOrtId;
	// bei neuen Zeiten hat das Objekt noch keine ID
	if (window.hZeit._id) {
		localStorage.ZeitId = window.hZeit._id;
	}
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.FeldlisteZeitEdit) {
		initiiereZeitEdit_3();
	} else {
		// Feldliste aus der DB holen
		// das dauert länger - hinweisen
		$("#hZeitEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeZeit?include_docs=true', {
			success: function (Feldliste) {
				window.FeldlisteZeitEdit = Feldliste;
				initiiereZeitEdit_3();
			}
		});
	}
}

function initiiereZeitEdit_3() {
	var HtmlContainer = generiereHtmlFuerZeitEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hZeitEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

// erstellt die Liste der Zeiten in Formular hZeitListe.html
function initiiereZeitListe() {
	// hat hZeitEdit.html eine ZeitListe übergeben?
	if (window.ZeitListe) {
		// Zeitliste aus globaler Variable holen - muss nicht geparst werden
		initiiereZeitListe_2();
	} else {
		// Zeitliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hZeitListe?startkey=["' + localStorage.Email + '", "' + localStorage.OrtId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.OrtId + '" ,{}]&include_docs=true', {
			success: function (data) {
				// ZeitListe für hZeitEdit bereitstellen
				window.ZeitListe = data;
				initiiereZeitListe_2();
			}
		});
	}
}

function initiiereZeitListe_2() {
	var i, anzZeit, Zeit, externalPage, listItem, ListItemContainer, Titel2, zZeitDatum;
	anzZeit = ZeitListe.rows.length;
	ListItemContainer = "";

	// Im Titel der Seite die Anzahl Zeiten anzeigen
	Titel2 = " Zeiten";
	if (anzZeit === 1) {
		Titel2 = " Zeit";
	}
	$("#hZeitListePageHeader .hZeitListePageTitel").text(anzZeit + Titel2);

	if (anzZeit === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueZeitZeitListe">Erste Zeit erfassen</a></li>';
	} else {
		for (i in ZeitListe.rows) {
			if (typeof i !== "function") {
				Zeit = ZeitListe.rows[i].doc;
				key = ZeitListe.rows[i].key;
				zZeitDatum = key[2] + "&nbsp; &nbsp;" + key[3];
				listItem = "<li ZeitId=\"" + Zeit._id + "\" class=\"Zeit\"><a href=\"#\"><h3>" + zZeitDatum + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#ZeitlistehZL").html(ListItemContainer);
	$("#ZeitlistehZL").listview("refresh");
	speichereLetzteUrl();
}

// generiert das Html für das Formular in hZeitEdit.html
// erwartet Feldliste als Objekt; Zeit als Objekt
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerZeitEditForm() {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteZeitEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteZeitEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === window.hZeit.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.hZeit.User) !== -1 && FeldName !== "zDatum" && FeldName !== "zUhrzeit") {
				if (window.hZeit[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && window.hZeit[FeldName]) {
					FeldWert = Feld.Standardwert[window.hZeit.User] || "";
					// Objekt window.hZeit um den Standardwert ergänzen, um später zu speichern
					window.hZeit[FeldName] = FeldWert;
				} else {
					FeldWert = window.hZeit[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
			// localStorage.Status wird schon im aufrufenden function gelöscht!
		}
	}
	if (localStorage.Status === "neu") {
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.hZeit, {
			success: function (data) {
				window.hZeit._id = data.id;
				window.hZeit._rev = data.rev;
				localStorage.ZeitId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// Neue Datensätze haben keine Attachments
		zeigeAttachments(window.hZeit, "hZE");
	}
	return HtmlContainer;
}

// managt den Aufbau aller Daten und Felder für hBeobEdit.html
// erwartet die hBeobId
// wird aufgerufen von hBeobEdit.html bei pageshow
function initiierehBeobEdit() {
	// achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
	if (window.hArt && (!localStorage.Von || localStorage.Von !== "hArtEdit")) {
		initiierehBeobEdit_2(window.hArt);
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.hBeobId, {
			success: function (data) {
				window.hArt = data;
				initiierehBeobEdit_2(data);
			}
		});
	}
}

function initiierehBeobEdit_2() {
	// hier werden Variablen gesetzt,
	// in die fixen Felder Werte eingesetzt,
	// die dynamischen Felder aufgebaut
	// und die Nav-Links gesetzt

	// Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehAE').hide();

	// diese (globalen) Variabeln werden in hArtEdit.html gebraucht
	// Variabeln bereitstellen
	localStorage.ProjektId = window.hArt.hProjektId;
	localStorage.RaumId = window.hArt.hRaumId;
	localStorage.OrtId = window.hArt.hOrtId;
	localStorage.ZeitId = window.hArt.hZeitId;
	// bei neuen hBeob hat das Objekt noch keine ID
	if (window.hArt._id) {
		localStorage.hBeobId = window.hArt._id;
	} else {
		localStorage.hBeobId = "neu";
	}
	localStorage.aArtGruppe = window.hArt.aArtGruppe;
	localStorage.aArtName = window.hArt.aArtName;
	localStorage.aArtId = window.hArt.aArtId;
	// fixe Felder aktualisieren
	$("[name='aArtGruppe']").selectmenu();
	$("[name='aArtGruppe']").val(window.hArt.aArtGruppe);
	$("[name='aArtGruppe']").html("<option value='" + window.hArt.aArtGruppe + "'>" + window.hArt.aArtGruppe + "</option>");
	$("[name='aArtGruppe']").selectmenu("refresh");
	$("[name='aArtName']").selectmenu();
	$("[name='aArtName']").val(window.hArt.aArtName);
	$("[name='aArtName']").html("<option value='" + window.hArt.aArtName + "'>" + window.hArt.aArtName + "</option>");
	$("[name='aArtName']").selectmenu("refresh");
	// prüfen, ob die Feldliste schon geholt wurde
	// wenn ja: deren globale Variable verwenden
	if (window.FeldlistehBeobEdit) {
		erstelleDynamischeFelderhArtEdit();
	} else {
		// Feldliste aus der DB holen
		// das dauert länger - hinweisen
		$("#hArtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeArt?include_docs=true', {
			success: function (data) {
				window.FeldlistehBeobEdit = data;
				erstelleDynamischeFelderhArtEdit();
			}
		});
	}
}

// generiert dynamisch die Artgruppen-abhängigen Felder
// Mitgeben: Feldliste, Beobachtung
function erstelleDynamischeFelderhArtEdit() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerhArtEditForm();
	// Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hArtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	// letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

// generiert das Html für Formular in hArtEdit.html
// erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerhArtEditForm () {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	ArtGruppe = window.hArt.aArtGruppe;
	for (i in window.FeldlistehBeobEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.FeldlistehBeobEdit.rows[i].doc;
			FeldName = Feld.FeldName;
			// nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			// Vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
			if ((Feld.User === window.hArt.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.hArt.User) !== -1 && (typeof Feld.ArtGruppe !== "undefined" && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0) && (FeldName !== "aArtId") && (FeldName !== "aArtGruppe") && (FeldName !== "aArtName")) {
				if (window.hArt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[window.hArt.User]) {
					FeldWert = Feld.Standardwert[window.hArt.User];
					// Objekt window.hArt um den Standardwert ergänzen, um später zu speichern
					window.hArt[FeldName] = FeldWert;
				} else {
					//"" verhindert, dass im Feld undefined erscheint
					FeldWert = window.hArt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	if (localStorage.Status === "neu") {
		// in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		$db = $.couch.db("evab");
		$db.saveDoc(window.hArt, {
			success: function (data) {
				window.hArt._id = data.id;
				window.hArt._rev = data.rev;
				localStorage.hBeobId = data.id;
			}
		});
		delete localStorage.Status;
	} else {
		// Neue Datensätze haben keine Anhänge
		zeigeAttachments(window.hArt, "hAE");
	}
	return HtmlContainer;
}

// initiiert BeobListe.html
function initiierehBeobListe() {
	// hat hArtEdit.html eine hBeobListe übergeben?
	if (window.hBeobListe) {
		// Beobliste aus globaler Variable holen - muss nicht geparst werden
		initiierehBeobListe_2();
	} else {
		// Beobliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hArtListe?startkey=["' + localStorage.Email + '", "' + localStorage.ZeitId + '"]&endkey=["' + localStorage.Email + '", "' + localStorage.ZeitId + '" ,{}]&include_docs=true', {
			success: function (data) {
				// Liste bereitstellen, um Datenbankzugriffe zu reduzieren
				window.hBeobListe = data;
				initiierehBeobListe_2();
			}
		});
	}
}

function initiierehBeobListe_2() {
	var anzArt = window.hBeobListe.rows.length, 
		Art, 
		externalPage, 
		listItem, 
		ListItemContainer = "", 
		Titel2, 
		hBeobTemp;

	// Im Titel der Seite die Anzahl Arten anzeigen
	Titel2 = " Arten";
	if (anzArt === 1) {
		Titel2 = " Art";
	}
	$("#hArtListePageHeader .hArtListePageTitel").text(anzArt + Titel2);

	if (anzArt === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueBeobhArtListe">Erste Art erfassen</a></li>';
	} else {
		for (var i in window.hBeobListe.rows) {
			if (typeof i !== "function") {
				hBeobTemp = window.hBeobListe.rows[i].doc;
				listItem = "<li class=\"beob ui-li-has-thumb\" hBeobId=\"" + hBeobTemp._id + "\" aArtGruppe=\"" + hBeobTemp.aArtGruppe + "\">" +
					"<a href=\"#\">" +
					"<img class=\"ui-li-thumb\" src=\"Artgruppenbilder/" + encodeURIComponent(hBeobTemp.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + ".png\" />" +
					"<h3>" + hBeobTemp.aArtName + "<\/h3>" +
					"<\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#ArtlistehAL").html(ListItemContainer);
	$("#ArtlistehAL").listview("refresh");
	speichereLetzteUrl();
}


// generiert das Html für ein Formularelement
// erwartet diverse Übergabewerte
// der HtmlContainer wird zurück gegeben
function generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, InputTyp, SliderMinimum, SliderMaximum) {
	var HtmlContainer = "";
	// abfangen, wenn Inputtyp vergessen wurde
	InputTyp = InputTyp || "text";
	switch(Feld.Formularelement) {
	case "textinput":
		HtmlContainer = generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
		break;
	case "textarea":
		HtmlContainer = generiereHtmlFuerTextarea(FeldName, FeldBeschriftung, FeldWert);
		break;
	case "toggleswitch":
		console.log("generiere Html für toggleswitch für Feld " + FeldName + " mit Inhalt " + FeldWert);
		HtmlContainer = generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert);
		break;
	case "checkbox":
		HtmlContainer = generiereHtmlFuerCheckbox(FeldName, FeldBeschriftung, FeldWert, Optionen);
		break;
	case "selectmenu":
		HtmlContainer = generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen, "SingleSelect");
		break;
	case "multipleselect":
		HtmlContainer = generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen, "MultipleSelect");
		break;
	case "slider":
		SliderMinimum = Feld.SliderMinimum || 0;
		SliderMaximum = Feld.SliderMaximum || 100;
		HtmlContainer = generiereHtmlFuerSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum);
		break;
	case "radio":
		HtmlContainer = generiereHtmlFuerRadio(FeldName, FeldBeschriftung, FeldWert, Optionen);
		break;
	case null:
		// Abfangen, wenn das Formularelement nicht gewählt wurde
		HtmlContainer = generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
		break;
	}
	return HtmlContainer;
}

// generiert den html-Inhalt für Textinputs
// wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp) {
	var HtmlContainer;
	HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
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
function generiereHtmlFuerSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum) {
	var HtmlContainer;
	HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
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
}

// generiert den html-Inhalt für Textarea
// wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerTextarea(FeldName, FeldBeschriftung, FeldWert) {
	var HtmlContainer;
	HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
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
}

// generiert den html-Inhalt für Toggleswitch
// wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'><label for='";
	HtmlContainer += FeldName;
	HtmlContainer += "'>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</label><select name='";
	HtmlContainer += FeldName;
	HtmlContainer += "' id='";
	HtmlContainer += FeldName;
	HtmlContainer += "' data-role='flipswitch' value='";
	HtmlContainer += FeldWert;
	HtmlContainer += "' class='speichern'><option value='nein'>nein</option><option value='ja'>ja</option></select></div>";
	return HtmlContainer;
}

/*function generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='";
	HtmlContainer += FeldName;
	HtmlContainer += "'>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</label>\n\t<select name='";
	HtmlContainer += FeldName;
	HtmlContainer += "' id='";
	HtmlContainer += FeldName;
	HtmlContainer += "' data-role='slider' value='";
	HtmlContainer += FeldWert;
	HtmlContainer += "' class='speichern'>\n\t\t<option value='nein'>nein</option>\n\t\t<option value='ja'>ja</option>\n\t</select>\n</div>";
	return HtmlContainer;
}*/

// generiert den html-Inhalt für Checkbox
// wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerCheckbox(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += generiereHtmlFuerCheckboxOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
}

// generiert den html-Inhalt für Optionen von Checkbox
// wird von generiereHtmlFuerCheckbox aufgerufen
function generiereHtmlFuerCheckboxOptionen(FeldName, FeldWert, Optionen) {
	var i, HtmlContainer, Optionn, ListItem;
	HtmlContainer = "";
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
}

// generiert den html-Inhalt für Radio
// wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerRadio(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
}

// generiert den html-Inhalt für Optionen von Radio
// wird von generiereHtmlFuerRadio aufgerufen
function generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen) {
	var i, HtmlContainer, Optionn, ListItem;
	HtmlContainer = "";
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
}

// generiert den html-Inhalt für Selectmenus
// wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen, MultipleSingleSelect) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='";
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
		HtmlContainer += generiereHtmlFuerMultipleselectOptionen(FeldName, FeldWert, Optionen);
	} else {
		HtmlContainer += generiereHtmlFuerSelectmenuOptionen(FeldName, FeldWert, Optionen);
	}
	HtmlContainer += "\n\t</select>\n</div>";
	return HtmlContainer;
}

// generiert den html-Inhalt für Optionen von Selectmenu
// wird von generiereHtmlFuerSelectmenu aufgerufen
function generiereHtmlFuerSelectmenuOptionen(FeldName, FeldWert, Optionen) {
	var i, HtmlContainer, Optionn, ListItem;
	HtmlContainer = "\n\t\t<option value=''></option>";
	for (i in Optionen) {
		if (typeof i !== "function") {
			Optionn = Optionen[i];
			ListItem = "\n\t\t<option value='";
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
}

// generiert den html-Inhalt für Optionen von MultipleSelect
// wird von generiereHtmlFuerSelectmenu aufgerufen
// FeldWert ist ein Array
function generiereHtmlFuerMultipleselectOptionen(FeldName, FeldWert, Optionen) {
	var i, HtmlContainer, Optionn, ListItem;
	HtmlContainer = "\n\t\t<option value=''></option>";
	for (i in Optionen) {
		if (typeof i !== "function") {
			Optionn = Optionen[i];
			ListItem = "\n\t\t<option value='";
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
}

(function ($) {
	// friendly helper http://tinyurl.com/6aow6yn
	// Läuft durch alle Felder im Formular
	// Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
	// nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
	$.fn.serializeObject = function () {
		var o, a;
		o = {};
		a = this.serializeArray();
		$.each(a, function () {
			if (this.value) {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value);
				} else {
					if (myTypeOf(this.value) === "integer") {
						// typ ist Int
						o[this.name] = parseInt(this.value, 10);
					} else if (myTypeOf(this.value) === "float") {
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
	$.fn.serializeObjectNull = function () {
		var o, a;
		o = {};
		a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value);
			} else {
				if (myTypeOf(this.value) === "integer") {
					// typ ist Int
					o[this.name] = parseInt(this.value, 10);
				} else if (myTypeOf(this.value) === "float") {
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

// Codeausführung für Anzahl Millisekunden unterbrechen
// Quelle: //sean.co.uk/a/webdesign/javascriptdelay.shtm
// grauenhafte Methode - blockiert die CPU!!
function warte(ms) {
	ms += new Date().getTime();
	while (new Date() < ms) {}
}

// verorted mit Hilfe aller Methoden
// wird benutzt von BeobEdit.html und hOrtEdit.html
// erwartet die docId, um am Ende der Verortung die neuen Koordinaten zu speichern
function GetGeolocation(docId, OrtOderBeob) {
	// benötigte Variabeln setzen
	localStorage.docId = docId;
	// Zweck: Genau solange animieren, wie verortet wird
	localStorage.NavbarVerortungAnimieren = "true";
	// übergebene Herkunft (Ort oder Beob) für die listeners bereitstellen
	localStorage.OrtOderBeob = OrtOderBeob;
	// dem Benutzer zeigen, dass verortet wird
	NavbarVerortungAnimieren();
	// Koordinaten zurücksetzen
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oHöhe;
	delete localStorage.oHöheGenauigkeit;
	// Mit der Verortung beginnen
	watchID = null;
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { frequency: 3000, enableHighAccuracy: true });
	// nach spätestens 20 Sekunden aufhören
	window.stop = setTimeout("stopGeolocation()", 20000);
	return watchID;
}

// solange verortet wird, 
// wird die Verortung in der Navbar jede Sekunde ein- und ausgeblendet
function NavbarVerortungAnimieren() {
	if (localStorage.NavbarVerortungAnimieren && localStorage.NavbarVerortungAnimieren === "true") {
		$(".neu").removeClass("ui-btn-active");
		$(".verorten").addClass("ui-btn-active").fadeToggle("slow");
		setTimeout("NavbarVerortungAnimieren()", 1000);
	} else {
		$(".verorten").removeClass("ui-btn-active").fadeIn("slow");
		//$(".neu").addClass("ui-btn-active");
	}
}

function GeolocationAuslesen(position) {
	localStorage.oLagegenauigkeit = Math.floor(position.coords.accuracy);
	localStorage.oLongitudeDecDeg = position.coords.longitude;
	localStorage.oLatitudeDecDeg = position.coords.latitude;
	localStorage.oXKoord = DdInChX(position.coords.latitude, position.coords.longitude);
	localStorage.oYKoord = DdInChY(position.coords.latitude, position.coords.longitude);
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
	speichereKoordinaten(localStorage.docId, localStorage.OrtOderBeob);
}

// Position ermitteln war erfolgreich
function onGeolocationSuccess(position) {
	// nur erste Position akzeptieren oder solche, die genauer sind als vorige
	if (!localStorage.oLagegenauigkeit || position.coords.accuracy < localStorage.oLagegenauigkeit) {
		if (position.coords.accuracy < 100) {
			GeolocationAuslesen(position);
			if (position.coords.accuracy <= 5) {
				stopGeolocation();
			}
		}
	}
}

// Position ermitteln war nicht erfolgreich
// onError Callback receives a PositionError object
function onGeolocationError(error) {
	melde("Keine Position erhalten\n" + error.message);
	stopGeolocation();
}

// Beendet Ermittlung der Position
function stopGeolocation() {
	// Positionssuche beenden
	// wenn keine watchID mehr, wurde sie schon beendet
	// stop timeout stoppen
	clearTimeout(stop);
	delete window.stop;
	delete localStorage.VerortungAbgeschlossen;
	// Vorsicht: In BeobEdit.html und hOrtEdit.html ist watchID nicht defined
	if (typeof watchID !== "undefined") {
		navigator.geolocation.clearWatch(watchID);
		delete window.watchID;
	}
	// Animation beenden
	delete localStorage.NavbarVerortungAnimieren;
	// auf den Erfolg reagieren
	if (localStorage.oLagegenauigkeit > 30) {
		melde("Koordinaten nicht sehr genau\nAuf Karte verorten?");
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
		speichereKoordinaten(localStorage.docId, localStorage.OrtOderBeob);
		melde("Keine genaue Position erhalten");
	}
	// Variablen aufräumen
	delete localStorage.docId;
	delete localStorage.OrtOderBeob;
}

// damit kann bei erneuter Anmeldung oeffneZuletztBenutzteSeite() die letzte Ansicht wiederherstellen
// host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
function speichereLetzteUrl() {
	localStorage.LetzteUrl = window.location.pathname + window.location.search;
}

function holeAutor() {
	// aAutor holen
	$db.openDoc("f19cd49bd7b7a150c895041a5d02acb0", {
		success: function (doc) {
			if (doc.Standardwert) {
				if (doc.Standardwert[localStorage.Email]) {
					localStorage.Autor = doc.Standardwert[localStorage.Email];
				}
			}
		}
	});
}

// speichert Anhänge
// setzt ein passendes Formular mit den feldern _rev und _attachments voraus
// nimmt den Formnamen entgegen respektive einen Anhang dazu, damit die Form ID eindeutig sein kann
// wird benutzt von allen Formularen mit Anhängen
function speichereAnhänge(id, Objekt, Page) {
	// prüfen, ob der Datensatz als Objekt übergeben wurde
	if (Objekt) {
		// das Objekt verwenden
		speichereAnhänge_2(id, Objekt, Page);
	} else {
		// Objekt aus der DB holen
		$db = $.couch.db("evab");
		$db.openDoc(id, {
			success: function (data) {
				window[Objekt.Typ] = data;
				speichereAnhänge_2(id, data, Page);
			},
			error: function () {
				melde("Fehler: Anhang nicht gespeichert");
			}
		});
	}
}

function speichereAnhänge_2(id, Objekt, Page) {
	$("#_rev" + Page).val(window[Objekt.Typ]._rev);
	$("#FormAnhänge" + Page).ajaxSubmit({
		url: "/evab/" + id,
		success: function () {
			// doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			$db.openDoc(id, {
				success: function (data2) {
					window[Objekt.Typ] = data2;
					// show attachments in form
					zeigeAttachments(data2, Page);
				},
				error: function () {
					melde("Uups, Anhang wird erst beim nächsten Mal angezeigt");
				}
			});
		},
		// form.jquery.js meldet einen Fehler, obwohl der Vorgang funktioniert!
		error: function () {
			// doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			$db.openDoc(id, {
				success: function (data3) {
					window[Objekt.Typ] = data3;
					zeigeAttachments(data3, Page);
				},
				error: function () {
					melde("Uups, Anhang wird erst beim nächsten Mal angezeigt");
				}
			});
		}
	});
}

// zeigt Anhänge im Formular an
// setzt ein passendes Formular mit dem Feld _attachments + Page voraus
// und eine div namens Anhänge + Page, in der die Anhänge angezeigt werden
// wird benutzt von allen (h)Beobachtungs-Edit-Formularen
// erwartet Page, damit sowohl das AttachmentFeld als auch das div um die Anhänge reinzuhängen eindeutig sind 
function zeigeAttachments(doc, Page) {
	var HtmlContainer, url, url_zumLöschen;
	HtmlContainer = "";
	$("#_attachments" + Page).val("");
	if (doc._attachments) {
		$.each(doc._attachments, function (Dateiname, val) {
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
}

// initiiert FelderWaehlen.html
// generiert dynamisch die Felder im Checkbox Felder
// checked diejenigen, die der User anzeigen will
function initiiereFelderWaehlen() {
	var TextUeberListe_FW, FeldlisteViewname;
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
	if (window[localStorage.FeldlisteFwName]) {
		initiiereFelderWaehlen_2();
	} else {
		// holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/' + FeldlisteViewname + '?include_docs=true', {
			success: function (data) {
				window[localStorage.FeldlisteFwName] = data;
				initiiereFelderWaehlen_2();
			}
		});
	}
}

function initiiereFelderWaehlen_2() {
	var HtmlContainer, anzFelder, Feld, FeldName, FeldBeschriftung, ListItem;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>";
	anzFelder = 0;
	for (var i in window[localStorage.FeldlisteFwName].rows) {
		Feld = window[localStorage.FeldlisteFwName].rows[i].doc;
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
	speichereLetzteUrl();
}

// kreiert ein neues Feld
// wird benutzt von FeldListe.html und FeldEdit.html
function neuesFeld() {
	var NeuesFeld;
	NeuesFeld = {};
	NeuesFeld.Typ = "Feld";
	NeuesFeld.User = localStorage.Email;
	NeuesFeld.SichtbarImModusEinfach = [];
	NeuesFeld.SichtbarImModusHierarchisch = [];
	// gleich sichtbar stellen
	NeuesFeld.SichtbarImModusEinfach.push(localStorage.Email);
	NeuesFeld.SichtbarImModusHierarchisch.push(localStorage.Email);
	$db = $.couch.db("evab");
	$db.saveDoc(NeuesFeld, {
		success: function (data) {
			localStorage.FeldId = data.id;
			NeuesFeld._id = data.id;
			NeuesFeld._rev = data.rev;
			window.Feld = NeuesFeld;
			// Feldliste soll neu aufgebaut werden
			leereStorageFeldListe();
			$(":mobile-pagecontainer").pagecontainer("change", "FeldEdit.html", { allowSamePageTransition : true });
		},
		error: function () {
			melde("Fehler: Feld nicht erzeugt");
		}
	});
}

function pruefeAnmeldung() {
	// Username Anmeldung überprüfen
	// Wenn angemeldet, globale Variable Username aktualisieren
	// Wenn nicht angemeldet, Anmeldedialog öffnen
	if (!localStorage.Email) {
		$.ajax({
			url: '/_session',
			dataType: 'json',
			async: false,
			success: function (session) {
				if (session.userCtx.name !== undefined && session.userCtx.name !== null) {
					localStorage.Email = session.userCtx.name;
				} else {
					localStorage.UserStatus = "neu";
					$.mobile.navigate("index.html");
				}
			}
		});
	}
}

// setzt die OrtId, damit hOrtEdit.html am richtigen Ort öffnet
// und ruft dann hOrtEdit.html auf
// wird von den Links in der Karte benutzt
function oeffneOrt(OrtId) {
	localStorage.OrtId = OrtId;
	$.mobile.navigate("hOrtEdit.html");
}

// setzt die BeobId, damit BeobEdit.html am richtigen Ort öffnet
// und ruft dann BeobEdit.html auf
// wird von den Links in der Karte auf BeobListe.html benutzt
function oeffneBeob(BeobId) {
	localStorage.BeobId = BeobId;
	$.mobile.navigate("BeobEdit.html");
}

// wird benutzt in Artenliste.html
// wird dort aufgerufen aus pageshow und pageinit, darum hierhin verlagert
// erwartet einen filterwert
// Wenn mehrmals nacheinander dieselbe Artenliste aufgerufen wird, soll wenn möglich die alte Liste verwendet werden können
// möglich ist dies wenn diese Faktoren gleich sind: Artgruppe, allfällige Unterauswahl
function initiiereArtenliste(filterwert) {
	// wenn alle drei Faktoren gleich sind, direkt die Artenliste erstellen
	// nur wenn eine Artenliste existiert. Grund: window.Artenliste lebt nicht so lang wie localStorage
	// aber die Artenliste aus der localStorage zu parsen macht auch keinen sinn
	if (window.Artenliste) {
		if (localStorage.aArtGruppeZuletzt === localStorage.aArtGruppe) {
			erstelleArtenliste(filterwert);
			return;
		}
	}
	// sonst aus der DB holen und die Variabeln aktualisieren
	localStorage.aArtGruppeZuletzt = localStorage.aArtGruppe;
	holeArtenliste(filterwert);
}

// wird benutzt in Artenliste.html
// aufgerufen von initiiereArtenliste
function holeArtenliste(filterwert) {
	viewname = 'evab/Artliste?startkey=["' + encodeURIComponent(localStorage.aArtGruppe) + '"]&endkey=["' + encodeURIComponent(localStorage.aArtGruppe) + '",{},{}]&include_docs=true';
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function (data) {
			window.Artenliste = data.rows;
			erstelleArtenliste(filterwert);
		}
	});
}

// bekommt eine Artenliste und baut damit im Formular die Artenliste auf
function erstelleArtenliste(filterwert) {
	var i,
		html_temp = "",
		html = "",
		ArtBezeichnung,
		Art,
		zähler = 0;
	// gefiltert werden muss nur, wenn mehr als 200 Arten aufgelistet würden
	if (window.Artenliste.length > 0) {
		if (filterwert) {
			artenliste_loop:
			for (i=0; i<window.Artenliste.length; i++) {
				if (zähler<200) {
					ArtBezeichnung = window.Artenliste[i].key[1];
					if (filterwert && ArtBezeichnung.toLowerCase().indexOf(filterwert) > -1) {
						zähler++;
						Art = window.Artenliste[i].doc;
						html_temp += holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
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
			if (window.Artenliste.length > 200) {
				// die ersten 200 anzeigen
				artenliste_loop_2:
				for (i=0; i<window.Artenliste.length; i++) {
					if (i<200) {
						ArtBezeichnung = window.Artenliste[i].key[1];
						Art = window.Artenliste[i].doc;
						html_temp += holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
					} else if (i === 200) {
						html += '<li class="artlistenhinweis">Die Artengruppe hat ' + window.Artenliste.length + ' Arten.<br>Um Mobilgeräte nicht zu überfordern, <b>werden nur die ersten 200 angezeigt</b>.<br>Tipp: Setzen Sie einen Filter</li>';
						break artenliste_loop_2;
					}
				}
				html += html_temp;
			} else {
				// weniger als 200 Arten, kein Filter. Alle anzeigen
				html += '<li class="artlistenhinweis">' + window.Artenliste.length + ' Arten angezeigt</li>';
				for (i=0; i<window.Artenliste.length; i++) {
					ArtBezeichnung = window.Artenliste[i].key[1];
					Art = window.Artenliste[i].doc;
					html += holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
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
}

function holeHtmlFürArtInArtenliste(Art, ArtBezeichnung) {
	var html;
	html = "<li name=\"ArtListItem\" ArtBezeichnung=\"";
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
}

// wird benutzt in Artgruppenliste.html
// aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListe() {
	// Artgruppenliste verfügbar machen
	if (window.Artgruppenliste) {
		erstelleArtgruppenListe_2();
	} else if (localStorage.Artgruppenliste) {
		window.Artgruppenliste = JSON.parse(localStorage.Artgruppenliste);
		erstelleArtgruppenListe_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/Artgruppen?include_docs=true', {
			success: function (data) {
				// Artgruppenliste bereitstellen
				window.Artgruppenliste = data;
				localStorage.Artgruppenliste = JSON.stringify(Artgruppenliste);
				erstelleArtgruppenListe_2();
			}
		});
	}
}

// wird benutzt in Artgruppenliste.html
// aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListe_2() {
	var i, y, html, ArtGruppe, row, AnzArten;
	html = "";
	for (i in window.Artgruppenliste.rows) {
		if (typeof i !== "function") {
			ArtGruppe = window.Artgruppenliste.rows[i].key;
			row = window.Artgruppenliste.rows[i].doc;
			AnzArten = row.AnzArten;
			html += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
			html += "<a href=\"#\"><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
		}
	}
	$("#agl_ArtgruppenListe").html(html);
	$("#agl_ArtgruppenListe").listview("refresh");
	$("#agl_Hinweistext").empty().remove();
}

// Stellt die Daten des Users bereit
// In der Regel nach gelungener Anmeldung
// Auch wenn eine Seite direkt geöffnet wird und die Userdaten vermisst
// braucht den Usernamen
function stelleUserDatenBereit() {
	$db = $.couch.db("evab");
	$db.view('evab/User?key="' + localStorage.Email + '"', {
		success: function (data) {
			// weitere anderswo benutzte Variabeln verfügbar machen
			holeAutor();
			// kontrollieren, ob User existiert
			// wenn nicht, kann es sein, dass dieser User sei Konto ursprünglich in ArtenDb erstellt hat
			if (data.rows.length === 0) {
				$.mobile.navigate("UserEdit.html");
				return;
			}
			if (data.Datenverwendung) {
				localStorage.Datenverwendung = data.Datenverwendung;
			}
			oeffneZuletztBenutzteSeite();
		}
	});
}

// wird benutzt von stelleUserDatenBereit()
// öffnet die zuletzt benutzte Seite oder BeobListe.html
function oeffneZuletztBenutzteSeite() {
	// unendliche Schlaufe verhindern, falls LetzteUrl auf diese Seite verweist
	if (localStorage.LetzteUrl && localStorage.LetzteUrl !== "/evab/_design/evab/index.html") {
		LetzteUrl = localStorage.LetzteUrl;
	} else {
		LetzteUrl = "BeobListe.html";
	}
	$.mobile.navigate(LetzteUrl);
}

// die nachfolgenden funktionen bereinigen die localStorage und die globalen Variabeln
// sie entfernen die im jeweiligen Formular ergänzten localStorage-Einträge
// mitLatLngListe gibt an, ob die Liste für die Karte auch entfernt werden soll

function leereAlleVariabeln(ohneClear) {
	// ohne clear: nötig, wenn man in FelderWaehlen.html ist und keine aufrufende Seite kennt
	// Username soll erhalten bleiben
	if (!ohneClear) {
		localStorage.clear();
	}
	delete localStorage.Autor;
	leereStorageProjektListe("mitLatLngListe");
	leereStorageProjektEdit("mitLatLngListe");
	leereStorageRaumListe("mitLatLngListe");
	leereStorageRaumEdit("mitLatLngListe");
	leereStorageOrtListe("mitLatLngListe");
	leereStorageOrtEdit();
	leereStorageZeitListe();
	leereStorageZeitEdit();
	leereStoragehBeobListe();
	leereStoragehBeobEdit();
	leereStorageBeobListe();
	leereStorageBeobEdit();
	leereStorageFeldListe();
	leereStorageFeldEdit();
}

function leereStorageProjektListe(mitLatLngListe) {
	delete window.Projektliste;
	if (mitLatLngListe) {
		delete window.hOrteLatLngProjektliste;
	}
}

// ohneId wird beim paginaten benutzt, da die ID übermittelt werden muss
function leereStorageProjektEdit(mitLatLngListe, ohneId) {
	if (!ohneId) {
		delete localStorage.ProjektId;
	}
	delete window.hProjekt;
	if (mitLatLngListe) {
		delete window.hOrteLatLngProjekt;
	}
	// hierarchisch tiefere Listen löschen
	delete window.RaeumeVonProjekt;
	delete window.OrteVonProjekt;
	delete window.OrteVonRaum;
	delete window.ZeitenVonProjekt;
	delete window.ZeitenVonRaum;
	delete window.ZeitenVonOrt;
	delete window.ArtenVonProjekt;
	delete window.ArtenVonRaum;
	delete window.ArtenVonOrt;
	delete window.ArtenVonZeit;
}

function leereStorageRaumListe(mitLatLngListe) {
	delete window.RaumListe;
	if (mitLatLngListe) {
		delete window.hOrteLatLngProjekt;
	}
	delete window.RaeumeVonProjekt;
}

function leereStorageRaumEdit(mitLatLngListe, ohneId) {
	if (!ohneId) {
		delete localStorage.RaumId;
	}
	delete window.hRaum;
	if (mitLatLngListe) {
		delete window.hOrteLatLngRaum;
	}
	// hierarchisch tiefere Listen löschen
	delete window.OrteVonProjekt;
	delete window.OrteVonRaum;
	delete window.ZeitenVonProjekt;
	delete window.ZeitenVonRaum;
	delete window.ZeitenVonOrt;
	delete window.ArtenVonProjekt;
	delete window.ArtenVonRaum;
	delete window.ArtenVonOrt;
	delete window.ArtenVonZeit;
}

function leereStorageOrtListe(mitLatLngListe) {
	delete window.OrtListe;
	if (mitLatLngListe) {
		delete window.hOrteLatLngRaum;
	}
	delete window.OrteVonProjekt;
	delete window.OrteVonRaum;
}

function leereStorageOrtEdit(ohneId) {
	if (!ohneId) {
		delete localStorage.OrtId;
	}
	delete window.hOrt;
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.aArtId;
	delete localStorage.aArtName;
	delete localStorage.aArtGruppe;
	// hierarchisch tiefere Listen löschen
	delete window.ZeitenVonProjekt;
	delete window.ZeitenVonRaum;
	delete window.ZeitenVonOrt;
	delete window.ArtenVonProjekt;
	delete window.ArtenVonRaum;
	delete window.ArtenVonOrt;
	delete window.ArtenVonZeit;
	// allfällige Lokalisierung abbrechen
	if (typeof watchID !== "undefined") {
		stopGeolocation();
	}
}

function leereStorageZeitListe() {
	delete window.ZeitListe;
	delete window.ZeitenVonProjekt;
	delete window.ZeitenVonRaum;
	delete window.ZeitenVonOrt;
}

function leereStorageZeitEdit(ohneId) {
	if (!ohneId) {
		delete localStorage.ZeitId;
	}
	delete window.hZeit;
	// hierarchisch tiefere Listen löschen
	delete window.ArtenVonProjekt;
	delete window.ArtenVonRaum;
	delete window.ArtenVonOrt;
	delete window.ArtenVonZeit;
}

function leereStoragehBeobListe() {
	delete window.hBeobListe;
	delete window.ArtenVonProjekt;
	delete window.ArtenVonRaum;
	delete window.ArtenVonOrt;
	delete window.ArtenVonZeit;
}

function leereStoragehBeobEdit(ohneId) {
	if (!ohneId) {
		delete localStorage.hBeobId;
	}
	delete window.hArt;
}

function leereStorageBeobListe() {
	delete window.BeobListe;
	delete window.BeobListeLatLng;
}

function leereStorageBeobEdit(ohneId) {
	if (!ohneId) {
		delete localStorage.BeobId;
	}
	delete window.Beobachtung;
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.aArtId;
	delete localStorage.aArtName;
	delete localStorage.aArtGruppe;
	// allfällige Lokalisierung abbrechen
	if (typeof watchID !== "undefined") {
		stopGeolocation();
	}
}

function leereStorageFeldListe() {
	delete window.Feldliste;
	delete window.FeldlisteBeobEdit;
	delete window.FeldlistehBeobEdit;
	delete window.FeldlisteZeitEdit;
	delete window.FeldlisteOrtEdit;
	delete window.FeldlisteRaumEdit;
	delete window.FeldlisteProjekt;
}

function leereStorageFeldEdit(ohneId) {
	if (!ohneId) {
		delete localStorage.FeldId;
	}
	delete window.Feld;
}

// setzt alle Felder im Modus Hierarchisch sichtbar
// Erwartet die Email
// Modus einfach wird hier nicht eingestellt: Die minimalen Felder sind fix programmiert
// wird verwendet in: Signup.html, UserEdit.html
function erstelleSichtbareFelder() {
	var viewname, Username;
	Username = localStorage.Email;
	$db = $.couch.db("evab");
	viewname = 'evab/FeldListeFeldName?include_docs=true';
	$db.view(viewname, {
		success: function (data) {
			var i, Feld;
			for (i in data.rows) {
				if (typeof i !== "function") {
					Feld = data.rows[i].doc;
					// Nur ausgewählte offizielle Felder berücksichtigen
					// if (Feld.User === "ZentrenBdKt") {
					if (["pBemerkungen", "rBemerkungen", "oLatitudeDecDeg", "oLongitudeDecDeg", "oHöhe", "oHöheGenauigkeit", "oBemerkungen", "zBemerkungen", "aArtNameUnsicher", "aArtNameEigener", "aArtNameBemerkungen", "aMenge", "aBemerkungen"].indexOf(Feld.FeldName) > -1) {
						$db.openDoc(Feld._id, {
							success: function (Feld) {
								Feld.SichtbarImModusHierarchisch.push(Username);
								$db.saveDoc(Feld);
							}
						});
					}
				}
			}
		}
	});
}

// Schreibt die Informationen des users in ein doc vom Typ User
// erstellt die sichtbaren Felder
// wird benutzt von: Signup.html, UserEdit.html
function speichereUserInEvab() {
	var doc;
	doc = {};
	doc._id = $('input[name=Email]').val();
	doc.Typ = "User";
	doc.Datenverwendung = localStorage.Datenverwendung || "JaAber";
	$db = $.couch.db("evab");
	$db.saveDoc(doc, {
		success: function (data) {
			// localStorage gründen
			localStorage.Email = $('input[name=Email]').val();
			localStorage.Autor = $("#Autor").val();
			// Autor speichern
			$db.openDoc("f19cd49bd7b7a150c895041a5d02acb0", {
				success: function (Feld) {
					// Autor speichern
					// Falls Standardwert noch nicht existiert, 
					// muss zuerst das Objekt geschaffen werden
					if (!Feld.Standardwert) {
						Feld.Standardwert = {};
					}
					Feld.Standardwert[localStorage.Email] = $("#Autor").val();
					$db.saveDoc(Feld, {
						success: function () {
							// Felder sictbar schalten
							erstelleSichtbareFelder();
							$.mobile.navigate("BeobListe.html");
						},
						error: function () {
							erstelleSichtbareFelder();
							melde("Konto erfolgreich erstellt\nAnmeldung gescheitert\nBitte melden Sie sich neu an");
						}
					});
				},
				error: function () {
					erstelleSichtbareFelder();
					melde("Konto erfolgreich erstellt\nAnmeldung gescheitert\nBitte melden Sie sich neu an");
				}
			});
		},
		error: function () {
			melde("Oh je, Ihr User konnte nicht erstellt werden, der Name ist jetzt aber belegt\nVersuchen Sie es mit einem anderen Benutzernamen\noder bitten Sie alex@gabriel-software.ch, den Namen wieder freizugeben");
		}
	});
}


/*
*validiert email-adressen
*Quelle: http://stackoverflow.com/questions/2507030/email-validation-using-jquery
*/
function validateEmail(email) {
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	if( !emailReg.test(email) ) {
		return false;
	} else {
		return true;
	}
}


// testet, ob die lokale Version erreichbar ist
// wenn ja, wird diese geöffnet, sonst arteigenschaften.ch
function oeffneArteigenschaftenVonArt(id) {
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
}

// wenn Artenliste.html initiiert wird
function handleAlPageinit() {
	$(document).on("keypress", handleAlKeypress);

	$("#al_Page").on("click", "#al_filter_setzen", handleAlAlFilterClick);

	$("#al_Page").on("click", ".ui-icon-delete", handleAlUiIconDeleteClick);

	$("#al_Page").on("click", "#al_standardgruppe", handleAlAlStandardgruppeClick);

	$("#al_ArtenListe").on("click", "[name='ArtListItem']", handleAlArtListItemClick);
}

// wenn Artenliste.html gezeigt wird
function handleAlPageshow() {
	initiiereArtenliste("");
	if (window.gruppe_merken) {
		$("#al_standardgruppe").removeClass('ui-disabled');
	} else {
		$("#al_standardgruppe").addClass('ui-disabled');
	}
}

// wenn Artenliste.html verschwindet
function handleAlPagehide() {
	$("#al_ArtenListe").hide();
}

// wenn in Artenliste.html eine Taste gedrückt wird
function handleAlKeypress() {
	if (event.which == 13) {
		var filterwert = $("#al_filter").val().toLowerCase();
		initiiereArtenliste(filterwert);
	}
}

// wenn in Artenliste.html #al_filter_setzen geklickt wird
function handleAlAlFilterClick() {
	var filterwert = $("#al_filter").val().toLowerCase();
	initiiereArtenliste(filterwert);
}

// wenn in Artenliste.html .ui-icon-delete geklickt wird
function handleAlUiIconDeleteClick() {
	var filterwert = "";
	initiiereArtenliste(filterwert);
}

// wenn in Artenliste.html #al_standardgruppe geklickt wird
function handleAlAlStandardgruppeClick() {
	delete window.gruppe_merken;
	$.mobile.navigate("Artgruppenliste.html");
}

// wenn in Artenliste.html [name='ArtListItem'] geklickt wird
function handleAlArtListItemClick() {
	event.preventDefault();
	var ArtBezeichnung = $(this).attr("ArtBezeichnung");
	localStorage.aArtId = $(this).attr("artid");
	if (localStorage.Status === "neu") {
		speichereNeueBeob(ArtBezeichnung);
	} else {
		speichereBeobNeueArtgruppeArt(ArtBezeichnung);
	}
}

// wenn Artgruppenliste.html erscheint
function handleAglPageshow() {
	erstelleArtgruppenListe();
	delete window.gruppe_merken;
}

// wenn Artgruppenliste.html verschwindet
function handleAglPagehide() {
	$("#agl_standardgruppe").html("nächste Gruppe merken");
}

// wenn Artgruppenliste.html initiiert wird
function handleAglPageinit() {
	// Vorsicht: Genauer als body funktioniert hier nicht,
	// weil die nested List im DOM jedes mal eine eigene Page aufbaut
	$("body").on("click", "[name='ArtgruppenListItem']", handleAglArtgruppenListItemClick);

	$("#agl_Page").on("click", "#agl_standardgruppe", handleAglAglStandardgruppeClick);
}

// wenn in Artgruppenliste.html [name='ArtgruppenListItem'] geklickt wird
function handleAglArtgruppenListItemClick() {
	event.preventDefault();
	localStorage.aArtGruppe = $(this).attr("ArtGruppe");
	// wenn die Gruppe gemerkt werden soll, sie als globale Variable speichern
	if (window.gruppe_merken) {
		window.gruppe_merken = $(this).attr("ArtGruppe");
	}
	$.mobile.navigate("Artenliste.html");
}

// wenn in Artgruppenliste.html #agl_standardgruppe geklickt wird
function handleAglAglStandardgruppeClick() {
	if ($(this).html() === "nächste Gruppe merken") {
		window.gruppe_merken = true;
		$(this).html("nächste Gruppe wird gemerkt");
	} else {
		delete window.gruppe_merken;
		$(this).html("nächste Gruppe merken");
	}
}

// wenn BeobEdit.html erscheint
function handleBeobEditPageshow() {
	// Sollte keine id vorliegen, zu BeobListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.BeobId || localStorage.BeobId === "undefined")) {
		leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
		return;
	}
	initiiereBeobEdit();
}

// wenn BeobEdit.html verschwindet
function handleBeobEditPagehide() {
	if (typeof watchID !== "undefined") {
		stopGeolocation();
	}
}

// wenn BeobEdit.html initiiert wird
function handleBeobEditPageinit() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.BeobId || localStorage.BeobId === "undefined")) {
		leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
		return;
	}

	$("#BeobEditHeader").on("click", "#OeffneBeobListeBeobEdit", handleOeffneBeobListeBeobEditClick);

	$("#BeobEditPageFooterNavbar").on("click", "#NeueBeobBeobEdit", handleNeueBeobBeobEditClick);

	$("#BeobEditForm").on("click", "[name='aArtGruppe']", handleBeobEditAArtGruppeClick);

	$("#BeobEditPageFooterNavbar").on("click", "#waehleFelderBeobEdit", handleWaehleFelderBeobEditClick);

	$("#BeobEditForm").on('click', '[name="aArtName"]', handleBeobEditAArtnameClick);

	$("#BeobEditForm").on("change", ".speichern", handleBeobEditSpeichernChange);

	$("#BeobEditForm").on("blur slidestop", '.speichernSlider', handleBeobEditSpeichernSliderBlurSlidestop);

	$("#BeobEditForm").on("mouseup", '.ui-slider-input', handleBeobEditUiSliderInputMouseup);

	$("#FormAnhängeBE").on("change", ".speichernAnhang", handleBeobEditSpeichernAnhangChange);

	$("#BeobEditPageFooterNavbar").on('click', "#OeffneKarteBeobEdit", handleBeobEditOeffneKarteClick);

	$("#BeobEditPageFooterNavbar").on('click', "#verorteBeobBeobEdit", handleBeobEditVerorteBeobClick);

	$('#BeobEditPageFooterNavbar').on('click', '#LoescheBeobBeobEdit', handleBeobEditLoescheBeobClick);

	$("#beob_löschen_meldung").on("click", "#beob_löschen_meldung_ja_loeschen", löscheBeob);

	$("#BeobEditPage").on("swipeleft", "#BeobEditContent", handleBeobEditContentSwipeleft);

	$("#BeobEditPage").on("swiperight", "#BeobEditContent", handleBeobEditContentSwiperight);

	$("#BeobEditPage").on("vclick", ".ui-pagination-prev", handleBeobEditUiPaginationPrevVclick);

	$("#BeobEditPage").on("vclick", ".ui-pagination-next", handleBeobEditUiPaginationNextVclick);

	$("#BeobEditPage").on("keyup", handleBeobEditKeyup);

	$("#FormAnhängeBE").on("click", "[name='LöscheAnhang']", handleBeobEditLoescheAnhangClick);

	$('#MenuBeobEdit').on('click', '.menu_arteigenschaften', handleBeobEditMenuArteigenschaftenClick);

	$('#MenuBeobEdit').on('click', '.menu_hierarchischer_modus', handleBeobEditMenuHierarchischerModusClick);

	$('#MenuBeobEdit').on('click', '.menu_felder_verwalten', handleBeobEditMenuFelderVerwaltenClick);

	$('#MenuBeobEdit').on('click', '.menu_beob_exportieren', handleBeobEditMenuBeobExportierenClick);

	$('#MenuBeobEdit').on('click', '.menu_einstellungen', handleBeobEditMenuEinstellungenClick);

	$('#MenuBeobEdit').on('click', '.menu_lokal_installieren', handleBeobEditMenuLokalInstallierenClick);

	$('#MenuBeobEdit').on('click', '.menu_neu_anmelden', handleBeobEditMenuNeuAnmeldenClick);
}

// wenn in BeobEdit.html #OeffneBeobListeBeobEdit geklickt wird
function handleOeffneBeobListeBeobEditClick() {
	leereStorageBeobEdit();
	$.mobile.navigate("BeobListe.html");
}

// wenn in BeobEdit.html #NeueBeobBeobEdit geklickt wird
// neue Beobachtung erfassen
function handleNeueBeobBeobEditClick() {
	event.preventDefault();
	// Globale Variable für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	leereStorageBeobListe();
	localStorage.Status = "neu";
	localStorage.Von = "BeobEdit";
	if (window.gruppe_merken) {
		// Artgruppenliste auslassen
		// localStorage.ArtGruppe ist schon gesetzt
		$.mobile.navigate("Artenliste.html");
	} else {
		$.mobile.navigate("Artgruppenliste.html");
	}
}

// wenn in BeobEdit.html [name='aArtGruppe'] geklickt wird
// Editieren von Beobachtungen managen, ausgehend von Artgruppe
function handleBeobEditAArtGruppeClick() {
	event.preventDefault();
	// Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	leereStorageBeobListe();
	delete localStorage.Status;	// ja kein Status neu
	localStorage.Von = "BeobEdit";
	if (window.gruppe_merken) {
		// Artgruppenliste auslassen
		// localStorage.aArtGruppe ist schon gesetzt
		$.mobile.navigate("Artenliste.html");
	} else {
		$.mobile.navigate("Artgruppenliste.html");
	}
}

// wenn in BeobEdit.html #waehleFelderBeobEdit geklickt wird
// sichtbare Felder wählen
function handleWaehleFelderBeobEditClick() {
	event.preventDefault();
	localStorage.AufrufendeSeiteFW = "BeobEdit";
	$.mobile.navigate("FelderWaehlen.html");
}

// wenn in BeobEdit.html [name="aArtName"] geklickt wird
// Editieren von Beobachtungen managen, ausgehend von ArtName
function handleBeobEditAArtnameClick() {
	event.preventDefault();
	// Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	leereStorageBeobListe();
	localStorage.Von = "BeobEdit";
	$.mobile.navigate("Artenliste.html");
}

// wenn in BeobEdit.html .speichern geändert wird
// Für jedes Feld bei Änderung speichern
function handleBeobEditSpeichernChange() {
	if (['oXKoord', 'oYKoord'].indexOf(this.name) > -1 && $("[name='oXKoord']").val() && $("[name='oYKoord']").val()) {
		// Wenn Koordinaten und beide erfasst
		localStorage.oXKoord = $("[name='oXKoord']").val();
		localStorage.oYKoord = $("[name='oYKoord']").val();
		// Längen- und Breitengrade berechnen
		localStorage.oLongitudeDecDeg = CHtoWGSlng(localStorage.oYKoord, localStorage.oXKoord);
		localStorage.oLatitudeDecDeg = CHtoWGSlat(localStorage.oYKoord, localStorage.oXKoord);
		localStorage.oLagegenauigkeit = null;
		// und Koordinaten speichern
		speichereKoordinaten(localStorage.BeobId, "Beobachtung");
	} else {
		speichereBeob(this);
	}
}

// wenn in BeobEdit.html .speichernSlider blurt
// ungelöstes Problem: swipe reagiert!
// Eingabe im Zahlenfeld abfangen (blur)
// Ende des Schiebens abfangen (slidestop)
function handleBeobEditSpeichernSliderBlurSlidestop() {
	speichereBeob(this);
}

// wenn in BeobEdit.html .ui-slider-input mouseup geschieht
// Klicken auf den Pfeilen im Zahlenfeld abfangen
function handleBeobEditUiSliderInputMouseup() {
	speichereBeob(this);
}

// wenn in BeobEdit.html .speichernAnhang geändert wird
// Änderungen im Formular für Anhänge speichern
function handleBeobEditSpeichernAnhangChange() {
	var _attachments = $("#_attachmentsBE").val();
	if (_attachments && _attachments.length !== 0) {
		speichereAnhänge(localStorage.BeobId, window.Beobachtung, "BE");
	}
}

// wenn in BeobEdit.html #OeffneKarteBeobEdit geklickt wird
function handleBeobEditOeffneKarteClick() {
	event.preventDefault();
	localStorage.zurueck = "BeobEdit";
	$.mobile.navigate("Karte.html");
}

// wenn in BeobEdit.html #verorteBeobBeobEdit geklickt wird
function handleBeobEditVerorteBeobClick() {
	event.preventDefault();
	GetGeolocation(localStorage.BeobId, "Beob");
}

// wenn in BeobEdit.html #LoescheBeobBeobEdit geklickt wird
// Löschen-Dialog öffnen
function handleBeobEditLoescheBeobClick() {
	event.preventDefault();
	$("#beob_löschen_meldung").popup("open");
}

// wenn in BeobEdit.html auf #BeobEditContent nach links gewischt wird
function handleBeobEditContentSwipeleft() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		nächsteVorigeBeob("nächste");
	}
}

// wenn in BeobEdit.html auf #BeobEditContent nach rechts gewischt wird
function handleBeobEditContentSwiperight() {
	if (!$("*:focus").attr("aria-valuenow")) {
		// kein slider
		nächsteVorigeBeob("vorige");
	}
}

// wenn in BeobEdit.html .ui-pagination-prev geklickt wird
// zum vorigen Datensatz wechseln
function handleBeobEditUiPaginationPrevVclick() {
	event.preventDefault();
	nächsteVorigeBeob('vorige');
}

// wenn in BeobEdit.html .ui-pagination-next geklickt wird
// zum nächsten Datensatz wechseln
function handleBeobEditUiPaginationNextVclick() {
	event.preventDefault();
	nächsteVorigeBeob('nächste');
}

// wenn in BeobEdit.html keyup erfolgt
// Wechsel zwischen Datensätzen via Pfeiltasten steuern
function handleBeobEditKeyup() {
	// nur reagieren, wenn BeobEditPage sichtbar und Fokus nicht in einem Feld
	if (!$(event.target).is("input, textarea, select, button") && $('#BeobEditPage').is(':visible')) {
		// Left arrow
		if (event.keyCode === $.mobile.keyCode.LEFT) {
			nächsteVorigeBeob('vorige');
			event.preventDefault();
		}
		// Right arrow
		else if (event.keyCode === $.mobile.keyCode.RIGHT) {
			nächsteVorigeBeob('nächste');
			event.preventDefault();
		}
	}
}

// wenn in BeobEdit.html [name='LöscheAnhang'] geklickt wird
function handleBeobEditLoescheAnhangClick() {
	event.preventDefault();
	loescheAnhang(this, window.Beobachtung, localStorage.BeobId);
}

// wenn in BeobEdit.html .menu_arteigenschaften geklickt wird
function handleBeobEditMenuArteigenschaftenClick() {
	oeffneArteigenschaftenVonArt(window.Beobachtung.aArtId);
}

// wenn in BeobEdit.html .menu_hierarchischer_modus geklickt wird
function handleBeobEditMenuHierarchischerModusClick() {
	leereStorageBeobEdit();
	$.mobile.navigate("hProjektListe.html");
}

// wenn in BeobEdit.html .menu_felder_verwalten geklickt wird
function handleBeobEditMenuFelderVerwaltenClick() {
	localStorage.zurueck = "BeobEdit.html";
	$.mobile.navigate("FeldListe.html");
}

// wenn in BeobEdit.html .menu_beob_exportieren geklickt wird
function handleBeobEditMenuBeobExportierenClick() {
	window.open('_list/ExportBeob/ExportBeob?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuBeobEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuBeobEdit").popup("close");
}

// wenn in BeobEdit.html .menu_einstellungen geklickt wird
function handleBeobEditMenuEinstellungenClick() {
	localStorage.zurueck = "BeobEdit.html";
	öffneMeineEinstellungen();
}

// wenn in BeobEdit.html .menu_lokal_installieren geklickt wird
function handleBeobEditMenuLokalInstallierenClick() {
	localStorage.zurueck = "BeobEdit.html";
	$.mobile.navigate("Installieren.html");
}

// wenn in BeobEdit.html .menu_neu_anmelden geklickt wird
function handleBeobEditMenuNeuAnmeldenClick() {
	localStorage.UserStatus = "neu";
	$.mobile.navigate("index.html");
}

// wenn BeobListe.html erscheint
function handleBeobListePageshow() {
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	}
	initiiereBeobliste();
}

// Wenn BeobListe.html initiiert wird
function handleBeobListePageinit() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	}

	$("#BeoblisteBL").on("swipeleft click", ".beob", handleBeobListeBeobSwipeleftClick);

	$("#BeoblisteBL").on("taphold", ".beob", handleBeobListeBeobTaphold);

	$("#BeobListePageFooter").on('click', '#OeffneKarteBeobListe', handleBeobListeOeffneKarteBeobListeClick);

	$("#BeobListePageHeader").on('click', "#OeffneProjektListeBeobListe", handleBeobListeOeffneProjektListeBeobListeClick);

	$("#BeobListePage").on("click", ".NeueBeobBeobListe", handleBeobListeNeueBeobBeobListeClick);

	$("#BeoblisteBL").on("swipeleft", ".erste", erstelleNeueBeob_1_Artgruppenliste);

	$("#BeobListePage").on("swiperight", "#BeobListePageContent", handleBeobListeBeobListePageContentSwiperight);

	$('#MenuBeobListe').on('click', '.menu_hierarchischer_modus', handleBeobListeMenuHierarchischerModusClick);

	$('#MenuBeobListe').on('click', '.menu_felder_verwalten', handleBeobListeMenuFelderVerwaltenClick);

	$('#MenuBeobListe').on('click', '.menu_beob_exportieren', handleBeobListeMenuBeobExportierenClick);

	$('#MenuBeobListe').on('click', '.menu_einstellungen', handleBeobListeMenuEinstellungenClick);

	$('#MenuBeobListe').on('click', '.menu_lokal_installieren', handleBeobListeMenuLokalInstallierenClick);

	$('#MenuBeobListe').on('click', '.menu_neu_anmelden', handleBeobListeMenuNeuAnmeldenClick);
}

// wenn in BeobListe.html .beob geklickt oder nach links geswiped wird
function handleBeobListeBeobSwipeleftClick() {
	localStorage.BeobId = $(this).attr('id');
	$.mobile.navigate("BeobEdit.html");
}

// wenn in BeobListe.html .beob taphold
function handleBeobListeBeobTaphold() {
	// FUNKTIONIERT NICHT, WEIL JQUERY MOBILE NACH TAPHOLD IMMER EINEN TAP AUSFÜHRT!!!!!!!!!!!!!!!	
	console.log('taphold');
}

// wenn in BeobListe.html #OeffneKarteBeobListe geklickt wird
function handleBeobListeOeffneKarteBeobListeClick() {
	event.preventDefault();
	localStorage.zurueck = "BeobListe";
	$.mobile.navigate("Karte.html");
}

// wenn in BeobListe.html #OeffneProjektListeBeobListe geklickt wird
function handleBeobListeOeffneProjektListeBeobListeClick() {
	event.preventDefault();
	$.mobile.navigate("hProjektListe.html");
}

// wenn in BeobListe.html .NeueBeobBeobListe geklickt wird
// Neue Beobachtung managen
function handleBeobListeNeueBeobBeobListeClick() {
	event.preventDefault();
	erstelleNeueBeob_1_Artgruppenliste();
}

// wenn in BeobListe.html #BeobListePageContent nach rechts gewischt wird
function handleBeobListeBeobListePageContentSwiperight() {
	$.mobile.navigate("hProjektListe.html");
}

// wenn in BeobListe.html .menu_hierarchischer_modus geklickt wird
function handleBeobListeMenuHierarchischerModusClick() {
	$.mobile.navigate("hProjektListe.html");
}

// wenn in BeobListe.html .menu_felder_verwalten geklickt wird
function handleBeobListeMenuFelderVerwaltenClick() {
	localStorage.zurueck = "BeobListe.html";
	$.mobile.navigate("FeldListe.html");
}

// wenn in BeobListe.html .menu_beob_exportieren geklickt wird
function handleBeobListeMenuBeobExportierenClick() {
	window.open('_list/ExportBeob/ExportBeob?startkey=["' + localStorage.Email + '"]&endkey=["' + localStorage.Email + '",{},{}]&include_docs=true');
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuBeobListe").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuBeobListe").popup("close");
}

// wenn in BeobListe.html .menu_einstellungen geklickt wird
function handleBeobListeMenuEinstellungenClick() {
	localStorage.zurueck = "BeobListe.html";
	öffneMeineEinstellungen();
}

// wenn in BeobListe.html .menu_lokal_installieren geklickt wird
function handleBeobListeMenuLokalInstallierenClick() {
	localStorage.zurueck = "BeobListe.html";
	$.mobile.navigate("Installieren.html");
}

// wenn in BeobListe.html .menu_neu_anmelden geklickt wird
function handleBeobListeMenuNeuAnmeldenClick() {
	localStorage.UserStatus = "neu";
	$.mobile.navigate("index.html");
}

// wenn FeldEdit.html erscheint
// Sollte keine id vorliegen, zu FeldListe.html wechseln
// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
function handleFeldEditPageshow() {
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.FeldId || localStorage.FeldId === "undefined")) {
		leereAlleVariabeln("ohneClear");
		geheZurueckFE();
	}
	initiiereFeldEdit();
}

// wenn FeldEdit.html initiiert wird
// Code, der nur beim ersten Aufruf der Seite laufen soll
function handleFeldEditPageinit() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if ((!localStorage.Status || localStorage.Status === "undefined") && (!localStorage.FeldId || localStorage.FeldId === "undefined")) {
		leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
	}

	$("#FeldEditContent").on("change", ".Feldeigenschaften", handleFeldEditFeldeigenschaftenChange);

	$("#FeldEditForm").on("change", "#FeldFolgtNach", handleFeldEditFeldFolgtNachChange);

	$("#FeldEditFooter").on("click", "#NeuesFeldFeldEdit", handleFeldEditNeuesFeldFeldEditClick);

	$("#UserFeldForm").on("change", "#Standardwert", handleFeldEditStandardwertChange);

	$('#FeldEditFooter').on('click', '#LoescheFeldFeldEdit', handleFeldEditLoescheFeldFeldEditClick);

	$("#fe_löschen_meldung").on("click", "#fe_löschen_meldung_ja_loeschen", handleFeldEditFeLoeschenMeldungJaClick);

	$('#MenuFeldEdit').on('click', '.menu_datenfelder_exportieren', handleFeldEditMenuDatenfelderExportierenClick);

	$("#FeldEditHeader").on('click', '#zurueckFeldEdit', handleFeldEditZurueckFeldEditClick);

	$("#FeldEditPage").on("swipeleft", "#FeldEditContent", geheZumNächstenFeld);

	$("#FeldEditPage").on("swiperight", "#FeldEditContent", geheZumVorigenFeld);

	$("#FeldEditPage").on("vclick", ".ui-pagination-prev", handleFeldEditUiPaginationPrevClick);

	$("#FeldEditPage").on("vclick", ".ui-pagination-next", handleFeldEditUiPaginationNextClick);

	$("#FeldEditPage").on("keyup", handleFeldEditKeyup);
}

// wenn in FeldEdit.htm .Feldeigenschaften geändert wird
// jedes Feld aus Feldeigenschaften bei Änderung speichern
function handleFeldEditFeldeigenschaftenChange() {
	var AlterFeldWert;

	localStorage.FeldWert = this.value;
	if (this.name) {
		localStorage.FeldName = this.name;
		localStorage.AlterFeldWert = Feld[this.name];
	} else {
		localStorage.FeldName = this.id;
		localStorage.AlterFeldWert = Feld[this.id];
	}
	// Felder der Datenzentren dürfen nicht verändert werden
	// ausser Standardwert, dessen Änderung wird aber in einer anderen Funktion verarbeitet
	if (Feld.User === "ZentrenBdKt" && !$(this).hasClass('meineEinstellungen')) {
		// Feldwert zurücksetzen	
		if (localStorage.AlterFeldWert) {
			$("#" + localStorage.FeldName).val(localStorage.AlterFeldWert);
		} else {
			$("#" + localStorage.FeldName).val("");
		}
		delete localStorage.FeldName;
		delete localStorage.FeldWert;
		delete localStorage.AlterFeldWert;
		melde("Dies ist ein geschütztes Feld eines öffentlichen Datenzentrums<br><br>Statt dieses zu ändern können Sie ein eigenes Feld erstellen");
	} else if (localStorage.FeldName === "FeldName") {
		// Wenn eigener Feldname verändert wird, kontrollieren, dass er nicht schon verwendet wurde
		// ohne explizit auf undefined zu prüfen, akzeptierte die Bedingung einen alten Feldwert von 
		// undefined als o.k.!!!!
		if (localStorage.AlterFeldWert !== "undefined" && localStorage.AlterFeldWert) {
			// wenn ein alter Feldname existiert,
			// zählen, in wievielen Datensätzen das Feld verwendet wird
			$db = $.couch.db("evab");
			$db.view('evab/FeldSuche?key="' + localStorage.Email + '"&include_docs=true', {
				success: function (data) {
					var i, anzVorkommen, Datensatz, TempFeld, ds;
					anzVorkommen = 0;
					// zählen, in wievielen Datensätzen das bisherige Feld verwendet wird
					for (i in data.rows) {
						if (typeof i !== "function") {
							Datensatz = data.rows[i].doc; 
							TempFeld = Datensatz[localStorage.AlterFeldWert];
							if (TempFeld) {
								anzVorkommen += 1;
							}
						}
					}
					if (anzVorkommen === 0) {
						// alter Feldname wurde noch in keinem Datensatz verwendet
						// prüfen, ob der neue Feldname schon existiert
						// wenn ja: melden, zurückstellen
						// wenn nein: speichern
						pruefeFeldNamen();
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
						melde("Dieses Feld wird in " + anzVorkommen + " " + ds + " verwendet.<br>Es kann deshalb nicht verändert werden.<br>Bereinigen Sie zuerst die Daten.");
					}
				}
			});
		} else {
			// Vorher gab es keinen Feldnamen
			// prüfen, ob der neue Feldname schon existiert
			// wenn ja: melden, zurückstellen
			// wenn nein: speichern
			pruefeFeldNamen();
		}
	} else if (localStorage.FeldName === "Hierarchiestufe" && localStorage.FeldWert === "Art") {
		$(".FeldEditHeaderTitel").text(localStorage.FeldWert + ": " + Feld.FeldBeschriftung);
		leereStorageFeldListe();
		speichereFeldeigenschaften();
		// Wenn die Hierarchiestufe zu Art geändert wird, muss das Feld für die Artgruppe aufgebaut werden
		ArtGruppeAufbauenFeldEdit();
	} else if (localStorage.FeldName === "Hierarchiestufe" && localStorage.FeldWert !== "Art") {
		$(".FeldEditHeaderTitel").text(localStorage.FeldWert + ": " + Feld.FeldBeschriftung);
		if (window.Feld.Hierarchiestufe === "Art") {
			// Wenn die Hierarchiestufe Art war und geändert wird, muss das Feld für die Artgruppe entfernt werden
			$("#Artgruppenliste").empty();
		}
		leereStorageFeldListe();
		speichereFeldeigenschaften();
	} else {
		if (localStorage.FeldName === "FeldBeschriftung") {
			$(".FeldEditHeaderTitel").text(Feld.Hierarchiestufe + ": " + localStorage.FeldWert);
		}
		speichereFeldeigenschaften();
	}
}

// wenn in FeldEdit.htm #FeldFolgtNach geändert wird
function handleFeldEditFeldFolgtNachChange() {
	setzeReihenfolgeMitVorgaenger(this.value);
	// Feldliste soll neu aufgebaut werden
	delete window.Feldliste;
}

// wenn in FeldEdit.htm #NeuesFeldFeldEdit geklickt wird
function handleFeldEditNeuesFeldFeldEditClick() {
	event.preventDefault();
	neuesFeld();
}

// wenn in FeldEdit.htm #Standardwert geändert wird
function handleFeldEditStandardwertChange() {
	var Optionen = $("#Optionen").val() || [],	// undefined verhindern
		Feldwert = this.value || [],	// undefined verhindern
		LetzterFeldwert, 
		Formularelement, 
		StandardwertOptionen;
	if (Optionen.length > 0) {
		// es gibt Optionen. Der Standardwert muss eine oder allenfalls mehrere Optionen sein
		LetzterFeldwert = [];
		if (Feld.Standardwert) {
			if (Feld.Standardwert[localStorage.Email]) {
				LetzterFeldwert = Feld.Standardwert[localStorage.Email];
			}
		}
		// Standardwert in Array verwandeln
		StandardwertOptionen = [];
		if (Feldwert.length > 0) {
			// Fehler verhindern, falls Feldwert undefined ist
			StandardwertOptionen = Feldwert.split(",");
		}
		if (["multipleselect", "checkbox"].indexOf(Feld.Formularelement) > -1) {
			// alle StandardwertOptionen müssen Optionen sein
			for (i in StandardwertOptionen) {
				if (typeof i !== "function") {
					if (Optionen.indexOf(StandardwertOptionen[i]) === -1) {
						// ein Wert ist keine Option, abbrechen
						$("#Standardwert").val(LetzterFeldwert);
						melde("Bitte wählen Sie eine oder mehrere der Optionen");
						return;
					}
				}
			}
			// alle Werte sind Optionen
			speichereStandardwert();
		} else if (["toggleswitch", "selectmenu", "radio"].indexOf(Feld.Formularelement) > -1) {
			// Array darf nur ein Element enthalten
			if (StandardwertOptionen.length > 1) {
				// Array enthält mehrere Optionen, nicht zulässig
				$("#Standardwert").val(LetzterFeldwert);
				melde("Bitte wählen Sie nur EINE der Optionen");
			} else {
				// Array enthält eine einzige Option
				for (i in StandardwertOptionen) {
					if (typeof i !== "function") {
						if (Optionen.indexOf(StandardwertOptionen[i]) === -1) {
							// der Wert ist keine Option, abbrechen
							$("#Standardwert").val(LetzterFeldwert);
							melde("Bitte wählen Sie eine der Optionen");
							return;
						}
					}
				}
				// alle Werte sind Optionen
				speichereStandardwert();
				return;
			}
		} else {
			// Optionen sind erfasst, Feld braucht aber keine. Alle Werte akzeptieren
			speichereStandardwert();
		}
	} else {
		// Es gibt keine Optionen. Alle Standardwerte akzeptieren
		speichereStandardwert();
	}
}

// wenn in FeldEdit.htm #LoescheFeldFeldEdit geklickt wird
// Beim Löschen rückfragen
function handleFeldEditLoescheFeldFeldEditClick() {
	event.preventDefault();
	if (Feld.User === "ZentrenBdKt") {
		melde("Dies ist ein Feld eines nationalen Datenzentrums<br><br>Es kann nicht gelöscht werden<br><br>Sie können es ausblenden");
	} else {
		$("#fe_löschen_meldung").popup("open");
	}
}

// wenn in FeldEdit.htm #fe_löschen_meldung_ja_loeschen geklickt wird
function handleFeldEditFeLoeschenMeldungJaClick() {
	if (!Feld.FeldName) {
		// Ohne Feldname kann nicht kontrolliert werden, in wievielen Datensätzen das Feld vorkommt
		loescheFeld();
	} else {
		$db = $.couch.db("evab");
		// zählen, in wievielen Datensätzen das Feld verwendet wird
		$db.view('evab/FeldSuche?key="' + localStorage.Email + '"&include_docs=true', {
			success: function (data) {
				var i,
					anzVorkommen,
					Datensatz,
					TempFeld,
					ds;
				anzVorkommen = 0;
				for (i in data.rows) {
					if (typeof i !== "function") {
						Datensatz = data.rows[i].doc;
						TempFeld = Datensatz[Feld.FeldName];
						if (TempFeld) {
							anzVorkommen += 1;
						}
					}
				}
				if (anzVorkommen === 0) {
					loescheFeld();
				} else {
					ds = "Datensätzen";
					if (anzVorkommen === 1) {
						ds = "Datensatz";
					}
					melde("Löschen abgebrochen:<br>Dieses Feld wird in " + anzVorkommen + " " + ds + " verwendet<br>Bereinigen Sie zuerst die Daten");
				}
			}
		});
	}
}

// wenn in FeldEdit.htm .menu_datenfelder_exportieren geklickt wird
function handleFeldEditMenuDatenfelderExportierenClick() {
	window.open("_list/FeldExport/FeldListe?include_docs=true");
	// völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
	$("#MenuFeldEdit").popup();
	// ...bevor es geschlossen werden muss, weil es sonst offen bleibt
	$("#MenuFeldEdit").popup("close");
}

// wenn in FeldEdit.htm #zurueckFeldEdit geklickt wird (BackButton)
function handleFeldEditZurueckFeldEditClick() {
	event.preventDefault();
	geheZurueckFE();
}

// wenn in FeldEdit.htm .ui-pagination-prev geklickt wird
function handleFeldEditUiPaginationPrevClick() {
	event.preventDefault();
	geheZumVorigenFeld();
}

// wenn in FeldEdit.htm .ui-pagination-next geklickt wird
function handleFeldEditUiPaginationNextClick() {
	event.preventDefault();
	geheZumNächstenFeld();
}

// wenn in FeldEdit.htm eine Taste gedrückt wird
// mit Pfeiltasten Datensätze wechseln
function handleFeldEditKeyup() {
	// nur reagieren, wenn ProjektEditPage sichtbar und Fokus nicht in einem Feld
	if (!$(event.target).is("input, textarea, select, button") && $('#FeldEditPage').is(':visible')) {
		// Left arrow
		if (event.keyCode === $.mobile.keyCode.LEFT) {
			geheZumVorigenFeld();
			event.preventDefault();
		}
		// Right arrow
		else if (event.keyCode === $.mobile.keyCode.RIGHT) {
			geheZumNächstenFeld();
			event.preventDefault();
		}
	}
}

// wenn FelderWaehlen.html erscheint
function handleFelderWaehlenPageshow() {
	// Sollte keine id vorliegen, zu BeobListe.html wechseln
	// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
	// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
		return;
	} else if (!localStorage.AufrufendeSeiteFW || localStorage.AufrufendeSeiteFW === "undefined") {
		leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
		return;
	}
	initiiereFelderWaehlen();
}

// wenn FelderWaehlen.html verschwindet
function handleFelderWaehlenPagehide() {
	// globale Variabeln aufräumen
	delete localStorage.FeldlisteFwName;
	delete localStorage.KriterienFürZuWählendeFelder;
	delete localStorage.AufrufendeSeiteFW;
	// verhindern, dass beim nächsten Mal zuerst die alten Felder angezeigt werden
	$("#FeldlisteFW").empty();
}

// wenn FelderWaehlen.html initiiert wird
function handleFelderWaehlenPageinit() {
	// Wird diese Seite direkt aufgerufen und es gibt keinen localStorage,
	// muss auf index.html umgeleitet werden
	if (localStorage.length === 0 || !localStorage.Email) {
		leereAlleVariabeln();
		$.mobile.navigate("index.html");
	} else if (!localStorage.AufrufendeSeiteFW || localStorage.AufrufendeSeiteFW === "undefined") {
		// oh, kein zurück bekannt
		leereAlleVariabeln("ohneClear");
		$.mobile.navigate("BeobListe.html");
	}

	$("#FelderWaehlenPage").on("click", "#FelderWaehlenPage_back", handleFelderWaehlenBackClick);
	
	
	$("#FeldlisteFW").on("change", "input[name='Felder']", handleFelderWaehlenInputFelderChange);

	
	$("#FeldlisteFW").on("taphold", "[name='Felder']", handleFelderWaehlenFelderTaphold);
}

// wenn in FelderWaehlen.html #FelderWaehlenPage_back geklickt wird
function handleFelderWaehlenBackClick() {
	event.preventDefault();
	$.mobile.navigate(localStorage.AufrufendeSeiteFW + ".html");
}

// wenn in FelderWaehlen.html input[name='Felder'] geändert wird
// Felder speichern (checkbox)
function handleFelderWaehlenInputFelderChange() {
	var FeldName = $(this).prop("id"),
		FeldId = $(this).attr("feldid"),
		Feld,
		FeldPosition;
	for (i in window[localStorage.FeldlisteFwName].rows) {
		if (typeof window[localStorage.FeldlisteFwName] !== "function") {
			if (window[localStorage.FeldlisteFwName].rows[i].doc._id === FeldId) {
				Feld = window[localStorage.FeldlisteFwName].rows[i].doc;
				FeldPosition = parseInt(i);
				break;
			}
		}
	}
	var SichtbarImModusX, idx;
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
		success: function (data) {
			// neue rev holen
			Feld._rev = data.rev;
			// Änderung in Feldliste-Objekt speichern
			window[localStorage.FeldlisteFwName].rows[FeldPosition].doc = Feld;
		},
		error: function () {
			melde("Fehler: nicht gespeichert<br>Vielleicht klicken Sie zu schnell?");
		}
	});
}

// wenn in FelderWaehlen.html taphold erfolgt
// JETZT FOLGT VERSUCH, TAPHOLD ZU IMPLEMENTIEREN
// NOCH NICHT IMPLEMENTIERT
function handleFelderWaehlenFelderTaphold() {
	// Feld aufrufen. SCHEINT NICHT ZU FUNKTIONIEREN
	event.preventDefault();
	alert("taphold");
	öffneFeld(this.id);
}

function öffneFeld(FeldName) {
	$db = $.couch.db("evab");
	$db.view('evab/FeldListeFeldName?key="' + FeldName + '"?include_docs=true', {
		success: function (data) {
			localStorage.FeldId = data.rows[0].doc._id;
			localStorage.zurueck = "FelderWaehlen.html";
			$.mobile.navigate("FeldEdit.html");
		}
	});
}

// prüft neue oder umbenannte Feldnamen
// prüft, ob der neue Feldname schon existiert
// wenn ja: melden, zurückstellen
// wenn nein: speichern
// wird in FeldEdit.html verwendet
function pruefeFeldNamen() {
	$db = $.couch.db("evab");
	$db.view('evab/FeldNamen?key="' + localStorage.FeldWert + '"&include_docs=true', {
		success: function (data) {
			var i, key, TempFeld, AnzEigeneOderOffizielleFelderMitSelbemNamen;
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
				$("select#SichtbarImModusHierarchisch").slider("refresh");
				speichereFeldeigenschaften();
			} else {
				// Feldname kommt bei diesem User schon vor
				// Wert im Feld zurücksetzen
				if (localStorage.AlterFeldWert) {
					$("#FeldName").val(localStorage.AlterFeldWert);
				} else {
					$("#FeldName").val("");
				}
				setTimeout(function () { 
					$('#FeldName').focus(); 
				}, 50);  // need to use a timer so that .blur() can finish before you do .focus()
				melde("Feldname " + localStorage.FeldWert + "existiert schon<br>Wählen Sie einen anderen");
				delete localStorage.FeldName;
				delete localStorage.FeldWert;
				delete localStorage.AlterFeldWert;
			}
		},
		error: function () {
			// Wert im Feld zurücksetzen
			if (localStorage.AlterFeldWert) {
				$("#FeldName").val(localStorage.AlterFeldWert);
			} else {
				$("#FeldName").val("");
			}
			melde("Fehler: Änderung in " + localStorage.FeldName + " nicht gespeichert");
			delete localStorage.FeldName;
			delete localStorage.FeldWert;
			delete localStorage.AlterFeldWert;
		}
	});
}

// löscht Felder
// wird in FeldEdit.html verwendet
function loescheFeld() {
	if (window.Feld) {
		// Objekt nutzen
		loescheFeld_2();
	} else {
		// Feld aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(Feld._id, {
			success: function (data) {
				window.Feld = data;
				loescheFeld_2();
			},
			error: function () {
				melde("Fehler: nicht gelöscht");
			}
		});
	}
}

function loescheFeld_2() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.Feld, {
		success: function (data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.Feldliste) {
				for (i in window.Feldliste.rows) {
					if (window.Feldliste.rows[i].doc._id === data.id) {
						window.Feldliste.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine Feldliste mehr. Storage löschen
				leereStorageFeldListe();
			}
			leereStorageFeldEdit();
			$.mobile.navigate("FeldListe.html");
		},
		error: function () {
			melde("Fehler: nicht gelöscht");
		}
	});
}

// Öffnet das nächste Feld
// nächstes des letzten => melden
// erwartet die ID des aktuellen Datensatzes
// wird in FeldEdit.html verwendet
function geheZumNächstenFeld() {
	if (window.Feldliste) {
		// Feldliste aus globaler Variable verwenden - muss nicht geparst werden
		geheZumNächstenFeld_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/FeldListe?include_docs=true', {
			success: function (data) {
				window.Feldliste = data;
				geheZumNächstenFeld_2();
			}
		});
	}
}

function geheZumNächstenFeld_2() {
	var i, y, FeldIdAktuell, FeldIdNächstes, AnzFelder, AktFeld_i, AktFeld_y;
	AnzFelder = window.Feldliste.rows.length -1;
	for (i in window.Feldliste.rows) {
		if (typeof i !== "function") {
			// alle Felder durchlaufen, aktuelles eigenes oder offizielles suchen
			AktFeld_i = window.Feldliste.rows[i].doc;
			// vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
			if (AktFeld_i.User === localStorage.Email || AktFeld_i.User === "ZentrenBdKt") {
				// Nur eigene und offizielle Felder berücksichtigen
				FeldIdAktuell = window.Feldliste.rows[i].doc._id;
				if (FeldIdAktuell === localStorage.FeldId) {
					// das ist das aktuelle Feld
					// von hier aus vorwärts das nächste eigene oder offizielle suchen
					if (parseInt(i) < AnzFelder) {
						// das aktuelle Feld ist nicht das letzte
						for (y = parseInt(i)+1; y <= AnzFelder; y++) {
							// alle verbleibenden Felder durchlaufen, eigenes suchen
							AktFeld_y = window.Feldliste.rows[y].doc;
							// Nur eigene Felder und offizielle berücksichtigen
							if (AktFeld_y.User === localStorage.Email || AktFeld_y.User === "ZentrenBdKt") {
								// das ist das nächste eigene Feld > öffnen
								localStorage.FeldId = window.Feldliste.rows[parseInt(i)+1].doc._id;
								leereStorageFeldEdit("ohneId");
								initiiereFeldEdit();
								return;
							} else {
								if (y === AnzFelder) {
									// am letzten Feld angelangt und es ist kein eigenes
									melde("Das ist das letzte Feld");
									return;
								}
							}
						}
					} else {
						// das aktuelle Feld ist das letzte
						melde("Das ist das letzte Feld");
						return;
					}
				}
			}
		}
	}
}

// Öffnet das vorige Feld
// voriges des ersten => FeldListe
// erwartet die ID des aktuellen Datensatzes
// wird in FeldEdit.html verwendet
function geheZumVorigenFeld() {
	if (window.Feldliste) {
		// Feldliste aus globaler Variable verwenden - muss nicht geparst werden
		geheZumVorigenFeld_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/FeldListe?include_docs=true', {
			success: function (data) {
				window.Feldliste = data;
				geheZumVorigenFeld_2();
			}
		});
	}
}

function geheZumVorigenFeld_2() {
	var i, y, FeldIdAktuell, FeldIdVoriges, AnzFelder, AktFeld_i, AktFeld_y;
	AnzFelder = window.Feldliste.rows.length -1;
	for (i in window.Feldliste.rows) {
		if (typeof i !== "function") {
			// alle Felder durchlaufen, aktuelles eigenes oder offizielles suchen
			AktFeld_i = window.Feldliste.rows[i].doc;
			// vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
			if (AktFeld_i.User === localStorage.Email || AktFeld_i.User === "ZentrenBdKt") {
				// Nur eigene und offizielle Felder berücksichtigen
				FeldIdAktuell = window.Feldliste.rows[i].doc._id;
				if (FeldIdAktuell === localStorage.FeldId) {
					// das ist das aktuelle Feld
					// von hier aus rückwärts das nächste eigene oder offizielle suchen
					if (parseInt(i) > 0) {
						// das aktuelle Feld ist nicht das erste 
						for (y = parseInt(i)-1; y >= 0; y--) {
							// alle vorhergehenden Felder durchlaufen, eigenes suchen
							AktFeld_y = window.Feldliste.rows[y].doc;
							// Nur eigene Felder und offizielle berücksichtigen
							if (AktFeld_y.User === localStorage.Email || AktFeld_y.User === "ZentrenBdKt") {
								// das ist das nächstvorherige eigene Feld > öffnen
								FeldIdVoriges = window.Feldliste.rows[parseInt(i)-1].doc._id;
								localStorage.FeldId = FeldIdVoriges;
								leereStorageFeldEdit("ohneId");
								initiiereFeldEdit();
								return;
							} else {
								if (y === 1) {
									// am ersten Feld angelangt und es ist kein eigenes
									// wir gehen zur Feldliste
									geheZurueckFE();
									return;
								}
							}
						}
					} else {
						// das aktuelle Feld ist das erste
						// wir gehen zur Feldliste
						geheZurueckFE();
						return;
					}
				}
			}
		}
	}
}

// empfängt den Feldnamen des gewählten Vorgängers
// ermittelt dessen Reihenfolge
// sucht das nächste eigene Feld und setzt als Reihenfolge den Mittelwert der zwei Reihenfolgen
// Wenn kein weiteres eigenes Feld kommt, wird als Reihenfolge der nächste um mindestens 1 höhere ganzzahlige Wert gesetzt
// wird in FeldEdit.html verwendet
function setzeReihenfolgeMitVorgaenger(FeldNameVorgaenger) {
	var viewname;
	$db = $.couch.db("evab");
	viewname = 'evab/FeldListeFeldName?key="' + FeldNameVorgaenger + '"&include_docs=true';
	$db.view(viewname, {
		success: function (data) {
			var ReihenfolgeVorgaenger;
			ReihenfolgeVorgaenger = data.rows[0].doc.Reihenfolge;
			$("#Reihenfolge").val(Math.floor(ReihenfolgeVorgaenger + 1));
			speichereFeldeigenschaften();
		}
	});
}

// speichert, dass ein Wert als Standardwert verwendet werden soll
// wird in FeldEdit.html verwendet
function speichereStandardwert() {
	// Prüfen, ob Feld als Objekt vorliegt
	if (window.Feld) {
		// dieses verwenden
		speichereStandardwert_2();
	} else {
		// aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function (doc) {
				window.Feld = doc;
				speichereStandardwert_2();
			},
			error: function () {
				melde("Fehler: Feld nicht gespeichert");
			}
		});
	}

}

function speichereStandardwert_2() {
	var Feldwert;
	Feldwert = $("#Standardwert").val();
	// Standardwert managen
	// Standardwert ist Objekt, in dem die Werte für jeden User gespeichert werden
	// darum manuell für diesen User updaten
	if (window.Feld.Standardwert) {
		// Standardwert existierte
		if (Feldwert) {
			// neuen Standardwert setzen
			window.Feld.Standardwert[localStorage.Email] = Feldwert;
		} else {
			// Standardwert ist leer
			if (window.Feld.Standardwert[localStorage.Email]) {
				// bisherigen Standardwert löschen
				delete window.Feld.Standardwert[localStorage.Email];
			}
		}
	} else {
		// Bisher gab es noch keinen Standardwert
		if (Feldwert) {
			// Objekt für Standardwert schaffen und neuen Wert setzen
			window.Feld.Standardwert = {};
			window.Feld.Standardwert[localStorage.Email] = Feldwert;
		}
	}
	$db.saveDoc(window.Feld, {
		success: function (data) {
			window.Feld._rev = data.rev;
			localStorage.FeldId = data.id;
			// Feldlisten leeren, damit Standardwert sofort verwendet werden kann!
			leereStorageFeldListe();
		},
		error: function () {
			melde("Fehler: Feld nicht gespeichert");
		}
	});
}

// speichert Feldeigenschaften
// wird in FeldEdit.html verwendet
function speichereFeldeigenschaften() {
	// prüfen, ob das Feld als Objekt vorliegt
	if (window.Feld) {
		// bestehendes Objekt verwenden
		speichereFeldeigenschaften_2();
	} else {
		// Objekt aus der DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function (data) {
				window.Feld = data;
				speichereFeldeigenschaften_2();
			},
			error: function () {
				melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
			}
		});
	}
}

function speichereFeldeigenschaften_2() {
	var Formularfelder, idx1, idx2;
	Formularfelder = $("#FeldEditForm").serializeObjectNull();
	// Felder mit Arrays: Kommagetrennte Werte in Arrays verwandeln. Plötzlich nicht mehr nötig??!!
	if (Formularfelder.Optionen) {
		Formularfelder.Optionen = Formularfelder.Optionen.split(",");
	}
	/*if (window.Feld.ArtGruppe) {
		window.Feld.ArtGruppe = window.Feld.ArtGruppe.split(", ");
	}*/

	// Es braucht eine Hierrarchiestufe
	if (!Formularfelder.Hierarchiestufe && Formularfelder.Hierarchiestufe !== "undefined") {
		// keine vorhanden > Art setzen
		Formularfelder.Hierarchiestufe = "Art";
		$("#Art").prop("checked",true).checkboxradio("refresh");
		// und Artgruppenliste aufbauen
		ArtGruppeAufbauenFeldEdit();
	}
	// Wenn Beschriftung fehlt und Name existiert: Beschriftung = Name
	if (!Formularfelder.FeldBeschriftung && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
		Formularfelder.FeldBeschriftung = Formularfelder.FeldName;
		// Feldliste soll neu aufgebaut werden
		leereStorageFeldListe();
	}
	// Es braucht eine Reihenfolge
	if (!Formularfelder.Reihenfolge && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
		Formularfelder.Reihenfolge = 1;
		// Feldliste soll neu aufgebaut werden
		leereStorageFeldListe();
	}
	// Es braucht einen Feldtyp
	if (!Formularfelder.Formularelement && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
		Formularfelder.Formularelement = "textinput";
		Formularfelder.InputTyp = "text";
	}
	// Wenn Feldtyp von textinput weg geändert wurde, sollte InputTyp entfernt werden
	if (Formularfelder.Formularelement !== "textinput" && Formularfelder.InputTyp) {
		delete Formularfelder.InputTyp;
		$("#" + Feld.InputTyp).prop("checked",false).checkboxradio("refresh");
	}
	// Wenn Feldtyp gesetzt wurde, muss ein InputTyp existieren. Wenn er nicht gesetzt wurde, text setzen
	if (Formularfelder.Formularelement === "textinput" && !Formularfelder.InputTyp) {
		Formularfelder.InputTyp = "text";
	}
	// Sichtbarkeitseinstellungen: In einem Array werden die User aufgelistet, welche das Feld sehen
	// Es muss geprüft werden, ob der aktuelle User in diesem Array enthalten ist
	// Soll das Feld im Modus einfach sichtbar sein?
	idx1 = window.Feld.SichtbarImModusEinfach.indexOf(localStorage.Email);
	if ($("#SichtbarImModusEinfach").val() === "ja") {
		// User ergänzen, wenn noch nicht enthalten
		if (idx1 === -1) {
			window.Feld.SichtbarImModusEinfach.push(localStorage.Email);
		}
	} else {
		// User entfernen, wenn enthalten
		if (idx1 !== -1) {
			window.Feld.SichtbarImModusEinfach.splice(idx1, 1);
		}
	}
	// Soll das Feld im Modus hierarchisch sichtbar sein?
	idx2 = window.Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Email);
	if ($("#SichtbarImModusHierarchisch").val() === "ja") {
		// User ergänzen, wenn noch nicht enthalten
		if (idx2 === -1) {
			window.Feld.SichtbarImModusHierarchisch.push(localStorage.Email);
		}
	} else {
		// User entfernen, wenn enthalten
		if (idx2 !== -1) {
			window.Feld.SichtbarImModusHierarchisch.splice(idx2, 1);
		}
	}
	// Formularfelder in Dokument schreiben
	// setzt Vorhandensein von Feldnamen voraus!
	for (i in Formularfelder) {
		if (typeof i !== "function") {
			if (Formularfelder[i]) {
				if (i === "Reihenfolge" || i === "SliderMinimum" || i === "SliderMaximum") {
					// Zahl wird sonst in Text verwandelt und falsch sortiert
					window.Feld[i] = parseInt(Formularfelder[i]);
				} else {
					window.Feld[i] = Formularfelder[i];
				}
			} else {
				// leere Felder entfernen, damit werden auch soeben gelöschte Felder entfernt
				delete window.Feld[i];
			}
		}
	}
	$db.saveDoc(window.Feld, {
		success: function (data) {
			// rev aktualisieren
			window.Feld._rev = data.rev;
			localStorage.FeldId = data.id;
			// Feldliste soll neu aufbauen
			leereStorageFeldListe();
		},
		error: function () {
			melde("Fehler: Die letzte Änderung wurde nicht gespeichert");
		}
	});
	delete localStorage.FeldName;
	delete localStorage.FeldWert;
	delete localStorage.AlterFeldWert;
}

// wird in BeobListe.html verwendet
// eigene Funktion, weil auch die Beobliste darauf verweist, wenn noch keine Art erfasst wurde
function erstelleNeueBeob_1_Artgruppenliste() {
	// Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
	leereStorageBeobListe();
	localStorage.Status = "neu";
	localStorage.Von = "BeobListe";
	delete localStorage.aArtGruppe;	// verhindern, dass eine Artgruppe übergeben wird
	$.mobile.navigate("Artgruppenliste.html");
}


// wird in BeobEdit.html benutzt
// Öffnet die vorige oder nächste Beobachtung
// vorige der ersten => BeobListe
// nächste der letzten => melden
// erwartet ob nächster oder voriger gesucht wird
function nächsteVorigeBeob(NächsteOderVorige) {
	// prüfen, ob BeobListe schon existiert
	// nur abfragen, wenn sie noch nicht existiert
	if (window.BeobListe) {
		// globale Variable BeobListe existiert noch
		nächsteVorigeBeob_2(NächsteOderVorige);
	} else {
		// keine Projektliste übergeben
		// neu aus DB erstellen
		$db = $.couch.db("evab");
		$db.view('evab/BeobListe?startkey=["' + localStorage.Email + '",{}]&endkey=["' + localStorage.Email + '"]&descending=true&include_docs=true', {
			success: function (data) {
				// Globale Variable erstellen, damit Abfrage ab dem zweiten Mal nicht mehr nötig ist
				// bei neuen/Löschen von Beobachtungen wird BeobListe wieder auf undefined gesetzt
				window.BeobListe = data;
				nächsteVorigeBeob_2(NächsteOderVorige);
			}
		});
	}
}

function nächsteVorigeBeob_2(NächsteOderVorige) {
	var i,
		BeobIdAktuell,
		AnzBeob;
	for (i in window.BeobListe.rows) {
		BeobIdAktuell = window.BeobListe.rows[i].doc._id;
		AnzBeob = window.BeobListe.rows.length -1;		// vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
		if (BeobIdAktuell === localStorage.BeobId) {
			switch (NächsteOderVorige) {
			case "nächste":
				if (parseInt(i) < AnzBeob) {
					localStorage.BeobId = BeobListe.rows[parseInt(i)+1].doc._id;
					leereStorageBeobEdit("ohneId");
					initiiereBeobEdit();
					return;
				} else {
					melde("Das ist die letzte Beobachtung");
					return;
				}
				break;
			case "vorige":
				if (parseInt(i) > 0) {
					localStorage.BeobId = BeobListe.rows[parseInt(i)-1].doc._id;
					leereStorageBeobEdit("ohneId");
					initiiereBeobEdit();
					return;
				} else {
					leereStorageBeobEdit();
					$.mobile.navigate("BeobListe.html");
					return;
				}
				break;
			}
		}
	}
}

// wird in BeobEdit.html benutzt
// löscht eine Beobachtung
function löscheBeob() {
	if (window.Beobachtung) {
		// vorhandenes Objekt nutzen
		löscheBeob_2();
	} else {
		// Objekt aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.BeobId, {
			success: function (data) {
				window.Beobachtung = data;
				löscheBeob_2();
			},
			error: function () {
				melde("Fehler: Beobachtung nicht gelöscht");
			}
		});
	}
}

function löscheBeob_2() {
	$db = $.couch.db("evab");
	$db.removeDoc(window.Beobachtung, {
		success: function (data) {
			// Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
			if (window.BeobListe) {
				for (var i in window.BeobListe.rows) {
					if (window.BeobListe.rows[i].doc._id === data.id) {
						window.BeobListe.rows.splice(i, 1);
						break;
					}
				}
			} else {
				// Keine BeobListe mehr. Storage löschen
				leereStorageBeobListe;
			}
			leereStorageBeobEdit();
			$.mobile.navigate("BeobListe.html");
		},
		error: function () {
			melde("Fehler: Beobachtung nicht gelöscht");
		}
	});
}

// Speichert alle Daten in BeobEdit.html
function speichereBeob(that) {
	// prüfen, ob Beob als Objekt vorliegt
	if (window.Beobachtung) {
		// ja: dieses Objekt verwenden
		speichereBeob_2(that);
	} else {
		// nein: Beob aus DB holen
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.BeobId, {
			success: function (data) {
				window.Beobachtung = data;
				speichereBeob_2(that);
			},
			error: function () {
				console.log('fehler in function speichereBeob_2(that)');
			}
		});
	}
}

function speichereBeob_2(that) {
	var Feldname, Feldjson, Feldwert;
	if (myTypeOf($(that).attr("aria-valuenow")) !== "string") {
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
		if (myTypeOf(Feldwert) === "float") {
			window.Beobachtung[Feldname] = parseFloat(Feldwert);
		} else if (myTypeOf(Feldwert) === "integer") {
			window.Beobachtung[Feldname] = parseInt(Feldwert);
		} else {
			window.Beobachtung[Feldname] = Feldwert;
		}
	} else if (window.Beobachtung[Feldname]) {
		delete window.Beobachtung[Feldname]
	}
	window.Beobachtung.aArtGruppe = localStorage.aArtGruppe;
	window.Beobachtung.aArtName = localStorage.aArtName;
	window.Beobachtung.aArtId = localStorage.aArtId;
	// alles speichern
	$db.saveDoc(window.Beobachtung, {
		success: function(data) {
			window.Beobachtung._rev = data.rev;
		},
		error: function (data) {
			console.log('fehler in function speichereBeob_2(that)');
		}
	});
}


/*!
* jQuery Mobile Framework : drag pagination plugin
* Copyright (c) Filament Group, Inc
* Authored by Scott Jehl, scott@filamentgroup.com
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function ($, undefined) {

	// auto-init on pagecreate
	$(document).bind("pagecreate", function (e) {
		$(":jqmData(role='pagination')", e.target).pagination();
	});

	var pageTitle = "";

	// create widget
	$.widget("mobile.pagination", $.mobile.widget, {
		_create: function () {
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

			$links.each(function () {
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


/*
* Versuch, damit taphold funktioniert, ohne dass tap ausgelöst wird
* Quelle: http://stackoverflow.com/questions/11759049/tap-event-fired-after-taphold-jquery-mobile-1-1-1
* ausgeschaltet, weil die Detailseite trotzdem kurz angezeibt wird
*/
/*$.event.special.tap = {
	tapholdThreshold: 750,

	setup: function() {
		var thisObject = this,
			$this = $( thisObject );

		$this.bind( "vmousedown", function( event ) {

			if ( event.which && event.which !== 1 ) {
				return false;
			}

			var origTarget = event.target,
				origEvent = event.originalEvent,
				// Modified Here
				tapfired = false,
				timer;

			function clearTapTimer() {
				clearTimeout( timer );
			}

			function clearTapHandlers() {
				clearTapTimer();

				$this.unbind( "vclick", clickHandler )
					.unbind( "vmouseup", clearTapTimer );
				$( document ).unbind( "vmousecancel", clearTapHandlers );
			}

			function clickHandler( event ) {
				clearTapHandlers();

				// ONLY trigger a 'tap' event if the start target is
				// the same as the stop target.
				// Modified Here
				//if ( origTarget === event.target) {
				if ( origTarget === event.target && !tapfired) {
					triggerCustomEvent( thisObject, "tap", event );
				}
			}

			function triggerCustomEvent( obj, eventType, event ) {
				var originalType = event.type;
				event.type = eventType;
				$.event.dispatch.call( obj, event );
				event.type = originalType;
			}

			$this.bind( "vmouseup", clearTapTimer )
				.bind( "vclick", clickHandler );
			$( document ).bind( "vmousecancel", clearTapHandlers );

			timer = setTimeout( function() {
				tapfired = true;	// Modified Here
				triggerCustomEvent( thisObject, "taphold", $.Event( "taphold", { target: origTarget } ) );
			}, $.event.special.tap.tapholdThreshold );
		});
	}
};*/
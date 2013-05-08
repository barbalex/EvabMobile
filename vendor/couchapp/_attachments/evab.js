/*
Diese Funktionen werden in evab auf mehreren Seiten benutzt
*/

function erstelleNeuesDatum() {
	var jetzt, Jahr, Mnt, MntAusgabe, Tag, TagAusgabe, Datum;
	jetzt = new Date();
	Jahr = jetzt.getFullYear();
	Mnt = jetzt.getMonth()+1;
	MntAusgabe = ((Mnt < 10) ? "0" + Mnt : Mnt);
	Tag = jetzt.getDate();
	TagAusgabe = ((Tag < 10) ? "0" + Tag : Tag);
	Datum = Jahr + "-" + MntAusgabe + "-" + TagAusgabe;
	return Datum;
}

function erstelleNeueUhrzeit() {
	var jetzt, Std, StdAusgabe, Min, MinAusgabe, Sek, SekAusgabe, Zeit;
	jetzt = new Date();
	Std = jetzt.getHours();
	StdAusgabe = ((Std < 10) ? "0" + Std : Std);
	Min = jetzt.getMinutes();
	MinAusgabe = ((Min < 10) ? "0" + Min : Min);
	Sek = jetzt.getSeconds();
	SekAusgabe = ((Sek < 10) ? "0" + Sek : Sek);
	Zeit = StdAusgabe + ":" + MinAusgabe + ":" + SekAusgabe;
	return Zeit;
}


//wandelt decimal degrees (vom GPS) in WGS84 um
function DdInWgs84BreiteGrad(Breite) {
	var BreiteGrad;
	BreiteGrad = Math.floor(Breite);
	return BreiteGrad;
}

function DdInWgs84BreiteMin(Breite) {
	var BreiteGrad, BreiteMin;
	BreiteGrad = Math.floor(Breite);
	BreiteMin = Math.floor((Breite-BreiteGrad)*60);
	return BreiteMin;
}

function DdInWgs84BreiteSec(Breite) {
	var BreiteGrad, BreiteMin, BreiteSec;
	BreiteGrad = Math.floor(Breite);
	BreiteMin = Math.floor((Breite-BreiteGrad)*60);
	BreiteSec =  (Math.round((((Breite - BreiteGrad) - (BreiteMin/60)) * 60 * 60) * 100) / 100);
	return BreiteSec;
}

function DdInWgs84LaengeGrad(Laenge) {
	var LaengeGrad;
	LaengeGrad = Math.floor(Laenge);
	return LaengeGrad;
}

function DdInWgs84LaengeMin(Laenge) {
	var LaengeGrad, LaengeMin;
	LaengeGrad = Math.floor(Laenge);
	LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
	return LaengeMin;
}

function DdInWgs84LaengeSec(Laenge) {
	var LaengeGrad, LaengeMin, LaengeSec;
	LaengeGrad = Math.floor(Laenge);
	LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
	LaengeSec = (Math.round((((Laenge - LaengeGrad) - (LaengeMin/60)) * 60 * 60) * 100 ) / 100);
	return LaengeSec;
}

// Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
function Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
	var lat_aux, lng_aux;
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

//Wandelt WGS84 in CH-Landeskoordinaten um
function Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
	var lat_aux, lng_aux;
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

//wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
function DdInChX(Breite, Laenge) {
	var BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec, x;
	BreiteGrad = DdInWgs84BreiteGrad(Breite);
	BreiteMin = DdInWgs84BreiteMin(Breite);
	BreiteSec = DdInWgs84BreiteSec(Breite);
	LaengeGrad = DdInWgs84LaengeGrad(Laenge);
	LaengeMin = DdInWgs84LaengeMin(Laenge);
	LaengeSec = DdInWgs84LaengeSec(Laenge);
	x = Math.floor(Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return x;
}

function DdInChY(Breite, Laenge) {
	var BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec, y;
	BreiteGrad = DdInWgs84BreiteGrad(Breite);
	BreiteMin = DdInWgs84BreiteMin(Breite);
	BreiteSec = DdInWgs84BreiteSec(Breite);
	LaengeGrad = DdInWgs84LaengeGrad(Laenge);
	LaengeMin = DdInWgs84LaengeMin(Laenge);
	LaengeSec = DdInWgs84LaengeSec(Laenge);
	y = Math.floor(Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return y;
}

//von CH-Landeskoord zu DecDeg

// Convert CH y/x to WGS lat
function CHtoWGSlat(y, x) {
	// Converts militar to civil and to unit = 1000km
	var y_aux, x_aux;
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
	var y_aux, x_aux;
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
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h4>&nbsp;" + Meldung +"&nbsp;</h4></div>")
		.css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 150 })
		.appendTo($.mobile.pageContainer)
		.delay(2500)
		.fadeOut(700, function () {
			$(this).remove();
		});
}

//wird in FeldEdit.html verwendet
function geheZurueckFE() {
	leereStorageFeldEdit();
	if (localStorage.zurueck && localStorage.zurueck !== "FelderWaehlen.html") {
		//via die Feldliste zurück
		leereStorageFeldEdit();
		$.mobile.changePage("FeldListe.html");
	} else if (localStorage.zurueck && localStorage.zurueck === "FelderWaehlen.html") {
		//direkt zurück, Feldliste auslassen
		leereStorageFeldEdit();
		leereStorageFeldListe();
		$.mobile.changePage(localStorage.zurueck);
		delete localStorage.zurueck;
	} else {
		//uups, kein zurück vorhanden
		leereAlleVariabeln();
		$.mobile.changePage("BeobListe.html");
	}
}

//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//aufgerufen bloss von Artenliste.html
function speichereNeueBeob(aArtBezeichnung) {
	var doc;
	doc = {};
	doc.User = localStorage.Username;
	doc.aAutor = localStorage.Autor;
	doc.aArtGruppe = localStorage.aArtGruppe;
	delete localStorage.aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = localStorage.aArtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	if (localStorage.Von === "hArtListe" || localStorage.Von === "hArtEdit") {
		doc.Typ = "hArt";
		doc.hProjektId = localStorage.ProjektId;
		doc.hRaumId = localStorage.RaumId;
		doc.hOrtId = localStorage.OrtId;
		doc.hZeitId = localStorage.ZeitId;
		doc.aArtId = localStorage.aArtId;
		//Bei hierarchischen Beobachtungen wollen wir jetzt die Felder der höheren hierarchischen Ebenen anfügen
		speichereNeueBeob_02(doc);
	} else {
		//localStorage.Von == "BeobListe" || localStorage.Von == "BeobEdit"
		doc.Typ = "Beobachtung";
		speichereNeueBeob_03(doc);
	}
}

//dies ist der zweite Schritt, nur für Typ = hArt:
//Felder der höheren Hierarchieebenen anfügen
function speichereNeueBeob_02(doc) {
	var ObjektNamenArray;
	//die zu ergänzenden Objekte (Hierarchiestufen) aufzählen und - falls sie aus der DB geholt werden müssen - die ID mitgeben
	ObjektNamenArray = {"hZeit": localStorage.ZeitId, "hOrt": localStorage.OrtId, "hRaum": localStorage.RaumId, "hProjekt": localStorage.ProjektId};
	speichereNeueBeob_03(ergaenzeFelderZuDoc(doc, ObjektNamenArray));
}

//übernimmt ein Objekt "doc", dem Felder aus anderen Objekten ergänzt werden sollen
//übernimmt ein Objekt "ObjektNamenObjekt", der die Namen aller Objekte enthält,
//inklusive ihrer ID's, falls sie aus der DB geholt werden müssen
//mit deren Felder die doc aktualisiert werden soll
//gibt das Objekt "doc" zurück
function ergaenzeFelderZuDoc(doc, ObjektNamenObjekt) {
	var ObjektName, Objekt, ObjektId;
	//prüfen, ob (noch) Objekte im Objekt enthalten sind
	for (var i in ObjektNamenObjekt) {
		if (i) {
			//das erste Objekt aus ObjektNamenObjekt entnehmen
			ObjektId = ObjektNamenObjekt[i];
			ObjektName = i;
			//entnommenen Namen löschen
			delete ObjektNamenObjekt[i];
			if (window[ObjektName]) {
				//Objekt schon vorhanden
				ergaenzeFelderZuDoc_2(doc, ObjektNamenObjekt, ObjektName);
			} else {
				//Objekt aus DB holen
				$db = $.couch.db("evab");
				$db.openDoc(ObjektId, {
					success: function (data) {
						window[ObjektName] = data;
						ergaenzeFelderZuDoc_2(doc, ObjektNamenObjekt, ObjektName);
					}
				});
			}
		}
	}
	return doc;
}

//übernimmt das Objekt als globale Variable, die doc und ein ObjektNamenObjekt
//ergänzt die Felder aus dem Objekt im doc
//gibt doc und ObjektNamenObjekt wieder an ergaenzeFelderZuDoc weiter
function ergaenzeFelderZuDoc_2(doc, ObjektNamenObjekt, ObjektName) {
	//mit allen Feldern des Objekts...
	for (var i in window[ObjektName]) {
		if (typeof i !== "function") {
			//FeldName = i, Feldwert = window.hZeit[i]
			//...ausser ein paar unerwünschten...
			if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
				//...die doc ergänzen
				doc[i] = window[ObjektName][i];
			}
		}
	}
	ergaenzeFelderZuDoc(doc, ObjektNamenObjekt);
}

//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//dies ist der letzte Schritt:
//Autor anfügen und weiter zum Edit-Formular
function speichereNeueBeob_03(doc) {
	$db.saveDoc(doc, {
		success: function (data) {
			//doc um id und rev ergänzen
			doc._id = data.id;
			doc._rev = data.rev;
			if (doc.Typ === 'hArt') {
				//Variabeln verfügbar machen
				localStorage.hBeobId = data.id;
				//damit hArtEdit.html die hBeob nicht aus der DB holen muss
				window.hArt = doc;
				//Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
				leereStoragehBeobListe();
				$.mobile.changePage("hArtEdit.html");
			} else {
				//Variabeln verfügbar machen
				localStorage.BeobId = data.id;
				//damit BeobEdit.html die Beob nicht aus der DB holen muss
				window.Beobachtung = doc;
				//Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
				leereStorageBeobListe();
				$.mobile.changePage("BeobEdit.html");
			}
		},
		error: function () {
			melde("Beobachtung nicht gespeichert.");
		}
	});
}

//Speichert, wenn in BeobEdit oder hArtEdit eine neue Art und ev. auch eine neue Artgruppe gewählt wurde
//erwartet localStorage.Von = von welchem Formular aufgerufen wurde
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
						//Variabeln verfügbar machen
						localStorage.BeobId = data.id;
						//Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						leereStorageBeobListe();
						$.mobile.changePage("BeobEdit.html");
					} else {
						//Variabeln verfügbar machen
						localStorage.hBeobId = data.id;
						//Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						leereStoragehBeobListe();
						$.mobile.changePage("hArtEdit.html");
					}
				},
				error: function () {
					melde("Fehler: Beobachtung nicht gespeichert");
				}
			});
		}
	});
}

//Menü aufbauen. Wird aufgerufen von Feldliste.html und FeldEdit.html
function erstelleMenuFürFelder(thiz) {
	//Code um Menü aufzubauen
	$(thiz).simpledialog2({
		'mode' : 'button',
		'headerClose': true,
		'headerText' : '<b>Menü</b>',
		'forceInput': false,
		'buttons' : {
			'Datenfelder<br>exportieren': {
				click: function () {
					window.open("_list/FeldExport/FeldListe");
				},
				theme: "a",
				icon: "exportieren"
			}
		}
	});
}

function erstelleNeueZeit() {
//Neue Zeiten werden erstellt
//ausgelöst durch hZeitListe.html oder hZeitEdit.html
//dies ist der erste Schritt: doc bilden
	var doc;
	doc = {};
	doc.Typ = "hZeit";
	doc.User = localStorage.Username;
	doc.hProjektId = localStorage.ProjektId;
	doc.hRaumId = localStorage.RaumId;
	doc.hOrtId = localStorage.OrtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	//Felder aus den höheren Hierarchiestufen ergänzen und speichern an hZeitEdit.html übergeben
	window.hZeit = ergaenzeFelderZuDoc(doc, {"hProjekt": localStorage.ProjektId, "hRaum": localStorage.RaumId, "hOrt": localStorage.OrtId});
	//Variabeln verfügbar machen
	delete localStorage.ZeitId;
	localStorage.Status = "neu";
	//Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	delete window.ZeitListe;
	//Vorsicht: Von hZeitEdit.html aus samepage transition!
	if ($("#ZeitEditPage").length > 0 && $("#ZeitEditPage").attr("data-url") !== "ZeitEditPage") {
		//Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		//das Objekt muss über die localStorage übermittelt werden
		localStorage.hZeit = JSON.stringify(window.hZeit);
		window.open("hZeitEdit.html", target = "_self");
		$.mobile.changePage($("#ZeitEditPage"), {allowSamePageTransition: true});
	} else if ($("#ZeitEditPage").length > 0 && $("#ZeitEditPage").attr("data-url") === "ZeitEditPage") {
		$.mobile.changePage($("#ZeitEditPage"), {allowSamePageTransition: true});
	} else {
		$.mobile.changePage("hZeitEdit.html");
	}
}

//erstellt einen neuen Ort
//wird aufgerufen von: hOrtEdit.html, hOrtListe.html
//erwartet Username, hProjektId, hRaumId
function erstelleNeuenOrt() {
	var doc;
	doc = {};
	doc.Typ = "hOrt";
	doc.User = localStorage.Username;
	doc.hProjektId = localStorage.ProjektId;
	doc.hRaumId = localStorage.RaumId;
	//Felder aus den höheren Hierarchiestufen ergänzen und in hOrtEdit.html an hOrtEdit.html übergeben
	window.hOrt = ergaenzeFelderZuDoc(doc, {"hProjekt": localStorage.ProjektId, "hRaum": localStorage.RaumId});
	//Variabeln verfügbar machen
	delete localStorage.OrtId;
	//Globale Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	leereStorageOrtListe("mitLatLngListe");
	localStorage.Status = "neu";	//das löst bei initiiereOrtEdit die Verortung aus
	//Vorsicht: Von hOrtEdit.html aus samepage transition!
	if ($("#OrtEditPage").length > 0 && $("#OrtEditPage").attr("data-url") !== "OrtEditPage") {
		//Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		//das Objekt muss über die localStorage übermittelt werden
		localStorage.hOrt = JSON.stringify(window.hOrt);
		window.open("hOrtEdit.html", target = "_self");
	} else if ($("#OrtEditPage").length > 0 && $("#OrtEditPage").attr("data-url") === "OrtEditPage") {
		$.mobile.changePage($("#OrtEditPage"), {allowSamePageTransition: true});
	} else {
		$.mobile.changePage("hOrtEdit.html");
	}
}

function erstelleNeuenRaum() {
	var doc;
	doc = {};
	doc.Typ = "hRaum";
	doc.User = localStorage.Username;
	doc.hProjektId = localStorage.ProjektId;
	//Felder aus den höheren Hierarchiestufen ergänzen und  in Objekt speichern, das an hRaumEdit.html übergeben wird
	window.hRaum = ergaenzeFelderZuDoc(doc, {"hProjekt": localStorage.ProjektId});
	//Variabeln verfügbar machen
	delete localStorage.RaumId;
	localStorage.Status = "neu";
	//Globale Variablen für RaumListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	leereStorageRaumListe("mitLatLngListe");
	//Vorsicht: Von hRaumEdit.html aus same page transition!
	if ($("#RaumEditPage").length > 0 && $("#RaumEditPage").attr("data-url") !== "RaumEditPage") {
		//Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		//das Objekt muss über die localStorage übermittelt werden
		localStorage.hRaum = JSON.stringify(window.hRaum);
		window.open("hRaumEdit.html", target = "_self");
	} else if ($("#RaumEditPage").length > 0 && $("#RaumEditPage").attr("data-url") === "RaumEditPage") {
		$.mobile.changePage($("#RaumEditPage"), {allowSamePageTransition: true});
	} else {
		$.mobile.changePage("hRaumEdit.html");
	}
}

//erstellt ein Objekt für ein neues Projekt und öffnet danach hProjektEdit.html
//das Objekt wird erst von initiiereProjektEdit gespeichert (einen DB-Zugriff sparen)
function erstelleNeuesProjekt() {
	var doc;
	doc = {};
	doc.Typ = "hProjekt";
	doc.User = localStorage.Username;
	//damit hProjektEdit.html die hBeob nicht aus der DB holen muss
	window.hProjekt = doc;
	//ProjektId faken, sonst leitet die edit-Seite an die oberste Liste weiter
	delete localStorage.ProjektId;
	localStorage.Status = "neu";
	//Globale Variablen für ProjektListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
	leereStorageProjektListe("mitLatLngListe");
	//Vorsicht: Von hProjektEdit.html aus same page transition!
	if ($("#ProjektEditPage").length > 0 && $("#ProjektEditPage").attr("data-url") !== "ProjektEditPage") {
		//Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
		//das Objekt muss über die localStorage übermittelt werden
		localStorage.hProjekt = JSON.stringify(window.hProjekt);
		window.open("hProjektEdit.html", target = "_self");
	} else if ($("#ProjektEditPage").length > 0 && $("#ProjektEditPage").attr("data-url") === "ProjektEditPage") {
		$.mobile.changePage($("#ProjektEditPage"), {allowSamePageTransition: true});
	} else {
		$.mobile.changePage("hProjektEdit.html");
	}
}

function öffneMeineEinstellungen() {
	if (!localStorage.UserId) {
		$db = $.couch.db("evab");
		$db.view('evab/User?key="' + localStorage.Username + '"', {
			success: function (data) {
				var User;
				User = data.rows[0].value;
				//UserId = data.rows[0].value._id;
				localStorage.UserId = UserId;
				$.mobile.changePage("UserEdit.html");
			}
		});
	} else {
		$.mobile.changePage("UserEdit.html");
	}
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

//initiiert Variabeln, fixe Felder und dynamische Felder in BeobEdit.html
//wird aufgerufen von BeobEdit.html und Felder_Beob.html
function initiiereBeobEdit() {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängeBE').hide();
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (window.FeldlisteBeobEdit) {
		initiiereBeobEdit_2();
	} else {
		//das dauert länger - hinweisen
		$("#BeobEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		//holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeBeob', {
			success: function (data) {
				//Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				window.FeldlisteBeobEdit = data;
				initiiereBeobEdit_2();
			}
		});
	}
}

//allfällige Beob übernehmen von speichereNeueBeob
//um die DB-Abfrage zu sparen
function initiiereBeobEdit_2() {
	//achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
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
	//diese (globalen) Variabeln werden in BeobEdit.html gebraucht
	//bei neuen Beob hat das Objekt noch keine ID
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
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//und aktualisiert die Links für pagination
//Mitgeben: id der Beobachtung, Username
function erstelleDynamischeFelderBeobEdit() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerBeobEditForm();
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	} else {
		HtmlContainer = "";
	}
	//nötig, weil sonst die dynamisch eingefügten Elemente nicht erscheinen (Felder) bzw. nicht funktionieren (links)
	$("#BeobEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	$("#BeobEditPage").trigger("create").trigger("refresh");
}

//setzt die Values in die hart codierten Felder im Formular BeobEdit.html
//erwartet das Objekt Beob, welches die Werte enthält
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

//generiert das Html für das Formular in BeobEdit.html
//erwartet Feldliste als Objekt; Beob als Objekt, Artgruppe
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerBeobEditForm () {
	var Feld, i, FeldName, FeldBeschriftung, SliderMaximum, SliderMinimum, ListItem, HtmlContainer, Status, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = localStorage.Status;
	ArtGruppe = window.Beobachtung.aArtGruppe;
	for (i in FeldlisteBeobEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteBeobEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusEinfach.indexOf(localStorage.Username) !== -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1) {
				//In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
				//vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
				if (Feld.Hierarchiestufe !== "Art" || (typeof Feld.ArtGruppe !== "undefined" && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0)) {
					if (window.Beobachtung[FeldName] && Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Username]) {
						FeldWert = Feld.Standardwert[localStorage.Username];
						//Objekt Beob um den Standardwert ergänzen, um später zu speichern
						window.Beobachtung[FeldName] = FeldWert;
					} else {
						//"" verhindert die Anzeige von undefined im Feld
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
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
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
		//Neue Datensätze haben keine Attachments
		zeigeAttachments(window.Beobachtung, "BE");
	}
	return HtmlContainer;
}

//BeobListe in BeobList.html vollständig neu aufbauen
function initiiereBeobliste() {
	//hat BeobEdit.html eine BeobListe übergeben?
	if (window.BeobListe) {
		//Beobliste aus globaler Variable holen - muss nicht geparst werden
		initiiereBeobliste_2();
	} else {
		//Beobliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/BeobListe?startkey=["' + localStorage.Username + '",{}]&endkey=["' + localStorage.Username + '"]&descending=true', {
			success: function (data) {
				//BeobListe für BeobEdit bereitstellen
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

	//Im Titel der Seite die Anzahl Beobachtungen anzeigen
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
				beob = window.BeobListe.rows[i].value;
				key = window.BeobListe.rows[i].key;
				ListItemContainer += "<li class=\"beob ui-li-has-thumb\" id=\"";
				ListItemContainer += beob._id;
				ListItemContainer += "\"><a href=\"BeobEdit.html\"><img class=\"ui-li-thumb\" src=\"";
				ListItemContainer += "Artgruppenbilder/" + beob.aArtGruppe + ".png";
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

//löscht Anhänge
//erwartet den Datensatz als Objekt und das Objekt, dass geklickt wurde
function loescheAnhang(that, Objekt, id) {
	if (Objekt) {
		//Es wurde ein Objekt übergeben, keine DB-Abfrage nötig
		loescheAnhang_2(that, Objekt);
	} else {
		//Objekt aus der DB holen
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
	//Anhang aus Objekt entfernen
	delete window[Objekt.Typ]._attachments[Dateiname];
	//Objekt in DB speichern
	$db.saveDoc(window[Objekt.Typ], {
		success: function (data) {
			//rev im Objekt ergänzen
			//die globale Variable heisst gleich, wie der Typ im Objekt
			window[Objekt.Typ]._rev = data.rev;
			//im Formular den Anhang und die Lösch-Schaltfläche entfernen
			$(that).parent().parent().remove();
		},
		error: function () {
			melde("Fehler: Anhänge werden nicht richtig angezeigt");
		}
	});
}

//initiiert UserEdit.html
//Mitgeben: localStorage.UserId
function initiiereUserEdit() {
	$db = $.couch.db("evab");
	$db.openDoc(localStorage.UserId, {
		success: function (User) {
			//fixe Felder aktualisieren
			$("#UserName").val(User.UserName);
			$("#Email").val(User.Email);
			$("[name='Datenverwendung']").checkboxradio();
			$("#" + User.Datenverwendung).prop("checked",true).checkboxradio("refresh");
			$("#Autor").val(localStorage.Autor);
			speichereLetzteUrl();
		}
	});
}

//initiiert Installieren.html
//kurz, da keine Daten benötigt werden
function initiiereInstallieren() {
	speichereLetzteUrl();
}

//generiert in hProjektEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Projekts, Username
//bei neuen Projekten wird das zuvor erzeugte Projekt übernommen, um die DB-Anfrage zu sparen
function initiiereProjektEdit() {
	//Anhänge ausblenden, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	//$('#AnhängehPE').hide().trigger('updatelayout');
	//window.hProjekt existiert schon bei neuem Projekt
	if (window.hProjekt) {
		initiiereProjektEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hProjekt) {
		//wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
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
	//fixe Felder aktualisieren
	$("#pName").val(window.hProjekt.pName);
	//Variabeln bereitstellen (bei neuen Projekten wird ProjektId später nachgeschoben)
	if (window.hProjekt._id) {
		localStorage.ProjektId = window.hProjekt._id;
	} else {
		localStorage.ProjektId = "neu";
	}
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (window.FeldlisteProjekt) {
		initiiereProjektEdit_3();
	} else {
		//das dauert länger - Hinweis einblenden
		$("#hProjektEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		//Feldliste aus der DB holen
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeProjekt', {
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
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hProjektEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für das Formular in hProjektEdit.html
//erwartet Feldliste als Objekt; Projekt als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerProjektEditForm () {
	var Feld, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (var i in FeldlisteProjekt.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteProjekt.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1 && FeldName !== "pName") {
				if (window.hProjekt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Username]) {
					FeldWert = Feld.Standardwert[localStorage.Username];
					//window.hProjekt um den Standardwert ergänzen, um später zu speichern
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
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
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
		//neue Datensätze haben keine Attachments
		zeigeAttachments(window.hProjekt, "hPE");
	}
	return HtmlContainer;
}

//initiiert FeldEdit.html
function initiiereFeldEdit() {
	//Bei neuem Feld gibt es Feld schon
	if (window.Feld) {
		initiiereFeldEdit_2();
	} else {
		$db = $.couch.db("evab");
		$db.openDoc(localStorage.FeldId, {
			success: function (doc) {
				//Feld bereitstellen
				window.Feld = doc;
				initiiereFeldEdit_2();
			}
		});
	}
}

function initiiereFeldEdit_2() {
	var SichtbarImModusHierarchisch, SichtbarImModusEinfach, Standardwert;
	//korrekte Werte in Felder SichtbarImModusEinfach und -Hierarchisch setzen
	SichtbarImModusHierarchisch = window.Feld.SichtbarImModusHierarchisch;
	SichtbarImModusEinfach = window.Feld.SichtbarImModusEinfach;
	//Vorsicht: Bei neuen Feldern gibt es window.Feld.SichtbarImModusHierarchisch noch nicht
	if (SichtbarImModusHierarchisch && SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1) {
		$("#SichtbarImModusHierarchisch").val("ja");
	} else {
		$("#SichtbarImModusHierarchisch").val("nein");
	}
	$("select#SichtbarImModusHierarchisch").slider();
	$("select#SichtbarImModusHierarchisch").slider("refresh");
	//Vorsicht: Bei neuen Feldern gibt es window.Feld.SichtbarImModusEinfach noch nicht
	if (SichtbarImModusEinfach && SichtbarImModusEinfach.indexOf(localStorage.Username) !== -1) {
		$("select#SichtbarImModusEinfach").val("ja");
	} else {
		$("select#SichtbarImModusEinfach").val("nein");
	}
	$("select#SichtbarImModusEinfach").slider();
	$("select#SichtbarImModusEinfach").slider("refresh");
	//Artgruppe Aufbauen, wenn Hierarchiestufe == Art
	if (window.Feld.Hierarchiestufe === "Art") {
		ArtGruppeAufbauenFeldEdit(window.Feld.ArtGruppe);
	}

	//allfälligen Standardwert anzeigen
	//Standardwert ist Objekt, darin werden die Standardwerte aller Benutzer gespeichert
	//darum hier auslesen und setzen
	//Zuerst leeren Wert setzen, sonst bleibt letzter, wenn keiner existiert!
	$("#Standardwert").val("");
	if (window.Feld.Standardwert) {
		Standardwert = window.Feld.Standardwert[localStorage.Username];
		if (Standardwert) {
			$("#Standardwert").val(Standardwert);
		}
	}

	if (window.Feld.FeldName) {
		//fix in Formulare eingebaute Felder: Standardwerte ausblenden und erklären
		if (["aArtGruppe", "aArtName"].indexOf(window.Feld.FeldName) > -1) {
			$("#Standardwert").attr("placeholder", "Keine Voreinstellung möglich");
			$("#Standardwert").attr("disabled", true);
		//ausschalten, soll jetzt im Feld verwaltet werden
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

	//Radio Felder initiieren (ausser ArtGruppe, das wird dynamisch erzeugt)
	$("input[name='Hierarchiestufe']").checkboxradio();
	$("#" + window.Feld.Hierarchiestufe).prop("checked",true).checkboxradio("refresh");
	$("input[name='Formularelement']").checkboxradio();
	$("#" + window.Feld.Formularelement).prop("checked",true).checkboxradio("refresh");
	$("input[name='InputTyp']").checkboxradio();
	$("#" + window.Feld.InputTyp).prop("checked",true).checkboxradio("refresh");

	//Werte in übrige Felder einfügen
	$("#FeldName").val(window.Feld.FeldName);
	$("#FeldBeschriftung").val(window.Feld.FeldBeschriftung);
	$("#FeldBeschreibung").val(window.Feld.FeldBeschreibung);	//Textarea - anders refreshen?
	$("#Reihenfolge").val(window.Feld.Reihenfolge);
	$("#FeldNameEvab").val(window.Feld.FeldNameEvab);
	$("#FeldNameZdsf").val(window.Feld.FeldNameZdsf);
	$("#FeldNameCscf").val(window.Feld.FeldNameCscf);
	$("#FeldNameNism").val(window.Feld.FeldNameNism);
	$("#FeldNameWslFlechten").val(window.Feld.FeldNameWslFlechten);
	$("#FeldNameWslPilze").val(window.Feld.FeldNameWslPilze);
	$("#Optionen").val(window.Feld.Optionen);	//Textarea - anders refreshen?
	$("#SliderMinimum").val(window.Feld.SliderMinimum);
	$("#SliderMaximum").val(window.Feld.SliderMaximum);

	erstelleSelectFeldFolgtNach();	//BESSER: Nur aufrufen, wenn erstaufbau oder auch Feldliste zurückgesetzt wurde
	speichereLetzteUrl();
	//Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
	$(":jqmData(role='page')").focus();
}

//wird von FeldEdit.html aufgerufen
//erstellt das Selectmenu, um die Reihenfolge-Position des Felds zu bestimmen
function erstelleSelectFeldFolgtNach() {
	//Nur bei eigenen Feldern anzeigen
	if (Feld.User !== "ZentrenBdKt") {
		if (window.Feldliste) {
			//Feldliste aus globaler Variable verwenden - muss nicht geparst werden
			erstelleSelectFeldFolgtNach_2();
		} else {
			$db = $.couch.db("evab");
			$db.view("evab/FeldListe", {
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
	for (i in Feldliste.rows) {
		if (typeof i !== "function") {
			TempFeld = Feldliste.rows[i].value;
			//Liste aufbauen
			//Nur eigene Felder und offizielle
			if (TempFeld.User === localStorage.Username || TempFeld.User === "ZentrenBdKt") {
				Optionen.push(TempFeld.FeldName);
			}
		}
	}
	HtmlContainer = generiereHtmlFuerSelectmenu("FeldFolgtNach", "Feld folgt nach:", "", Optionen, "SingleSelect");
	$("#FeldFolgtNachDiv").html(HtmlContainer).trigger("create").trigger("refresh");
}

//wird benutzt in FeldEdit.html
//von je einer Funktion in FeldEdit.html und evab.js
//Funktion ist zweigeteilt, um wenn möglich Datenbankabfragen zu sparen
function ArtGruppeAufbauenFeldEdit(ArtGruppenArrayIn) {
	if (window.Artgruppen) {
		//Artgruppen von globaler Variable holen
		ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else if (localStorage.Artgruppen) {
		//Artgruppen aus localStorage holen und parsen
		window.Artgruppen = JSON.parse(localStorage.Artgruppen);
		ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else {
		//Artgruppen aus DB holen
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

//initiiert FeldListe.html
function initiiereFeldliste() {
	//hat FeldEdit.html eine Feldliste übergeben?
	if (window.Feldliste) {
		//Feldliste aus globaler Variable holen - muss nicht geparst werden
		initiiereFeldliste_2();
	} else {
		//FeldListe aus DB holen
		$db = $.couch.db("evab");
		$db.view("evab/FeldListe", {
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
	for (i in Feldliste.rows) {
		if (typeof i !== "function") {
			TempFeld = Feldliste.rows[i].value;
			//Liste aufbauen
			//Nur eigene Felder und offizielle
			if (TempFeld.User === localStorage.Username || TempFeld.User === "ZentrenBdKt") {
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
				//Felder zählen
				anzFelder += 1;
			}
		}
	}
	//Im Titel der Seite die Anzahl Beobachtungen anzeigen
	$("#FeldListeHeader .FeldListeTitel").text(anzFelder + " Felder");
	$("#FeldListeFL").html(ListItemContainer);
	$("#FeldListeFL").listview("refresh");
	speichereLetzteUrl();
}

//wird benutzt von hOrtEdit.html, BeobEdit.html und Karte.html
//die Felder werden aus localStorage übernommen, die Liste ihrer Namen wird als Array FelderArray überbeben
//die Felder werden in der DB und im übergebenen Objekt "DatensatzObjekt" gespeichert
//und anschliessend in Formularfeldern aktualisiert
//function speichereKoordinaten übernimmt id und den ObjektNamen
//kontrolliert, ob das Objekt existiert
//wenn nein wird es aus der DB geholt
function speichereKoordinaten(id, ObjektName) {
	//kontrollieren, ob Ort oder Beob als Objekt vorliegt
	if (window[ObjektName]) {
		//ja: Objekt verwenden
		speichereKoordinaten_2(id, ObjektName);
	} else {
		//nein: Objekt aus DB holen
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

//setzt das DatensatzObjekt voraus
//aktualisiert darin die Felder, welche in FelderArray aufgelistet sind
//Variablen müssen in Objekt und localStorage denselben Namen verwenden
function speichereKoordinaten_2(id, ObjektName) {
	var FelderArray;
	FelderArray = ["oLongitudeDecDeg", "oLongitudeDecDeg", "oLatitudeDecDeg", "oXKoord", "oYKoord", "oLagegenauigkeit", "oHöhe", "oHöheGenauigkeit"];
	speichereFelderAusLocalStorageInObjekt(ObjektName, FelderArray, "FormularAktualisieren");
	//nun die Koordinaten in den Zeiten und Arten dieses Objekts aktualisieren
	speichereFelderAusLocalStorageInObjektliste("ZeitenVonOrt", FelderArray, "hOrtId", id, "hZeitIdVonOrt");
	speichereFelderAusLocalStorageInObjektliste("ArtenVonOrt", FelderArray, "hOrtId", id, "hArtIdVonOrt");
}

//übernimmt eine Liste von Feldern und eine Objektliste (via Name)
//sucht in der Objektliste nach den Objekten mit der BezugsId
//aktualisiert diese Objekte
//wird verwendet, um die Koordinaten von Orten in Zeiten und Arten zu schreiben
//im ersten Schritt prüfen, ob die Objektliste vorhanden ist. Wenn nicht, aus DB holen
function speichereFelderAusLocalStorageInObjektliste(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert, Querystring) {
	var viewname;
	if (window[ObjektlistenName]) {
		//vorhandene Objektliste nutzen
		speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert);
	} else {
		//Objektliste aus DB holen
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
	//in allen Objekten in der Objektliste
	var DsBulkListe, Docs, row;
	//nur machen, wenn rows vorhanden!
	if (window[ObjektlistenName].rows.length > 0) {
		DsBulkListe = {};
		Docs = [];
		for (var i in window[ObjektlistenName].rows) {
			row = window[ObjektlistenName].rows[i].doc;
			if (typeof i !== "function") {
				//Objekte mit dem richtigen Wert in der BezugsId suchen (z.B. die richtige hOrtId)
				if (row[BezugsIdName] && row[BezugsIdName] === BezugsIdWert) {
					//im Objekt alle in FelderArray aufgelisteten Felder suchen
					for (i in FelderArray) {
						if (typeof i !== "function") {
							//und ihre Werte aktualisieren
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
		//Objektliste in DB speichern
		$.ajax({
			type: "POST",
			url: "../../_bulk_docs",
			contentType: "application/json",
			data: JSON.stringify(DsBulkListe),
			success: function(data) {
				//_rev in den Objekten in Objektliste aktualisieren
				//für alle zurückgegebenen aktualisierten Zeilen
				//offenbar muss data zuerst geparst werden ??!!
				data = JSON.parse(data);
				for (var y in data) {
					if (typeof y !== "function") {
						//das zugehörige Objekt in der Objektliste suchen
						for (var i in window[ObjektlistenName].rows) {
							row = window[ObjektlistenName].rows[i].doc;
							if (typeof i !== "function") {
								//und dessen rev aktualisieren
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

//Neue Daten liegen in localStorage vor
//sie werden in Objekt und in DB geschrieben
//Variablen müssen in Objekt und localStorage denselben Namen verwenden
//FelderArray enthält eine Liste der Namen der zu aktualisierenden Felder
//ObjektName ist der Name des zu aktualisierenden Objekts bzw. Datensatzes
function speichereFelderAusLocalStorageInObjekt(ObjektName, FelderArray, FormularAktualisieren) {
	//Objekt aktualisieren
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
	//in DB speichern
	$db.saveDoc(window[ObjektName], {
		success: function (data) {
			window[ObjektName]._rev = data.rev;
			if (FormularAktualisieren) {
				aktualisiereKoordinatenfelderInFormular(ObjektName);
			}
		}
	});
}

//übernimmt ein Objekt (via dessen Namen) und eine Liste von Feldern (FelderArray)
//setzt in alle Felder mit den Namen gemäss FelderArray die Werte gemäss Objekt
function aktualisiereKoordinatenfelderInFormular(ObjektName, FelderArray) {
	for (var i in FelderArray) {
		if (typeof i !== "function") {
			$("[name='" + FelderArray[i] + "']").val(window[ObjektName][FelderArray[i]] || null);
		}
	}
}

//dient der Unterscheidung von Int und Float
function isInt(n) {
	return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n);
}

//Hilfsfunktion, die typeof ersetzt und ergänzt
//typeof gibt bei input-Feldern immer String zurück!
function myTypeOf(Wert) {
	if (typeof Wert === "boolean") {
		return "boolean";
	} else if (parseInt(Wert, 10) && parseFloat(Wert) && parseInt(Wert, 10) != parseFloat(Wert) && parseInt(Wert, 10) == Wert) {
		//es ist eine Float
		return "float";
	} else if (parseInt(Wert, 10) == Wert) {
		//es ist eine Integer
		return "integer";
	} else {
		//als String behandeln
		return "string";
	}
}

//Übernimmt einen Feldnamen, einen Feldwert
//und eine Datensatzliste (z.B. alle Räume eines Projekts) sowie ihren Namen
//speichert das neue Feld in alle Datensätze der Liste in der DB
//und aktualisiert die Liste selber, damit sie das nächste mal nicht in der DB geholt werden muss
function speichereFeldInDatensatzliste(Feldname, Feldwert, DatensatzlisteName) {
	var DsBulkListe, Docs, row;
	//nur machen, wenn Datensätze da sind
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

//löscht Datensätze in Massen
//nimmt das Ergebnis einer Abfrage entgegen, welche im key einen Array hat
//Array[0] ist fremde _id (mit der die Abfrage gefiltert wurde),
//Array[1] die _id des zu löschenden Datensatzes und Array[2] dessen _rev
function loescheIdIdRevListe(Datensatzobjekt) {
	var ObjektMitDeleteListe, Docs, Datensatz, rowkey;
	ObjektMitDeleteListe = {};
	Docs = [];
	for (var i in Datensatzobjekt.rows) {
		if (typeof i !== "function") {
			//unsere Daten sind im key
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
	//hat ProjektEdit.html eine Projektliste übergeben?
	if (window.Projektliste) {
		initiiereProjektliste_2();
	} else {
		//Daten für die Projektliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hProjListe?startkey=["' + localStorage.Username + '"]&endkey=["' + localStorage.Username + '",{}]', {
			success: function (data) {
				//Projektliste für ProjektEdit bereitstellen
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

	//Im Titel der Seite die Anzahl Projekte anzeigen
	Titel2 = " Projekte";
	if (anzProj === 1) {
		Titel2 = " Projekt";
	}
	$("#hProjektListePageHeader .hProjektListePageTitel").text(anzProj + Titel2);

	if (anzProj === 0) {
		ListItemContainer = "<li><a href='#' class='erste NeuesProjektProjektListe'>Erstes Projekt erfassen</a></li>";
	} else {
		for (i in Projektliste.rows) {			//Liste aufbauen
			if (typeof i !== "function") {
				Proj = Projektliste.rows[i].value;
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

//generiert in hRaumEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Raums, Username
//Bei neuen Räumen wird der Raum übernommen um eine DB-Abfrage zu sparen
function initiiereRaumEdit() {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehRE').hide();
	if (window.hRaum) {
		initiiereRaumEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hRaum) {
		//wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
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
	//fixes Feld setzen
	$("#rName").val(window.hRaum.rName);
	//Variabeln bereitstellen
	localStorage.ProjektId = window.hRaum.hProjektId;
	//bei neuen Räumen hat das Objekt noch keine ID
	if (window.hRaum._id) {
		localStorage.RaumId = window.hRaum._id;
	} else {
		localStorage.RaumId = "neu";
	}
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (window.FeldlisteRaumEdit) {
		initiiereRaumEdit_3();
	} else {
		//das dauert länger - hinweisen
		$("#hRaumEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		//holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeRaum', {
			success: function (Feldliste) {
				//Variabeln bereitstellen
				window.FeldlisteRaumEdit = Feldliste;
				initiiereRaumEdit_3();
			}
		});
	}
}

function initiiereRaumEdit_3() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerRaumEditForm ();
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hRaumEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für das Formular in hRaumEdit.html
//erwartet Feldliste als Objekt; window.hRaum als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerRaumEditForm () {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteRaumEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteRaumEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1 && FeldName !== "rName") {
				if (window.hRaum[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Username]) {
					FeldWert = Feld.Standardwert[localStorage.Username];
					//Objekt window.hRaum um den Standardwert ergänzen, um später zu speichern
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
	//In neuen Datensätzen allfällige Standardwerte speichern
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
		//Attachments gibt's bei neuen Datensätzen nicht
		zeigeAttachments(window.hRaum, "hRE");
	}
	return HtmlContainer;
}

function initiiereRaumListe() {
	//hat hRaumEdit.html eine RaumListe übergeben?
	if (window.RaumListe) {
		//Raumliste aus globaler Variable holen - muss nicht geparst werden
		initiiereRaumListe_2();
	} else {
		//Raumliste aud DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hRaumListe?startkey=["' + localStorage.Username + '", "' + localStorage.ProjektId + '"]&endkey=["' + localStorage.Username + '", "' + localStorage.ProjektId + '" ,{}]', {
			success: function (data) {
				//RaumListe für haumEdit bereitstellen
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

	//Im Titel der Seite die Anzahl Räume anzeigen
	Titel2 = " Räume";
	if (anzRaum === 1) {
		Titel2 = " Raum";
	}
	$("#hRaumListePageHeader .hRaumListePageTitel").text(anzRaum + Titel2);

	if (anzRaum === 0) {
		ListItemContainer = '<li><a href="#" name="NeuerRaumRaumListe" class="erste">Ersten Raum erfassen</a></li>';
	} else {
		for (i in RaumListe.rows) {	//Liste aufbauen
			if (typeof i !== "function") {
				Raum = RaumListe.rows[i].value;
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

//generiert in hOrtEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Orts
function initiiereOrtEdit() {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehOE').hide();
	if (window.hOrt) {
		initiiereOrtEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hOrt) {
		//wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
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
	//fixe Felder aktualisieren
	$("[name='oName']").val(window.hOrt.oName);
	$("[name='oXKoord']").val(window.hOrt.oXKoord);
	$("[name='oYKoord']").val(window.hOrt.oYKoord);
	$("[name='oLagegenauigkeit']").val(window.hOrt.oLagegenauigkeit);
	//Variabeln bereitstellen
	localStorage.ProjektId = window.hOrt.hProjektId;
	localStorage.RaumId = window.hOrt.hRaumId;
	//bei neuen Orten hat das Objekt noch keine ID
	if (window.hOrt._id) {
		localStorage.OrtId = window.hOrt._id;
	} else {
		localStorage.OrtId = "neu";
	}
	//Lat Lng werden geholt. Existieren sie nicht, erhalten Sie den Wert ""
	localStorage.oLongitudeDecDeg = window.hOrt.oLongitudeDecDeg;
	localStorage.oLatitudeDecDeg = window.hOrt.oLatitudeDecDeg;
	localStorage.oLagegenauigkeit = window.hOrt.oLagegenauigkeit;
	localStorage.oXKoord = window.hOrt.oXKoord;
	localStorage.oYKoord = window.hOrt.oYKoord;
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (window.FeldlisteOrtEdit) {
		initiiereOrtEdit_3();
	} else {
		//das dauert länger - hinweisen
		$("#hOrtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		//holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeOrt', {
			success: function (Feldliste) {
				//Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				window.FeldlisteOrtEdit = Feldliste;
				initiiereOrtEdit_3();
			}
		});
	}
}

function initiiereOrtEdit_3() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerOrtEditForm();
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hOrtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");

	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();

}

//generiert das Html für das Formular in hOrtEdit.html
//erwartet Feldliste als Objekt (aus der globalen Variable); window.hOrt als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerOrtEditForm () {
	var Feld, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (var i in FeldlisteOrtEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteOrtEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.hOrt.User) !== -1 && (FeldName !== "oName") && (FeldName !== "oXKoord") && (FeldName !== "oYKoord") && (FeldName !== "oLagegenauigkeit")) {
				if (window.hOrt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[localStorage.Username]) {
					FeldWert = Feld.Standardwert[localStorage.Username];
					//Objekt window.hOrt um den Standardwert ergänzen, um später zu speichern
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
	//Allfällige Standardwerte speichern
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
		//Status zurücksetzen - es soll nur ein mal verortet werden
		delete localStorage.Status;
	} else {
		//Attachments gibt es bei neuen Orten nicht
		zeigeAttachments(window.hOrt, "hOE");
	}
	return HtmlContainer;
}

//erstellt die Ortliste in hOrtListe.html
function initiiereOrtListe() {
	//hat hOrtEdit.html eine OrtListe übergeben?
	if (window.OrtListe) {
		//Ortliste aus globaler Variable holen - muss nicht geparst werden
		initiiereOrtListe_2();
	} else {
		//Ortliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hOrtListe?startkey=["' + localStorage.Username + '", "' + localStorage.RaumId + '"]&endkey=["' + localStorage.Username + '", "' + localStorage.RaumId + '" ,{}]', {
			success: function (data) {
				//OrtListe für hOrtEdit bereitstellen
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

	//Im Titel der Seite die Anzahl Orte anzeigen
	Titel2 = " Orte";
	if (anzOrt === 1) {
		Titel2 = " Ort";
	}
	$("#hOrtListePageHeader .hOrtListePageTitel").text(anzOrt + Titel2);

	if (anzOrt === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeuerOrtOrtListe">Ersten Ort erfassen</a></li>';
	} else {
		for (i in OrtListe.rows) {	//Liste aufbauen
			if (typeof i !== "function") {
				Ort = OrtListe.rows[i].value;
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

//generiert in hZeitEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id der Zeit
function initiiereZeitEdit() {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehZE').hide();
	//hZeit existiert schon bei neuer Zeit
	//alert("window.hZeit = " + JSON.stringify(window.hZeit));
	if (window.hZeit) {
		initiiereZeitEdit_2();
	} else if (localStorage.Status === "neu" && localStorage.hZeit) {
		//wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
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
	//fixe Felder aktualisieren
	$("[name='zDatum']").val(window.hZeit.zDatum);
	$("[name='zUhrzeit']").val(window.hZeit.zUhrzeit);
	//Variabeln bereitstellen
	localStorage.ProjektId = window.hZeit.hProjektId;
	localStorage.RaumId = window.hZeit.hRaumId;
	localStorage.OrtId = window.hZeit.hOrtId;
	//bei neuen Zeiten hat das Objekt noch keine ID
	if (window.hZeit._id) {
		localStorage.ZeitId = window.hZeit._id;
	}
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (window.FeldlisteZeitEdit) {
		initiiereZeitEdit_3();
	} else {
		//Feldliste aus der DB holen
		//das dauert länger - hinweisen
		$("#hZeitEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeZeit', {
			success: function (Feldliste) {
				window.FeldlisteZeitEdit = Feldliste;
				initiiereZeitEdit_3();
			}
		});
	}
}

function initiiereZeitEdit_3() {
	var HtmlContainer = generiereHtmlFuerZeitEditForm();
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hZeitEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//erstellt die Liste der Zeiten in Formular hZeitListe.html
function initiiereZeitListe() {
	//hat hZeitEdit.html eine ZeitListe übergeben?
	if (window.ZeitListe) {
		//Zeitliste aus globaler Variable holen - muss nicht geparst werden
		initiiereZeitListe_2();
	} else {
		//Zeitliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hZeitListe?startkey=["' + localStorage.Username + '", "' + localStorage.OrtId + '"]&endkey=["' + localStorage.Username + '", "' + localStorage.OrtId + '" ,{}]', {
			success: function (data) {
				//ZeitListe für hZeitEdit bereitstellen
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

	//Im Titel der Seite die Anzahl Zeiten anzeigen
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
				Zeit = ZeitListe.rows[i].value;
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

//generiert das Html für das Formular in hZeitEdit.html
//erwartet Feldliste als Objekt; Zeit als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerZeitEditForm() {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteZeitEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteZeitEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === window.hZeit.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.hZeit.User) !== -1 && FeldName !== "zDatum" && FeldName !== "zUhrzeit") {
				if (window.hZeit[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && window.hZeit[FeldName]) {
					FeldWert = Feld.Standardwert[window.hZeit.User] || "";
					//Objekt window.hZeit um den Standardwert ergänzen, um später zu speichern
					window.hZeit[FeldName] = FeldWert;
				} else {
					FeldWert = window.hZeit[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
			//localStorage.Status wird schon im aufrufenden function gelöscht!
		}
	}
	if (localStorage.Status === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
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
		//Neue Datensätze haben keine Attachments
		zeigeAttachments(window.hZeit, "hZE");
	}
	return HtmlContainer;
}

//managt den Aufbau aller Daten und Felder für hBeobEdit.html
//erwartet die hBeobId
//wird aufgerufen von hBeobEdit.html bei pageshow
function initiierehBeobEdit() {
	//achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
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
	//hier werden Variablen gesetzt,
	//in die fixen Felder Werte eingesetzt,
	//die dynamischen Felder aufgebaut
	//und die Nav-Links gesetzt

	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	//$('#AnhängehAE').hide();

	//diese (globalen) Variabeln werden in hArtEdit.html gebraucht
	//Variabeln bereitstellen
	localStorage.ProjektId = window.hArt.hProjektId;
	localStorage.RaumId = window.hArt.hRaumId;
	localStorage.OrtId = window.hArt.hOrtId;
	localStorage.ZeitId = window.hArt.hZeitId;
	//bei neuen hBeob hat das Objekt noch keine ID
	if (window.hArt._id) {
		localStorage.hBeobId = window.hArt._id;
	} else {
		localStorage.hBeobId = "neu";
	}
	localStorage.aArtGruppe = window.hArt.aArtGruppe;
	localStorage.aArtName = window.hArt.aArtName;
	localStorage.aArtId = window.hArt.aArtId;
	//fixe Felder aktualisieren
	$("[name='aArtGruppe']").selectmenu();
	$("[name='aArtGruppe']").val(window.hArt.aArtGruppe);
	$("[name='aArtGruppe']").html("<option value='" + window.hArt.aArtGruppe + "'>" + window.hArt.aArtGruppe + "</option>");
	$("[name='aArtGruppe']").selectmenu("refresh");
	$("[name='aArtName']").selectmenu();
	$("[name='aArtName']").val(window.hArt.aArtName);
	$("[name='aArtName']").html("<option value='" + window.hArt.aArtName + "'>" + window.hArt.aArtName + "</option>");
	$("[name='aArtName']").selectmenu("refresh");
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (window.FeldlistehBeobEdit) {
		erstelleDynamischeFelderhArtEdit();
	} else {
		//Feldliste aus der DB holen
		//das dauert länger - hinweisen
		$("#hArtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeArt', {
			success: function (data) {
				window.FeldlistehBeobEdit = data;
				erstelleDynamischeFelderhArtEdit();
			}
		});
	}
}

//generiert dynamisch die Artgruppen-abhängigen Felder
//Mitgeben: Feldliste, Beobachtung
function erstelleDynamischeFelderhArtEdit() {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerhArtEditForm();
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hArtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für Formular in hArtEdit.html
//erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerhArtEditForm () {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	ArtGruppe = window.hArt.aArtGruppe;
	for (i in window.FeldlistehBeobEdit.rows) {
		if (typeof i !== "function") {
			Feld = window.FeldlistehBeobEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			//Vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
			if ((Feld.User === window.hArt.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(window.hArt.User) !== -1 && (typeof Feld.ArtGruppe !== "undefined" && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0) && (FeldName !== "aArtId") && (FeldName !== "aArtGruppe") && (FeldName !== "aArtName")) {
				if (window.hArt[FeldName] && localStorage.Status === "neu" && Feld.Standardwert && Feld.Standardwert[window.hArt.User]) {
					FeldWert = Feld.Standardwert[window.hArt.User];
					//Objekt window.hArt um den Standardwert ergänzen, um später zu speichern
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
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
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
		//Neue Datensätze haben keine Anhänge
		zeigeAttachments(window.hArt, "hAE");
	}
	return HtmlContainer;
}

//initiiert BeobListe.html
function initiierehBeobListe() {
	//hat hArtEdit.html eine hBeobListe übergeben?
	if (window.hBeobListe) {
		//Beobliste aus globaler Variable holen - muss nicht geparst werden
		initiierehBeobListe_2();
	} else {
		//Beobliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hArtListe?startkey=["' + localStorage.Username + '", "' + localStorage.ZeitId + '"]&endkey=["' + localStorage.Username + '", "' + localStorage.ZeitId + '" ,{}]', {
			success: function (data) {
				//Liste bereitstellen, um Datenbankzugriffe zu reduzieren
				window.hBeobListe = data;
				initiierehBeobListe_2();
			}
		});
	}
}

function initiierehBeobListe_2() {
	var anzArt, Art, externalPage, listItem, ListItemContainer, Titel2, hBeobTemp;
	anzArt = hBeobListe.rows.length;
	ListItemContainer = "";

	//Im Titel der Seite die Anzahl Arten anzeigen
	Titel2 = " Arten";
	if (anzArt === 1) {
		Titel2 = " Art";
	}
	$("#hArtListePageHeader .hArtListePageTitel").text(anzArt + Titel2);

	if (anzArt === 0) {
		ListItemContainer = '<li><a href="#" class="erste NeueBeobhArtListe">Erste Art erfassen</a></li>';
	} else {
		for (var i in hBeobListe.rows) {
			if (typeof i !== "function") {
				hBeobTemp = hBeobListe.rows[i].value;
				listItem = "<li class=\"beob ui-li-has-thumb\" hBeobId=\"" + hBeobTemp._id + "\" aArtGruppe=\"" + hBeobTemp.aArtGruppe + "\">" +
					"<a href=\"#\">" +
					"<img class=\"ui-li-thumb\" src=\"Artgruppenbilder/" + hBeobTemp.aArtGruppe + ".png\" />" +
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


//generiert das Html für ein Formularelement
//erwartet diverse Übergabewerte
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, InputTyp, SliderMinimum, SliderMaximum) {
	var HtmlContainer = "";
	//abfangen, wenn Inputtyp vergessen wurde
	InputTyp = InputTyp || "text";
	switch(Feld.Formularelement) {
	case "textinput":
		HtmlContainer = generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
		break;
	case "textarea":
		HtmlContainer = generiereHtmlFuerTextarea(FeldName, FeldBeschriftung, FeldWert);
		break;
	case "toggleswitch":
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
		//Abfangen, wenn das Formularelement nicht gewählt wurde
		HtmlContainer = generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
		break;
	}
	return HtmlContainer;
}

//generiert den html-Inhalt für Textinputs
//wird von erstellehBeobEdit aufgerufen
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

//generiert den html-Inhalt für Slider
//wird von erstellehBeobEdit aufgerufen
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

//generiert den html-Inhalt für Textarea
//wird von erstellehBeobEdit aufgerufen
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

//generiert den html-Inhalt für Toggleswitch
//wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert) {
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
}

//generiert den html-Inhalt für Checkbox
//wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerCheckbox(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += generiereHtmlFuerCheckboxOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
}

//generiert den html-Inhalt für Optionen von Checkbox
//wird von generiereHtmlFuerCheckbox aufgerufen
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

//generiert den html-Inhalt für Radio
//wird von erstellehBeobEdit aufgerufen
function generiereHtmlFuerRadio(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer;
	HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
}

//generiert den html-Inhalt für Optionen von Radio
//wird von generiereHtmlFuerRadio aufgerufen
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

//generiert den html-Inhalt für Selectmenus
//wird von erstellehBeobEdit aufgerufen
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

//generiert den html-Inhalt für Optionen von Selectmenu
//wird von generiereHtmlFuerSelectmenu aufgerufen
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

//generiert den html-Inhalt für Optionen von MultipleSelect
//wird von generiereHtmlFuerSelectmenu aufgerufen
//FeldWert ist ein Array
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
	//Läuft durch alle Felder im Formular
	//Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
	//nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
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
						//typ ist Int
						o[this.name] = parseInt(this.value, 10);
					} else if (myTypeOf(this.value) === "float") {
						//typ ist Float
						o[this.name] = parseFloat(this.value);
					} else {
						//anderer Typ, als String behandeln
						o[this.name] = this.value;
					}
				}
			}
		});
		return o;
	};
	//friendly helper http://tinyurl.com/6aow6yn
	//Läuft durch alle Felder im Formular
	//Feldname und Wert aller Felder werden ins Objekt geschrieben
	//so können auch bei soeben gelöschten Feldinhalten das entsprechende Feld im doc gelöscht werden
	//siehe Beispiel in FeldEdit.html
	//nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
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
					//typ ist Int
					o[this.name] = parseInt(this.value, 10);
				} else if (myTypeOf(this.value) === "float") {
					//typ ist Float
					o[this.name] = parseFloat(this.value);
				} else {
					//anderer Typ, als String behandeln
					o[this.name] = this.value;
				}
			}
		});
		return o;
	};
})(jQuery);

//Codeausführung für Anzahl Millisekunden unterbrechen
//Quelle: http://www.sean.co.uk/a/webdesign/javascriptdelay.shtm
//grauenhafte Methode - blockiert die CPU!!
function warte(ms) {
	ms += new Date().getTime();
	while (new Date() < ms) {}
}

//verorted mit Hilfe aller Methoden
//wird benutzt von BeobEdit.html und hOrtEdit.html
//erwartet die docId, um am Ende der Verortung die neuen Koordinaten zu speichern
function GetGeolocation(docId, OrtOderBeob) {
	//benötigte Variabeln setzen
	localStorage.docId = docId;
	//Zweck: Genau solange animieren, wie verortet wird
	localStorage.NavbarVerortungAnimieren = "true";
	//übergebene Herkunft (Ort oder Beob) für die listeners bereitstellen
	localStorage.OrtOderBeob = OrtOderBeob;
	//dem Benutzer zeigen, dass verortet wird
	NavbarVerortungAnimieren();
	//Koordinaten zurücksetzen
	delete localStorage.oXKoord;
	delete localStorage.oYKoord;
	delete localStorage.oLongitudeDecDeg;
	delete localStorage.oLatitudeDecDeg;
	delete localStorage.oLagegenauigkeit;
	delete localStorage.oHöhe;
	delete localStorage.oHöheGenauigkeit;
	//Mit der Verortung beginnen
	watchID = null;
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { frequency: 3000, enableHighAccuracy: true });
	//nach spätestens 20 Sekunden aufhören
	window.stop = setTimeout("stopGeolocation()", 20000);
	return watchID;
}

//solange verortet wird, 
//wird die Verortung in der Navbar jede Sekunde ein- und ausgeblendet
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

//Position ermitteln war erfolgreich
function onGeolocationSuccess(position) {
	//nur erste Position akzeptieren oder solche, die genauer sind als vorige
	if (!localStorage.oLagegenauigkeit || position.coords.accuracy < localStorage.oLagegenauigkeit) {
		if (position.coords.accuracy < 100) {
			GeolocationAuslesen(position);
			if (position.coords.accuracy <= 5) {
				stopGeolocation();
			}
		}
	}
}

//Position ermitteln war nicht erfolgreich
//onError Callback receives a PositionError object
function onGeolocationError(error) {
	melde("Keine Position erhalten\n" + error.message);
	stopGeolocation();
}

//Beendet Ermittlung der Position
function stopGeolocation() {
	//Positionssuche beenden
	//wenn keine watchID mehr, wurde sie schon beendet
	//stop timeout stoppen
	clearTimeout(stop);
	delete window.stop;
	delete localStorage.VerortungAbgeschlossen;
	//Vorsicht: In BeobEdit.html und hOrtEdit.html ist watchID nicht defined
	if (typeof watchID !== "undefined") {
		navigator.geolocation.clearWatch(watchID);
		delete window.watchID;
	}
	//Animation beenden
	delete localStorage.NavbarVerortungAnimieren;
	//auf den Erfolg reagieren
	if (localStorage.oLagegenauigkeit > 30) {
		melde("Koordinaten nicht sehr genau\nAuf Karte verorten?");
	} else if (!localStorage.oLagegenauigkeit) {
		//Felder leeren
		$("[name='oXKoord']").val("");
		$("[name='oYKoord']").val("");
		$("[name='oLongitudeDecDeg']").val("");
		$("[name='oLatitudeDecDeg']").val("");
		$("[name='oLagegenauigkeit']").val("");
		$("[name='oHöhe']").val("");
		$("[name='oHöheGenauigkeit']").val("");
		//Diesen neuen Stand speichern (allfällige alte Koordinaten werden verworfen)
		speichereKoordinaten(localStorage.docId, localStorage.OrtOderBeob);
		melde("Keine genaue Position erhalten");
	}
	//Variablen aufräumen
	delete localStorage.docId;
	delete localStorage.OrtOderBeob;
}

//damit kann bei erneuter Anmeldung oeffneZuletztBenutzteSeite() die letzte Ansicht wiederherstellen
//host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
function speichereLetzteUrl() {
	localStorage.LetzteUrl = window.location.pathname + window.location.search;
}

function holeAutor() {
	//aAutor holen
	$db.openDoc("f19cd49bd7b7a150c895041a5d02acb0", {
		success: function (doc) {
			if (doc.Standardwert) {
				if (doc.Standardwert[localStorage.Username]) {
					localStorage.Autor = doc.Standardwert[localStorage.Username];
				}
			}
		}
	});
}

//PROBLEM: Dies verursacht Verzögerungen, viel DB-Datenverkehr, aufgeblähte DB
//und vor allem Daten-Konflikte
//darum auf localStorage gewechselt und dies hier ausgeschaltet
//MOMENTAN NICHT IM GEBRAUCH
function localStorageInUserSpeichern(UserId) {
	$db = $.couch.db("evab");
	$db.openDoc(UserId, {
		success: function (User) {
			//nur speichern, wann anders als zuletzt
			//leider registriert das auch Änderungen der Feldliste etc.
			//um das zu beheben, müsste immer eine Änderung der passenden id verfolgt werden
			//damit könnte auch das parsen gespaart werden
			if (JSON.stringify(User.localStorage) !== JSON.stringify(localStorage)) {
				User.localStorage = localStorage;
				$db.saveDoc(User);
			}
		}
	});
}

//Wenn die localStorage mit localStorageInUserSpeichern() in de DB gespeichert wurde
//kann sie mit dieser Funktion wieder geholt werden
//MOMENTAN NICHT IM GEBRAUCH
function holeLocalStorageAusDb() {
	$db = $.couch.db("evab");
	$db.openDoc(sessionStorage.UserId, {
		success: function (data) {
			var localStorageObjekt = {};
			User = data.rows[0].value;
			localStorageObjekt = User.localStorage;
			for (var i in localStorageObjekt) {
				if (typeof i !== "function") {
					localStorage[i] = localStorageObjekt[i];
				}
			}
		}
	});
}

//speichert Anhänge
//setzt ein passendes Formular mit den feldern _rev und _attachments voraus
//nimmt den Formnamen entgegen respektive einen Anhang dazu, damit die Form ID eindeutig sein kann
//wird benutzt von allen Formularen mit Anhängen
function speichereAnhänge(id, Objekt, Page) {
	//prüfen, ob der Datensatz als Objekt übergeben wurde
	if (Objekt) {
		//das Objekt verwenden
		speichereAnhänge_2(id, Objekt, Page);
	} else {
		//Objekt aus der DB holen
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
			//doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			$db.openDoc(id, {
				success: function (data2) {
					window[Objekt.Typ] = data2;
					//show attachments in form
					zeigeAttachments(data2, Page);
				},
				error: function () {
					melde("Uups, Anhang wird erst beim nächsten Mal angezeigt");
				}
			});
		},
		//form.jquery.js meldet einen Fehler, obwohl der Vorgang funktioniert!
		error: function () {
			//doc nochmals holen, damit der Anhang mit Dateiname dabei ist
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

//zeigt Anhänge im Formular an
//setzt ein passendes Formular mit dem Feld _attachments + Page voraus
//und eine div namens Anhänge + Page, in der die Anhänge angezeigt werden
//wird benutzt von allen (h)Beobachtungs-Edit-Formularen
//erwartet Page, damit sowohl das AttachmentFeld als auch das div um die Anhänge reinzuhängen eindeutig sind 
function zeigeAttachments(doc, Page) {
	var HtmlContainer, url, url_zumLöschen;
	HtmlContainer = "";
	$("#_attachments" + Page).val("");
	if (doc._attachments) {
		$.each(doc._attachments, function (Dateiname, val) {
			url = "/evab/" + doc._id + "/" + Dateiname;
			//url_zumLöschen = url + "?" + doc._rev;	//theoretisch kann diese rev bis zum Löschen veraltet sein, praktisch kaum
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
	//Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
	$(":jqmData(role='page')").focus();
}

//initiiert FelderWaehlen.html
//generiert dynamisch die Felder im Checkbox Felder
//checked diejenigen, die der User anzeigen will
function initiiereFelderWaehlen() {
	var TextUeberListe_FW, FeldlisteViewname;
	//Je nach aufrufender Seite Variabeln setzen
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
	//Feldliste nur abfragen, wenn sie nicht schon als globale Variable existiert
	//Für FelderWaehlen.html könnte an sich immer die vollständige Liste verwendet werden
	//besser ist aber, dieselbe Liste zu teilen, die in derselben Hierarchiestufe für die Anzeige der Felder verwendet wird
	//darum wird hier für jede Seite eine eigene verwendet
	if (window[localStorage.FeldlisteFwName]) {
		initiiereFelderWaehlen_2();
	} else {
		//holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/' + FeldlisteViewname, {
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
		Feld = window[localStorage.FeldlisteFwName].rows[i].value;
		FeldName = Feld.FeldName;
		//Nur eigene und offizielle Felder berücksichtigen
		if (Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") {
			//im Formular fix integrierte Felder nicht aufbauen
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
						if (Feld.SichtbarImModusEinfach.indexOf(localStorage.Username) !== -1) {
							//wenn sichtbar, anzeigen
							ListItem += " checked='checked'";
						}
					}
				} else {
					if (Feld.SichtbarImModusHierarchisch) {
						if (Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1) {
							//wenn sichtbar, anzeigen
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
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//kreiert ein neues Feld
//wird benutzt von FeldListe.html und FeldEdit.html
function neuesFeld() {
	var NeuesFeld;
	NeuesFeld = {};
	NeuesFeld.Typ = "Feld";
	NeuesFeld.User = localStorage.Username;
	NeuesFeld.SichtbarImModusEinfach = [];
	NeuesFeld.SichtbarImModusHierarchisch = [];
	//gleich sichtbar stellen
	NeuesFeld.SichtbarImModusEinfach.push(localStorage.Username);
	NeuesFeld.SichtbarImModusHierarchisch.push(localStorage.Username);
	$db = $.couch.db("evab");
	$db.saveDoc(NeuesFeld, {
		success: function (data) {
			localStorage.FeldId = data.id;
			NeuesFeld._id = data.id;
			NeuesFeld._rev = data.rev;
			window.Feld = NeuesFeld;
			//Feldliste soll neu aufgebaut werden
			leereStorageFeldListe();
			$.mobile.changePage("FeldEdit.html", {allowSamePageTransition: true});
		},
		error: function () {
			melde("Fehler: Feld nicht erzeugt");
		}
	});
}

function pruefeAnmeldung() {
	//Username Anmeldung überprüfen
	//Wenn angemeldet, globale Variable Username aktualisieren
	//Wenn nicht angemeldet, Anmeldedialog öffnen
	if (!localStorage.Username) {
		$.ajax({
			url: '/_session',
			dataType: 'json',
			async: false,
			success: function (session) {
				if (session.userCtx.name !== undefined && session.userCtx.name !== null) {
					localStorage.Username = session.userCtx.name;
				} else {
					localStorage.UserStatus = "neu";
					$.mobile.changePage("index.html");
				}
			}
		});
	}
}

//setzt die OrtId, damit hOrtEdit.html am richtigen Ort öffnet
//und ruft dann hOrtEdit.html auf
//wird von den Links in der Karte benutzt
function oeffneOrt(OrtId) {
	localStorage.OrtId = OrtId;
	$.mobile.changePage("hOrtEdit.html");
}

//setzt die BeobId, damit BeobEdit.html am richtigen Ort öffnet
//und ruft dann BeobEdit.html auf
//wird von den Links in der Karte auf BeobListe.html benutzt
function oeffneBeob(BeobId) {
	localStorage.BeobId = BeobId;
	$.mobile.changePage("BeobEdit.html");
}

//wird benutzt in Artenliste.html
//wird dort aufgerufen aus pageshow und pageinit, darum hierhin verlagert
//erwartet einen filterwert
//Wenn mehrmals nacheinander dieselbe Artenliste aufgerufen wird, soll wenn möglich die alte Liste verwendet werden können
//möglich ist dies wenn diese Faktoren gleich sind: Artgruppe, allfälliger Unterauswahl
function initiiereArtenliste(filterwert) {
	//wenn alle drei Faktoren gleich sind, direkt die Artenliste erstellen
	//nur wenn eine Artenliste existiert. Grund: window.Artenliste lebt nicht so lang wie localStorage
	//aber die Artenliste aus der localStorage zu parsen macht auch keinen sinn
	if (window.Artenliste) {
		if (localStorage.aArtGruppeZuletzt === localStorage.aArtGruppe) {
			erstelleArtenliste(filterwert);
			return;
		}
	}
	//sonst aus der DB holen und die Variabeln aktualisieren
	localStorage.aArtGruppeZuletzt = localStorage.aArtGruppe;
	holeArtenliste(filterwert);
}

//wird benutzt in Artenliste.html
//aufgerufen von initiiereArtenliste
function holeArtenliste(filterwert) {
	viewname = 'evab/Artliste?startkey=["' + localStorage.aArtGruppe + '"]&endkey=["' + localStorage.aArtGruppe + '",{},{}]';
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function (data) {
			window.Artenliste = data;
			erstelleArtenliste(filterwert);
		}
	});
}

//bekommt eine Artenliste und baut damit im Formular die Artenliste auf
function erstelleArtenliste(filterwert) {
	console.log('erstelleArtenliste, filterwert = ' + filterwert);
	var Artenliste = window.Artenliste.rows,
		i,
		html_temp = "",
		html = "",
		ArtBezeichnung,
		Art,
		zähler = 0,
		filterwert = filterwert;
	//gefiltert werden muss nur, wenn mehr als 200 Arten aufgelistet würden
	if (Artenliste.length > 0) {
		if (filterwert) {
			artenliste_loop:
			for (i=0; i<Artenliste.length; i++) {
				if (zähler<200) {
					ArtBezeichnung = Artenliste[i].key[2];
					if (filterwert && ArtBezeichnung.toLowerCase().indexOf(filterwert) > -1) {
						zähler++;
						Art = Artenliste[i].value;
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
			//kein Filter gesetzt
			if (Artenliste.length > 200) {
				//die ersten 200 anzeigen
				artenliste_loop_2:
				for (i=0; i<Artenliste.length; i++) {
					if (i<200) {
						ArtBezeichnung = Artenliste[i].key[2];
						Art = Artenliste[i].value;
						html_temp += holeHtmlFürArtInArtenliste(Art, ArtBezeichnung);
					} else if (i === 200) {
						html += '<li class="artlistenhinweis">Die Artengruppe hat ' + Artenliste.length + ' Arten.<br>Um Mobilgeräte nicht zu überfordern, <b>werden nur die ersten 200 angezeigt</b>.<br>Tipp: Setzen Sie einen Filter</li>';
						break artenliste_loop_2;
					}
				}
				html += html_temp;
			} else {
				//weniger als 200 Arten, kein Filter. Alle anzeigen
				html += '<li class="artlistenhinweis">' + Artenliste.length + ' Arten angezeigt</li>';
				for (i=0; i<Artenliste.length; i++) {
					ArtBezeichnung = Artenliste[i].key[2];
					Art = Artenliste[i].value;
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

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListe() {
	//Artgruppenliste verfügbar machen
	if (window.Artgruppenliste) {
		erstelleArtgruppenListe_2();
	} else if (localStorage.Artgruppenliste) {
		Artgruppenliste = JSON.parse(localStorage.Artgruppenliste);
		erstelleArtgruppenListe_2();
	} else {
		$db = $.couch.db("evab");
		$db.view('evab/Artgruppen', {
			success: function (data) {
				//Artgruppenliste bereitstellen
				Artgruppenliste = data;
				localStorage.Artgruppenliste = JSON.stringify(Artgruppenliste);
				erstelleArtgruppenListe_2();
			}
		});
	}
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListe_2() {
	var i, y, html, ArtGruppe, row, AnzArten;
	html = "";
	for (i in Artgruppenliste.rows) {
		if (typeof i !== "function") {
			ArtGruppe = Artgruppenliste.rows[i].key;
			row = Artgruppenliste.rows[i].value;
			AnzArten = row.AnzArten;
			html += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
			html += "<a href=\"#\"><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
		}
	}
	$("#agl_ArtgruppenListe").html(html);
	$("#agl_ArtgruppenListe").listview("refresh");
	$("#agl_Hinweistext").empty().remove();
}

//Stellt die Daten des Users bereit
//In der Regel nach gelungener Anmeldung
//Auch wenn eine Seite direkt geöffnet wird und die Userdaten vermisst
//braucht den Usernamen
function stelleUserDatenBereit() {
	$db = $.couch.db("evab");
	$db.view('evab/User?key="' + localStorage.Username + '"', {
		success: function (data) {
			var User;
			User = data.rows[0].value;
			//UserId als globale Variable setzen, damit die Abfrage nicht immer durchgeführt werden muss
			localStorage.UserId = User._id;
			//weitere anderswo benutzte Variabeln verfügbar machen
			holeAutor();
			oeffneZuletztBenutzteSeite();
		}
	});
}

//wird benutzt von stelleUserDatenBereit()
//öffnet die zuletzt benutzte Seite oder BeobListe.html
function oeffneZuletztBenutzteSeite() {
	//unendliche Schlaufe verhindern, falls LetzteUrl auf diese Seite verweist
	if (localStorage.LetzteUrl && localStorage.LetzteUrl !== "/evab/_design/evab/index.html") {
		LetzteUrl = localStorage.LetzteUrl;
	} else {
		LetzteUrl = "BeobListe.html";
	}
	$.mobile.changePage(LetzteUrl);
}

//die nachfolgenden funktionen bereinigen die localStorage und die globalen Variabeln
//sie entfernen die im jeweiligen Formular ergänzten localStorage-Einträge
//mitLatLngListe gibt an, ob die Liste für die Karte auf entfernt werden soll

function leereAlleVariabeln(ohneClear) {
	//ohne clear: nötig, wenn man in FelderWaehlen.html ist und keine aufrufende Seite kennt
	//Username soll erhalten bleiben
	if (!ohneClear) {
		localStorage.clear();
	}
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

//ohneId wird beim paginaten benutzt, da die ID übermittelt werden muss
function leereStorageProjektEdit(mitLatLngListe, ohneId) {
	if (!ohneId) {
		delete localStorage.ProjektId;
	}
	delete window.hProjekt;
	if (mitLatLngListe) {
		delete window.hOrteLatLngProjekt;
	}
	//hierarchisch tiefere Listen löschen
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
	//hierarchisch tiefere Listen löschen
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
	//hierarchisch tiefere Listen löschen
	delete window.ZeitenVonProjekt;
	delete window.ZeitenVonRaum;
	delete window.ZeitenVonOrt;
	delete window.ArtenVonProjekt;
	delete window.ArtenVonRaum;
	delete window.ArtenVonOrt;
	delete window.ArtenVonZeit;
	//allfällige Lokalisierung abbrechen
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
	//hierarchisch tiefere Listen löschen
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
	//allfällige Lokalisierung abbrechen
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


/*!
* jQuery Mobile Framework : drag pagination plugin
* Copyright (c) Filament Group, Inc
* Authored by Scott Jehl, scott@filamentgroup.com
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function ($, undefined) {

	//auto-init on pagecreate
	$(document).bind("pagecreate", function (e) {
		$(":jqmData(role='pagination')", e.target).pagination();
	});

	var pageTitle = "";

	//create widget
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

			//set up next and prev buttons

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
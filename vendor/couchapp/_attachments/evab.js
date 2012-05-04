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
};

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
};

/*
funktion, mit der man recht einfach einen Paramater aus der URL lesen kann. 
Sollte der Parameter nicht vorhanden sein, so liefert die Funktion einen leeren String zurück, andernfalls den Inhalt des Parameters.
 
Hier noch ein Verwendungsbeispiel:
URL: http://www.example.com/?titel=test&trinken=bier&essen=schweinshaxe
wasEssenWir = get_url_param('essen');
*/
function get_url_param(name) {
	var regexS, regex, results;
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	regexS = "[\\?&]"+name+"=([^&#]*)";
	regex = new RegExp(regexS);
	results = regex.exec(window.location.href);
	//results = regex.exec( $(this).data("url") );

	if (!results) {
		return "";
	} else {
		return results[1];
	}
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

function speichereNeueBeob(aArtGruppe, aArtBezeichnung, ArtId, Von, hProjektId, hRaumId, hOrtId, hZeitId) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//aufgerufen bloss von Artenliste.html
//hArtListe und hArtEdit geben hProjektId, hRaumId, hOrtId und hZeitId mit
	var doc;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.User = Username;
	doc.aArtGruppe = aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = ArtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	if (Von === "hArtListe" || Von === "hArtEdit") {
		doc.Typ = "hArt";
		doc.hProjektId = hProjektId;
		doc.hRaumId = hRaumId;
		doc.hOrtId = hOrtId;
		doc.hZeitId = hZeitId;
		//Bei hierarchischen Beobachtungen wollen wir jetzt die Felder der höheren hierarchischen Ebenen anfügen
		speichereNeueBeob_02(doc);
	} else {
		//Von == "BeobListe" || Von == "BeobEdit"
		doc.Typ = "Beobachtung";
		speichereNeueBeob_03(doc);
	}
}

function speichereNeueBeob_02(doc) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch hArtListe.html oder hArtEdit.html
//dies ist der zweite Schritt:
//Felder der höheren Hierarchieebenen anfügen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hZeitId, {
		success: function (Zeit) {
			for (i in Zeit) {
				//FeldName = i, Feldwert = Zeit[i]
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hOrtId', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) === -1) {
					doc[i] = Zeit[i];
				}
			}
			$db.openDoc(doc.hOrtId, {
				success: function (Ort) {
					for (i in Ort) {
						//ein paar Felder wollen wir nicht
						if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) === -1) {
							doc[i] = Ort[i];
						}
					}
					$db.openDoc(doc.hRaumId, {
						success: function (Raum) {
							for (i in Raum) {
								//ein paar Felder wollen wir nicht
								if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) === -1) {
									doc[i] = Raum[i];
								}
							}
							$db.openDoc(doc.hProjektId, {
								success: function (Projekt) {
									for (i in Projekt) {
										//ein paar Felder wollen wir nicht
										if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
											doc[i] = Projekt[i];
										}
									}
									speichereNeueBeob_03(doc);
								}
							});
						}
					});
				}
			});
		}
	});
}

function speichereNeueBeob_03(doc) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//dies ist der letzte Schritt:
//Autor anfügen und weiter zum Edit-Formular
	$db = $.couch.db("evab");
	$db.view('evab/User?key="' + doc.User + '"', {
		success: function (Userliste) {
			User = Userliste.rows[0].value;
			doc.aAutor = User.Autor;
			$db.saveDoc(doc, {
				success: function (data) {
					BeobId = data.id;
					if (doc.Typ === 'hArt') {
						//Variabeln verfügbar machen
						hBeobId = data.id;
						sessionStorage.hBeobId = hBeobId;
						//Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						if (typeof hBeobListe !== "undefined") {
							hBeobListe = undefined;
						}
						sessionStorage.removeItem("hBeobListe");
						//Wenn hArtEditPage schon im Dom ist, mit changePage zur id wechseln, sonst zur Url
						if ($("#hArtEditPage").length > 0) {
							$.mobile.changePage($("#hArtEditPage"));
							
							//initiierehBeobEdit(BeobId);
							//$("#al_Page").removeClass('ui-page-active');
							//$("#hArtEditPage").addClass('ui-page-active');
						} else {
							window.open("hArtEdit.html?id=" + data.id, target = "_self");
							/*$.mobile.changePage("hArtEdit.html", {
								type: "get",
								data: "id=" + data.id
							});*/
						}
					} else {
						//Variabeln verfügbar machen
						BeobId = data.id;
						sessionStorage.BeobId = BeobId;
						//Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						if (typeof BeobListe !== "undefined") {
							BeobListe = undefined;
						}
						sessionStorage.removeItem("BeobListe");
						//Wenn BeobEditPage schon im Dom ist, mit changePage zur id wechseln, sonst zur Url
						if ($("#BeobEditPage").length > 0) {
							$.mobile.changePage($("#BeobEditPage"));
							//$.mobile.changePage("BeobEdit.html?id=" + data.id);
							
							//alert("BeobId = " + BeobId);
							//initiiereBeobEdit(BeobId);
							//$("#al_Page").removeClass('ui-page-active');
							//$("#BeobEditPage").addClass('ui-page-active');
						} else {
							window.open("BeobEdit.html?id=" + BeobId, target = "_self");
							//$.mobile.changePage("BeobEdit.html?id=" + data.id);
						}
						//window.open("BeobEdit.html?id=" + data.id + "&Status=neu", target = "_self");
						//$.mobile.changePage("BeobEdit.html?id=" + data.id, {reloadPage:"true", allowSamePageTransition:"true"});
						GetGeolocation();
					}
				},
				error: function () {
					melde("Beobachtung nicht gespeichert.");
				}
			});
		}
	});
}

//Speichert, wenn in BeobEdit oder hArtEdit eine neue Art und ev. auch eine neue Artgruppe gewählt wurde
//erwartet Von = von welchem Formular aufgerufen wurde
function speichereBeobNeueArtgruppeArt(BeobId, aArtGruppe, aArtName, ArtId, Von) {
$db = $.couch.db("evab");
$db.openDoc(BeobId, {
		success: function (Beob) {
			if (aArtGruppe) {
				Beob.aArtGruppe = aArtGruppe;
			}
			Beob.aArtName = aArtName;
			Beob.aArtId = ArtId;
			$db.saveDoc(Beob, {
				success: function (data) {
					if (Von === "BeobListe" || Von === "BeobEdit") {
						//Variabeln verfügbar machen
						BeobId = data.id;
						sessionStorage.BeobId = BeobId;
						//Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						if (typeof BeobListe !== "undefined") {
							BeobListe = undefined;
						}
						sessionStorage.removeItem("BeobListe");
						if ($('#BeobEditPage').length > 0) {
							$.mobile.changePage($('#BeobEditPage'));
							//alert("BeobId = " + BeobId);
							initiiereBeobEdit(BeobId);
						} else {
							window.open("BeobEdit.html?id=" + BeobId, target = "_self");
							//$.mobile.changePage("BeobEdit.html?id=" + BeobId);
						}
						GetGeolocation();
					} else {
						//Variabeln verfügbar machen
						hBeobId = data.id;
						sessionStorage.hBeobId = hBeobId;
						//Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						if (typeof hBeobListe !== "undefined") {
							hBeobListe = undefined;
						}
						sessionStorage.removeItem("hBeobListe");
						if ($('#hArtEditPage').length > 0) {
							$.mobile.changePage($('#hArtEditPage'));
							initiierehBeobEdit(BeobId);
						} else {
							window.open("BeobEdit.html?id=" + BeobId, target = "_self");
							//$.mobile.changePage("hArtEdit.html?id=" + BeobId);
						}
						//window.open("hArtEdit.html?hBeobId=" + Beob._id, target = "_self");
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
function erstelleMenuFürFelder(thiz, Pfad) {
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
		'fullHTML': 'true',
    	'buttons' : {
      		'Datenfelder<br>exportieren': {
		      	click: function () {
		        	window.open(Pfad + "_list/FeldExport/FeldListe");
        		},
        		theme: "a",
        		icon: "arrow-r"
      		},
      		'schliessen': {
                click: function () { return true; },
                icon: "back",
                theme: "c"
            }
    	}
  	})
}

function erstelleNeueZeit(hProjektId, hRaumId, hOrtId) {
//Neue Zeiten werden erstellt
//ausgelöst durch hZeitListe.html oder hZeitEdit.html
//dies ist der erste Schritt: doc bilden
	var doc;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.Typ = "hZeit";
	doc.User = Username;
	doc.hProjektId = hProjektId;
	doc.hRaumId = hRaumId;
	doc.hOrtId = hOrtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hOrtId, {
		success: function (Ort) {
			for (i in Ort) {
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) === -1) {
					doc[i] = Ort[i];
				}
			}
			$db.openDoc(doc.hRaumId, {
				success: function (Raum) {
					for (i in Raum) {
						//ein paar Felder wollen wir nicht
						if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) === -1) {
							doc[i] = Raum[i];
						}
					}
					$db.openDoc(doc.hProjektId, {
						success: function (Projekt) {
							for (i in Projekt) {
								//ein paar Felder wollen wir nicht
								if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
									doc[i] = Projekt[i];
								}
							}
							//speichern
							$db.saveDoc(doc, {
								success: function (Zeit) {
									//Variabeln verfügbar machen
									ZeitId = Zeit.id;
									sessionStorage.ZeitId = ZeitId;
									//Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
									if (typeof ZeitListe !== "undefined") {
										ZeitListe = undefined;
									}
									sessionStorage.removeItem("ZeitListe");
									window.open("hZeitEdit.html?id=" + Zeit.id, target = "_self");
								},
								error: function () {
									melde("Fehler: neue Zeit nicht erstellt");
								}
							});
						}
					});
				}
			});
		}
	});
}

//erstellt einen neuen Ort
//wird aufgerufen von: hOrtEdit.html, hOrtListe.html
//erwartet Username, hProjektId, hRaumId
function erstelleNeuenOrt(hProjektId, hRaumId) {
	var doc;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.Typ = "hOrt";
	doc.User = Username;
	doc.hProjektId = hProjektId;
	doc.hRaumId = hRaumId;
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hRaumId, {
		success: function (Raum) {
			for (i in Raum) {
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) === -1) {
					doc[i] = Raum[i];
				}
			}
			$db.openDoc(doc.hProjektId, {
				success: function (Projekt) {
					for (i in Projekt) {
						//ein paar Felder wollen wir nicht
						if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
							doc[i] = Projekt[i];
						}
					}
					//speichern
					$db.saveDoc(doc, {
						success: function (data) {
							//Variabeln verfügbar machen
							OrtId = data.id;
							sessionStorage.OrtId = OrtId;
							//Globale Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
							if (typeof OrtListe !== "undefined") {
								OrtListe = undefined;
							}
							sessionStorage.removeItem("OrtListe");
							window.open("hOrtEdit.html?id=" + data.id + "&Status=neu", target = "_self");
						},
						error: function () {
							melde("Fehler: neuer Ort nicht erstellt");
						 }
					});
				}
			});
		}
	});
}

function erstelleNeuenRaum(hProjektId) {
	var doc;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.Typ = "hRaum";
	doc.User = Username;
	doc.hProjektId = hProjektId;
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(hProjektId, {
		success: function (Projekt) {
			for (i in Projekt) {
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
					doc[i] = Projekt[i];
				}
			}
			//speichern
			$db.saveDoc(doc, {
				success: function (data) {
					//Variabeln verfügbar machen
					RaumId = data.id;
					sessionStorage.RaumId = RaumId;
					//Globale Variablen für RaumListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
					if (typeof RaumListe !== "undefined") {
						RaumListe = undefined;
					}
					sessionStorage.removeItem("RaumListe");
					window.open("hRaumEdit.html?id=" + data.id + "&Status=neu", target = "_self");
				},
				error: function () {
					melde("Fehler: neuer Raum nicht erstellt");
				 }
			});
		}
	});
}

function erstelleNeuesProjekt() {
	var hProjekt;
	hProjekt = {};
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	hProjekt.Typ = "hProjekt";
	hProjekt.User = Username;
	$db = $.couch.db("evab");
	$db.saveDoc(hProjekt, {
		success: function (data) {
			//Variabeln verfügbar machen
			ProjektId = data.id;
			sessionStorage.ProjektId = ProjektId;
			//Globale Variablen für ProjektListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
			if (typeof Projektliste !== "undefined") {
				Projektliste = undefined;
			}
			sessionStorage.removeItem("Projektliste");
			window.open("hProjektEdit.html?id=" + data.id + "&Status=neu", target = "_self");
		},
		error: function () {
			melde("Fehler: neues Projekt nicht erstellt");
		 }
	});
}

function öffneMeineEinstellungen(Pfad) {
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	if (typeof sessionStorage.UserId === "undefined" || !sessionStorage.UserId) {
		$db = $.couch.db("evab");
		$db.view('evab/User?key="' + Username + '"', {
			success: function (data) {
				var User;
				User = data.rows[0].value;
				UserId = data.rows[0].value._id;
				sessionStorage.UserId = UserId;
				sessionStorage.Autor = User.Autor;
				window.open(Pfad + "_show/UserEdit/" + UserId, target = "_self");
			}
		});
	} else {
		window.open(Pfad + "_show/UserEdit/" + sessionStorage.UserId, target = "_self");
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

//generiert in ArtEdit.html dynamisch das collapsible set mit den Feldlisten
//Mitgeben: id der Art, Username, Artgruppe
function erstelleArtEdit(ArtId) {
	$("#ArtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	//holt die Art aus der DB
	$db = $.couch.db("evab");
	$db.openDoc(ArtId, {
		success: function (Art) {
			var HtmlContainer;
			//diese Variabeln werden in ArtEdit.html gebraucht
			ArtEdit_aArtGruppe = Art.ArtGruppe
			//fixe Felder aktualisieren
			$("#ArtEdit_ArtGruppe").selectmenu();
			$("#ArtEdit_ArtGruppe").val(ArtEdit_aArtGruppe);
			$("#ArtEdit_ArtGruppe").html("<option value='" + ArtEdit_aArtGruppe + "'>" + ArtEdit_aArtGruppe + "</option>");
			$("#ArtEdit_ArtGruppe").selectmenu("refresh");
			$("#ArtEdit_ArtBezeichnungL").selectmenu();
			$("#ArtEdit_ArtBezeichnungL").val(Art.ArtBezeichnungL);
			$("#ArtEdit_ArtBezeichnungL").html("<option value='" + Art.ArtBezeichnungL + "'>" + Art.ArtBezeichnungL + "</option>");
			$("#ArtEdit_ArtBezeichnungL").selectmenu("refresh");
			HtmlContainer = generiereHtmlFuerArtEditForm(Art);
			//nur anfügen, wenn Felder erstellt wurden
			if (HtmlContainer) {
				HtmlContainer = "<hr />" + HtmlContainer;
				$("#ArtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
			}
			$("#ArtEdit_Hinweistext").html("");
			//url aktualisieren, nötig wenn zwischen mehreren Seiten mit changePage gewechselt wird
			window.history.pushState("", "", "ArtEdit.html?ArtId=" + ArtId); //funktioniert in IE erst ab 10!
		}
	});
}

//generiert das Html für das Formular in ArtEdit.html
//erwartet Art als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerArtEditForm(Art) {
	var HtmlContainer, Titel, Feldname, Feldwert, Datensammlung;
	HtmlContainer = '';
	for (i in Art) {              
		if (i.slice(0, 13) === "Datensammlung") {
			if (Art[i]) {
				Titel = Art[i].Datensammlung;
				//collapsible und Liste beginnen
				if (Titel === "Index") {
					//der Index soll aufgeklappt sein
					HtmlContainer += '<div data-role="collapsible" data-collapsed="false"><h3>';
				} else {
					HtmlContainer += '<div data-role="collapsible"><h3>';
				}
				HtmlContainer += Titel;
				HtmlContainer += '</h3><ul data-role="listview">';
				for (y in Art[i]) {
					if (y !== "Datensammlung") {
						Feldname = y;
						Feldwert = Art[i][y];
						HtmlContainer += generiereHtmlFuerReadOnlyListZeile(Feldname, Feldwert);
					}
				}
				//Liste und collapsible beenden
				HtmlContainer += '</ul></div>';
			}
		}
	}
	HtmlContainer += '';
	return HtmlContainer;
}

//generiert Html für read-only lists für Feldnamen - Feldwerte
//Erwartet Feldname und Feldwert
//retourniert Html für eine Zeile
function generiereHtmlFuerReadOnlyListZeile(Feldname, Feldwert) {
	var HtmlContainer;
	//Liste und ersten Block beginnen
	HtmlContainer = '<li><div class="ui-grid-a"><div class="ui-block-a ArteigenschaftFeldname">';
	HtmlContainer += Feldname;
	//ersten Block beenden, zweiten beginnen
	HtmlContainer += ':</div><div class="ui-block-b ArteigenschaftFeldwert">';
	HtmlContainer += Feldwert;
	//zweiten Block und Liste beenden
	HtmlContainer += '</div></div></li>';
	return HtmlContainer;
}

//initiiert Variabeln, fixe Felder und dynamische Felder in BeobEdit.html
//wird aufgerufen von BeobEdit.html und Felder_Beob.html
function initiiereBeobEdit(id) {
	//prüfen, ob die Feldliste schon geholt wurde
	//wenn ja: deren globale Variable verwenden
	if (typeof FeldlisteBeobEdit !== "undefined") {
		initiiereBeobEdit_2(id, FeldlisteBeobEdit);
	} else {
		//holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeBeob', {
			success: function (Feldliste) {
				//Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				FeldlisteBeobEdit = Feldliste;
				initiiereBeobEdit_2(id, FeldlisteBeobEdit);
			}
		});
	}
}

function initiiereBeobEdit_2(id, Feldliste) {
	$db.openDoc(id, {
		success: function (Beob) {
			//diese (globalen) Variabeln werden in BeobEdit.html gebraucht
			BeobId = Beob._id;
			sessionStorage.BeobId = BeobId;
			aArtGruppe = Beob.aArtGruppe;
			sessionStorage.aArtGruppe = aArtGruppe;
			aArtName = Beob.aArtName;
			sessionStorage.aArtName = aArtName;
			aArtId = Beob.aArtId;
			sessionStorage.aArtId = aArtId;
			oLongitudeDecDeg = Beob.oLongitudeDecDeg || "";
			oLatitudeDecDeg = Beob.oLatitudeDecDeg || "";
			setzeFixeFelderInBeobEdit(Beob);
			erstelleDynamischeFelderBeobEdit(Feldliste, Beob, Beob.User);
			//url muss gepuscht werden, wenn mit changePage zwischen mehreren Formularen gewechselt wurde
			window.history.pushState("", "", "BeobEdit.html?id=" + BeobId); //funktioniert in IE erst ab 10!
			//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
			speichereLetzteUrl();
		}
	});
}

//generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//und aktualisiert die Links für pagination
//Mitgeben: id der Beobachtung, Username
function erstelleDynamischeFelderBeobEdit(Feldliste, Beob, Username) {
	var HtmlContainer, Formularwerte;
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#BeobEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	HtmlContainer = generiereHtmlFuerBeobEditForm (Username, Feldliste, Beob);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	} else {
		HtmlContainer = "";
	}
	//nötig, weil sonst die dynamisch eingefügten Elemente nicht erscheinen (Felder) bzw. nicht funktionieren (links)
	$("#BeobEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	$("#BeobEditPage").trigger("create").trigger("refresh");
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#BeobEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (Formularwerte[i] && Formularwerte[i] !== "Position ermitteln...") {
				Beob[i] = Formularwerte[i];
			} else if (Beob[i]) {
				delete Beob[i]
			}
		}
		$db.saveDoc(Beob);
	}
	erstelleAttachments(Beob);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
}

//setzt die Values in die hart codierten Felder im Formular BeobEdit.html
//erwartet das Objekt Beob, welches die Werte enthält
function setzeFixeFelderInBeobEdit(Beob) {
	$("#aArtGruppe").selectmenu();
	$("#aArtGruppe").html("<option value='" + Beob.aArtGruppe + "'>" + Beob.aArtGruppe + "</option>");
	$("#aArtGruppe").val(Beob.aArtGruppe);
	$("#aArtGruppe").selectmenu("refresh");
	$("#aArtName").selectmenu();
	$("#aArtName").html("<option value='" + Beob.aArtName + "'>" + Beob.aArtName + "</option>");
	$("#aArtName").val(Beob.aArtName);
	$("#aArtName").selectmenu("refresh");
	$("#aAutor").val(Beob.aAutor);
	$("#oXKoord").val(Beob.oXKoord);
	$("#oYKoord").val(Beob.oYKoord);
	$("#oLagegenauigkeit").val(Beob.oLagegenauigkeit);
	$("#zDatum").val(Beob.zDatum);
	$("#zUhrzeit").val(Beob.zUhrzeit);
}

//generiert das Html für das Formular in BeobEdit.html
//erwartet Feldliste als Objekt; Beob als Objekt, Artgruppe
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerBeobEditForm (Username, Feldliste, Beob) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMaximum, SliderMinimum, ListItem, HtmlContainer, Status, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = get_url_param("Status");
	ArtGruppe = Beob.aArtGruppe;
	for (i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User === Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusEinfach.indexOf(Username) !== -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1) {
			//In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
			if (Feld.Hierarchiestufe !== "Art" || Feld.ArtGruppe.indexOf(ArtGruppe) >= 0) {
				if (Status === "neu" && Feld.Standardwert) {
					//FeldWert = eval("Feld.Standardwert." + Username) || "";
					FeldWert = Feld.Standardwert[Username] || "";
				} else {
					//FeldWert = (eval("Beob." + FeldName) || "");
					FeldWert = Beob[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	return HtmlContainer;
}

//generiert in hProjektEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Projekts, Username
function initiiereProjektEdit(ProjektId) {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#hProjektEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	$db = $.couch.db("evab");
	$db.openDoc(ProjektId, {
		success: function (Projekt) {
			//fixe Felder aktualisieren
			$("#pName").val(Projekt.pName);
			//Variabeln bereitstellen
			ProjektId = Projekt._id;
			sessionStorage.ProjektId = ProjektId;
			//prüfen, ob die Feldliste schon geholt wurde
			//wenn ja: deren globale Variable verwenden
			if (typeof FeldlisteProjektEdit !== "undefined") {
				initiiereProjektEdit_2(Projekt);
			} else {
				$db = $.couch.db("evab");
				//holt die Feldliste aus der DB
				$db.view('evab/FeldListeProjekt', {
					success: function (Feldliste) {
						FeldlisteProjektEdit = Feldliste;
						initiiereProjektEdit_2(Projekt);
					}
				});
			}
		}
	});	
}

function initiiereProjektEdit_2(Projekt) {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerProjektEditForm(Projekt);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hProjektEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hProjektEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (Formularwerte[i]) {
				Projekt[i] = Formularwerte[i];
			} else if (Projekt[i]) {
				delete Projekt[i]
			}
		}
		$db.saveDoc(Projekt);
	}
	erstelleAttachments(Projekt);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für das Formular in hProjektEdit.html
//erwartet Feldliste als Objekt; Projekt als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerProjektEditForm (Projekt) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, Status;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = get_url_param("Status");
	for (i in FeldlisteProjektEdit.rows) {
		Feld = FeldlisteProjektEdit.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User === Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Username) !== -1 && FeldName !== "pName") {
			if (Status === "neu" && Feld.Standardwert) {
				//FeldWert = eval("Feld.Standardwert." + Username) || "";
				FeldWert = Feld.Standardwert[Username] || "";
			} else {
				//FeldWert = (eval("Projekt." + FeldName) || "");
				FeldWert = Projekt[FeldName] || "";
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

//generiert in hRaumEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Raums, Username
function initiiereRaumEdit(RaumId) {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#hRaumEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	$db = $.couch.db("evab");
	//Holt den Raum mit der id "RaumId" aus der DB
	$db.openDoc(RaumId, {
		success: function (Raum) {
			//fixes Feld setzen
			$("#rName").val(Raum.rName);
			//Variabeln bereitstellen
			ProjektId = Raum.hProjektId;
			sessionStorage.ProjektId = ProjektId;
			RaumId = Raum._id;
			sessionStorage.RaumId = RaumId;
			//prüfen, ob die Feldliste schon geholt wurde
			//wenn ja: deren globale Variable verwenden
			if (typeof FeldlisteRaumEdit !== "undefined") {
				initiiereRaumEdit_2(Raum);
			} else {
				//holt die Feldliste aus der DB
				$db = $.couch.db("evab");
				$db.view('evab/FeldListeRaum', {
					success: function (Feldliste) {
						FeldlisteRaumEdit = Feldliste;
						initiiereRaumEdit_2(Raum);
					}
				});
			}
		}
	});
}

function initiiereRaumEdit_2(Raum) {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerRaumEditForm (FeldlisteRaumEdit, Raum);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hRaumEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hRaumEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (Formularwerte[i]) {
				Raum[i] = Formularwerte[i];
			} else if (Raum[i]) {
				delete Raum[i]
			}
		}
		$db.saveDoc(Raum);
	}
	erstelleAttachments(Raum);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für das Formular in hRaumEdit.html
//erwartet Feldliste als Objekt; Raum als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerRaumEditForm (Feldliste, Raum) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, Status;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = get_url_param("Status");
	for (i in Feldliste.rows) {
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User === Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Username) !== -1 && FeldName !== "rName") {
			if (Status === "neu" && Feld.Standardwert) {
				//FeldWert = eval("Feld.Standardwert." + Username) || "";
				FeldWert = Feld.Standardwert[Username] || "";
			} else {
				//FeldWert = (eval("Raum." + FeldName) || "");
				FeldWert = Raum[FeldName] || "";
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

function initiiereRaumListe() {
	erstelleRaumListe();
	speichereLetzteUrl();
}

function erstelleRaumListe() {
	$("#Räume").empty();
	//hat hRaumEdit.html eine RaumListe übergeben?
	if (typeof sessionStorage.RaumListe !== "undefined" && sessionStorage.RaumListe) {
		//Objekte werden als Strings übergeben, müssen geparst werden
		RaumListe = JSON.parse(sessionStorage.RaumListe);
		erstelleRaumListe_2();
	} else {
		if (typeof Username === "undefined" || !Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hRaumListe?startkey=["' + sessionStorage.Username + '", "' + sessionStorage.ProjektId + '"]&endkey=["' + sessionStorage.Username + '", "' + sessionStorage.ProjektId + '" ,{}]', {
			success: function (data) {
				RaumListe = data;
				//RaumListe für haumEdit bereitstellen
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.RaumListe = JSON.stringify(RaumListe);
				erstelleRaumListe_2();
			}
		});
	}
}

function erstelleRaumListe_2() {
	var i, anzRaum, Raum, externalPage, listItem, ListItemContainer, Titel2;
	anzRaum = 0;
	ListItemContainer = "";
	for (i in RaumListe.rows) {                    //Räume zählen
		anzRaum += 1;
	}
	Titel2 = " Räume";                   //Im Titel der Seite die Anzahl Räume anzeigen
	if (anzRaum === 1) {
		Titel2 = " Raum";
	}
	$("#hRaumListePageHeader .hRaumListePageTitel").text(anzRaum + Titel2);
	if (anzRaum === 0) {
		ListItemContainer = '<li><a href="#" data-transition="slideup" rel="external" name="hRaumNeuLink" class="erste">Ersten Raum erfassen</a></li>';
	} else {
		for (i in RaumListe.rows) {                //Liste aufbauen
			Raum = RaumListe.rows[i].value;
			key = RaumListe.rows[i].key;
			rName = Raum.rName;
			//externalPage = "hRaumEdit.html?id=" + Raum._id + "&ProjektId=" + ProjektId;
			//listItem = "<li RaumId=\"" + Raum._id + "\" class=\"Raum\"><a href=\"" + externalPage + "\" rel=\"external\"><h3>" + rName + "<\/h3><\/a> <\/li>";
			listItem = "<li RaumId=\"" + Raum._id + "\" class=\"Raum\"><a href=\"#\"><h3>" + rName + "<\/h3><\/a> <\/li>";
			ListItemContainer += listItem;
		}
	}
	$("#Räume").html(ListItemContainer);
	$("#Räume").listview("refresh");
}

//generiert in hOrtEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Orts
function initiiereOrtEdit(OrtId) {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#hOrtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	$db = $.couch.db("evab");
	$db.openDoc(OrtId, {
		success: function (Ort) {
			//fixe Felder aktualisieren
			$("#oName").val(Ort.oName);
			$("#oXKoord").val(Ort.oXKoord);
			$("#oYKoord").val(Ort.oYKoord);
			$("#oLagegenauigkeit").val(Ort.oLagegenauigkeit);
			//Variabeln bereitstellen
			ProjektId = Ort.hProjektId;
			sessionStorage.ProjektId = ProjektId;
			RaumId = Ort.hRaumId;
			sessionStorage.RaumId = RaumId;
			OrtId = Ort._id;
			sessionStorage.OrtId = OrtId;
			//Lat Lng werden geholt. Existieren sie nicht, erhalten Sie den Wert ""
			oLongitudeDecDeg = Ort.oLongitudeDecDeg || "";
			oLatitudeDecDeg = Ort.oLatitudeDecDeg || "";
			//prüfen, ob die Feldliste schon geholt wurde
			//wenn ja: deren globale Variable verwenden
			if (typeof FeldlisteOrtEdit !== "undefined") {
				initiiereOrtEdit_2(Ort);
			} else {
				//holt die Feldliste aus der DB
				$db = $.couch.db("evab");
				$db.view('evab/FeldListeOrt', {
					success: function (Feldliste) {
						//Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
						FeldlisteOrtEdit = Feldliste;
						initiiereOrtEdit_2(Ort);
					}
				});
			}
		}
	});			
}

function initiiereOrtEdit_2(Ort) {
	var HtmlContainer, Formularwerte;
	HtmlContainer = generiereHtmlFuerOrtEditForm(Ort);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hOrtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hOrtEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (Formularwerte[i]) {
				Ort[i] = Formularwerte[i];
			} else if (Ort[i]) {
				delete Ort[i]
			}
		}
		$db.saveDoc(Ort);
	}
	erstelleAttachments(Ort);
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen verorten
		//aber nur, wenn noch keine Koordinaten drin sind
		if (!$("#oXKoord").val()) {
			GetGeolocation();
		}
	}
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//url muss gepuscht werden, wenn mit changePage zwischen mehreren Formularen gewechselt wurde
	window.history.pushState("", "", "hOrtEdit.html?id=" + Ort._id); //funktioniert in IE erst ab 10!
	aktualisiereLinksMitOrtId_hoe();
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();

}

//generiert das Html für das Formular in hOrtEdit.html
//erwartet Feldliste als Objekt (aus der globalen Variable); Ort als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerOrtEditForm (Ort) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, Status;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = get_url_param("Status");
	for (i in FeldlisteOrtEdit.rows) {              
		Feld = FeldlisteOrtEdit.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User === Ort.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Ort.User) !== -1 && (FeldName !== "oName") && (FeldName !== "oXKoord") && (FeldName !== "oYKoord") && (FeldName !== "oLagegenauigkeit")) {
			if (Status === "neu" && Feld.Standardwert) {
				//FeldWert = eval("Feld.Standardwert." + Ort.User) || "";
				FeldWert = Feld.Standardwert[Ort.User] || "";
			} else {
				//FeldWert = (eval("Ort." + FeldName) || "");
				FeldWert = Ort[FeldName] || "";
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

function initiiereOrtListe() {
	erstelleOrtListe();
	speichereLetzteUrl();
}

function erstelleOrtListe() {
	$("#Orte").empty();
	//hat hOrtEdit.html eine OrtListe übergeben?
	if (typeof sessionStorage.OrtListe !== "undefined" && sessionStorage.OrtListe) {
		//Objekte werden als Strings übergeben, müssen geparst werden
		OrtListe = JSON.parse(sessionStorage.OrtListe);
		erstelleOrtListe_2();
	} else {
		if (typeof Username === "undefined" || !Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hOrtListe?startkey=["' + sessionStorage.Username + '", "' + sessionStorage.RaumId + '"]&endkey=["' + sessionStorage.Username + '", "' + sessionStorage.RaumId + '" ,{}]', {
			success: function (data) {
				//OrtListe für hOrtEdit bereitstellen
				OrtListe = data;
				sessionStorage.OrtListe = JSON.stringify(data);	//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				erstelleOrtListe_2();
			}
		});
	}
}

function erstelleOrtListe_2() {
	var i, anzOrt, Ort, externalPage, listItem, ListItemContainer, Titel2;
	anzOrt = 0;
	ListItemContainer = "";
	for (i in OrtListe.rows) {                //Orte zählen. Wenn noch keine: darauf hinweisen
		anzOrt += 1;
	}
	Titel2 = " Orte";                    //Im Titel der Seite die Anzahl Orte anzeigen
	if (anzOrt === 1) {
		Titel2 = " Ort";
	}
	$("#hOrtListePageHeader .hOrtListePageTitel").text(anzOrt + Titel2);

	if (anzOrt === 0) {
		ListItemContainer = '<li><a href="#" class="erste hol_NeuLink">Ersten Ort erfassen</a></li>';
	} else {
		for (i in OrtListe.rows) {                //Liste aufbauen
			Ort = OrtListe.rows[i].value;
			key = OrtListe.rows[i].key;
			listItem = "<li OrtId=\"" + Ort._id + "\" class=\"Ort\"><a href=\"#\"><h3>" + Ort.oName + "<\/h3><\/a> <\/li>";
			ListItemContainer += listItem;
		}
	}
	$("#Orte").html(ListItemContainer);
	$("#Orte").listview("refresh");
}

//generiert in hZeitEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id der Zeit
function initiiereZeitEdit(ZeitId) {
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#hZeitEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	$db = $.couch.db("evab");
	$db.openDoc(ZeitId, {
		success: function (Zeit) {
			//fixe Felder aktualisieren
			$("#zDatum").val(Zeit.zDatum);
			$("#zUhrzeit").val(Zeit.zUhrzeit);
			//Variabeln bereitstellen
			ProjektId = Zeit.hProjektId;
			sessionStorage.ProjektId = ProjektId;
			RaumId = Zeit.hRaumId;
			sessionStorage.RaumId = RaumId;
			OrtId = Zeit.hOrtId;
			sessionStorage.OrtId = OrtId;
			ZeitId = Zeit._id;
			sessionStorage.ZeitId = ZeitId;
			//prüfen, ob die Feldliste schon geholt wurde
			//wenn ja: deren globale Variable verwenden
			if (typeof FeldlisteZeitEdit !== "undefined") {
				initiiereZeitEdit_2(Zeit);
			} else {
				$db = $.couch.db("evab");
				//holt die Feldliste aus der DB
				$db.view('evab/FeldListeZeit', {
					success: function (Feldliste) {
						FeldlisteZeitEdit = Feldliste;
						initiiereZeitEdit_2(Zeit);
					}
				});
			}
		}
	});
}

function initiiereZeitEdit_2(Zeit) {
	var HtmlContainer = generiereHtmlFuerZeitEditForm(Zeit);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hZeitEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		speichereAlles();
	}
	erstelleAttachments(Zeit);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

function initiiereZeitListe() {
	erstelleZeitListe();
	speichereLetzteUrl();
}

//erstellt die Liste der Zeiten in Formular hZeitListe.html
function erstelleZeitListe() {
		//hat hZeitEdit.html eine ZeitListe übergeben?
	if (typeof sessionStorage.ZeitListe !== "undefined" && sessionStorage.ZeitListe) {
		//Objekte werden als Strings übergeben, müssen geparst werden
		ZeitListe = JSON.parse(sessionStorage.ZeitListe);
		erstelleZeitListe_2();
	} else {
  		if (typeof Username === "undefined" || !Username) {
			pruefeAnmeldung();
		}
		$("#Zeiten").empty();
		$db = $.couch.db("evab");
		$db.view('evab/hZeitListe?startkey=["' + Username + '", "' + sessionStorage.OrtId + '"]&endkey=["' + Username + '", "' + sessionStorage.OrtId + '" ,{}]', {
			success: function (data) {
				//ZeitListe für hZeitEdit bereitstellen
				ZeitListe = data;
				sessionStorage.ZeitListe = JSON.stringify(data);  //Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				erstelleZeitListe_2();
			}
		});
	}
}

function erstelleZeitListe_2() {
	var i, anzZeit, Zeit, externalPage, listItem, ListItemContainer, Titel2, zZeitDatum;
	anzZeit = 0;
	ListItemContainer = "";
	for (i in ZeitListe.rows) {                    //Zeiten zählen. Wenn noch keine: darauf hinweisen
		anzZeit += 1;
	}

	Titel2 = " Zeiten";                  //Im Titel der Seite die Anzahl Zeiten anzeigen
	if (anzZeit === 1) {
		Titel2 = " Zeit";
	}
	$("#hZeitListePageHeader .hZeitListePageTitel").text(anzZeit + Titel2);

	if (anzZeit === 0) {
		ListItemContainer = '<li><a href="#" class="erste hzl_NeuLink">Erste Zeit erfassen</a></li>';
	} else {
		for (i in ZeitListe.rows) {
			Zeit = ZeitListe.rows[i].value;
			key = ZeitListe.rows[i].key;
			zZeitDatum = key[2] + "&nbsp; &nbsp;" + key[3];
			listItem = "<li ZeitId=\"" + Zeit._id + "\" class=\"Zeit\"><a href=\"#\"><h3>" + zZeitDatum + "<\/h3><\/a> <\/li>";
			ListItemContainer += listItem;
		}
	}
	$("#Zeiten").html(ListItemContainer);
	$("#Zeiten").listview("refresh");
}

//generiert das Html für das Formular in hZeitEdit.html
//erwartet Feldliste als Objekt; Zeit als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerZeitEditForm(Zeit) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, Status;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = get_url_param("Status");
	for (i in FeldlisteZeitEdit.rows) {              
		Feld = FeldlisteZeitEdit.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User === Zeit.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Zeit.User) !== -1 && FeldName !== "zDatum" && FeldName !== "zUhrzeit") {
			if (Status === "neu" && Feld.Standardwert) {
				//FeldWert = eval("Feld.Standardwert." + Zeit.User) || "";
				FeldWert = Feld.Standardwert[Zeit.User] || "";
			} else {
				//FeldWert = (eval("Zeit." + FeldName) || "");
				FeldWert = Zeit[FeldName] || "";
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

//Wenn die hBeobListe.html direkt als erste Seite aufgerufen wird, 
//wird die ZeitId aus der url gelesen und initiierehBeobListe() übergeben
//hier werden die Variabeln bereitgestellt
function erstinitiierehBeobListe(ZeitId) {
	$db = $.couch.db("evab");
	$db.openDoc(ZeitId, {
		success: function (Zeit) {
			//Variabeln bereitstellen
			ProjektId = Zeit.hProjektId;
			sessionStorage.ProjektId = ProjektId;
			RaumId = Zeit.hRaumId;
			sessionStorage.RaumId = RaumId;
			OrtId = Zeit.hOrtId;
			sessionStorage.OrtId = OrtId;
			ZeitId = Zeit._id;
			sessionStorage.ZeitId = ZeitId;
		}
	});
}

//managt den Aufbau aller Daten und Felder für hBeobEdit.html
//erwartet die hBeobId
//wird aufgerufen von hBeobEdit.html und Felder_Beob.html
function initiierehBeobEdit(BeobId) {
	//hier werden Variablen gesetzt,
	//in die fixen Felder Werte eingesetzt,
	//die dynamischen Felder aufgebaut
	//und die Nav-Links gesetzt
	$db = $.couch.db("evab");
	$db.openDoc(BeobId, {
		success: function (Beob) {
			//diese (globalen) Variabeln werden in hArtEdit.html gebraucht
			//Variabeln bereitstellen
			ProjektId = Beob.hProjektId;
			sessionStorage.ProjektId = ProjektId;
			RaumId = Beob.hRaumId;
			sessionStorage.RaumId = RaumId;
			OrtId = Beob.hOrtId;
			sessionStorage.OrtId = OrtId;
			ZeitId = Beob.hZeitId;
			sessionStorage.ZeitId = ZeitId;
			hBeobId = Beob._id;
			sessionStorage.hBeobId = hBeobId;
			aArtGruppe = Beob.aArtGruppe;
			sessionStorage.aArtGruppe = aArtGruppe;
			aArtName = Beob.aArtName;
			sessionStorage.aArtName = aArtName;
			aArtId = Beob.aArtId;
			sessionStorage.aArtId = aArtId;
			//fixe Felder aktualisieren
			$("#aArtGruppe").selectmenu();
			$("#aArtGruppe").val(aArtGruppe);
			$("#aArtGruppe").html("<option value='" + aArtGruppe + "'>" + aArtGruppe + "</option>");
			$("#aArtGruppe").selectmenu("refresh");
			$("#aArtName").selectmenu();
			$("#aArtName").val(aArtName);
			$("#aArtName").html("<option value='" + aArtName + "'>" + aArtName + "</option>");
			$("#aArtName").selectmenu("refresh");
			//Links in der Navbar setzen
			$("#hae_ProjektLink").attr("href", "hProjektEdit.html?id=" + ProjektId);
			$("#hae_RaumLink").attr("href", "hRaumEdit.html?id=" + RaumId);
			$("#hae_OrtLink").attr("href", "hOrtEdit.html?id=" + OrtId);
			$("#hae_ZeitLink").attr("href", "hZeitEdit.html?id=" + ZeitId);
			$("[name='hArtListeLink']").attr('href', "hArtListe.html?id=" + ZeitId);
			//prüfen, ob die Feldliste schon geholt wurde
			//wenn ja: deren globale Variable verwenden
			if (typeof FeldlistehBeobEdit !== "undefined") {
				erstelleDynamischeFelderhArtEdit(FeldlistehBeobEdit, Beob);
			} else {
				//Feldliste aus der DB holen
				$db = $.couch.db("evab");
				$db.view('evab/FeldListeArt', {
					success: function (data) {
						FeldlistehBeobEdit = data;
						erstelleDynamischeFelderhArtEdit(FeldlistehBeobEdit, Beob);
						
					}
				});
			}
		}
	});
}

//generiert dynamisch die Artgruppen-abhängigen Felder
//Mitgeben: Feldliste, Beobachtung
function erstelleDynamischeFelderhArtEdit(Feldliste, Beob) {
	var HtmlContainer, Formularwerte;
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#hArtEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	HtmlContainer = generiereHtmlFuerhArtEditForm(Feldliste, Beob);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	}
	$("#hArtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	if (get_url_param("Status") === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hArtEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (Formularwerte[i] && Formularwerte[i] !== "Position ermitteln...") {
				Beob[i] = Formularwerte[i];
			} else if (Beob[i]) {
				delete Beob[i]
			}
		}
		$db.saveDoc(Beob);
	}
	erstelleAttachments(Beob);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//url muss gepuscht werden, wenn mit changePage zwischen mehreren Formularen gewechselt wurde
	window.history.pushState("", "", "hArtEdit.html?id=" + Beob._id); //funktioniert in IE erst ab 10!
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für Formular in hArtEdit.html
//erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerhArtEditForm (Feldliste, Beob) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, Status, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = get_url_param("Status");
	ArtGruppe = Beob.aArtGruppe;
	for (i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User === Beob.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Beob.User) !== -1 && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0 && (FeldName !== "aArtId") && (FeldName !== "aArtGruppe") && (FeldName !== "aArtName")) {
			if (Status === "neu" && Feld.Standardwert) {
				//FeldWert = eval("Feld.Standardwert." + Beob.User) || "";
				FeldWert = Feld.Standardwert[Beob.User] || "";
			} else {
				//FeldWert = (eval("Beob." + FeldName) || "");
				FeldWert = Beob[FeldName] || "";
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

function initiierehBeobListe() {
	erstellehBeobListe();
	speichereLetzteUrl();
}

function erstellehBeobListe() {
	$("#Arten").empty();
	//hat hArtEdit.html eine hBeobListe übergeben?
	if (typeof sessionStorage.hBeobListe !== "undefined" && sessionStorage.hBeobListe) {
		//Objekte werden als Strings übergeben, müssen geparst werden
		hBeobListe = JSON.parse(sessionStorage.hBeobListe);
		erstellehBeobListe_2();
	} else {
  		if (typeof Username === "undefined" || !Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hArtListe?startkey=["' + Username + '", "' + sessionStorage.ZeitId + '"]&endkey=["' + Username + '", "' + sessionStorage.ZeitId + '" ,{}]', {
			success: function (data) {
				//Liste bereitstellen, um Datenbankzugriffe zu reduzieren
				hBeobListe = data;
				sessionStorage.hBeobListe = JSON.stringify(hBeobListe);
				erstellehBeobListe_2();
			}
		});
	}
}

function erstellehBeobListe_2() {
	var i, anzArt, Art, externalPage, listItem, ListItemContainer, Titel2, bArtName;
	anzArt = 0;
	ListItemContainer = "";
	for (i in hBeobListe.rows) {               //Arten zählen. Wenn noch keine: darauf hinweisen
		anzArt += 1;
	}

	Titel2 = " Arten";                   //Im Titel der Seite die Anzahl Arten anzeigen
	if (anzArt === 1) {
		Titel2 = " Art";
	}
	$("#hArtListePageHeader .hArtListePageTitel").text(anzArt + Titel2);

	if (anzArt === 0) {
		ListItemContainer = '<li><a href="#" class="erste hal_NeuLink">Erste Art erfassen</a></li>';
	} else {
		for (i in hBeobListe.rows) {                //Liste aufbauen
			hBeob = hBeobListe.rows[i].value;
			key = hBeobListe.rows[i].key;
			aArtGruppe = hBeob.aArtGruppe;
			ImageLink = "Artgruppenbilder/" + aArtGruppe + ".png";
			bArtName = key[2];
			listItem = "<li class=\"beob ui-li-has-thumb\" hBeobId=\"" + hBeob._id + "\" aArtGruppe=\"" + aArtGruppe + "\">" +
				"<a href=\"#\">" +
				"<img class=\"ui-li-thumb\" src=\"" + ImageLink + "\" />" +
				"<h3>" + bArtName + "<\/h3>" +
				"<\/a> <\/li>";
			ListItemContainer += listItem;
		}
	}
	$("#Arten").html(ListItemContainer);
	$("#Arten").listview("refresh");
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
	return HtmlContainer;
}

//generiert den html-Inhalt für Optionen von MultipleSelect
//wird von generiereHtmlFuerSelectmenu aufgerufen
//FeldWert ist ein Array
function generiereHtmlFuerMultipleselectOptionen(FeldName, FeldWert, Optionen) {
	var i, HtmlContainer, Optionn, ListItem;
	HtmlContainer = "\n\t\t<option value=''></option>";
	for (i in Optionen) {
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
        	if (this.value !== "") {
	            if (o[this.name]) {
	                if (!o[this.name].push) {
	                    o[this.name] = [o[this.name]];
	                }
	                o[this.name].push(this.value);
	            } else {
	            	if (typeof this === 'number') {   //verhindern, dass Nummern in Strings verwandelt werden
	            		o[this.name] = parseInt(this.value);
	            	} else {
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
            	if (typeof this === 'number') {   //verhindern, dass Nummern in Strings verwandelt werden
            		o[this.name] = parseInt(this.value);
            	} else {
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

function GetGeolocation() {
	watchID = null;
	//dem Benutzer mitteilen, dass die Position ermittelt wird
	$("input#oXKoord").val("Position ermitteln...");
	$("input#oYKoord").val("Position ermitteln...");
	$("input#oLagegenauigkeit").val("Position ermitteln...");
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { frequency: 3000, enableHighAccuracy: true });
	//nach spätestens 30 Sekunden aufhören zu messen
	setTimeout("stopGeolocation()", 30000);
	return watchID;
}

//Position ermitteln war erfolgreich
function onGeolocationSuccess(position) {
	var oLagegenauigkeit, Höhe, x, y;
	//Koordinaten nur behalten, wenn Mindestgenauigkeit erreicht ist
	oLagegenauigkeit = position.coords.accuracy;
	if (oLagegenauigkeit < 100) {
		oLongitudeDecDeg = position.coords.longitude;
		oLatitudeDecDeg = position.coords.latitude;
		Höhe = position.coords.altitude;
		$("input#oLagegenauigkeit").val(oLagegenauigkeit);
		x = DdInChX(oLatitudeDecDeg, oLongitudeDecDeg);
		y = DdInChY(oLatitudeDecDeg, oLongitudeDecDeg);
		$("input#oXKoord").val(x);
		$("input#oYKoord").val(y);
		if (Höhe > 0) {
			$("input#oObergrenzeHöhe").val(position.coords.altitude);
		}
		if (oLagegenauigkeit > 30) {
			speichern("Koordinaten gespeichert\nAchtung: nicht sehr genau\nAuf Karte verorten?");
		} else {
			speichern();	
		}

	}
	//Verortung abbrechen, wenn sehr genau
	if (oLagegenauigkeit < 5) {
		stopGeolocation();
		speichern("Koordinaten gespeichert");
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
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        //Mitteilungen löschen
        if ($("input#oXKoord").val() === "Position ermitteln...") {
        	$("input#oXKoord").val("");
			$("input#oYKoord").val("");
        	$("input#oLagegenauigkeit").val("");
        	melde("Keine genaue Position erhalten");
        }
        speichern();
    }
}

function speichereLetzteUrl() {
//empfängt Username
//speichert diese im Userdokument
//damit kann bei erneuter Anmeldung die letzte Ansicht wiederhergestellt werden
//host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
//UserId wird zurück gegeben. Wird meist benutzt, um im Menü meine Einstellungen zu öffnen
	if (typeof sessionStorage.Username === ("undefined" || null)) {
		$.ajax({
		    url: '/_session',
		    dataType: 'json',
		    async: false,
		    success: function (session) {
		    	if (session.userCtx.name !== (undefined || null)) {
		        	Username = session.userCtx.name;
		        	sessionStorage.Username = Username;
		        	speichereLetzteUrl_2();
		        } else {
					window.open("index.html?Status=neu", target = "_self");
				}
		    }
		});
	} else {
		speichereLetzteUrl_2();
	}
}

function speichereLetzteUrl_2() {
	var url, User;
	url = window.location.pathname + window.location.search;
	$db = $.couch.db("evab");
	//nur speichern, wann anders als zuletzt
	if (typeof LetzteUrl === "undefined" || LetzteUrl !== url) {
		//UserId nur abfragen, wenn nicht schon erfolgt
		if (typeof sessionStorage.UserId === "undefined" || !sessionStorage.UserId) {
			$db.view('evab/User?key="' + sessionStorage.Username + '"', {
				success: function (data) {
					User = data.rows[0].value;
					//UserId als globale Variable setzen, damit die Abfrage nicht immer durchgeführt werden muss
					UserId = User._id;
					sessionStorage.UserId = UserId;
					//weitere anderswo benutzte Variabeln verfügbar machen
					sessionStorage.ArtenSprache = User.ArtenSprache;
					sessionStorage.Autor = User.Autor;
					speichereLetzteUrl_3(url);
				}
			});
		} else {
			UserId = sessionStorage.UserId;
			speichereLetzteUrl_3(url, User);
		}
	}
}

function speichereLetzteUrl_3(url, User) {
	$db.openDoc(UserId, {
		success: function (User) {
			User.LetzteUrl = url;
			User.SessionStorageObjekt = sessionStorage;
			$db.saveDoc(User);
			//LetzteUrl als globale Variable speichern, damit das nächste mal ev. die Abfrage gespart werden kann
			LetzteUrl = url;
		}
	});
}

//Wenn Seiten direkt geöffnet werden, muss die sessionStorage wieder hergestellt werden
//Dieser Vorgang ist langsam. Bis er beendet ist, hätte die aufrufende Seite bereits mit dem Initiieren der Felder begonnen
//und dabei wegen mangelndem sesstionStorage Fehler produziert
//daher wird die aufrufende Seite übergeben und nach getaner Arbeit deren Felder initiiert
//Wenn sessionStorage null ist, verzichtet die aufrufende Seite auf das Initiieren
function holeSessionStorageAusDb(AufrufendeSeite) {
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	$db = $.couch.db("evab");
	$db.view('evab/User?key="' + sessionStorage.Username + '"', {
		success: function (data) {
			var SessionStorageObjekt = {};
			User = data.rows[0].value;
			SessionStorageObjekt = User.SessionStorageObjekt;
			for (i in SessionStorageObjekt) {
				sessionStorage[i] = SessionStorageObjekt[i];
			}
			switch(AufrufendeSeite) {
				case "hBeobEdit":
					initiierehBeobEdit(sessionStorage.hBeobId);
				break;
				case "hBeobListe":
					initiierehBeobListe();
				break;
				case "hZeitEdit":
					initiiereZeitEdit(sessionStorage.ZeitId);
				break;
				case "hZeitListe":
					initiiereZeitListe();
				break;
				case "hOrtEdit":
					initiiereOrtEdit(sessionStorage.OrtId);
				break;
				case "hOrtListe":
					initiiereOrtListe();
				break;
				case "hRaumEdit":
					initiiereRaumEdit(sessionStorage.RaumId);
				break;
				case "hRaumListe":
					initiiereRaumListe();
				break;
				case "hProjektEdit":

				break;
				case "hProjektListe":

				break;
				case "BeobEdit":

				break;
				case "BeobListe":

				break;
			}
		}
	});
}


//erstellt die Google-Map Karte für die Orte eines Raums
//wird aufgerufen von RaumEdit.html und OrtListe.html
//erwartet den user und die RaumId
function erstelleKarteFürRaum(RaumId) {
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hRaumOrteFuerKarte?startkey=["' + Username + '", "' + RaumId + '"]&endkey=["' + Username + '", "' + RaumId + '" ,{}]&include_docs=true', {
		success: function (data) {
			var i, anzOrt, Ort;
			anzOrt = 0;
			var infowindow = new google.maps.InfoWindow();
			for (i in data.rows) {
				//Orte zählen
				anzOrt += 1;
			}
			if (anzOrt === 0) {
				//Keine Orte: Hinweis und zurück
				melde("Dieser Raum enthält keine Orte mit Koordinaten");
				history.back();
			} else {
				//Orte vorhanden: Karte aufbauen
				var lat = 47.383333;
				var lng = 8.533333;
				var latlng = new google.maps.LatLng(lat, lng);
				var options = {
				    zoom: 15,
				    center: latlng,
				    streetViewControl: false,
				    mapTypeId: google.maps.MapTypeId.HYBRID
				};
				var map = new google.maps.Map(document.getElementById("map_canvas"),options);
				//google.maps.event.trigger(map,'resize');
				var bounds = new google.maps.LatLngBounds();
				//für alle Orte Marker erstellen
				var markers = [];
				for (i in data.rows) {
					Ort = data.rows[i].doc;
					var hOrtId = Ort._id;
					var hRaumId = Ort.hRaumId;
					var hProjektId = Ort.hProjektId;
					var oName = Ort.oName;
					var oXKoord = Ort.oXKoord;
					var oYKoord = Ort.oYKoord;
					var lat2 = Ort.oLatitudeDecDeg;
					var lng2 = Ort.oLongitudeDecDeg;
					var externalPage = "hOrtEdit.html?id=" + hOrtId;
					var latlng2 = new google.maps.LatLng(lat2, lng2);
					if (anzOrt === 1) {
						//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
						latlng = latlng2;
					} else {
						//Kartenausschnitt um diese Koordinate erweitern
						bounds.extend(latlng2);
					}
					var marker = new MarkerWithLabel({ 
						map: map,
						position: latlng2,  
					    title: oName.toString(),
					    labelContent: oName,
					    labelAnchor: new google.maps.Point(22, 0),
					    labelClass: "MapLabel", // the CSS class for the label
						labelStyle: {opacity: 0.75}
					});
					markers.push(marker);
					var contentString = '<div id="content">'+
					    '<div id="siteNotice">'+
					    '</div>'+
					    '<h4 id="firstHeading" class="GmInfowindow">' + oName + '</h4>'+
					    '<div id="bodyContent" class="GmInfowindow">'+
					    '<p>X-Koordinate: ' + oXKoord + '</p>'+
					    '<p>Y-Koordinate: ' + oYKoord + '</p>'+
					    "<p><a href=\"" + externalPage + "\" rel=\"external\">bearbeiten<\/a></p>"+
					    '</div>'+
					    '</div>';
					makeListener(map, marker, contentString);
				}
				var mcOptions = {maxZoom: 17};
				var markerCluster = new MarkerClusterer(map, markers, mcOptions);
				if (anzOrt === 1) {
					//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
					map.setCenter(latlng);
					map.setZoom(18);
				} else {
					//Karte auf Ausschnitt anpassen
					map.fitBounds(bounds);
				}
			}
			function makeListener(map, marker, contentString) {
				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(contentString);
					infowindow.open(map,marker);
				});
			}
		}
	});
}

//Erstellt die Google-Map Karte für Orte eines Projekts
//wird aufgerufen von ProjektEdit.html und RaumListe.html
//erwartet Username und ProjektId
function erstelleKarteFürProjekt(ProjektId) {
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hProjektOrteFuerKarte?startkey=["' + Username + '", "' + ProjektId + '"]&endkey=["' + Username + '", "' + ProjektId + '" ,{}]&include_docs=true', {
		success: function (data) {
			var i, anzOrt, Ort;
			anzOrt = 0;
			var infowindow = new google.maps.InfoWindow();
			for (i in data.rows) {
				//Orte zählen
				anzOrt += 1;
			}
			if (anzOrt === 0) {
				//Keine Orte: Hinweis und zurück
				melde("Dieses Projekt enthält keine Orte mit Koordinaten");
				history.back();
			} else {
				//Orte vorhanden: Karte aufbauen
				var lat = 47.383333;
				var lng = 8.533333;
				var latlng = new google.maps.LatLng(lat, lng);
				var options = {
				    zoom: 15,
				    center: latlng,
				    streetViewControl: false,
				    mapTypeId: google.maps.MapTypeId.HYBRID
				};
				var map = new google.maps.Map(document.getElementById("map_canvas"),options);
				google.maps.event.trigger(map,'resize');
				var bounds = new google.maps.LatLngBounds();
				//für alle Orte Marker erstellen
				var markers = [];
				for (i in data.rows) {
					Ort = data.rows[i].doc;
					var hOrtId = Ort._id;
					var hRaumId = Ort.hRaumId;
					var hProjektId = Ort.hProjektId;
					var oName = Ort.oName;
					var oXKoord = Ort.oXKoord;
					var oYKoord = Ort.oYKoord;
					var lat2 = Ort.oLatitudeDecDeg;
					var lng2 = Ort.oLongitudeDecDeg;
					var externalPage = "hOrtEdit.html?id=" + hOrtId;
					var latlng2 = new google.maps.LatLng(lat2, lng2);
					if (anzOrt === 1) {
						//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
						latlng = latlng2;
					} else {
						//Kartenausschnitt um diese Koordinate erweitern
						bounds.extend(latlng2);
					}
					var marker = new MarkerWithLabel({ 
						map: map,
						position: latlng2,  
					    title: oName.toString(),
					    labelContent: oName,
					    labelAnchor: new google.maps.Point(22, 0),
					    labelClass: "MapLabel", // the CSS class for the label
						labelStyle: {opacity: 0.75}
					});
					markers.push(marker);
					var contentString = '<div id="content">'+
					    '<div id="siteNotice">'+
					    '</div>'+
					    '<h4 id="firstHeading" class="GmInfowindow">' + oName + '</h4>'+
					    '<div id="bodyContent" class="GmInfowindow">'+
					    '<p>X-Koordinate: ' + oXKoord + '</p>'+
					    '<p>Y-Koordinate: ' + oYKoord + '</p>'+
					    "<p><a href=\"" + externalPage + "\" rel=\"external\">bearbeiten<\/a></p>"+
					    '</div>'+
					    '</div>';
					makeListener(map, marker, contentString);
				}
				var mcOptions = {maxZoom: 17};
				var markerCluster = new MarkerClusterer(map, markers, mcOptions);
				if (anzOrt === 1) {
					//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
					map.setCenter(latlng);
					map.setZoom(18);
				} else {
					//Karte auf Ausschnitt anpassen
					map.fitBounds(bounds);
				}
			}
			function makeListener(map, marker, contentString) {
				google.maps.event.addListener(marker, 'click', function () {
					infowindow.setContent(contentString);
					infowindow.open(map,marker);
				});
			}
		}
	});
}

//speichert Anhänge
//setzt ein passendes Formular mit den feldern _rev und _attachments voraus
//wird benutzt von allen Formularen mit Anhängen
function speichereAnhänge(id) {
	$db = $.couch.db("evab");
	$db.openDoc(id, {
		success: function (data) {
			$("#_rev").val(data._rev);
			$("#FormAnhänge").ajaxSubmit({
			    url: "/evab/" + id,
			    success: function () {
			    	//doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			    	$db.openDoc(id, {
						success: function (data2) {
					    	//show attachments in form
					    	erstelleAttachments(data2);
					    }
					});
			    },
			    error: function () {
			    	//doc nochmals holen, damit der Anhang mit Dateiname dabei ist
			    	$db.openDoc(id, {
						success: function (data3) {
					    	//da form.jquery.js einen Fehler hat, meldet es einen solchen zurück, obwohl der Vorgang funktioniert!
					    	erstelleAttachments(data3);
					    }
					});
			    }
			});
		}
	});
}

//erstellt Anhänge, d.h. schaut nach, ob welche existieren und zeigt sie im Formular an
//setzt ein passendes Formular mit dem Feld_attachments und eine div namens Anhänge voraus
//wird benutzt von allen Beobachtungs-Edit-Formularen
function erstelleAttachments(doc) {
	var attachments, rev, HtmlContainer, url, url_zumLöschen;
	attachments = doc._attachments;
	rev = doc._rev;
	HtmlContainer = "";
	if (attachments) {
		$.each(attachments, function (Dateiname, val) {
			url = "/evab/" + doc.id + "/" + Dateiname;
			url_zumLöschen = url + "?" + rev;    //theoretisch kann diese rev bis zum Löschen veraltet sein, praktisch kaum
			HtmlContainer += "<a href='";
			HtmlContainer += url;
			HtmlContainer += "' data-inline='true' data-role='button' target='_blank'>";
			HtmlContainer += Dateiname;
			HtmlContainer += "</a><button name='LöscheAnhang' id='";
			HtmlContainer += Dateiname;
			HtmlContainer += "' data-icon='delete' data-inline='true' data-iconpos='notext'/><br>";
		});
		$("#_attachments").val("");
	}
	$("#Anhänge").html(HtmlContainer).trigger("create").trigger("refresh");
}

//kreiert ein neues Feld
//erwartet den Teil des Pfads, der links von FeldEdit ist
function neuesFeld(Pfad) {
	var Feld;
	if (typeof Username === "undefined" || !Username) {
		pruefeAnmeldung();
	}
	Feld = {};
	Feld.Typ = "Feld";
	Feld.User = Username;
	Feld.SichtbarImModusEinfach = [];
	Feld.SichtbarImModusHierarchisch = [];
	//gleich sichtbar stellen
	Feld.SichtbarImModusEinfach.push(Username);
	Feld.SichtbarImModusHierarchisch.push(Username);
	$db = $.couch.db("evab");
	$db.saveDoc(Feld, {
		success: function (data) {
			window.open(Pfad + "FeldEdit/" + data.id + "?Status=neu?zurueck=" + get_url_param("zurueck"), target = "_self");
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
	if (typeof sessionStorage.Username === "undefined" || !sessionStorage.Username) {
		$.ajax({
		    url: '/_session',
		    dataType: 'json',
		    async: false,
		    success: function (session) {
		    	if (session.userCtx.name !== (undefined || null)) {
		        	Username = session.userCtx.name;
		        	sessionStorage.Username = Username;
		        } else {
					window.open("index.html?Status=neu", target = "_self");
				}
		    }
		});
	} else {
		Username = sessionStorage.Username;
	}
}

//aktualisiert OrtId-abhängige Links
//ist eigene Funktion, weil auch ohne pageshow nötig (beim Datensatzwechsel)
//wird aufgerufen von: hOrtEdit.html, evab.js
function aktualisiereLinksMitOrtId_hoe() {
	//Link zur Zeit in Navbar setzen
	$("#hoe_hZeitListeLink").attr("href", "hZeitListe.html?OrtId=" + sessionStorage.OrtId);
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
					})
			});
		}		
	});
	
}( jQuery ));
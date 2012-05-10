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

function speichereNeueBeob(aArtBezeichnung, ArtId) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//aufgerufen bloss von Artenliste.html
//hArtListe und hArtEdit geben hProjektId, hRaumId, hOrtId und hZeitId mit
	var doc;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.User = localStorage.Username;
	doc.aArtGruppe = sessionStorage.aArtGruppe;
	delete sessionStorage.aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = ArtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	if (sessionStorage.Von === "hArtListe" || sessionStorage.Von === "hArtEdit") {
		doc.Typ = "hArt";
		doc.hProjektId = sessionStorage.ProjektId;
		doc.hRaumId = sessionStorage.RaumId;
		doc.hOrtId = sessionStorage.OrtId;
		doc.hZeitId = sessionStorage.ZeitId;
		//Bei hierarchischen Beobachtungen wollen wir jetzt die Felder der höheren hierarchischen Ebenen anfügen
		speichereNeueBeob_02(doc);
	} else {
		//sessionStorage.Von == "BeobListe" || sessionStorage.Von == "BeobEdit"
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
				if (typeof i !== "function") {
					//FeldName = i, Feldwert = Zeit[i]
					//ein paar Felder wollen wir nicht
					if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hOrtId', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) === -1) {
						doc[i] = Zeit[i];
					}
				}
			}
			$db.openDoc(doc.hOrtId, {
				success: function (Ort) {
					for (i in Ort) {
						if (typeof i !== "function") {
							//ein paar Felder wollen wir nicht
							if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) === -1) {
								doc[i] = Ort[i];
							}
						}
					}
					$db.openDoc(doc.hRaumId, {
						success: function (Raum) {
							for (i in Raum) {
								if (typeof i !== "function") {
									//ein paar Felder wollen wir nicht
									if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) === -1) {
										doc[i] = Raum[i];
									}
								}
							}
							$db.openDoc(doc.hProjektId, {
								success: function (Projekt) {
									for (i in Projekt) {
										if (typeof i !== "function") {
											//ein paar Felder wollen wir nicht
											if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
												doc[i] = Projekt[i];
											}
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
						delete window.hBeobListe;
						delete sessionStorage.hBeobListe;
						//Wenn hArtEditPage schon im Dom ist, mit changePage zur id wechseln, sonst zur Url
						if ($("#hArtEditPage").length > 0) {
							$.mobile.changePage($("#hArtEditPage"));
							
							//$("#al_Page").removeClass('ui-page-active');
							//$("#hArtEditPage").addClass('ui-page-active');
						} else {
							sessionStorage.hBeobId = data.id;
							window.open("hArtEdit.html", target = "_self");
							//$.mobile.changePage("hArtEdit.html");
						}
					} else {
						//Variabeln verfügbar machen
						BeobId = data.id;
						sessionStorage.BeobId = BeobId;
						//Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						delete window.BeobListe;
						delete sessionStorage.BeobListe;
						//Wenn BeobEditPage schon im Dom ist, mit changePage zur id wechseln, sonst zur Url
						if ($("#BeobEditPage").length > 0) {
							$.mobile.changePage($("#BeobEditPage"));
							
							//$("#al_Page").removeClass('ui-page-active');
							//$("#BeobEditPage").addClass('ui-page-active');
						} else {
							window.open("BeobEdit.html", target = "_self");
							//$.mobile.changePage("BeobEdit.html?id=" + data.id);
						}
						//window.open("BeobEdit.html?id=" + data.id + "&Status=neu", target = "_self");
						//$.mobile.changePage("BeobEdit.html?id=" + data.id, {reloadPage:"true", allowSamePageTransition:"true"});
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
//erwartet sessionStorage.Von = von welchem Formular aufgerufen wurde
function speichereBeobNeueArtgruppeArt(aArtName, ArtId) {
	var docId;
	if (sessionStorage.Von === "BeobListe" || sessionStorage.Von === "BeobEdit") {
		docId = sessionStorage.BeobId;
	} else {
		docId = sessionStorage.hBeobId;
	}
	$db = $.couch.db("evab");
	$db.openDoc(docId, {
		success: function (doc) {
			if (typeof sessionStorage.aArtGruppe !== "undefined" && sessionStorage.aArtGruppe) {
				doc.aArtGruppe = sessionStorage.aArtGruppe;
				delete sessionStorage.aArtGruppe;
			}
			doc.aArtName = aArtName;
			doc.aArtId = ArtId;
			$db.saveDoc(doc, {
				success: function (data) {
					if (sessionStorage.Von === "BeobListe" || sessionStorage.Von === "BeobEdit") {
						//Variabeln verfügbar machen
						BeobId = data.id;
						sessionStorage.BeobId = BeobId;
						//Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						delete window.BeobListe;
						delete sessionStorage.BeobListe;
						if ($('#BeobEditPage').length > 0) {
							$.mobile.changePage($('#BeobEditPage'));
						} else {
							window.open("BeobEdit.html", target = "_self");
						}
					} else {
						//Variabeln verfügbar machen
						hBeobId = data.id;
						sessionStorage.hBeobId = hBeobId;
						//Globale Variablen für hBeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
						delete window.hBeobListe;
						delete sessionStorage.hBeobListe;
						if ($('#hArtEditPage').length > 0) {
							$.mobile.changePage($('#hArtEditPage'));
						} else {
							window.open("hArtEdit.html", target = "_self");
						}
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
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
		'fullHTML': 'true',
		'buttons' : {
			'Datenfelder<br>exportieren': {
				click: function () {
					window.open("_list/FeldExport/FeldListe");
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

function erstelleNeueZeit() {
//Neue Zeiten werden erstellt
//ausgelöst durch hZeitListe.html oder hZeitEdit.html
//dies ist der erste Schritt: doc bilden
	var doc;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.Typ = "hZeit";
	doc.User = localStorage.Username;
	doc.hProjektId = sessionStorage.ProjektId;
	doc.hRaumId = sessionStorage.RaumId;
	doc.hOrtId = sessionStorage.OrtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hOrtId, {
		success: function (Ort) {
			for (i in Ort) {
				if (typeof i !== "function") {
					//ein paar Felder wollen wir nicht
					if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) === -1) {
						doc[i] = Ort[i];
					}
				}
			}
			$db.openDoc(doc.hRaumId, {
				success: function (Raum) {
					for (i in Raum) {
						if (typeof i !== "function") {
							//ein paar Felder wollen wir nicht
							if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) === -1) {
								doc[i] = Raum[i];
							}
						}
					}
					$db.openDoc(doc.hProjektId, {
						success: function (Projekt) {
							for (i in Projekt) {
								if (typeof i !== "function") {
									//ein paar Felder wollen wir nicht
									if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
										doc[i] = Projekt[i];
									}
								}
							}
							//speichern
							$db.saveDoc(doc, {
								success: function (Zeit) {
									//Variabeln verfügbar machen
									//ZeitId = Zeit.id;
									sessionStorage.ZeitId = Zeit.id;
									sessionStorage.Status = "neu";
									//Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
									delete window.ZeitListe;
									delete sessionStorage.ZeitListe;
									window.open("hZeitEdit.html", target = "_self");
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
function erstelleNeuenOrt() {
	var doc;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.Typ = "hOrt";
	doc.User = localStorage.Username;
	doc.hProjektId = sessionStorage.ProjektId;
	doc.hRaumId = sessionStorage.RaumId;
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hRaumId, {
		success: function (Raum) {
			for (i in Raum) {
				if (typeof i !== "function") {
					//ein paar Felder wollen wir nicht
					if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) === -1) {
						doc[i] = Raum[i];
					}
				}
			}
			$db.openDoc(doc.hProjektId, {
				success: function (Projekt) {
					for (i in Projekt) {
						if (typeof i !== "function") {
							//ein paar Felder wollen wir nicht
							if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
								doc[i] = Projekt[i];
							}
						}
					}
					//speichern
					$db.saveDoc(doc, {
						success: function (data) {
							//Variabeln verfügbar machen
							OrtId = data.id;
							sessionStorage.OrtId = OrtId;
							//Globale Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
							delete window.OrtListe;
							delete sessionStorage.OrtListe;
							sessionStorage.Status = "neu";	//das löst bei pageshow die Verortung aus
							window.open("hOrtEdit.html", target = "_self");
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

function erstelleNeuenRaum() {
	var doc;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	doc = {};
	doc.Typ = "hRaum";
	doc.User = localStorage.Username;
	doc.hProjektId = sessionStorage.ProjektId;
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(sessionStorage.ProjektId, {
		success: function (Projekt) {
			for (i in Projekt) {
				if (typeof i !== "function") {
					//ein paar Felder wollen wir nicht
					if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) === -1) {
						doc[i] = Projekt[i];
					}
				}
			}
			//speichern
			$db.saveDoc(doc, {
				success: function (data) {
					//Variabeln verfügbar machen
					RaumId = data.id;
					sessionStorage.RaumId = RaumId;
					sessionStorage.Status = "neu";
					//Globale Variablen für RaumListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
					delete window.RaumListe;
					delete sessionStorage.RaumListe;
					window.open("hRaumEdit.html", target = "_self");
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
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	hProjekt.Typ = "hProjekt";
	hProjekt.User = localStorage.Username;
	$db = $.couch.db("evab");
	$db.saveDoc(hProjekt, {
		success: function (data) {
			//Variabeln verfügbar machen
			ProjektId = data.id;
			sessionStorage.ProjektId = ProjektId;
			sessionStorage.Status = "neu";
			//Globale Variablen für ProjektListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
			delete window.Projektliste;
			delete sessionStorage.Projektliste;
			window.open("hProjektEdit.html", target = "_self");
		},
		error: function () {
			melde("Fehler: neues Projekt nicht erstellt");
		}
	});
}

function öffneMeineEinstellungen() {
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	if (typeof sessionStorage.UserId === "undefined" || !sessionStorage.UserId) {
		$db = $.couch.db("evab");
		$db.view('evab/User?key="' + localStorage.Username + '"', {
			success: function (data) {
				var User;
				User = data.rows[0].value;
				//UserId = data.rows[0].value._id;
				sessionStorage.UserId = UserId;
				sessionStorage.Autor = User.Autor;
				window.open("UserEdit.html", target = "_self");
			}
		});
	} else {
		window.open("UserEdit.html", target = "_self");
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
			sessionStorage.aArtGruppe = Art.ArtGruppe;
			//fixe Felder aktualisieren
			$("#ArtEdit_ArtGruppe").selectmenu();
			$("#ArtEdit_ArtGruppe").val(sessionStorage.aArtGruppe);
			$("#ArtEdit_ArtGruppe").html("<option value='" + sessionStorage.aArtGruppe + "'>" + sessionStorage.aArtGruppe + "</option>");
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
			window.history.pushState("", "", "ArtEdit.html"); //funktioniert in IE erst ab 10!
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
		if (typeof i !== "function") { 
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
						if (typeof y !== "function") {
							if (y !== "Datensammlung") {
								Feldname = y;
								Feldwert = Art[i][y];
								HtmlContainer += generiereHtmlFuerReadOnlyListZeile(Feldname, Feldwert);
							}
						}
					}
					//Liste und collapsible beenden
					HtmlContainer += '</ul></div>';
				}
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
	} else if (typeof sessionStorage.FeldlisteBeobEdit !== "undefined" && sessionStorage.FeldlisteBeobEdit) {
		FeldlisteBeobEdit = JSON.parse(sessionStorage.FeldlisteBeobEdit);
		initiiereBeobEdit_2(id, FeldlisteBeobEdit);
	} else {
		//holt die Feldliste aus der DB
		$db = $.couch.db("evab");
		$db.view('evab/FeldListeBeob', {
			success: function (Feldliste) {
				//Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
				FeldlisteBeobEdit = Feldliste;
				sessionStorage.FeldlisteBeobEdit = JSON.stringify(FeldlisteBeobEdit);
				initiiereBeobEdit_2(id, FeldlisteBeobEdit);
			}
		});
	}
}

function initiiereBeobEdit_2(id, Feldliste) {
	$db = $.couch.db("evab");
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
			erstelleDynamischeFelderBeobEdit(Feldliste, Beob);
			//url muss gepuscht werden, wenn mit changePage zwischen mehreren Formularen gewechselt wurde
			window.history.pushState("", "", "BeobEdit.html"); //funktioniert in IE erst ab 10!
			//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
			speichereLetzteUrl();
		}
	});
}

//generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//und aktualisiert die Links für pagination
//Mitgeben: id der Beobachtung, Username
function erstelleDynamischeFelderBeobEdit(Feldliste, Beob) {
	var HtmlContainer, Formularwerte;
	//Anhänge ausblenden, weil sie sonst beim Wechsel stören
	$('#FormAnhänge').hide();
	//Anhänge entfernen, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
	$('#Anhänge').empty();
	$("#BeobEditFormHtml").html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>');
	HtmlContainer = generiereHtmlFuerBeobEditForm (Feldliste, Beob);
	//Linie nur anfügen, wenn Felder erstellt wurden
	if (HtmlContainer) {
		HtmlContainer = "<hr />" + HtmlContainer;
	} else {
		HtmlContainer = "";
	}
	//nötig, weil sonst die dynamisch eingefügten Elemente nicht erscheinen (Felder) bzw. nicht funktionieren (links)
	$("#BeobEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
	$("#BeobEditPage").trigger("create").trigger("refresh");
	if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#BeobEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (typeof i !== "function") {
				if (Formularwerte[i] && Formularwerte[i] !== "Position ermitteln...") {
					Beob[i] = Formularwerte[i];
				} else if (Beob[i]) {
					delete Beob[i]
				}
			}
		}
		$db.saveDoc(Beob);
		//verorten
		GetGeolocation(Beob._id, "BeobEditForm");
		setTimeout("delete sessionStorage.Status", 500);	//jetzt ist der Datensatz nicht mehr neu
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
function generiereHtmlFuerBeobEditForm (Feldliste, Beob) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMaximum, SliderMinimum, ListItem, HtmlContainer, Status, ArtGruppe, Status;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	Status = sessionStorage.Status;
	ArtGruppe = Beob.aArtGruppe;
	for (i in Feldliste.rows) {
		//vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
		if (typeof i !== "function" && typeof Feld.ArtGruppe !== "undefined") {
			Feld = Feldliste.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusEinfach.indexOf(localStorage.Username) !== -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1) {
				//In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
				if (Feld.Hierarchiestufe !== "Art" || Feld.ArtGruppe.indexOf(ArtGruppe) >= 0) {
					if (Status === "neu" && Feld.Standardwert) {
						FeldWert = Feld.Standardwert[localStorage.Username] || "";
					} else {
						FeldWert = Beob[FeldName] || "";
					}
					FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
					Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
					HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
				}
			}}
	}
	return HtmlContainer;
}

//BeobListe in BeobList.html vollständig neu aufbauen
function initiiereBeobliste() {
	//hat BeobEdit.html eine BeobListe übergeben?
	if (window.BeobListe) {
		//Beobliste aus globaler Variable holen - muss nicht geparst werden
		initiiereBeobliste_2()
	} else if (sessionStorage.BeobListe) {
		//Beobliste aus sessionStorage holen
		BeobListe = JSON.parse(sessionStorage.BeobListe);
		initiiereBeobliste_2()
	} else {
		//Beobliste aus DB holen
		if (!localStorage.Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/BeobListe?startkey=["' + localStorage.Username + '",{}]&endkey=["' + localStorage.Username + '"]&descending=true', {
			success: function (data) {
				//BeobListe für BeobEdit bereitstellen
				BeobListe = data;
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.BeobListe = JSON.stringify(BeobListe);
				initiiereBeobliste_2()
			}
		});
	}
}

function initiiereBeobliste_2() {
	var i, anzBeob, beob, ListItemContainer, Titel2, Datum, Zeit, ArtGruppe, ImageLink, ArtName, externalPage;
	anzBeob = 0;
	ListItemContainer = "";
	
	for (i in BeobListe.rows) {   //Beobachtungen zählen
		if (typeof i !== "function") {
			anzBeob += 1;
		}
	}

	Titel2 = " Beobachtungen";   //Im Titel der Seite die Anzahl Beobachtungen anzeigen
	if (anzBeob === 1) {
		Titel2 = " Beobachtung";
	}
	$("#BeobListePageHeader .BeobListePageTitel").text(anzBeob + Titel2);

	if (anzBeob === 0) {
		ListItemContainer = '<li><a href="#" class="bl_NeuLink">Erste Beobachtung erfassen</a></li>';
	} else {
		for (i in BeobListe.rows) {	//Liste aufbauen
			if (typeof i !== "function") {
				beob = BeobListe.rows[i].value;
				key = BeobListe.rows[i].key;
				Datum = beob.zDatum;
				Zeit = beob.zUhrzeit;
				ArtGruppe = beob.aArtGruppe;
				ImageLink = "Artgruppenbilder/" + ArtGruppe + ".png";
				ArtName = beob.aArtName;
				ListItemContainer += "<li class=\"beob ui-li-has-thumb\" id=\"";
				ListItemContainer += beob._id;
				ListItemContainer += "\"><a href=\"BeobEdit.html\" rel=\"external\"><img class=\"ui-li-thumb\" src=\"";
				ListItemContainer += ImageLink;
				ListItemContainer += "\" /><h3 class=\"aArtName\">";
				ListItemContainer += ArtName;
				ListItemContainer += "<\/h3><p class=\"zUhrzeit\">";
				ListItemContainer += Datum;
				ListItemContainer += "&nbsp; &nbsp;";
				ListItemContainer += Zeit;
				ListItemContainer += "<\/p><\/a> <\/li>";
			}
		}
	}
	$("#beobachtungen").html(ListItemContainer);
	$("#beobachtungen").listview("refresh");
	speichereLetzteUrl();
}

//initiiert UserEdit.html
//Mitgeben: sessionStorage.UserId
function initiiereUserEdit() {
	$db = $.couch.db("evab");
	$db.openDoc(sessionStorage.UserId, {
		success: function (User) {
			//fixe Felder aktualisieren
			$("#UserName").val(User.UserName);
			$("#Autor").val(User.Autor);
			$("#Email").val(User.Email);
			$("input[name='ArtenSprache']").checkboxradio();
			$("#" + User.ArtenSprache).prop("checked",true).checkboxradio("refresh");
			$("input[name='Datenverwendung']").checkboxradio();
			$("#" + User.Datenverwendung).prop("checked",true).checkboxradio("refresh");
			speichereLetzteUrl();
		}
	});
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
			if (typeof FeldlisteProjekt !== "undefined") {
				initiiereProjektEdit_2(Projekt);
			} else if (typeof sessionStorage.FeldlisteProjekt !== "undefined" && sessionStorage.FeldlisteProjekt) {
				FeldlisteProjekt = JSON.parse(sessionStorage.FeldlisteProjekt);
				initiiereProjektEdit_2(Projekt);
			} else {
				$db = $.couch.db("evab");
				//holt die Feldliste aus der DB
				$db.view('evab/FeldListeProjekt', {
					success: function (Feldliste) {
						FeldlisteProjekt = Feldliste;
						sessionStorage.FeldlisteProjekt = JSON.stringify(FeldlisteProjekt);
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
	if (sessionStorage.Status === "neu") {
		$("#pName").focus();
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hProjektEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (typeof i !== "function") {
				if (Formularwerte[i]) {
					Projekt[i] = Formularwerte[i];
				} else if (Projekt[i]) {
					delete Projekt[i]
				}
			}
		}
		$db.saveDoc(Projekt);
		setTimeout("delete sessionStorage.Status", 500);
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
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteProjekt.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteProjekt.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1 && FeldName !== "pName") {
				if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu" && Feld.Standardwert) {
					FeldWert = Feld.Standardwert[localStorage.Username] || "";
				} else {
					FeldWert = Projekt[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	return HtmlContainer;
}

//initiiert FeldEdit.html
function initiiereFeldEdit() {
	$db = $.couch.db("evab");
	$db.openDoc(sessionStorage.FeldId, {
		success: function (doc) {
			var SichtbarImModusHierarchisch, SichtbarImModusEinfach, Standardwert;
			//Feld bereitstellen
			Feld = doc;
			sessionStorage.Feld = JSON.stringify(doc);
			sessionStorage.FeldId = Feld._id;

			if (!localStorage.Username) {
				pruefeAnmeldung();
			}
			//korrekte Werte in Felder SichtbarImModusEinfach und -Hierarchisch setzen
			SichtbarImModusHierarchisch = doc.SichtbarImModusHierarchisch;
			SichtbarImModusEinfach = doc.SichtbarImModusEinfach;
			//Vorsicht: Bei neuen Feldern gibt es doc.SichtbarImModusHierarchisch noch nicht
			if (SichtbarImModusHierarchisch && SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1) {
				$("#SichtbarImModusHierarchisch").val("ja");
			} else {
				$("#SichtbarImModusHierarchisch").val("nein");
			}
			$("select#SichtbarImModusHierarchisch").slider();
			$("select#SichtbarImModusHierarchisch").slider("refresh");
			//Vorsicht: Bei neuen Feldern gibt es doc.SichtbarImModusEinfach noch nicht
			if (SichtbarImModusEinfach && SichtbarImModusEinfach.indexOf(localStorage.Username) !== -1) {
				$("select#SichtbarImModusEinfach").val("ja");
			} else {
				$("select#SichtbarImModusEinfach").val("nein");
			}
			$("select#SichtbarImModusEinfach").slider();
			$("select#SichtbarImModusEinfach").slider("refresh");
			//Artgruppe Aufbauen, wenn Hierarchiestufe == Art
			if (Feld.Hierarchiestufe === "Art") {
				ArtGruppeAufbauenFeldEdit(doc.ArtGruppe);
			}

			//allfälligen Standardwert anzeigen
			//Standardwert ist Objekt, darin werden die Standardwerte aller Benutzer gespeichert
			//darum hier auslesen und setzen
			if (doc.Standardwert) {
				Standardwert = doc.Standardwert[localStorage.Username];
				if (Standardwert) {
					$("#Standardwert").val(Standardwert);
				}
			}

			if (doc.FeldName) {
				//fix in Formulare eingebaute Felder: Standardwerte ausblenden und erklären
				if (["aArtGruppe", "aArtName"].indexOf(doc.FeldName) > -1) {
					$("#Standardwert").attr("placeholder", "Keine Voreinstellung möglich");
					$("#Standardwert").attr("disabled", true);
				} else if (doc.FeldName === "aAutor") {
					$("#Standardwert").attr("placeholder", 'Bitte im Menü "meine Einstellungen" voreinstellen');
					$("#Standardwert").attr("disabled", true);
				} else if (["oXKoord", "oYKoord", "oLatitudeDecDeg", "oLongitudeDecDeg", "oLagegenauigkeit"].indexOf(doc.FeldName) > -1) {
					$("#Standardwert").attr("placeholder", 'Lokalisierung erfolgt automatisch, keine Voreinstellung möglich');
					$("#Standardwert").attr("disabled", true);
				} else if (["zDatum", "zUhrzeit"].indexOf(doc.FeldName) > -1) {
					$("#Standardwert").attr("placeholder", 'Standardwert ist "jetzt", keine Voreinstellung möglich');
					$("#Standardwert").attr("disabled", true);
				}
			}
			$(".FeldEditHeaderTitel").text(doc.Hierarchiestufe + ": " + doc.FeldBeschriftung);
			
			//Radio Felder initiieren (ausser ArtGruppe, das wird dynamisch erzeugt)
			$("input[name='Hierarchiestufe']").checkboxradio();
			$("#" + doc.Hierarchiestufe).prop("checked",true).checkboxradio("refresh");
			$("input[name='Formularelement']").checkboxradio();
			$("#" + doc.Formularelement).prop("checked",true).checkboxradio("refresh");
			$("input[name='InputTyp']").checkboxradio();
			$("#" + doc.InputTyp).prop("checked",true).checkboxradio("refresh");

			//Werte in übrige Felder einfügen
			$("#FeldName").val(doc.FeldName);
			$("#FeldBeschriftung").val(doc.FeldBeschriftung);
			$("#FeldBeschreibung").val(doc.FeldBeschreibung);	//Textarea - anders refreshen?
			$("#Reihenfolge").val(doc.Reihenfolge);
			$("#FeldNameEvab").val(doc.FeldNameEvab);
			$("#FeldNameZdsf").val(doc.FeldNameZdsf);
			$("#FeldNameCscf").val(doc.FeldNameCscf);
			$("#FeldNameNism").val(doc.FeldNameNism);
			$("#FeldNameWslFlechten").val(doc.FeldNameWslFlechten);
			$("#FeldNameWslPilze").val(doc.FeldNameWslPilze);
			$("#Optionen").val(doc.Optionen);	//Textarea - anders refreshen?
			$("#SliderMinimum").val(doc.SliderMinimum);
			$("#SliderMaximum").val(doc.SliderMaximum);

			erstelleSelectFeldFolgtNach();	//BESSER: Nur aufrufen, wenn erstaufbau oder auch Feldliste zurückgesetzt wurde
			speichereLetzteUrl();
		}
	});
}

//wird von FeldEdit.html aufgerufen
//erstellt das Selectmenu, um die Reihenfolge-Position des Felds zu bestimmen
function erstelleSelectFeldFolgtNach() {
	//Nur bei eigenen Feldern anzeigen
	if (Feld.User !== "ZentrenBdKt") {
		if (window.Feldliste) {
			//Feldliste aus globaler Variable verwenden - muss nicht geparst werden
			erstelleSelectFeldFolgtNach_2();
		} else if (sessionStorage.Feldliste) {
			//sessionStorage verwenden
			Feldliste = JSON.parse(sessionStorage.Feldliste);
			erstelleSelectFeldFolgtNach_2();
		} else {
			$db = $.couch.db("evab");
			$db.view("evab/FeldListe", {
				success: function (data) {
					Feldliste = data;
					sessionStorage.Feldliste = JSON.stringify(data);
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
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
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
	var viewname;
	if (window.Artgruppen) {
		//Artgruppen von globaler Variable holen
		ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else if (sessionStorage.Artgruppen) {
		//Artgruppen aus sessionStorage holen und parsen
		window.Artgruppen = JSON.parse(sessionStorage.Artgruppen);
		ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn);
	} else {
		//Artgruppen aus DB holen
		$db = $.couch.db("evab");
		$("select#ArtGruppe").empty();
		viewname = "evab/Artgruppen";
		$db.view(viewname, {
			success: function (data) {
				window.Artgruppen = data;
				sessionStorage.Artgruppen = JSON.stringify(data);
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
	ListItemContainer += "\n</fieldset>"
	$("#Artgruppenliste").html(ListItemContainer).trigger("create").trigger("refresh");
}

//initiiert FeldListe.html
function initiiereFeldliste() {
	//hat FeldEdit.html eine Feldliste übergeben?
	if (window.Feldliste) {
		//Feldliste aus globaler Variable holen - muss nicht geparst werden
		initiiereFeldliste_2();
	} else if (sessionStorage.Feldliste) {
		//Feldliste aus sessionStorage holen
		Feldliste = JSON.parse(sessionStorage.Feldliste);
		initiiereFeldliste_2();
	} else {
		//FeldListe aus DB holen
		$db = $.couch.db("evab");
		$db.view("evab/FeldListe", {
			success: function (data) {
				Feldliste = data;
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.Feldliste = JSON.stringify(Feldliste);
				initiiereFeldliste_2();
			}
		});
	}
}

function initiiereFeldliste_2() {
	var i, Feld, anzFelder, ImageLink, externalPage, ListItemContainer, Hierarchiestufe, FeldBeschriftung, FeldBeschreibung;
	ListItemContainer = "";
	anzFelder = 0;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}  
	for (i in Feldliste.rows) {
		if (typeof i !== "function") {
			Feld = Feldliste.rows[i].value;
			//Liste aufbauen
			//Nur eigene Felder und offizielle
			if (Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") {
				Hierarchiestufe = Feld.Hierarchiestufe;
				FeldBeschriftung = Feld.FeldBeschriftung;
				FeldBeschreibung = "";
				if (Feld.FeldBeschreibung) {
					FeldBeschreibung = Feld.FeldBeschreibung;
				}
				ImageLink = "Hierarchiebilder/" + Hierarchiestufe + ".png";
				ListItemContainer += "<li class=\"Feld ui-li-has-thumb\" FeldId=\"";
				ListItemContainer += Feld._id;
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
	$("#FeldListe").html(ListItemContainer);
	$("#FeldListe").listview("refresh");
	speichereLetzteUrl();
}

function initiiereProjektliste() {
	//hat ProjektEdit.html eine Projektliste übergeben?
	if (window.Projektliste) {
		initiiereProjektliste_2();
	} else if (sessionStorage.Projektliste) {
		//Daten für die Projektliste aus sessionStorage holen
		Projektliste = JSON.parse(sessionStorage.Projektliste);
		initiiereProjektliste_2();
	} else {
		if (!localStorage.Username) {
			pruefeAnmeldung();
		}
		//Daten für die Projektliste aus DB holen
		$db = $.couch.db("evab");
		$db.view('evab/hProjListe?startkey=["' + localStorage.Username + '"]&endkey=["' + localStorage.Username + '",{}]', {
			success: function (data) {
				//Projektliste für ProjektEdit bereitstellen
				Projektliste = data;
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.Projektliste = JSON.stringify(Projektliste);
				initiiereProjektliste_2();
			}
		});
	}
}

function initiiereProjektliste_2() {
	var i, anzProj, Proj, externalPage, listItem, ListItemContainer, Titel2;
	anzProj = 0;
	ListItemContainer = "";
	for (i in Projektliste.rows) {			//Beobachtungen zählen. Wenn noch keine: darauf hinweisen
		if (typeof i !== "function") {
			anzProj += 1;
		}
	}

	Titel2 = " Projekte";				//Im Titel der Seite die Anzahl Projekte anzeigen
	if (anzProj === 1) {
		Titel2 = " Projekt";
	}
	$("#hProjektListePageHeader .hProjektListePageTitel").text(anzProj + Titel2);

	if (anzProj === 0) {
		ListItemContainer = "<li><a href='#' class='erste hpl_NeuLink'>Erstes Projekt erfassen</a></li>";
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
	$("#Projekte").html(ListItemContainer);
	$("#Projekte").listview("refresh");
	speichereLetzteUrl();
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
			} else if (typeof sessionStorage.FeldlisteRaumEdit !== "undefined" && sessionStorage.FeldlisteRaumEdit) {
				FeldlisteRaumEdit = JSON.parse(sessionStorage.FeldlisteRaumEdit);
				initiiereRaumEdit_2(Raum);
			} else {
				//holt die Feldliste aus der DB
				$db = $.couch.db("evab");
				$db.view('evab/FeldListeRaum', {
					success: function (Feldliste) {
						FeldlisteRaumEdit = Feldliste;
						sessionStorage.FeldlisteRaumEdit = JSON.stringify(FeldlisteRaumEdit);
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
	if (sessionStorage.Status === "neu") {
		$("#rName").focus();
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hRaumEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (typeof i !== "function") {
				if (Formularwerte[i]) {
					Raum[i] = Formularwerte[i];
				} else if (Raum[i]) {
					delete Raum[i]
				}
			}
		}
		$db.saveDoc(Raum);
		setTimeout("delete sessionStorage.Status", 500);
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
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in Feldliste.rows) {
		if (typeof i !== "function") {
			Feld = Feldliste.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === localStorage.Username || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(localStorage.Username) !== -1 && FeldName !== "rName") {
				if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu" && Feld.Standardwert) {
					FeldWert = Feld.Standardwert[localStorage.Username] || "";
				} else {
					FeldWert = Raum[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	return HtmlContainer;
}

function initiiereRaumListe() {
	//hat hRaumEdit.html eine RaumListe übergeben?
	if (window.RaumListe) {
		//Raumliste aus globaler Variable holen - muss nicht geparst werden
		initiiereRaumListe_2();
	} else	if (typeof sessionStorage.RaumListe !== "undefined" && sessionStorage.RaumListe) {
		//Raumliste aus sessionStorage holen
		RaumListe = JSON.parse(sessionStorage.RaumListe);
		initiiereRaumListe_2();
	} else {
		//Raumliste aud DB holen
		if (!localStorage.Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hRaumListe?startkey=["' + localStorage.Username + '", "' + sessionStorage.ProjektId + '"]&endkey=["' + localStorage.Username + '", "' + sessionStorage.ProjektId + '" ,{}]', {
			success: function (data) {
				RaumListe = data;
				//RaumListe für haumEdit bereitstellen
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.RaumListe = JSON.stringify(RaumListe);
				initiiereRaumListe_2();
			}
		});
	}
}

function initiiereRaumListe_2() {
	var i, anzRaum, Raum, externalPage, listItem, ListItemContainer, Titel2;
	anzRaum = 0;
	ListItemContainer = "";
	for (i in RaumListe.rows) {	//Räume zählen
		if (typeof i !== "function") {
			anzRaum += 1;
		}
	}
	Titel2 = " Räume";   //Im Titel der Seite die Anzahl Räume anzeigen
	if (anzRaum === 1) {
		Titel2 = " Raum";
	}
	$("#hRaumListePageHeader .hRaumListePageTitel").text(anzRaum + Titel2);
	if (anzRaum === 0) {
		ListItemContainer = '<li><a href="#" data-transition="slideup" rel="external" name="hRaumNeuLink" class="erste">Ersten Raum erfassen</a></li>';
	} else {
		for (i in RaumListe.rows) {	//Liste aufbauen
			if (typeof i !== "function") {
				Raum = RaumListe.rows[i].value;
				key = RaumListe.rows[i].key;
				rName = Raum.rName;
				//externalPage = "hRaumEdit.html?id=" + Raum._id + "&ProjektId=" + ProjektId;
				//listItem = "<li RaumId=\"" + Raum._id + "\" class=\"Raum\"><a href=\"" + externalPage + "\" rel=\"external\"><h3>" + rName + "<\/h3><\/a> <\/li>";
				listItem = "<li RaumId=\"" + Raum._id + "\" class=\"Raum\"><a href=\"#\"><h3>" + rName + "<\/h3><\/a> <\/li>";
				ListItemContainer += listItem;
			}
		}
	}
	$("#Räume").html(ListItemContainer);
	$("#Räume").listview("refresh");
	speichereLetzteUrl();
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
			} else if (typeof sessionStorage.FeldlisteOrtEdit !== "undefined" && sessionStorage.FeldlisteOrtEdit) {
				FeldlisteOrtEdit = JSON.parse(sessionStorage.FeldlisteOrtEdit);
				initiiereOrtEdit_2(Ort);
			} else {
				//holt die Feldliste aus der DB
				$db = $.couch.db("evab");
				$db.view('evab/FeldListeOrt', {
					success: function (Feldliste) {
						//Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
						FeldlisteOrtEdit = Feldliste;
						sessionStorage.FeldlisteOrtEdit = JSON.stringify(FeldlisteOrtEdit);
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
	//in neuen Datensätzen dynamisch erstellte Standardwerte speichern und verorten
	if (sessionStorage.Status === "neu") {
		$("#oName").focus();
		Formularwerte = {};
		Formularwerte = $("#hOrtEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (typeof i !== "function") {
				if (Formularwerte[i]) {
					Ort[i] = Formularwerte[i];
				} else if (Ort[i]) {
					delete Ort[i]
				}
			}
		}
		$db.saveDoc(Ort);
		//verorten
		GetGeolocation(Ort._id, "hOrtEditForm");
		//Status zurücksetzen - es soll nur ein mal verortet werden
		//Spät löschen, weil auch generiereHtmlFuerOrtEditForm damit arbeitet
		setTimeout("delete sessionStorage.Status", 1000);
	}
	erstelleAttachments(Ort);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//url muss gepuscht werden, wenn mit changePage zwischen mehreren Formularen gewechselt wurde
	window.history.pushState("", "", "hOrtEdit.html"); //funktioniert in IE erst ab 10!
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();

}

//generiert das Html für das Formular in hOrtEdit.html
//erwartet Feldliste als Objekt (aus der globalen Variable); Ort als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerOrtEditForm (Ort) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteOrtEdit.rows) {
		if (typeof i !== "function") {
			Feld = FeldlisteOrtEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === Ort.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Ort.User) !== -1 && (FeldName !== "oName") && (FeldName !== "oXKoord") && (FeldName !== "oYKoord") && (FeldName !== "oLagegenauigkeit")) {
				if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu" && Feld.Standardwert) {
					FeldWert = Feld.Standardwert[Ort.User] || "";
				} else {
					FeldWert = Ort[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
		}
	}
	return HtmlContainer;
}

//erstellt die Ortliste in hOrtListe.html
function initiiereOrtListe() {
	//hat hOrtEdit.html eine OrtListe übergeben?
	if (window.OrtListe) {
		//Ortliste aus globaler Variable holen - muss nicht geparst werden
		initiiereOrtListe_2();
	} else if (typeof sessionStorage.OrtListe !== "undefined" && sessionStorage.OrtListe) {
		//Ortliste aus sessionStorage holen
		OrtListe = JSON.parse(sessionStorage.OrtListe);
		initiiereOrtListe_2();
	} else {
		//Ortliste aus DB holen
		if (!localStorage.Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hOrtListe?startkey=["' + localStorage.Username + '", "' + sessionStorage.RaumId + '"]&endkey=["' + localStorage.Username + '", "' + sessionStorage.RaumId + '" ,{}]', {
			success: function (data) {
				//OrtListe für hOrtEdit bereitstellen
				OrtListe = data;
				sessionStorage.OrtListe = JSON.stringify(data);	//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				initiiereOrtListe_2();
			}
		});
	}
}

function initiiereOrtListe_2() {
	var i, anzOrt, Ort, externalPage, listItem, ListItemContainer, Titel2;
	anzOrt = 0;
	ListItemContainer = "";
	for (i in OrtListe.rows) {	//Orte zählen. Wenn noch keine: darauf hinweisen
		if (typeof i !== "function") {
			anzOrt += 1;
		}
	}
	Titel2 = " Orte";	//Im Titel der Seite die Anzahl Orte anzeigen
	if (anzOrt === 1) {
		Titel2 = " Ort";
	}
	$("#hOrtListePageHeader .hOrtListePageTitel").text(anzOrt + Titel2);

	if (anzOrt === 0) {
		ListItemContainer = '<li><a href="#" class="erste hol_NeuLink">Ersten Ort erfassen</a></li>';
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
	$("#Orte").html(ListItemContainer);
	$("#Orte").listview("refresh");
	speichereLetzteUrl();
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
			} else if (typeof sessionStorage.FeldlisteZeitEdit !== "undefined" && sessionStorage.FeldlisteZeitEdit) {
				FeldlisteZeitEdit = JSON.parse(sessionStorage.FeldlisteZeitEdit);
				initiiereZeitEdit_2(Zeit);
			} else {
				$db = $.couch.db("evab");
				//holt die Feldliste aus der DB
				$db.view('evab/FeldListeZeit', {
					success: function (Feldliste) {
						FeldlisteZeitEdit = Feldliste;
						sessionStorage.FeldlisteZeitEdit = JSON.stringify(FeldlisteZeitEdit);
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
	if (sessionStorage.Status === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hZeitEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (typeof i !== "function") {
				if (Formularwerte[i]) {
					Zeit[i] = Formularwerte[i];
				} else if (Zeit[i]) {
					delete Zeit[i]
				}
			}
		}
		$db.saveDoc(Zeit);
		setTimeout("delete sessionStorage.Status", 500);	//warten, generiereHtmlFuerZeitEditForm arbeitet auch damit!
	}
	erstelleAttachments(Zeit);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//erstellt die Liste der Zeiten in Formular hZeitListe.html
function initiiereZeitListe() {
	//hat hZeitEdit.html eine ZeitListe übergeben?
	if (window.ZeitListe) {
		//Zeitliste aus globaler Variable holen - muss nicht geparst werden
		initiiereZeitListe_2();
	} else if (typeof sessionStorage.ZeitListe !== "undefined" && sessionStorage.ZeitListe) {
		//Zeitliste aus sessionStorage holen
		ZeitListe = JSON.parse(sessionStorage.ZeitListe);
		initiiereZeitListe_2();
	} else {
		//Zeitliste aus DB holen
  		if (!localStorage.Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hZeitListe?startkey=["' + localStorage.Username + '", "' + sessionStorage.OrtId + '"]&endkey=["' + localStorage.Username + '", "' + sessionStorage.OrtId + '" ,{}]', {
			success: function (data) {
				//ZeitListe für hZeitEdit bereitstellen
				ZeitListe = data;
				sessionStorage.ZeitListe = JSON.stringify(data);
				initiiereZeitListe_2();
			}
		});
	}
}

function initiiereZeitListe_2() {
	var i, anzZeit, Zeit, externalPage, listItem, ListItemContainer, Titel2, zZeitDatum;
	anzZeit = 0;
	ListItemContainer = "";
	for (i in ZeitListe.rows) {	//Zeiten zählen. Wenn noch keine: darauf hinweisen
		if (typeof i !== "function") {
			anzZeit += 1;
		}
	}

	Titel2 = " Zeiten";  //Im Titel der Seite die Anzahl Zeiten anzeigen
	if (anzZeit === 1) {
		Titel2 = " Zeit";
	}
	$("#hZeitListePageHeader .hZeitListePageTitel").text(anzZeit + Titel2);

	if (anzZeit === 0) {
		ListItemContainer = '<li><a href="#" class="erste hzl_NeuLink">Erste Zeit erfassen</a></li>';
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
	$("#Zeiten").html(ListItemContainer);
	$("#Zeiten").listview("refresh");
	speichereLetzteUrl();
}

//generiert das Html für das Formular in hZeitEdit.html
//erwartet Feldliste als Objekt; Zeit als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerZeitEditForm(Zeit) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	for (i in FeldlisteZeitEdit.rows) {
		if (typeof i !== "function") { 
			Feld = FeldlisteZeitEdit.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === Zeit.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Zeit.User) !== -1 && FeldName !== "zDatum" && FeldName !== "zUhrzeit") {
				if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu" && Feld.Standardwert) {
					FeldWert = Feld.Standardwert[Zeit.User] || "";
				} else {
					FeldWert = Zeit[FeldName] || "";
				}
				FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
				Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
				HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
			}
			//sessionStorage.Status wird schon im aufrufenden function gelöscht!
		}
	}
	return HtmlContainer;
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
			//prüfen, ob die Feldliste schon geholt wurde
			//wenn ja: deren globale Variable verwenden
			if (typeof FeldlistehBeobEdit !== "undefined") {
				erstelleDynamischeFelderhArtEdit(FeldlistehBeobEdit, Beob);
			} else if (typeof sessionStorage.FeldlistehBeobEdit !== "undefined" && sessionStorage.FeldlistehBeobEdit) {
				FeldlistehBeobEdit = JSON.parse(sessionStorage.FeldlistehBeobEdit);
				erstelleDynamischeFelderhArtEdit(FeldlistehBeobEdit, Beob);
			} else {
				//Feldliste aus der DB holen
				$db = $.couch.db("evab");
				$db.view('evab/FeldListeArt', {
					success: function (data) {
						FeldlistehBeobEdit = data;
						sessionStorage.FeldlistehBeobEdit = JSON.stringify(FeldlistehBeobEdit);
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
	if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu") {
		//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
		Formularwerte = {};
		Formularwerte = $("#hArtEditForm").serializeObject();
		//Werte aus dem Formular aktualisieren
		for (i in Formularwerte) {
			if (typeof i !== "function") {
				if (Formularwerte[i]) {
					Beob[i] = Formularwerte[i];
				} else if (Beob[i]) {
					delete Beob[i]
				}
			}
		}
		$db.saveDoc(Beob);
		setTimeout("delete sessionStorage.Status", 500);
	}
	erstelleAttachments(Beob);
	//Anhänge wieder einblenden
	$('#FormAnhänge').show();
	//url muss gepuscht werden, wenn mit changePage zwischen mehreren Formularen gewechselt wurde
	window.history.pushState("", "", "hArtEdit.html"); //funktioniert in IE erst ab 10!
	//letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
	speichereLetzteUrl();
}

//generiert das Html für Formular in hArtEdit.html
//erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerhArtEditForm (Feldliste, Beob) {
	var Feld, i, FeldName, FeldBeschriftung, SliderMinimum, SliderMaximum, ListItem, HtmlContainer, ArtGruppe;
	Feld = {};
	ListItem = "";
	HtmlContainer = "";
	ArtGruppe = Beob.aArtGruppe;
	for (i in Feldliste.rows) {
		//Vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
		if (typeof i !== "function" && typeof Feld.ArtGruppe !== "undefined") {
			Feld = Feldliste.rows[i].value;
			FeldName = Feld.FeldName;
			//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
			if ((Feld.User === Beob.User || Feld.User === "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(Beob.User) !== -1 && Feld.ArtGruppe.indexOf(ArtGruppe) >= 0 && (FeldName !== "aArtId") && (FeldName !== "aArtGruppe") && (FeldName !== "aArtName")) {
				if (typeof sessionStorage.Status !== "undefined" && sessionStorage.Status === "neu" && Feld.Standardwert) {
					FeldWert = Feld.Standardwert[Beob.User] || "";
				} else {
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

//initiiert BeobListe.html
function initiierehBeobListe() {
	//hat hArtEdit.html eine hBeobListe übergeben?
	if (window.hBeobListe) {
		//Beobliste aus globaler Variable holen - muss nicht geparst werden
		initiierehBeobListe_2();
	} else if (sessionStorage.hBeobListe) {
		//Beobliste aus sessionStorage holen
		hBeobListe = JSON.parse(sessionStorage.hBeobListe);
		initiierehBeobListe_2();
	} else {
		//Beobliste aus DB holen
  		if (!localStorage.Username) {
			pruefeAnmeldung();
		}
		$db = $.couch.db("evab");
		$db.view('evab/hArtListe?startkey=["' + localStorage.Username + '", "' + sessionStorage.ZeitId + '"]&endkey=["' + localStorage.Username + '", "' + sessionStorage.ZeitId + '" ,{}]', {
			success: function (data) {
				//Liste bereitstellen, um Datenbankzugriffe zu reduzieren
				hBeobListe = data;
				sessionStorage.hBeobListe = JSON.stringify(hBeobListe);
				initiierehBeobListe_2();
			}
		});
	}
}

function initiierehBeobListe_2() {
	var i, anzArt, Art, externalPage, listItem, ListItemContainer, Titel2, bArtName;
	anzArt = 0;
	ListItemContainer = "";
	for (i in hBeobListe.rows) {   //Arten zählen. Wenn noch keine: darauf hinweisen
		if (typeof i !== "function") {
			anzArt += 1;
		}
	}

	Titel2 = " Arten";   //Im Titel der Seite die Anzahl Arten anzeigen
	if (anzArt === 1) {
		Titel2 = " Art";
	}
	$("#hArtListePageHeader .hArtListePageTitel").text(anzArt + Titel2);

	if (anzArt === 0) {
		ListItemContainer = '<li><a href="#" class="erste hal_NeuLink">Erste Art erfassen</a></li>';
	} else {
		for (i in hBeobListe.rows) {	//Liste aufbauen
			if (typeof i !== "function") {
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
	}
	$("#Arten").html(ListItemContainer);
	$("#Arten").listview("refresh");
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

//verorted mit Hilfe aller Methoden
//erwartet die docId und den Formularnamen, um am Ende der Verortung die neuen Koordinaten zu speichern
function GetGeolocation(docId, FormName) {
	sessionStorage.docId = docId;
	sessionStorage.FormName = FormName;
	watchID = null;
	//dem Benutzer mitteilen, dass die Position ermittelt wird
	//Felder nur ändern, wenn zuvor kein Wert enthalten war
	//if (!$("input#oXKoord").val()) {
		$("input#oXKoord").val("Position ermitteln...");
		$("input#oYKoord").val("Position ermitteln...");
		$("input#oLagegenauigkeit").val("Position ermitteln...");
	//}
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { frequency: 3000, enableHighAccuracy: true });
	//nach spätestens 20 Sekunden aufhören zu messen
	setTimeout("stopGeolocation()", 20000);
	return watchID;
}

//Position ermitteln war erfolgreich
function onGeolocationSuccess(position) {
	var oLagegenauigkeit, Höhe, x, y;
	//Koordinaten nur behalten, wenn Mindestgenauigkeit erreicht ist
	//und eine ev. zuvor erhaltene Genauigkeit unterschritten wird
	oLagegenauigkeit = position.coords.accuracy;
	//if (oLagegenauigkeit < 100 && oLagegenauigkeit < $("#oLagegenauigkeit").val()) {
	if (oLagegenauigkeit < 100) {
		oLongitudeDecDeg = position.coords.longitude;
		oLatitudeDecDeg = position.coords.latitude;
		Höhe = position.coords.altitude;
		$("#oLagegenauigkeit").val(oLagegenauigkeit);
		x = DdInChX(oLatitudeDecDeg, oLongitudeDecDeg);
		y = DdInChY(oLatitudeDecDeg, oLongitudeDecDeg);
		$("#oXKoord").val(x);
		$("#oYKoord").val(y);
		if (Höhe > 0) {
			$("input#oObergrenzeHöhe").val(position.coords.altitude);
		}
		//speichereAlles kommt in BeobEdit und in hOrtEdit vor
		stopGeolocation();
		speichereAlles(sessionStorage.docId, sessionStorage.FormName);
		if (oLagegenauigkeit > 30) {
			melde("Koordinaten nicht sehr genau\nAuf Karte verorten?");
		}

	}
	//Verortung abbrechen, wenn sehr genau
	if (oLagegenauigkeit < 5) {
		stopGeolocation();
		speichereAlles(sessionStorage.docId, sessionStorage.FormName);
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
		speichereAlles(sessionStorage.docId, sessionStorage.FormName);
		delete sessionStorage.docId;
		delete sessionStorage.FormName;
	}
}

//Speichert alle Daten eines Formulars
//wird aufgerufen von evab.js, function GetGeolocation
//und stellt sicher, dass die Koordinaten gespeichert werden
//erwartet docId und Formularnamen
function speichereAlles(docId, FormName) {
	$db = $.couch.db("evab");
	$db.openDoc(docId, {
		success: function(doc) {
			var Formularwerte = {};
			var Formularname = '#' + FormName;
			Formularwerte = $(Formularname).serializeObject();
			//Werte aus dem Formular aktualisieren
			for (i in Formularwerte) {
				if (typeof i !== "function") {
					if (Formularwerte[i]) {
						doc[i] = Formularwerte[i];
					} else if (doc[i]) {
						delete doc[i]
					}
				}
			}
			$db.saveDoc(doc);
		}
	});
}

function speichereLetzteUrl() {
//damit kann bei erneuter Anmeldung die letzte Ansicht wiederhergestellt werden
//host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
//UserId wird zurück gegeben. Wird meist benutzt, um im Menü meine Einstellungen zu öffnen
	//damit - zusammen mit der letzen URL - die letzte Seite bekannt ist
	//sessionStorage.LetzteId = id; idee um nicht von gesammter sessionStorage abhängig zu sein?
	//if (typeof localStorage.Username === ("undefined" || null)) {
	if (typeof localStorage.Username === "undefined" || localStorage.Username === null) {
		$.ajax({
			url: '/_session',
			dataType: 'json',
			async: false,
			success: function (session) {
				//if (session.userCtx.name !== (undefined || null)) {
				if (session.userCtx.name !== undefined && session.userCtx.name !== null) {
					Username = session.userCtx.name;
					localStorage.Username = Username;
					speichereLetzteUrl_2();
				} else {
					sessionStorage.UserStatus = "neu";
					window.open("index.html", target = "_self");
				}
			}
		});
	} else {
		speichereLetzteUrl_2();
	}
}

function speichereLetzteUrl_2() {
	var User, UserId;
	sessionStorage.LetzteUrl = window.location.pathname + window.location.search;
	//UserId nur abfragen, wenn nicht schon erfolgt
	if (!sessionStorage.UserId) {
		$db = $.couch.db("evab");
		$db.view('evab/User?key="' + localStorage.Username + '"', {
			success: function (data) {
				User = data.rows[0].value;
				//UserId als globale Variable setzen, damit die Abfrage nicht immer durchgeführt werden muss
				sessionStorage.UserId = User._id;
				//weitere anderswo benutzte Variabeln verfügbar machen
				sessionStorage.ArtenSprache = User.ArtenSprache;
				sessionStorage.Autor = User.Autor;
				speichereLetzteUrl_3(User._id);
			}
		});
	} else {
		UserId = sessionStorage.UserId;
		speichereLetzteUrl_3(UserId);
	}
}

function speichereLetzteUrl_3(UserId) {
	$db = $.couch.db("evab");
	$db.openDoc(UserId, {
		success: function (User) {
			//nur speichern, wann anders als zuletzt
			//leider registriert das auch Änderungen der Feldliste etc.
			//um das zu beheben, müsste immer eine Änderung der passenden id verfolgt werden
			//damit könnte auch das parsen gespaart werden
			if (typeof sessionStorage === "undefined" || JSON.stringify(User.sessionStorage) !== JSON.stringify(sessionStorage)) {
				User.sessionStorage = sessionStorage;
				$db.saveDoc(User);
			}
		}
	});
}

//Wenn Seiten direkt geöffnet werden, muss die sessionStorage wieder hergestellt werden
//Dieser Vorgang ist langsam. Bis er beendet ist, hätte die aufrufende Seite bereits mit dem Initiieren der Felder begonnen
//und dabei wegen mangelndem sesstionStorage Fehler produziert
//daher wird die aufrufende Seite übergeben und nach getaner Arbeit deren Felder initiiert
//Wenn sessionStorage null ist, verzichtet die aufrufende Seite auf das Initiieren
function holeSessionStorageAusDb(AufrufendeSeite) {
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	$db = $.couch.db("evab");
	$db.view('evab/User?key="' + localStorage.Username + '"', {
		success: function (data) {
			var SessionStorageObjekt = {};
			User = data.rows[0].value;
			SessionStorageObjekt = User.sessionStorage;
			for (i in SessionStorageObjekt) {
				if (typeof i !== "function") {
					sessionStorage[i] = SessionStorageObjekt[i];
				}
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
					initiiereProjektEdit(sessionStorage.ProjektId);
				break;
				case "hProjektListe":
					initiiereProjektliste();
				break;
				case "BeobEdit":
					initiiereBeobEdit(sessionStorage.BeobId);
				break;
				case "BeobListe":
					initiiereBeobliste();
				break;
				case "FeldEdit":
					initiiereFeldEdit();
				break;
				case "Feldliste":
					initiiereFeldliste();
				break;
				case "UserEdit":
					initiiereUserEdit();
				break;
			}
		}
	});
}


//erstellt die Google-Map Karte für die Orte eines Raums
//wird aufgerufen von RaumEdit.html und OrtListe.html
//erwartet den user und die RaumId
function erstelleKarteFürRaum() {
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hRaumOrteFuerKarte?startkey=["' + localStorage.Username + '", "' + sessionStorage.RaumId + '"]&endkey=["' + localStorage.Username + '", "' + sessionStorage.RaumId + '" ,{}]&include_docs=true', {
		success: function (data) {
			var i, anzOrt, Ort;
			anzOrt = 0;
			var infowindow = new google.maps.InfoWindow();
			for (i in data.rows) {
				if (typeof i !== "function") {
					//Orte zählen
					anzOrt += 1;
				}
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
					if (typeof i !== "function") {
						Ort = data.rows[i].doc;
						var hOrtId = Ort._id;
						var hRaumId = Ort.hRaumId;
						var hProjektId = Ort.hProjektId;
						var oName = Ort.oName;
						var oXKoord = Ort.oXKoord;
						var oYKoord = Ort.oYKoord;
						var lat2 = Ort.oLatitudeDecDeg;
						var lng2 = Ort.oLongitudeDecDeg;
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
							"<p><a href=\"#\" onclick=\"oeffneOrt('" + hOrtId + "')\" rel=\"external\">bearbeiten<\/a></p>"+
							'</div>'+
							'</div>';
						makeListener(map, marker, contentString);
					}
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
function erstelleKarteFürProjekt() {
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hProjektOrteFuerKarte?startkey=["' + localStorage.Username + '", "' + sessionStorage.ProjektId + '"]&endkey=["' + localStorage.Username + '", "' + sessionStorage.ProjektId + '" ,{}]&include_docs=true', {
		success: function (data) {
			var i, anzOrt, Ort;
			anzOrt = 0;
			var infowindow = new google.maps.InfoWindow();
			for (i in data.rows) {
				if (typeof i !== "function") {
					//Orte zählen
					anzOrt += 1;
				}
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
					if (typeof i !== "function") {
						Ort = data.rows[i].doc;
						var hOrtId = Ort._id;
						var hRaumId = Ort.hRaumId;
						var hProjektId = Ort.hProjektId;
						var oName = Ort.oName;
						var oXKoord = Ort.oXKoord;
						var oYKoord = Ort.oYKoord;
						var lat2 = Ort.oLatitudeDecDeg;
						var lng2 = Ort.oLongitudeDecDeg;
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
							"<p><a href=\"#\" onclick=\"oeffneOrt('" + hOrtId + "')\" rel=\"external\">bearbeiten<\/a></p>"+
							'</div>'+
							'</div>';
						makeListener(map, marker, contentString);
					}
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
			url_zumLöschen = url + "?" + rev;	//theoretisch kann diese rev bis zum Löschen veraltet sein, praktisch kaum
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
//wird benutzt von FeldListe.html und FeldEdit.html
function neuesFeld() {
	var NeuesFeld;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
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
			sessionStorage.FeldId = data.id;
			Feld = data;
			sessionStorage.Feld = JSON.stringify(data);
			//Feldliste soll neu aufgebaut werden
			delete window.Feldliste;
			delete sessionStorage.Feldliste;
			window.open("FeldEdit.html", target = "_self");
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
				//if (session.userCtx.name !== (undefined || null)) {
				if (session.userCtx.name !== undefined && session.userCtx.name !== null) {
					localStorage.Username = session.userCtx.name;
				} else {
					sessionStorage.UserStatus = "neu";
					window.open("index.html", target = "_self");
				}
			}
		});
	}
}

//setzt die OrtId, damit hOrtEdit.html am richtigen Ort öffnet
//und ruft dann hOrtEdit.html auf
//wird von den Links in der Karte benutzt
function oeffneOrt(OrtId) {
	sessionStorage.OrtId = OrtId;
	window.open("hOrtEdit.html", target = "_self");
}

//setzt die BeobId, damit BeobEdit.html am richtigen Ort öffnet
//und ruft dann BeobEdit.html auf
//wird von den Links in der Karte auf BeobListe.html benutzt
function oeffneBeob(BeobId) {
	sessionStorage.BeobId = BeobId;
	window.open("BeobEdit.html", target = "_self");
}

//wird benutzt in Artenliste.html
//wird dort aufgerufen aus pageshow und pageinit, darum hierhin verlagert
function erstelleArtenliste() {
	var viewname;
		if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	//Wenn Artensprache noch nicht bekannt ist, aus der DB holen
	//sonst aus der sessionStorage
	if (typeof sessionStorage.ArtenSprache === "undefined" || !sessionStorage.ArtenSprache) {
		viewname = 'evab/User?key="' + localStorage.Username + '"';
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function (data) {
				User = data.rows[0].value;
				sessionStorage.ArtenSprache = User.ArtenSprache;
				//Wenn der User schon bekannt ist, UserId und Autor bereit stellen
				sessionStorage.UserId = User._id;
				sessionStorage.Autor = User.Autor;
			}
		});
	}
	switch(sessionStorage.ArtenSprache) {
	case "Lateinisch":
		$("#al_ButtonSprache .ui-btn-text").text("Deutsch");
		erstelleArtenlisteLateinisch();
		break;
	case "Deutsch":
		$("#al_ButtonSprache .ui-btn-text").text("Lateinisch");
		erstelleArtenlisteDeutsch();
		break;
	}
}

//wird benutzt in Artenliste.html
//aufgerufen von erstelleArtenliste
function erstelleArtenlisteLateinisch() {
	//prüfen, ob nur eine Unterauswahl von Arten der Artengruppe abgerufen werden soll
	if (typeof sessionStorage.L === "undefined" || !sessionStorage.L) {
		viewname = 'evab/Artliste?startkey=["' + sessionStorage.aArtGruppe + '"]&endkey=["' + sessionStorage.aArtGruppe + '",{},{}]';
	} else {
		viewname = 'evab/Artliste?startkey=["' + sessionStorage.aArtGruppe + '","' + sessionStorage.L + '"]&endkey=["' + sessionStorage.aArtGruppe + '","' + sessionStorage.L + '",{}]';
	}
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function (data) {
			var i, ListItemContainer, ArtBezeichnung, Art, ArtId;
			ListItemContainer = "";
			for (i in data.rows) {
				if (typeof i !== "function") {
					ArtBezeichnung = data.rows[i].key[2];
					Art = data.rows[i].value;
					ArtId = Art._id;
					ListItemContainer += "<li name=\"ArtListItem\" ArtBezeichnung=\"";
					ListItemContainer += ArtBezeichnung;
					ListItemContainer += "\" ArtId=\"";
					ListItemContainer += ArtId;
					ListItemContainer += "\">";
					ListItemContainer += "<a href=\"#\"><h3>";
					ListItemContainer += ArtBezeichnung;
					ListItemContainer += "<\/h3>";
					if (Art.HinweisVerwandschaft) {
						ListItemContainer += "<p>" + Art.HinweisVerwandschaft + "<\/p>";
					}
					ListItemContainer += "<\/a><\/li>";
				}
			}
			$("#al_ArtenListe").html(ListItemContainer);
			$("#al_ArtenListe").listview("refresh");
			$("#al_Hinweistext").empty().remove();
		}
	});
}

//wird benutzt in Artenliste.html
//aufgerufen von erstelleArtenliste
function erstelleArtenlisteDeutsch() {
	//prüfen, ob nur eine Unterauswahl von Arten der Artengruppe abgerufen werden soll
	if (typeof sessionStorage.L === "undefined" || !sessionStorage.L) {
		viewname = 'evab/ArtlisteDeutsch?startkey=["' + sessionStorage.aArtGruppe + '"]&endkey=["' + sessionStorage.aArtGruppe + '",{},{}]';
	} else {
		viewname = 'evab/ArtlisteDeutsch?startkey=["' + sessionStorage.aArtGruppe + '","' + sessionStorage.L + '"]&endkey=["' + sessionStorage.aArtGruppe + '","' + sessionStorage.L + '",{}]';
	}
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function (data) {
			var i, ListItemContainer, ArtBezeichnung, Art, ArtId;
			ListItemContainer = "";
			for (i in data.rows) {
				if (typeof i !== "function") {
					ArtBezeichnung = data.rows[i].key[2];
					Art = data.rows[i].value;
					ArtId = Art._id;
					ListItemContainer += "<li name=\"ArtListItem\" ArtBezeichnung=\"";
					ListItemContainer += ArtBezeichnung;
					ListItemContainer += "\" ArtId=\"";
					ListItemContainer += ArtId;
					ListItemContainer += "\">";
					ListItemContainer += "<a href=\"#\"><h3>";
					ListItemContainer += ArtBezeichnung;
					ListItemContainer += "<\/h3>";
					if (Art.HinweisVerwandschaft) {
						ListItemContainer += "<p>" + Art.HinweisVerwandschaft + "<\/p>";
					}
					ListItemContainer += "<\/a><\/li>";
				}
			}
			$("#al_ArtenListe").html(ListItemContainer);
			$("#al_ArtenListe").listview("refresh");
			$("#al_Hinweistext").empty().remove();
		}
	});
}

//wird benutzt in Artgruppenliste.html
//wird dort aufgerufen aus pageshow und pageinit, darum hierhin verlagert
function erstelleArtgruppenListe() {
//gewünschte Sprache für Arten ermitteln
//Listen aufbauen lassen
//und button für Sprache richtig beschriften
	var viewname;
	if (!localStorage.Username) {
		pruefeAnmeldung();
	}
	//Wenn Artensprache noch nicht bekannt ist, aus der DB holen
	//sonst aus der sessionStorage
	if (typeof sessionStorage.ArtenSprache === "undefined" || !sessionStorage.ArtenSprache) {
		viewname = 'evab/User?key="' + localStorage.Username + '"';
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function (data) {
				User = data.rows[0].value;
				ArtenSprache = User.ArtenSprache;
				sessionStorage.ArtenSprache = ArtenSprache;
				//Wenn der User schon bekannt ist, UserId und Autor bereit stellen
				sessionStorage.UserId = User._id;
				sessionStorage.Autor = User.Autor;
				erstelleArtgruppenListe_2();
			}
		});
	} else {
		ArtenSprache = sessionStorage.ArtenSprache;
		erstelleArtgruppenListe_2();
	}
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListe_2() {
	//je nach Sprache Artgruppenliste aufbauen
	switch(ArtenSprache) {
	case "Lateinisch":
		$("#agl_ButtonSprache .ui-btn-text").text("Deutsch");
		if (sessionStorage.NestedList) {
			//Artgruppen werden übergeben, wenn die Art geändert wird, die Artgruppe aber bleiben soll
			//und die Artgruppe ihre Arten in einer nested list darstellt
			//sonst wird direkt Artenliste.html aufgerufen
			erstelleArtgruppenListeFürNestedArtgruppeLat();
		} else {
			erstelleArgruppenListeLat();
		}
		delete sessionStorage.NestedList;
		break;
	case "Deutsch":
		$("#agl_ButtonSprache .ui-btn-text").text("Lateinisch");
		if (sessionStorage.NestedList) {
			erstelleArtgruppenListeFürNestedArtgruppeDeutsch();
		} else {
			erstelleArgruppenListeDeutsch();
		}
		delete sessionStorage.NestedList;
		break;
	}
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListeFürNestedArtgruppeLat() {
	var i, y, ListItemContainer, ArtGruppe, row, ArtGruppen_2_L, ArtGruppen, AnzArten, viewname;
	ListItemContainer = "";
	viewname = 'evab/Artgruppen?key="' + sessionStorage.aArtGruppe + '"'; 
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function (data) {
			ArtGruppen = data;
			for (i in data.rows) {
				if (typeof i !== "function") {
					ArtGruppe = ArtGruppen.rows[i].key;
					row = ArtGruppen.rows[i].value;
					AnzArten = row.AnzArten;
					ArtGruppen_2_L = row.ArtGruppen_2_L;
					ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
					ListItemContainer += "<a href=\"#\"><h3>A - Z<\/h3><p>Langsamer, kann Mobilgeräte überfordern</p><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
					for (y in ArtGruppen_2_L) {
						if (typeof y !== "function") {
							ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\" L=\"" + ArtGruppen_2_L[y].Artgruppe_2_L + "\">";
							ListItemContainer += "<a href=\"#\"><h3>" + ArtGruppen_2_L[y].Artgruppe_2_L + "<\/h3><span class='ui-li-count'>" + ArtGruppen_2_L[y].AnzArten + "</span><\/a><\/li>";
						}
					}
					ListItemContainer += "<\/li>";
				}
			}
			$("#agl_ArtgruppenListe").html(ListItemContainer);
			$(".ui-title").text(ArtGruppe);
			$("#agl_ArtgruppenListe").listview("refresh");
			$("#agl_Hinweistext").empty().remove();
		}
	});
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArtgruppenListeFürNestedArtgruppeDeutsch() {
	var i, y, ListItemContainer, ArtGruppe, row, ArtGruppen_2_D, ArtGruppen, AnzArten, viewname;
	ListItemContainer = "";
	viewname = 'evab/Artgruppen?key="' + sessionStorage.aArtGruppe + '"'; 
	$db = $.couch.db("evab");
	$db.view(viewname, {
		success: function (data) {
			ArtGruppen = data;
			for (i in data.rows) {
				if (typeof i !== "function") {
					ArtGruppe = ArtGruppen.rows[i].key;
					row = ArtGruppen.rows[i].value;
					AnzArten = row.AnzArtenDeutsch;
					ArtGruppen_2_D = row.ArtGruppen_2_D;
					ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
					ListItemContainer += "<a href=\"#\"><h3>A - Z<\/h3><p>Langsamer, kann Mobilgeräte überfordern</p><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
					for (y in ArtGruppen_2_D) {
						if (typeof y !== "function") {
							ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\" L=\"" + ArtGruppen_2_D[y].Artgruppe_2_D + "\">";
							ListItemContainer += "<a href=\"#\"><h3>" + ArtGruppen_2_D[y].Artgruppe_2_D + "<\/h3><span class='ui-li-count'>" + ArtGruppen_2_D[y].AnzArten + "</span><\/a><\/li>";
						}
					}
					ListItemContainer += "<\/li>";
				}
			}
			$("#agl_ArtgruppenListe").html(ListItemContainer);
			$(".ui-title").text(ArtGruppe);
			$("#agl_ArtgruppenListe").listview("refresh");
			$("#agl_Hinweistext").empty().remove();
		}
	});
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArgruppenListeLat() {
	//Artgruppenliste verfügbar machen
	var viewname;
	if (typeof ArtgruppenlisteLateinisch !== "undefined" && ArtgruppenlisteLateinisch) {
		erstelleArgruppenListeLat_2();
	} else if (typeof sessionStorage.ArtgruppenlisteLateinisch !== "undefined" && sessionStorage.ArtgruppenlisteLateinisch) {
		ArtgruppenlisteLateinisch = JSON.parse(sessionStorage.ArtgruppenlisteLateinisch);
		erstelleArgruppenListeLat_2();
	} else {
		viewname = 'evab/Artgruppen';
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function (data) {
				ArtgruppenlisteLateinisch = data;
				//Artgruppenliste bereitstellen
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.ArtgruppenlisteLateinisch = JSON.stringify(ArtgruppenlisteLateinisch);
				erstelleArgruppenListeLat_2();
			}
		});
	}
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArgruppenListeLat_2() {
	var i, y, ListItemContainer, ArtGruppe, row, ArtGruppen_2_L, AnzArten;
	ListItemContainer = "";
	for (i in ArtgruppenlisteLateinisch.rows) {
		if (typeof i !== "function") {
			ArtGruppe = ArtgruppenlisteLateinisch.rows[i].key;
			row = ArtgruppenlisteLateinisch.rows[i].value;
			AnzArten = row.AnzArten;
			ArtGruppen_2_L = row.ArtGruppen_2_L;
			if (ArtGruppen_2_L) {
				ListItemContainer += "<li><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span>";
				ListItemContainer += "<ul>";
				ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
				ListItemContainer += "<a href=\"#\"><h3>A - Z<\/h3><p>Langsamer, kann Mobilgeräte überfordern</p><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
				for (y in ArtGruppen_2_L) {
					if (typeof y !== "function") {
						ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\" L=\"" + ArtGruppen_2_L[y].Artgruppe_2_L + "\">";
						ListItemContainer += "<a href=\"#\"><h3>" + ArtGruppen_2_L[y].Artgruppe_2_L + "<\/h3><span class='ui-li-count'>" + ArtGruppen_2_L[y].AnzArten + "</span><\/a><\/li>";
					}
				}
				ListItemContainer += "</ul><\/li>";
			} else {
				ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
				ListItemContainer += "<a href=\"#\"><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
			}
		}
	}
	$("#agl_ArtgruppenListe").html(ListItemContainer);
	$("#agl_ArtgruppenListe").listview("refresh");
	$("#agl_Hinweistext").empty().remove();
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArgruppenListeDeutsch() {
	//Artgruppenliste verfügbar machen
	var viewname;
	if (typeof ArtgruppenlisteDeutsch !== "undefined" && ArtgruppenlisteDeutsch) {
		erstelleArgruppenListeDeutsch_2();
	} else if (typeof sessionStorage.ArtgruppenlisteDeutsch !== "undefined" && sessionStorage.ArtgruppenlisteDeutsch) {
		ArtgruppenlisteDeutsch = JSON.parse(sessionStorage.ArtgruppenlisteDeutsch);
		erstelleArgruppenListeDeutsch_2();
	} else {
		viewname = 'evab/Artgruppen';
		$db = $.couch.db("evab");
		$db.view(viewname, {
			success: function (data) {
				ArtgruppenlisteDeutsch = data;
				//Artgruppenliste bereitstellen
				//Objekte werden als Strings übergeben, müssen in String umgewandelt werden
				sessionStorage.ArtgruppenlisteDeutsch = JSON.stringify(ArtgruppenlisteDeutsch);
				erstelleArgruppenListeDeutsch_2();
			}
		});
	}
}

//wird benutzt in Artgruppenliste.html
//aufgerufen von erstelleArtgruppenListe
function erstelleArgruppenListeDeutsch_2() {
	var i, y, ListItemContainer, ArtGruppe, row, ArtGruppen_2_D, AnzArten;
	ListItemContainer = "";
	for (i in ArtgruppenlisteDeutsch.rows) {
		if (typeof i !== "function") {
			ArtGruppe = ArtgruppenlisteDeutsch.rows[i].key;
			row = ArtgruppenlisteDeutsch.rows[i].value;
			AnzArten = row.AnzArtenDeutsch;
			ArtGruppen_2_D = row.ArtGruppen_2_D;
			if (ArtGruppen_2_D) {
				ListItemContainer += "<li><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span>";
				ListItemContainer += "<ul>";
				ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
				ListItemContainer += "<a href=\"#\"><h3>A - Z<\/h3><p>Langsamer, kann Mobilgeräte überfordern</p><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
				for (y in ArtGruppen_2_D) {
					if (typeof y !== "function") {
						ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\" L=\"" + ArtGruppen_2_D[y].Artgruppe_2_D + "\">";
						ListItemContainer += "<a href=\"#\"><h3>" + ArtGruppen_2_D[y].Artgruppe_2_D + "<\/h3><span class='ui-li-count'>" + ArtGruppen_2_D[y].AnzArten + "</span><\/a><\/li>";
					}
				}
				ListItemContainer += "</ul><\/li>";
			} else {
				ListItemContainer += "<li name=\"ArtgruppenListItem\" ArtGruppe=\"" + ArtGruppe + "\">";
				ListItemContainer += "<a href=\"#\"><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + "</span><\/a><\/li>";
			}
		}
	}
	$("#agl_ArtgruppenListe").html(ListItemContainer);
	$("#agl_ArtgruppenListe").listview("refresh");
	$("#agl_Hinweistext").empty().remove();
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
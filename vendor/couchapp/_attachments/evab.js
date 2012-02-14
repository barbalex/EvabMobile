/*
Diese Funktionen werden in evab auf mehreren Seiten benutzt
*/

function erstelleNeuesDatum(){                               
	var jetzt = new Date();
	var Jahr = jetzt.getFullYear();
	var Mnt = jetzt.getMonth()+1;
	var MntAusgabe = ((Mnt < 10) ? "0" + Mnt : Mnt);
	var Tag = jetzt.getDate();
	var TagAusgabe = ((Tag < 10) ? "0" + Tag : Tag);
	var Datum = Jahr + "-" + MntAusgabe + "-" + TagAusgabe;
	return Datum;
};

function erstelleNeueUhrzeit(){                               
	var jetzt = new Date();
	var Std = jetzt.getHours();
	var StdAusgabe = ((Std < 10) ? "0" + Std : Std);
	var Min = jetzt.getMinutes();
	var MinAusgabe = ((Min < 10) ? "0" + Min : Min);
	var Sek = jetzt.getSeconds();
	var SekAusgabe = ((Sek < 10) ? "0" + Sek : Sek);
	var Zeit = StdAusgabe + ":" + MinAusgabe + ":" + SekAusgabe;
	return Zeit;
};

/*
funktion, mit der man recht einfach einen Paramater aus der URL lesen kann. 
Sollte der Parameter nicht vorhanden sein, so liefert die Funktion einen leeren String zurück, andernfalls den Inhalt des Parameters.
 
Hier noch ein Verwendungsbeispiel:
URL: http://www.example.com/?titel=test&trinken=bier&essen=schweinshaxe
wasEssenWir = get_url_param('essen');
*/
function get_url_param(name){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );

	if ( results == null )
		return "";
	else
		return results[1];
};


//wandelt decimal degrees (vom GPS) in WGS84 um
function DdInWgs84BreiteGrad(Breite){
 	BreiteGrad = Math.floor(Breite);
    return BreiteGrad;
};

function DdInWgs84BreiteMin(Breite){
 	BreiteGrad = Math.floor(Breite);
    BreiteMin = Math.floor((Breite-BreiteGrad)*60);
    return BreiteMin;
};

function DdInWgs84BreiteSec(Breite){
 	BreiteGrad = Math.floor(Breite);
    BreiteMin = Math.floor((Breite-BreiteGrad)*60);
    BreiteSec =  (Math.round((((Breite - BreiteGrad) - (BreiteMin/60)) * 60 * 60) * 100) / 100);
    return BreiteSec;
};

function DdInWgs84LaengeGrad(Laenge){
    LaengeGrad = Math.floor(Laenge);
    return LaengeGrad;
};

function DdInWgs84LaengeMin(Laenge){
    LaengeGrad = Math.floor(Laenge);
    LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
    return LaengeMin;
};

function DdInWgs84LaengeSec(Laenge){
    LaengeGrad = Math.floor(Laenge);
    LaengeMin = Math.floor((Laenge-LaengeGrad)*60);
    LaengeSec = (Math.round((((Laenge - LaengeGrad) - (LaengeMin/60)) * 60 * 60) * 100 ) / 100);
    return LaengeSec;
};

// Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
function Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
  // Converts degrees dec to sex
  lat = BreiteSec + BreiteMin*60 + BreiteGrad*3600;
  lng = LaengeSec + LaengeMin*60 + LaengeGrad*3600;
  
  // Axiliary values (% Bern)
  var lat_aux = (lat - 169028.66)/10000;
  var lng_aux = (lng - 26782.5)/10000;

  x = 200147.07
   + 308807.95 * lat_aux 
   +   3745.25 * Math.pow(lng_aux,2)
   +     76.63 * Math.pow(lat_aux,2)
   -    194.56 * Math.pow(lng_aux,2) * lat_aux
   +    119.79 * Math.pow(lat_aux,3);
     
  return x;
}

function Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec) {
  // Converts degrees dec to sex
  lat = BreiteSec + BreiteMin*60 + BreiteGrad*3600;
  lng = LaengeSec + LaengeMin*60 + LaengeGrad*3600;
  
  // Axiliary values (% Bern)
  var lat_aux = (lat - 169028.66)/10000;
  var lng_aux = (lng - 26782.5)/10000;
  
  // Process Y
  y = 600072.37 
     + 211455.93 * lng_aux 
     -  10938.51 * lng_aux * lat_aux
     -      0.36 * lng_aux * Math.pow(lat_aux,2)
     -     44.54 * Math.pow(lng_aux,3);
     
  return y;
}

//wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
function DdInChX(Breite, Laenge){
	var BreiteGrad = DdInWgs84BreiteGrad(Breite);
	var BreiteMin = DdInWgs84BreiteMin(Breite);
	var BreiteSec = DdInWgs84BreiteSec(Breite);
	var LaengeGrad = DdInWgs84LaengeGrad(Laenge);
	var LaengeMin = DdInWgs84LaengeMin(Laenge);
	var LaengeSec = DdInWgs84LaengeSec(Laenge);
	var x = Math.floor(Wgs84InChX(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return x;
};

function DdInChY(Breite, Laenge){
	var BreiteGrad = DdInWgs84BreiteGrad(Breite);
	var BreiteMin = DdInWgs84BreiteMin(Breite);
	var BreiteSec = DdInWgs84BreiteSec(Breite);
	var LaengeGrad = DdInWgs84LaengeGrad(Laenge);
	var LaengeMin = DdInWgs84LaengeMin(Laenge);
	var LaengeSec = DdInWgs84LaengeSec(Laenge);
	var y = Math.floor(Wgs84InChY(BreiteGrad, BreiteMin, BreiteSec, LaengeGrad, LaengeMin, LaengeSec));
	return y;
};

function melde(Meldung) {
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + Meldung +"</h1></div>")
	    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 150 })
	    .appendTo( $.mobile.pageContainer )
	    .delay( 2500 )
	    .fadeOut( 700, function(){
	    	$(this).remove();
		});
};

function speichereNeueBeob(Pfad, UserName, aArtGruppe, aArtBezeichnung, ArtId, Von, hProjektId, hRaumId, hOrtId, hZeitId) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//hArtListe und hArtEdit geben hProjektId, hRaumId, hOrtId und hZeitId mit
	$db = $.couch.db("evab");
	var doc = {};
	doc.User = UserName;
	doc.aArtGruppe = aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = ArtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	if (Von == "hArtListe" || Von == "hArtEdit") {
		doc.Typ = "hArt";
		doc.hProjektId = hProjektId;
		doc.hRaumId = hRaumId;
		doc.hOrtId = hOrtId;
		doc.hZeitId = hZeitId;
		//Bei hierarchischen Beobachtungen wollen wir jetzt die Felder der höheren hierarchischen Ebenen anfügen
		speichereNeueBeob_02(Von, doc);
		return false;
	} else {
		//Von == "BeobListe" || Von == "BeobEdit"
		doc.Typ = "Beobachtung";
		speichereNeueBeob_03(Von, doc);
		return false;
	}
}

function speichereNeueBeob_02(Von, doc) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch hArtListe.html oder hArtEdit.html
//dies ist der zweite Schritt:
//Felder der höheren Hierarchieebenen anfügen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hZeitId, {
		success: function(Zeit) {
			for (i in Zeit) {
				//FeldName = i, Feldwert = Zeit[i]
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hOrtId', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) == -1) {
					doc[i] = Zeit[i];
				}
			}
			$db.openDoc(doc.hOrtId, {
				success: function(Ort) {
					for (i in Ort) {
						//ein paar Felder wollen wir nicht
						if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) == -1) {
							doc[i] = Ort[i];
						}
					}
					$db.openDoc(doc.hRaumId, {
						success: function(Raum) {
							for (i in Raum) {
								//ein paar Felder wollen wir nicht
								if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) == -1) {
									doc[i] = Raum[i];
								}
							}
							$db.openDoc(doc.hProjektId, {
								success: function(Projekt) {
									for (i in Projekt) {
										//ein paar Felder wollen wir nicht
										if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) == -1) {
											doc[i] = Projekt[i];
										}
									}
									speichereNeueBeob_03(Von, doc);
								}
							});
						}
					});
				}
			});
		}
	});
}

function speichereNeueBeob_03(Von, doc) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
//dies ist der letzte Schritt:
//Autor anfügen und weiter zum Edit-Formular
	$db = $.couch.db("evab");
	$db.view('evab/User?key="' + doc.User + '"', {
		success: function(Userliste) {
			var User = Userliste.rows[0].value;
			doc.aAutor = User.Autor;
			$db.saveDoc(doc, {
				success: function(data) {
					if (Von == "hArtListe" || Von == "hArtEdit") {
						window.open("_show/hArtEdit/" + data.id + "?Status=neu", target="_self");
					} else {
						window.open("_show/BeobEdit/" + data.id + "?Status=neu", target="_self");
					}
				},
				error: function() {
					melde("Beobachtung nicht gespeichert.");
				}
			});
		}
	});
}

//Speichert, wenn in BeobEdit oder hArtEdit eine neue Art und ev. auch eine neue Artgruppe gewählt wurde
//erwartet Von = von welchem Formular aufgerufen wurde
function speichereBeobNeueArtgruppeArt(BeobId, aArtGruppe, aArtName, ArtId, Von) {
$db.openDoc(BeobId, {
		success: function(Beob) {
			if (aArtGruppe) {
				Beob.aArtGruppe = aArtGruppe;
			}
			Beob.aArtName = aArtName;
			Beob.aArtId = ArtId;
			$db.saveDoc(Beob, {
				success: function(data) {
					if (Von == "BeobListe" || Von == "BeobEdit") {
						window.open("_show/BeobEdit/" + BeobId, target="_self");
					} else {
						window.open("_show/hArtEdit/" + BeobId, target="_self");
					}
				},
				error: function() {
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

function erstelleNeueZeit(User, hProjektId, hRaumId, hOrtId) {
//Neue Zeiten werden erstellt
//ausgelöst durch hZeitListe.html oder hZeitEdit.html
//dies ist der erste Schritt: doc bilden
	var doc = {};
	doc.Typ = "hZeit";
	doc.User = User;
	doc.hProjektId = hProjektId;
	doc.hRaumId = hRaumId;
	doc.hOrtId = hOrtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zUhrzeit = erstelleNeueUhrzeit();
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hOrtId, {
		success: function(Ort) {
			for (i in Ort) {
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hRaumId', 'hProjektId', '_attachments'].indexOf(i) == -1) {
					doc[i] = Ort[i];
				}
			}
			$db.openDoc(doc.hRaumId, {
				success: function(Raum) {
					for (i in Raum) {
						//ein paar Felder wollen wir nicht
						if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) == -1) {
							doc[i] = Raum[i];
						}
					}
					$db.openDoc(doc.hProjektId, {
						success: function(Projekt) {
							for (i in Projekt) {
								//ein paar Felder wollen wir nicht
								if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) == -1) {
									doc[i] = Projekt[i];
								}
							}
							//speichern
							$db.saveDoc(doc, {
								success: function(data) {
									window.open("../hZeitEdit/" + data.id + "?Status=neu", target="_self");
								},
								error: function() {
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

function erstelleNeuenOrt(User, hProjektId, hRaumId) {
	var doc = {};
	doc.Typ = "hOrt";
	doc.User = User;
	doc.hProjektId = hProjektId;
	doc.hRaumId = hRaumId;
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hRaumId, {
		success: function(Raum) {
			for (i in Raum) {
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', 'hProjektId', '_attachments'].indexOf(i) == -1) {
					doc[i] = Raum[i];
				}
			}
			$db.openDoc(doc.hProjektId, {
				success: function(Projekt) {
					for (i in Projekt) {
						//ein paar Felder wollen wir nicht
						if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) == -1) {
							doc[i] = Projekt[i];
						}
					}
					//speichern
					$db.saveDoc(doc, {
						success: function(data) {
							window.open("../hOrtEdit/" + data.id + "?Status=neu", target="_self");
						},
						error: function() {
							melde("Fehler: neuer Ort nicht erstellt");
						 }
					});
				}
			});
		}
	});
}

function erstelleNeuenRaum(hProjektId) {
	$db = $.couch.db("evab");
	var doc = {};
	doc.Typ = "hRaum";
	doc.User = User;
	doc.hProjektId = hProjektId;
	//Daten aus höheren Hierarchiestufen ergänzen
	$db = $.couch.db("evab");
	$db.openDoc(doc.hProjektId, {
		success: function(Projekt) {
			for (i in Projekt) {
				//ein paar Felder wollen wir nicht
				if (['_id', '_rev', '_conflict', 'Typ', 'User', '_attachments'].indexOf(i) == -1) {
					doc[i] = Projekt[i];
				}
			}
			//speichern
			$db.saveDoc(doc, {
				success: function(data) {
					window.open("../hRaumEdit/" + data.id + "?Status=neu", target="_self");
				},
				error: function() {
					melde("Fehler: neuer Raum nicht erstellt");
				 }
			});
		}
	});
}

function erstelleNeuesProjekt(Pfad) {
	var hProjekt = {};
	hProjekt.Typ = "hProjekt";
	hProjekt.User = User;
	$db.saveDoc(hProjekt, {
		success: function(data) {
			window.open(Pfad + "hProjektEdit/" + data.id + "?Status=neu", target="_self");
		},
		error: function() {
			melde("Fehler: neues Projekt nicht erstellt");
		 }
	});
}

function öffneMeineEinstellungen(User, Pfad) {
	$db.view('evab/User?key="' + User + '"', {
		success: function(data) {
			UserId = data.rows[0].value._id;
			window.open(Pfad + "_show/UserEdit/" + UserId, target="_self");
		}
	});
}

function löscheDokument(DocId) {
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
}

Function.prototype.andThen=function(g) {
  var f=this;
  return function() {
    f();g();
  }
};

function Manager() {
  this.callback=function () {}; // do nothing
  this.registerCallback=function(callbackFunction) {
    this.callback=(this.callback).andThen(callbackFunction);
  }
}

//generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id der Beobachtung, User, Artgruppe
function erstelleBeobEdit(ID, aArtGruppe, User) {
	$("#BeobEditFormHtml").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeBeob', {
		success: function(Feldliste) {
			$db.openDoc(ID, {
				success: function(Beob) {
					var HtmlContainer = generiereHtmlFuerBeobEditForm (User, aArtGruppe, Feldliste, Beob);
					//nur anfügen, wenn Felder erstellt wurden
					if (HtmlContainer != "") {
						HtmlContainer = "<hr />" + HtmlContainer;
						$("#BeobEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
						if (get_url_param("Status") == "neu") {
							//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
							speichereAlles();
						}
					}
					$("#Hinweistext").html("");
					erstelleAttachments(ID);
					//in neuen Datensätzen verorten
					if (get_url_param("Status") == "neu") {
						GetGeolocation();
					}
				}
			});
		}
	});
}

//generiert das Html für das Formular in BeobEdit.html
//erwartet Feldliste als Objekt; Beob als Objekt, Artgruppe
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerBeobEditForm (User, ArtGruppe, Feldliste, Beob) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	var Status = get_url_param("Status");
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User == User || Feld.User == "ZentrenBdKt") && Feld.SichtbarImModusEinfach.indexOf(User) != -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) == -1) {
			//In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
			if (Feld.Hierarchiestufe != "Art" || Feld.ArtGruppe.indexOf(ArtGruppe)>=0) {
				if (Status == "neu" && Feld.Standardwert) {
					FeldWert = eval("Feld.Standardwert." + User) || "";
				} else {
					FeldWert = (eval("Beob." + FeldName) || "");
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
//Mitgeben: id des Projekts, User
function erstelle_hProjektEdit(ID, User) {
	$("#hProjektEditFormHtml").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeProjekt', {
		success: function(Feldliste) {
			$db.openDoc(ID, {
				success: function(Projekt) {
					var HtmlContainer = generiereHtmlFuerProjektEditForm (User, Feldliste, Projekt);
					//nur anfügen, wenn Felder erstellt wurden
					if (HtmlContainer != "") {
						HtmlContainer = "<hr />" + HtmlContainer;
						$("#hProjektEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
						if (get_url_param("Status") == "neu") {
							//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
							speichern("../../");
						}
					}
					$("#Hinweistext").html("");
					erstelleAttachments(ID);
				}
			});
		}
	});
}

//generiert das Html für das Formular in hProjektEdit.html
//erwartet Feldliste als Objekt; Projekt als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerProjektEditForm (User, Feldliste, Projekt) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	var Status = get_url_param("Status");
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User == User || Feld.User == "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(User) != -1 && FeldName != "pName") {
			if (Status == "neu" && Feld.Standardwert) {
				FeldWert = eval("Feld.Standardwert." + User) || "";
			} else {
				FeldWert = (eval("Projekt." + FeldName) || "");
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

//generiert in hRaumEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Raums, User
function erstelle_hRaumEdit(ID, User) {
	$("#hRaumEditFormHtml").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeRaum', {
		success: function(Feldliste) {
			//Holt den Raum mit der id "ID" aus der DB
			$db.openDoc(ID, {
				success: function(Raum) {
					var HtmlContainer = generiereHtmlFuerRaumEditForm (User, Feldliste, Raum);
					//nur anfügen, wenn Felder erstellt wurden
					if (HtmlContainer != "") {
						HtmlContainer = "<hr />" + HtmlContainer;
						$("#hRaumEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
						if (get_url_param("Status") == "neu") {
							//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
							speichern("../../");
						}
					}
					$("#Hinweistext").html("");
					erstelleAttachments(ID);
				}
			});
		}
	});
}

//generiert das Html für das Formular in hRaumEdit.html
//erwartet Feldliste als Objekt; Raum als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerRaumEditForm (User, Feldliste, Raum) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	var Status = get_url_param("Status");
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User == User || Feld.User == "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(User) != -1 && FeldName != "rName") {
			if (Status == "neu" && Feld.Standardwert) {
				FeldWert = eval("Feld.Standardwert." + User) || "";
			} else {
				FeldWert = (eval("Raum." + FeldName) || "");
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

//generiert in hOrtEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id des Orts, User
function erstelle_hOrtEdit(ID, User) {
	$("#hOrtEditFormHtml").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeOrt', {
		success: function(Feldliste) {
			$db.openDoc(ID, {
				success: function(Ort) {
					var HtmlContainer = generiereHtmlFuerOrtEditForm (User, Feldliste, Ort);
					if (HtmlContainer != "") {
						HtmlContainer = "<hr />" + HtmlContainer;
						$("#hOrtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
						if (get_url_param("Status") == "neu") {
							//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
							speichern("KeineMeldung");
						}
					}
					$("#Hinweistext").html("");
					erstelleAttachments(ID);
					if (get_url_param("Status") == "neu") {
						//in neuen Datensätzen verorten
						GetGeolocation();
					}
				}
			});
		}
	});
}

//generiert das Html für das Formular in hOrtEdit.html
//erwartet Feldliste als Objekt; Ort als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerOrtEditForm (User, Feldliste, Ort) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	var Status = get_url_param("Status");
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User == User || Feld.User == "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(User) != -1 && (FeldName != "oName") && (FeldName != "oXKoord") && (FeldName != "oYKoord") && (FeldName != "oLagegenauigkeit")) {
			if (Status == "neu" && Feld.Standardwert) {
				FeldWert = eval("Feld.Standardwert." + User) || "";
			} else {
				FeldWert = (eval("Ort." + FeldName) || "");
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

//generiert in hZeitEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
//Mitgeben: id der Zeit, User
function erstelle_hZeitEdit(ID, User) {
	$("#hZeitEditFormHtml").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeZeit', {
		success: function(Feldliste) {
			$db.openDoc(ID, {
				success: function(Zeit) {
					var HtmlContainer = generiereHtmlFuerZeitEditForm (User, Feldliste, Zeit);
					if (HtmlContainer != "") {
						HtmlContainer = "<hr />" + HtmlContainer;
						$("#hZeitEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
						if (get_url_param("Status") == "neu") {
							//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
							speichern("../../");
						}
					}
					$("#Hinweistext").html("");
					erstelleAttachments(ID);
				}
			});
		}
	});
}

//generiert das Html für das Formular in hZeitEdit.html
//erwartet Feldliste als Objekt; Zeit als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerZeitEditForm (User, Feldliste, Zeit) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	var Status = get_url_param("Status");
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User == User || Feld.User == "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(User) != -1 && FeldName != "zDatum" && FeldName != "zUhrzeit") {
			if (Status == "neu" && Feld.Standardwert) {
				FeldWert = eval("Feld.Standardwert." + User) || "";
			} else {
				FeldWert = (eval("Zeit." + FeldName) || "");
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
}

//generiert in hArtEdit.html dynamisch die Artgruppen-abhängigen Felder
//Mitgeben: id der Art, Artgruppe
function erstelle_hArtEdit(ID, aArtGruppe, User) {
	$("#hArtEditFormHtml").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeArt', {
		success: function(Feldliste) {
			$db.openDoc(ID, {
				success: function(Beobachtung) {
					var HtmlContainer = generiereHtmlFuerhArtEditForm (User, aArtGruppe, Feldliste, Beobachtung);
					if (HtmlContainer != "") {
						HtmlContainer = "<hr />" + HtmlContainer;
						$("#hArtEditFormHtml").html(HtmlContainer).trigger("create").trigger("refresh");
						if (get_url_param("Status") == "neu") {
							//in neuen Datensätzen dynamisch erstellte Standardwerte speichern
							speichern();
						}
					}
					$("#Hinweistext").html("");
					erstelleAttachments(ID);
				}
			});
		}
	});
}

//generiert das Html für Formular in hArtEdit.html
//erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
//der HtmlContainer wird zurück gegeben
function generiereHtmlFuerhArtEditForm (User, ArtGruppe, Feldliste, Beobachtung) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	var Status = get_url_param("Status");
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		//nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
		if ((Feld.User == User || Feld.User == "ZentrenBdKt") && Feld.SichtbarImModusHierarchisch.indexOf(User) != -1 && Feld.ArtGruppe.indexOf(ArtGruppe)>=0 && (FeldName != "aArtId") && (FeldName != "aArtGruppe") && (FeldName != "aArtName")) {
			if (Status == "neu" && Feld.Standardwert) {
				FeldWert = eval("Feld.Standardwert." + User) || "";
			} else {
				FeldWert = (eval("Beobachtung." + FeldName) || "");
			}
			FeldBeschriftung = Feld.FeldBeschriftung || FeldName;
			Optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'];
			HtmlContainer += generiereHtmlFuerFormularelement(Feld, FeldName, FeldBeschriftung, FeldWert, Optionen, Feld.InputTyp, SliderMinimum, SliderMaximum);
		}
	}
	return HtmlContainer;
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
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp) {
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

//generiert den html-Inhalt für Slider
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum) {
	var HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
	HtmlContainer += FeldName;
	HtmlContainer += '">';
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += ':</label>\n\t<input class="speichernSlider" type="range" name="';
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
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerTextarea(FeldName, FeldBeschriftung, FeldWert) {
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
}

//generiert den html-Inhalt für Toggleswitch
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='";
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
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerCheckbox(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += generiereHtmlFuerCheckboxOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
}

//generiert den html-Inhalt für Optionen von Checkbox
//wird von generiereHtmlFuerCheckbox aufgerufen
function generiereHtmlFuerCheckboxOptionen(FeldName, FeldWert, Optionen) {
	var i;
	var HtmlContainer = "";
	for(i in Optionen) {
		var Option = Optionen[i];
		var ListItem = "\n\t\t\t<label for='";
		ListItem += Option;
		ListItem += "'>";
		ListItem += Option;
		ListItem += "</label>\n\t\t\t<input type='checkbox' name='";
		ListItem += FeldName;
		ListItem += "' id='";
		ListItem += Option;
		ListItem += "' value='";
		ListItem += Option;
		ListItem += "' class='custom speichern'";
		if(FeldWert.indexOf(Option) >=0) {
			ListItem += " checked='checked'";
		}
		ListItem += "/>";
		HtmlContainer += ListItem;
	}
	return HtmlContainer;
}

//generiert den html-Inhalt für Radio
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerRadio(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<fieldset data-role='controlgroup'>\n\t\t<legend>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</legend>";
	HtmlContainer += generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</fieldset>\n</div>";
	return HtmlContainer;
}

//generiert den html-Inhalt für Optionen von Radio
//wird von generiereHtmlFuerRadio aufgerufen
function generiereHtmlFuerRadioOptionen(FeldName, FeldWert, Optionen) {
	var i;
	var HtmlContainer = "";
	for(i in Optionen) {
		var Option = Optionen[i];
		var ListItem = "\n\t\t\t<label for='";
		ListItem += Option;
		ListItem += "'>";
		ListItem += Option;
		ListItem += "</label>\n\t\t\t<input class='speichern' type='radio' name='";
		ListItem += FeldName;
		ListItem += "' id='";
		ListItem += Option;
		ListItem += "' value='";
		ListItem += Option;
		if(FeldWert == Option){
			ListItem += "' checked='checked";
		}
		ListItem += "'/>";
		HtmlContainer += ListItem;
	}
	return HtmlContainer;
}

//generiert den html-Inhalt für Selectmenus
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen, MultipleSingleSelect) {
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
	if(MultipleSingleSelect == "MultipleSelect"){
		HtmlContainer += " multiple='multiple'";
	}
	HtmlContainer += " class='speichern'>";
	if(MultipleSingleSelect == "MultipleSelect"){
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
	var i;
	var HtmlContainer = "\n\t\t<option value=''></option>";
	for(i in Optionen) {
		var Option = Optionen[i];
		var ListItem = "\n\t\t<option value='";
		ListItem += Option;
		ListItem += "' class='speichern'";
		if(FeldWert == Option){
			ListItem += " selected='selected'";
		}
		ListItem += ">";
		ListItem += Option;
		ListItem += "</option>";
		HtmlContainer += ListItem;
	}
	return HtmlContainer;
}

//generiert den html-Inhalt für Optionen von MultipleSelect
//wird von generiereHtmlFuerSelectmenu aufgerufen
//FeldWert ist ein Array
function generiereHtmlFuerMultipleselectOptionen(FeldName, FeldWert, Optionen) {
	var i;
	var HtmlContainer = "\n\t\t<option value=''></option>";
	for(i in Optionen) {
		var Option = Optionen[i];
		var ListItem = "\n\t\t<option value='";
		ListItem += Option;
		ListItem += "' class='speichern'";
		if(FeldWert.indexOf(Option)!=-1){
			ListItem += " selected='selected'";
		}
		ListItem += ">";
		ListItem += Option;
		ListItem += "</option>";
		HtmlContainer += ListItem;
	}
	return HtmlContainer;
}

(function($) {
    // friendly helper http://tinyurl.com/6aow6yn
    //Läuft durch alle Felder im Formular
    //Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
    //nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
        	if (this.value != "") {
	            if (o[this.name]) {
	                if (!o[this.name].push) {
	                    o[this.name] = [o[this.name]];
	                }
	                o[this.name].push(this.value);
	            } else {
	            	//verhindern, dass Nummern in Strings verwandelt werden
	            	if (this.value > -999999999 && this.value < 999999999) {
	            		o[this.name] = parseInt(this.value);
	            	} else {
	                	o[this.name] = this.value;
	                }
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
	while (new Date() < ms){}
} 

//Position ermitteln
function onGeolocationSuccess(position) {
	//Koordinaten nur behalten, wenn Mindestgenauigkeit erreicht ist
	var oLagegenauigkeit = position.coords.accuracy;
	if (oLagegenauigkeit < 100) {
		oLongitudeDecDeg = position.coords.longitude;
		oLatitudeDecDeg = position.coords.latitude;
		var Höhe = position.coords.altitude;
		$("input#oLagegenauigkeit").val(oLagegenauigkeit);
		var x = DdInChX(oLatitudeDecDeg, oLongitudeDecDeg);
		var y = DdInChY(oLatitudeDecDeg, oLongitudeDecDeg);
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

//onError Callback receives a PositionError object
function onGeolocationError(error) {
	melde("Keine Position erhalten" + "\n" + error.message);
	stopGeolocation();
}

//Options: retrieve the location every 3 seconds
watchID = null;
function GetGeolocation() {
	$("input#oXKoord").val("Position ermitteln...");
	$("input#oYKoord").val("Position ermitteln...");
	$("input#oLagegenauigkeit").val("Position ermitteln...");
	watchID = navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, { frequency: 3000, enableHighAccuracy: true });
	//nach spätestens 30 Sekunden aufhören zu messen
	setTimeout("stopGeolocation()", 30000);
	return watchID;
}

function stopGeolocation() {
    if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        if ($("input#oXKoord").val() == "Position ermitteln...") {
        	$("input#oXKoord").val("");
			$("input#oYKoord").val("");
        	$("input#oLagegenauigkeit").val("");
        	melde("Keine genaue Position erhalten");
        }
        speichern();
    }
}

function speichereLetzteUrl(User) {
//empfängt User und Name der letzten Ansicht
//speichert diese im Userdokument
//damit kann bei erneuter Anmeldung die letzte Ansicht wiederhergestellt werden
//host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
//UserId wird zurück gegeben. Wird meist benutzt, um im Menü meine Einstellungen zu öffnen
	var url = window.location.pathname + window.location.search;
	$db.view('evab/User?key="' + User + '"', {
		success: function(data) {
			var UserId = data.rows[0].value._id;
			$db.openDoc(UserId, {
				success: function(doc) {
					//nur speichern, wenn anders als zuletzt
					if (doc.LetzteUrl != url) {	
						doc.LetzteUrl = url;
						$db.saveDoc(doc);
					}
				}
			});
		}
	});
}

/*! A fix for the iOS orientationchange zoom bug.
 Script by @scottjehl, rebound by @wilto.
 MIT License.
*/
(function(w){
    var doc = w.document;

    if( !doc.querySelector ){ return; }

    var meta = doc.querySelector( "meta[name=viewport]" ),
        initialContent = meta && meta.getAttribute( "content" ),
        disabledZoom = initialContent + ", maximum-scale=1",
        enabledZoom = initialContent + ", maximum-scale=10",
        enabled = true,
        orientation = w.orientation,
        rotation = 0;

    if( !meta ){ return; }

    function restoreZoom(){
        meta.setAttribute( "content", enabledZoom );
        enabled = true;
    }

    function disableZoom(){
        meta.setAttribute( "content", disabledZoom );
        enabled = false;
    }

    function checkTilt( e ){
        orientation = Math.abs( w.orientation );
        rotation = Math.abs( e.gamma );

        if( rotation > 8 && orientation === 0 ){
            if( enabled ){
                disableZoom();
            }   
        }
        else {
            if( !enabled ){
                restoreZoom();
            }
        }
    }

    w.addEventListener( "orientationchange", restoreZoom, false );
    w.addEventListener( "deviceorientation", checkTilt, false );

})( this );

function erstelleKarteFürRaum(User, RaumId) {
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hRaumOrteFuerKarte?startkey=["' + User + '", "' + RaumId + '"]&endkey=["' + User + '", "' + RaumId + '" ,{}]&include_docs=true', {
		success: function(data) {
			var i;
			var anzOrt = 0;
			var Ort;
			var infowindow = new google.maps.InfoWindow();
			for(i in data.rows) {
				//Orte zählen
				anzOrt += 1;
			}
			if (anzOrt == 0) {
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
				google.maps.event.trigger(map,'resize');
				var bounds = new google.maps.LatLngBounds();
				//für alle Orte Marker erstellen
				var markers = [];
				for(i in data.rows) {
					Ort = data.rows[i].doc;
					var hOrtId = Ort._id;
					var oName = Ort.oName;
					var oXKoord = Ort.oXKoord;
					var oYKoord = Ort.oYKoord;
					var lat2 = Ort.oLatitudeDecDeg;
					var lng2 = Ort.oLongitudeDecDeg;
					var externalPage = "../../_show/hOrtEdit/" + hOrtId;
					var latlng2 = new google.maps.LatLng(lat2, lng2);
					if (anzOrt == 1) {
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
				if (anzOrt == 1) {
					//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
					map.setCenter(latlng);
					map.setZoom(18);
				} else {
					//Karte auf Ausschnitt anpassen
					map.fitBounds(bounds);
				}
			}
			function makeListener(map, marker, contentString) {
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(contentString);
					infowindow.open(map,marker);
				});
			}
		}
	});
}

function erstelleKarteFürProjekt(User, ProjektId) {
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hProjektOrteFuerKarte?startkey=["' + User + '", "' + ProjektId + '"]&endkey=["' + User + '", "' + ProjektId + '" ,{}]&include_docs=true', {
		success: function(data) {
			var i;
			var anzOrt = 0;
			var Ort;
			var infowindow = new google.maps.InfoWindow();
			for(i in data.rows) {
				//Orte zählen
				anzOrt += 1;
			}
			if (anzOrt == 0) {
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
				for(i in data.rows) {
					Ort = data.rows[i].doc;
					var hOrtId = Ort._id;
					var oName = Ort.oName;
					var oXKoord = Ort.oXKoord;
					var oYKoord = Ort.oYKoord;
					var lat2 = Ort.oLatitudeDecDeg;
					var lng2 = Ort.oLongitudeDecDeg;
					var externalPage = "../../_show/hOrtEdit/" + hOrtId;
					var latlng2 = new google.maps.LatLng(lat2, lng2);
					if (anzOrt == 1) {
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
				if (anzOrt == 1) {
					//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
					map.setCenter(latlng);
					map.setZoom(18);
				} else {
					//Karte auf Ausschnitt anpassen
					map.fitBounds(bounds);
				}
			}
			function makeListener(map, marker, contentString) {
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(contentString);
					infowindow.open(map,marker);
				});
			}
		}
	});
}

function erstelleKarteFürProjektliste(User) {
	$db = $.couch.db("evab");
	//Zuerst Orte abfragen
	$db.view('evab/hProjektlisteOrteFuerKarte?key="' + User + '"&include_docs=true', {
		success: function(data) {
			var i;
			var anzOrt = 0;
			var Ort;
			var infowindow = new google.maps.InfoWindow();
			for(i in data.rows) {
				//Orte zählen
				anzOrt += 1;
			}
			if (anzOrt == 0) {
				//Keine Orte: Hinweis und zurück
				melde("Es gibt keine Orte mit Koordinaten");
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
				for(i in data.rows) {
					Ort = data.rows[i].doc;
					var hOrtId = Ort._id;
					var oName = Ort.oName;
					var oXKoord = Ort.oXKoord;
					var oYKoord = Ort.oYKoord;
					var lat2 = Ort.oLatitudeDecDeg;
					var lng2 = Ort.oLongitudeDecDeg;
					var externalPage = "_show/hOrtEdit/" + hOrtId;
					var latlng2 = new google.maps.LatLng(lat2, lng2);
					if (anzOrt == 1) {
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
				if (anzOrt == 1) {
					//map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
					map.setCenter(latlng);
					map.setZoom(18);
				} else {
					//Karte auf Ausschnitt anpassen
					map.fitBounds(bounds);
				}
			}
			function makeListener(map, marker, contentString) {
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(contentString);
					infowindow.open(map,marker);
				});
			}
		}
	});
}

//speichert Anhänge
//setzt ein passendes Formular mit den feldern _rev und _attachments voraus
//wird benutzt von: BeobEdit.html
function speichereAnhänge(id) {
	$db.openDoc(id, {
		success: function(data) {
			$("#_rev").val(data._rev);
			$("#FormAnhänge").ajaxSubmit({
			    url: "/evab/" + id,
			    success: function() {
			    	//show attachments in form
			    	erstelleAttachments(id);
			    },
			    error: function() {
			    	//da form.jquery.js einen Fehler hat, meldet es einen solchen zurück, obwohl der Vorgang funktioniert!
			    	erstelleAttachments(id);
			    }
			});
		}
	});
}

//erstellt Anhänge
//setzt ein passendes Formular mit dem Feld_attachments und eine div namens Anhänge voraus
//wird benutzt von allen Beobachtungs-Edit-Formularen
//Status wird benötigt, weil .trigger create nur beim ersten mal funktioniert
function erstelleAttachments(id) {
	$db.openDoc(id, {
		success: function(doc) {
			var attachments = doc._attachments;
			var rev = doc._rev;
			var HtmlContainer = "";
			if (attachments) {
				$.each(attachments, function(Dateiname, val) {
					var url = "/evab/" + id + "/" + Dateiname;
					var url_zumLöschen = url + "?" + rev;    //theoretisch kann diese rev bis zum Löschen veraltet sein, praktisch kaum
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
			$.mobile.fixedToolbars.show(true);
		}
	});
}

//kreiert ein neues Feld
//erwartet den Teil des Pfads, der links von FeldEdit ist
function neuesFeld(User, Pfad) {
	$db = $.couch.db("evab");
	var Feld = {};
	Feld.Typ = "Feld";
	Feld.User = User;
	Feld.SichtbarImModusEinfach = [];
	Feld.SichtbarImModusHierarchisch = [];
	//gleich sichtbar stellen
	Feld.SichtbarImModusEinfach.push(User);
	Feld.SichtbarImModusHierarchisch.push(User);
	$db.saveDoc(Feld, {
		success: function(data) {
			var id = data.id;
			var zurueck = get_url_param("zurueck");
			window.open(Pfad + "FeldEdit/" + id + "?Status=neu?zurueck=" + zurueck, target="_self");
		},
		error: function() {
			melde("Fehler: Feld nicht erzeugt");
		}
	});
}
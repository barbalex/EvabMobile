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

//ArtgruppenListe in Artgruppenliste.html wird aufgebaut
//Status ist Neu oder Edit, damit BeobListe.html und hArtListe.html (Neu) bzw. BeobEdit.html und hArtEdit.html individuell reagieren können
function erstelleArtgruppenliste(Status) { 
	var viewname = "evab/Artgruppen";
	$db.view(viewname, {
		success: function(data) {
			var i;
			var ListItemContainer = "";
			var ArtGruppe;
			for(i in data.rows) {
				ArtGruppe = data.rows[i].key;
				ListItemContainer += "<li name=\"ArtgruppenListItem" + Status + "\" id=\"" + ArtGruppe + "\">" +
				"<a href=\"#\">" +
				"<h3>" + ArtGruppe + "<\/h3>" +
				"<\/a> <\/li>";
			}
			ListItemContainer += "<\/ul>";
			$("#ArtgruppenListe").html(ListItemContainer);
			$("#ArtgruppenListe").listview();
			$("#ArtgruppenListe").listview("refresh");
		}
	});
}

//ArtenListe in Artenliste.html wird aufgebaut
//Status ist Neu oder Edit, damit BeobListe.html (Neu) und BeobEdit.html individuell reagieren können
function erstelleArtliste(ArtGruppe, Status, PfadIn) { 
	var viewname = "evab/Artliste" + ArtGruppe;
	var Pfad = PfadIn || "";
	$db.view(viewname, {
		success: function(data) {
			var i;
			var ListItemContainer = "";
			var ArtBezeichnung;
			var Art;
			var ArtId;
			var HinweisVerwandschaft;
			for(i in data.rows) {
				ArtBezeichnung = data.rows[i].key;
				Art = data.rows[i].value;
				ArtId = Art._id;
				if(Art.HinweisVerwandschaft){
					ListItemContainer += "<li name=\"ArtListItem" + Status + "\" ArtBezeichnung=\"" + ArtBezeichnung + "\" ArtId=\"" + ArtId + "\" aArtGruppe=\"" + ArtGruppe + "\" Pfad=\"" + Pfad + "\">" +
					"<a href=\"#\">" +
					"<h3>" + ArtBezeichnung + "<\/h3>" +
					"<p>" + Art.HinweisVerwandschaft + "<\/p>" +
					"<\/a> <\/li>";
				}else{
					ListItemContainer += "<li name=\"ArtListItem" + Status + "\" ArtBezeichnung=\"" + ArtBezeichnung + "\" ArtId=\"" + ArtId + "\" aArtGruppe=\"" + ArtGruppe + "\" Pfad=\"" + Pfad + "\">" +
					"<a href=\"#\">" +
					"<h3>" + ArtBezeichnung + "<\/h3>" +
					"<\/a> <\/li>";
				}
			}
			ListItemContainer += "<\/ul>";
			$("#ArtenListe").html(ListItemContainer);
			$("#ArtenListe").listview();
			$("#ArtenListe").listview("refresh");
		}
	});
}

function speichereNeueBeobachtung(Pfad, User, aArtGruppe, aArtBezeichnung, aArtId) {
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html oder BeobEdit.html
	var doc = {};
	doc.Modus = "einfach";
	doc.Typ = "Beobachtung";
	doc.User = User;
	doc.aArtGruppe = aArtGruppe;
	doc.aArtName = aArtBezeichnung;
	doc.aArtId = aArtId;
	doc.zDatum = erstelleNeuesDatum();          //GEHT DAS AUF MOBILGERÄTEN ZU LANGE?????????????
	doc.zZeit = erstelleNeueUhrzeit();
	$db.saveDoc(doc, {
		success: function(data) {
			//$.mobile.changePage(Pfad + "_show/BeobEdit/" + data.id + "?Status=neu", {transition: "slide", reverse: "false", showLoadMsg: "true", reloadPage: "true"});
			window.open("_show/BeobEdit/" + data.id + "?Status=neu", target="_self");
			//$("#BeobEditPage").page();
		},
		error: function() {
			melde("Die Beobachtung konnte nicht gespeichert werden.");
		}
	});
}

function speichereNeueBeobachtungHierarchisch(ProjektId, RaumId, OrtId, ZeitId, User, aArtGruppe, aArtName, aArtId) {
//Neue hierarchische Beobachtungen werden gespeichert
//ausgelöst durch hArtListe.html oder hArtEdit.html
	var doc = {};
	doc.Typ = "hArt";
	doc.User = User;
	doc.ProjektId = ProjektId;
	doc.RaumId = RaumId;
	doc.OrtId = OrtId;
	doc.ZeitId = ZeitId;
	doc.aArtGruppe = aArtGruppe;
	doc.aArtName = aArtName;
	doc.aArtId = aArtId;
	doc.aMeldungTyp = "Feldbeobachtung";
	$db.saveDoc(doc, {
		success: function(data) {
			window.open("_show/hArtEdit/" + data.id + "?Status=neu", target="_self");
		},
		error: function() {
			melde("Die Art konnte nicht gespeichert werden.");
		}
	});
}

function setzeAutor() {
	$db.view('evab/User?key="' + User + '"', {
		success: function(data) {
			var doc;
			doc = data.rows[0].value;
			var aAutor = doc.Autor;
			$("input#aAutor").val(aAutor);
		}
	});
}

//Menü aufbauen. Wird aufgerufen von allen Formularen in evab/_attachments
function erstelleMenu(thiz, User, UserId, Pfad) {
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
    	'buttons' : {
		 	'hierarchischer Modus': {
		      	click: function () {
		        	window.open(Pfad + "hProjektListe.html", target="_self");
        		},
        		theme: "a",
        		icon: "check"
      		},
		 	'neu anmelden': {
		      	click: function () {
		        	window.open(Pfad + "index.html", target="_self");
        		},
        		theme: "a",
        		icon: "home"
      		},
      		'meine Einstellungen': {
		      	click: function () {
		        	window.open(Pfad + "_show/UserEdit/" + UserId, target="_self");
        		},
        		theme: "a",
        		icon: "gear"
      		},
      		'lokal installieren': {
		      	click: function () {
		        	window.open(Pfad + "Installieren.html", target="_self");
        		},
        		theme: "a",
        		icon: "gear"
      		},
      		'Beobachtungen exportieren': {
		      	click: function () {
		        	window.open(Pfad + '_list/BeobExport/BeobListeUser?key="' + User + '"');
        		},
        		theme: "a",
        		icon: "arrow-r"
      		},
      		'Datenfelder verwalten': {
		      	click: function () {
		        	window.open(Pfad + "FeldListe.html", target="_self");
        		},
        		theme: "a",
        		icon: "grid"
      		},
      		'schliessen': {
                click: function () { return true; },
                icon: "back",
                theme: "c"
            }
    	}
  	})
}

//Menü aufbauen. Wird aufgerufen von allen Formularen in evab/templates
function erstelleMenuHierarchisch(thiz, User, UserId, Pfad){
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
    	'buttons' : {
		 	'einfacher Modus': {
		      	click: function () {
		        	window.open(Pfad + "BeobListe.html", target="_self");
        		},
        		theme: "a",
        		icon: "check"
      		},
      		'neu anmelden': {
		      	click: function () {
		        	window.open(Pfad + "index.html", target="_self");
        		},
        		theme: "a",
        		icon: "home"
      		},
      		'meine Einstellungen': {
		      	click: function () {
		        	window.open(Pfad + "_show/UserEdit/" + UserId, target="_self");
        		},
        		theme: "a",
        		icon: "gear"
      		},
      		'lokal installieren': {
		      	click: function () {
		        	window.open(Pfad + "Installieren.html", target="_self");
        		},
        		theme: "a",
        		icon: "gear"
      		},
      		'Beobachtungen exportieren': {
		      	click: function () {
		        	window.open(Pfad + '_list/BeobExportHierarchisch/hArtListeExport?startkey=["' + User + '", {}, {}, {}, {}, {}]&endkey=["' + User + '"]&descending=true');
        		},
        		theme: "a",
        		icon: "arrow-r"
      		},
      		'Datenfelder verwalten': {
		      	click: function () {
		        	window.open(Pfad + "FeldListe.html", target="_self");
        		},
        		theme: "a",
        		icon: "grid"
      		},
      		'schliessen': {
                click: function () { return true; },
                icon: "back",
                theme: "c"
            }
    	}
  	})
}

//Menü aufbauen. Wird aufgerufen von Feldliste.html, FeldEdit.html und FeldRead.html
function erstelleMenuFürFelder(thiz, Pfad) {
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
    	'buttons' : {
      		'Datenfelder exportieren': {
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

//BeobListe in BeobList.html vollständig neu aufbauen. Wird aufgerufen von: BeobListe.html, BeobEdit.html
//Pfad muss mitgegeben werden, weil sonst beim Aufruf von BeobEdit der Pfad zu den Bildern nicht klappt...
function aktualisiereBeobListe(Pfad, User) {
	$("#beobachtungen").empty();
	$db.view('evab/BeobListe?startkey=["' + User + '"]&endkey=["' + User + '",{}]', {
		success: function(data) {
			var i;
			var anzBeob = 0;
			var beob;
			var ListItemContainer = "";
			for(i in data.rows) {                    //Beobachtungen zählen
				anzBeob += 1;
			}

			var Titel2 = " Beobachtungen";           //Im Titel der Seite die Anzahl Beobachtungen anzeigen
			if (anzBeob == 1) {
				Titel2 = " Beobachtung";
			}
			$("#BeobListePageHeader .BeobListePageTitel").text(anzBeob + Titel2);

			if (anzBeob == 0) {
				ListItemContainer = '<li><a href="javascript:erstelleNeuBeob_1_Artgruppenliste()" data-transition="slideup" rel="external">Erste Beobachtung erfassen</a></li>';
			} else {
				data.rows.reverse();                 //zuletzt erfasste sind zuoberst
				for(i in data.rows) {                //Liste aufbauen
					beob = data.rows[i].value;
					key = data.rows[i].key;
					var Datum = beob.zDatum;
					var Zeit = beob.zZeit;
					var ArtGruppe = beob.aArtGruppe;
					var ImageLink = Pfad + "Artgruppenbilder/" + ArtGruppe + ".png";
					var ArtName = beob.aArtName;
					var externalPage = "_show/BeobEdit/" + beob._id;
					ListItemContainer += "<li class=\"beob ui-li-has-thumb\" id=\"";
					ListItemContainer += beob._id;
					ListItemContainer += "\"><a href=\"",
					ListItemContainer += externalPage;
					ListItemContainer += "\" rel=\"external\"><img class=\"ui-li-thumb\" src=\"";
					ListItemContainer += ImageLink;
					ListItemContainer += "\" /><h3 class=\"aArtName\">";
					ListItemContainer += ArtName;
					ListItemContainer += "<\/h3><p class=\"zZeit\">";
					ListItemContainer += Datum;
					ListItemContainer += "&nbsp; &nbsp;";
					ListItemContainer += Zeit;
					ListItemContainer += "<\/p><\/a> <\/li>";
				}
			}
			ListItemContainer += "<\/ul>";
			$("#beobachtungen").html(ListItemContainer);
			$("#beobachtungen").listview();
			$("#beobachtungen").listview("refresh");
		}
	});
}

function erstelleNeueZeit(User, ProjektId, RaumId, OrtId) {
	var doc = {};
	doc.Typ = "hZeit";
	doc.User = User;
	doc.ProjektId = ProjektId;
	doc.RaumId = RaumId;
	doc.OrtId = OrtId;
	doc.zDatum = erstelleNeuesDatum();
	doc.zZeit = erstelleNeueUhrzeit();
	$db.saveDoc(doc, {
		success: function(data) {
			window.open("../hZeitEdit/" + data.id, target="_self");
		},
		error: function() {
			melde("Fehler: neue Zeit nicht gespeichert.");
		}
	});
}

function holeUserId(User) {
	$db.view('evab/User?key="' + User + '"', {
		success: function(data) {
			var doc;
			doc = data.rows[0].value;
			UserId = doc._id;
			return UserId;
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

//generiert in hArtEdit.html dynamisch die Artgruppen-abhängigen Felder
//Mitgeben: id der Art, Artgruppe, Artname
function erstelle_hArtEdit(ID, aArtGruppe, aArtName) {
	$("#hArtEditForm").empty();
	$db = $.couch.db("evab");
	//holt die Feldliste aus der DB
	$db.view('evab/FeldListeArt', {
		success: function(data) {
			var Feldliste = data;
			//Holt die Beobachtung mit der id "ID" aus der DB
			$db.view('evab/BeobachtungenNachId?key="' + ID + '"', {
				success: function(data) {
					var Beobachtung = data.rows[0].value;
					//alert("Beobachtung = " + Beobachtung);
					var HtmlContainer3 = generiereHtmlFuerhArtEditForm (aArtGruppe, Feldliste, Beobachtung);
					var HtmlContainer1 = generiereHtmlFuerArtgruppe(aArtGruppe);
					var HtmlContainer2 = generiereHtmlFuerArtname(aArtName);
					var HtmlContainer = HtmlContainer1 + HtmlContainer2 + HtmlContainer3;
					$("#hArtEditForm").html(HtmlContainer).trigger("create").trigger("refresh");
				},
				error: function() {
				}
			});
		},
		error: function() {
		}
	});
}

//generiert das Html für das Formular in hArtEdit.html
//erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt; HtmlContainer mit dessen aktuellen Stand
//der HtmlContainer wird ergänzt und zurück gegeben
function generiereHtmlFuerhArtEditForm (ArtGruppe, Feldliste, Beobachtung) {
	var Feld = {};
	var i;
	var FeldName;
	var FeldBeschriftung;
	var SliderMinimum;
	var SliderMaximum;
	var ListItem = "";
	var HtmlContainer = "";
	for(i in Feldliste.rows) {              
		Feld = Feldliste.rows[i].value;
		FeldName = Feld.FeldName;
		FeldWert = (eval("Beobachtung." + FeldName) || "");
		FeldBeschriftung = Feld.FeldBeschriftung;
		Optionen = Feld.Optionen || ['Bitte Optionen erfassen > Feldverwaltung'];
		InputTyp = Feld.InputTyp;
		ListItem = "";
		if (Feld.ArtGruppe.indexOf(ArtGruppe)>=0 && (FeldName != "aArtId") && (FeldName != "aArtGruppe") && (FeldName != "aArtName")) {  //aArtId soll nicht angezeigt werden
			switch(Feld.Formularelement) {
				case "textinput": 	
					ListItem = generiereHtmlFuerTextinput(FeldName, FeldBeschriftung, FeldWert, InputTyp);
					break;
				case "textarea":
					ListItem = generiereHtmlFuerTextarea(FeldName, FeldBeschriftung, FeldWert);
					break;
				case "toggleswitch":
					ListItem = generiereHtmlFuerToggleswitch(FeldName, FeldBeschriftung, FeldWert);
					break;
				case "checkbox":
					ListItem = generiereHtmlFuerCheckbox(FeldName, FeldBeschriftung, FeldWert, Optionen);
					break;
				case "selectmenu":
					ListItem = generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen);
					break;
				case "slider":
					SliderMinimum = Feld.SliderMinimum || 0;
					SliderMaximum = Feld.SliderMaximum || 100;
					ListItem = generiereHtmlFuerSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum);
					break;
				case "radio":
					ListItem = generiereHtmlFuerRadio(FeldName, FeldBeschriftung, FeldWert, Optionen);
					break;
			}
		}
		HtmlContainer += ListItem;
	}
	return HtmlContainer;
}

//generiert den html-Inhalt für aArtGruppe
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerArtgruppe(aArtGruppe) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='aArtGruppe' class='select'>Artgruppe:</label>\n\t";
	HtmlContainer += "<select name='aArtGruppe' id='aArtGruppe' data-icon='arrow-r' data-native-menu='true' value='";
	HtmlContainer += aArtGruppe;
	HtmlContainer += "'>\n\t\t<option value='"
	HtmlContainer += aArtGruppe;
	HtmlContainer += "'>";
	HtmlContainer += aArtGruppe;
	HtmlContainer += "</option>\n\t</select>\n</div>\n";
	return HtmlContainer;
}

//generiert den html-Inhalt für aArtName
//wird von erstelle_hArtEdit aufgerufen
//bekommt HtmlContainer, ergänzt ihn und gibt ihn zurück
function generiereHtmlFuerArtname(aArtName) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='aArtName' class='select'>Artname:</label>\n\t";
	HtmlContainer += "<select name='aArtName' id='aArtName' data-icon='arrow-r' data-native-menu='true' value='";
	HtmlContainer += aArtName;
	HtmlContainer += "'>\n\t\t<option value='";
	HtmlContainer += aArtName;
	HtmlContainer += "'>";
	HtmlContainer += aArtName;
	HtmlContainer += "</option>\n\t</select>\n</div>\n<hr />";
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
	HtmlContainer += '"/>\n</div>';
	return HtmlContainer;		
}

//generiert den html-Inhalt für Slider
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum) {
	var HtmlContainer = '<div data-role="fieldcontain">\n\t<label for="';
	HtmlContainer += FeldName;
	HtmlContainer += '">';
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += ':</label>\n\t<input x="y" type="range" name="';
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
	HtmlContainer += '">';
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
	HtmlContainer += "'>\n\t\t<option value='nein'>nein</option>\n\t\t<option value='ja'>ja</option>\n\t</select>\n</div>";
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
		ListItem += FeldWert;
		ListItem += "' class='custom'";
		if(FeldWert.indexOf(Optionen)>=0){
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
		ListItem += "</label>\n\t\t\t<input type='radio' name='";
		ListItem += FeldName;
		ListItem += "' id='";
		ListItem += Option;
		ListItem += "' value='";
		ListItem += FeldWert;
		if(FeldWert.indexOf(Optionen)>=0){
			ListItem += " checked='checked'";
		}
		ListItem += "'/>";
		HtmlContainer += ListItem;
	}
	return HtmlContainer;
}

//generiert den html-Inhalt für Selectmenus
//wird von erstelle_hArtEdit aufgerufen
function generiereHtmlFuerSelectmenu(FeldName, FeldBeschriftung, FeldWert, Optionen) {
	var HtmlContainer = "<div data-role='fieldcontain'>\n\t<label for='";
	HtmlContainer += FeldName;
	HtmlContainer += "' class='select'>";
	HtmlContainer += FeldBeschriftung;
	HtmlContainer += "</label>\n\t<select name='";
	HtmlContainer += FeldName;
	HtmlContainer += "' id='";
	HtmlContainer += FeldName;
	HtmlContainer += "' data-native-menu='false'>";
	HtmlContainer += generiereHtmlFuerSelectmenuOptionen(FeldName, FeldWert, Optionen);
	HtmlContainer += "\n\t</select>\n</div>";
	return HtmlContainer;	
}

//generiert den html-Inhalt für Optionen von Selectmenu
//wird von generiereHtmlFuerSelectmenu aufgerufen
function generiereHtmlFuerSelectmenuOptionen(FeldName, FeldWert, Optionen) {
	var i;
	var HtmlContainer = "\n\t\t<option value=''>Kein Eintrag</option>";
	for(i in Optionen) {
		var Option = Optionen[i];
		var ListItem = "\n\t\t<option value='";
		ListItem += Option;
		if(FeldWert.indexOf(Optionen)>=0){
			ListItem += " checked='checked'";
		}
		ListItem += "'>";
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
	while (new Date() < ms){}
} 
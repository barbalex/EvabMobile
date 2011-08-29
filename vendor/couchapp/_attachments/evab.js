/*
Diese Funktionen werden in evab auf mehreren Seiten benutzt
*/

function DatumNeu(){                               
	var jetzt = new Date();
	var Jahr = jetzt.getFullYear();
	var Mnt = jetzt.getMonth()+1;
	var MntAusgabe = ((Mnt < 10) ? "0" + Mnt : Mnt);
	var Tag = jetzt.getDate();
	var TagAusgabe = ((Tag < 10) ? "0" + Tag : Tag);
	var Datum = Jahr + "-" + MntAusgabe + "-" + TagAusgabe;
	return Datum;
};

function ZeitNeu(){                               
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

function MeldungEinzeilig(ErsteZeile) {
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + ErsteZeile +"</h1></div>")
	    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 150 })
	    .appendTo( $.mobile.pageContainer )
	    .delay( 2500 )
	    .fadeOut( 700, function(){
	    	$(this).remove();
		});
};

function MeldungZweizeilig(ErsteZeile, ZweiteZeile) {
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + ErsteZeile + "<br>" + ZweiteZeile +"</h1></div>")
	    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 150 })
	    .appendTo( $.mobile.pageContainer )
	    .delay( 2500 )
	    .fadeOut( 700, function(){
	    	$(this).remove();
		});
};

//ArtgruppenListe in Artgruppenliste.html wird aufgebaut
//Status ist Neu oder Edit, damit BeobListe.html (Neu) und BeobEdit.html individuell reagieren können
function ArtgruppenlisteAufbauen(Status){ 
	var viewname = "evab/Artgruppen";
	$db.view(viewname, {
		success: function(data) {
			var i;
			var ListItem;
			var ListItemContainer = "";
			var ArtGruppe;
			for(i in data.rows)
			{
				ArtGruppe = data.rows[i].key;
				ListItem = "<li name=\"ArtgruppenListItem" + Status + "\" id=\"" + ArtGruppe + "\">" +
				"<a href=\"#\">" +
				"<h3>" + ArtGruppe + "<\/h3>" +
				"<\/a> <\/li>";
				ListItemContainer = ListItemContainer + ListItem;
			}
			ListItemContainer = ListItemContainer + "<\/ul>";
			$("#ArtgruppenListe").append(ListItemContainer);
			$("#ArtgruppenListe").listview();
			$("#ArtgruppenListe").listview("refresh");
		}
	});
}

function ArtlisteAufbauen(ArtGruppe, Status)
//ArtenListe in Artenliste.html wird aufgebaut
//Status ist Neu oder Edit, damit BeobListe.html (Neu) und BeobEdit.html individuell reagieren können
{ 
	var viewname = "evab/Artliste" + ArtGruppe;
	$db.view(viewname, {
		success: function(data) {
			var i;
			var ListItem;
			var ListItemContainer = "";
			var ArtName;
			var Art;
			var ArtId;
			var HinweisVerwandschaft;
			for(i in data.rows)
			{
				ArtName = data.rows[i].key;
				Art = data.rows[i].value;
				ArtId = Art._id;
				if(Art.HinweisVerwandschaft){
					ListItem = "<li name=\"ArtListItem" + Status + "\" id=\"" + ArtName + "\" ArtId=\"" + ArtId + "\" aArtGruppe=\"" + ArtGruppe + "\">" +
					"<a href=\"#\">" +
					"<h3>" + ArtName + "<\/h3>" +
					"<p>" + Art.HinweisVerwandschaft + "<\/p>" +
					"<\/a> <\/li>";
				}else{
					ListItem = "<li name=\"ArtListItem" + Status + "\" id=\"" + ArtName + "\" ArtId=\"" + ArtId + "\" aArtGruppe=\"" + ArtGruppe + "\">" +
					"<a href=\"#\">" +
					"<h3>" + ArtName + "<\/h3>" +
					"<\/a> <\/li>";
				}
				ListItemContainer = ListItemContainer + ListItem;
			}
			ListItemContainer = ListItemContainer + "<\/ul>";
			$("#ArtenListe").append(ListItemContainer);
			$("#ArtenListe").listview();
			$("#ArtenListe").listview("refresh");
		}
	});
}

function BeobNeuSpeichern(User, aArtGruppe, aArtName, aArtId){
//Neue Beobachtungen werden gespeichert
//ausgelöst durch BeobListe.html oder BeobEdit.html
	var doc = {};
	doc.Modus = "einfach";
	doc.Typ = "Beobachtung";
	doc.User = User;
	doc.aArtGruppe = aArtGruppe;
	doc.aArtName = aArtName;
	doc.aArtId = aArtId;
	doc.zDatum = DatumNeu();
	doc.zZeit = ZeitNeu();
	$db.saveDoc(doc, {
		success: function(data) {
			//$.mobile.changePage("_show/BeobEdit/" + data.id + "?Status=neu");     Nicht so öffnen: Div. Code müsste dann in BeobListe verschoben werden... würde unübersichtlich
			window.open("_show/BeobEdit/" + data.id + "?Status=neu", target="_self");
			refreshBeobListe("");
		},
		error: function() {
			MeldungEinzeilig("Die Beobachtung konnte nicht gespeichert werden.");
		 }
	});
}

function BeobNeuSpeichernHierarchisch(ProjektId, RaumId, OrtId, ZeitId, User, aArtGruppe, aArtName, aArtId){
//Neue hierarchische Beobachtungen werden gespeichert
//ausgelöst durch hArtListe.html oder hArtArtgruppeEdit.html
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
			window.open("_show/hArtArtgruppeEdit/" + data.id + "?Status=neu", target="_self");
		},
		error: function() {
			MeldungEinzeilig("Die Art konnte nicht gespeichert werden.");
		 }
	});
}

function DatumZeitSetzen(){
	var Datum = DatumNeu();
	$("input#zDatum").val(Datum);
	var Zeit = ZeitNeu();
	$("input#zZeit").val(Zeit);
}

function DatumZeitHolen(){
	zDatum = DatumNeu();
	zZeit = ZeitNeu();
}

function GetGeolocation(){
	//ÜBERALL DURCH KOORDINATENHOLEN ERSETHEN!!!!!!!!!!!!!!!!!!!
	if ( navigator.geolocation ) { 
    navigator.geolocation.getCurrentPosition ( 
        function(position) {
        	var oLongitudeDecDeg = position.coords.longitude;
			var oLatitudeDecDeg = position.coords.latitude;
			var oLagegenauigkeit = position.coords.accuracy;
			$("input#oLongitudeDecDeg").val(oLongitudeDecDeg);
			$("input#oLatitudeDecDeg").val(oLatitudeDecDeg);
			$("input#oLagegenauigkeit").val(oLagegenauigkeit);
			var x = DdInChX(oLatitudeDecDeg, oLongitudeDecDeg);
			var y = DdInChY(oLatitudeDecDeg, oLongitudeDecDeg);
			$("input#oXKoord").val(x);
			$("input#oYKoord").val(y); 
			MeldungEinzeilig("Die Koordinaten wurden gesetzt");    
        }, 
        function(){ 
            MeldungEinzeilig('Keine Positionsdaten erhalten');
        }); 
    }
}

function KoordinatenHolen(){
	if ( navigator.geolocation ) { 
    navigator.geolocation.getCurrentPosition ( 
        function(position) {
        	oLongitudeDecDeg = position.coords.longitude;
			oLatitudeDecDeg = position.coords.latitude;
			oLagegenauigkeit = position.coords.accuracy;
			oXKoord = DdInChX(oLatitudeDecDeg, oLongitudeDecDeg);
			oYKoord = DdInChY(oLatitudeDecDeg, oLongitudeDecDeg);
			return(oLongitudeDecDeg, oLatitudeDecDeg, oLagegenauigkeit, oXKoord, oYKoord);
			MeldungEinzeilig("Die Koordinaten wurden gesetzt");    
        }, 
        function(){ 
            MeldungEinzeilig('Keine Positionsdaten erhalten');
        }); 
    }
}

function AutorHolen(){
	$db.view("evab/User",
		{success: function(data) {
			var i;
			var beob;
			var key;
			for(i in data.rows)
			{
				beob = data.rows[i].value;
				key = data.rows[i].key;
				if (User == key) {
					var aAutor = beob.Autor;
					return(aAutor);
				}
			}
		}
	});
}

function AutorSetzen(){
	$db.view("evab/User",
		{success: function(data) {
			var i;
			var beob;
			var key;
			for(i in data.rows)
			{
				beob = data.rows[i].value;
				key = data.rows[i].key;
				if (User == key) {
					var aAutor = beob.Autor;
					$("input#aAutor").val(aAutor);
					break;
				}
			}
		}
	});
}

//Menü aufbauen. Wird aufgerufen von allen Formularen in evab/_attachments
function MenuAufbauen(thiz, User, UserId, Pfad){
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
    	'buttons' : {
		 	'neu anmelden': {
		      	click: function () {
		        	window.open(Pfad + "index.html", target="_self");
        		},
        		theme: "a",
        		icon: "home"
      		},
      		'meine Einstellungen': {
		      	click: function () {
		        	//$.mobile.changePage(Pfad + "_show/UserEdit/" + UserId, {transition: "none"});
		        	window.open(Pfad + "_show/UserEdit/" + UserId, target="_self");
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
      		'Datenfelder exportieren': {
		      	click: function () {
		        	window.open(Pfad + "_list/FeldExport/FeldListe");
        		},
        		theme: "a",
        		icon: "arrow-r"
      		},
      		'hierarchischer Modus': {
		      	click: function () {
		        	window.open(Pfad + "hProjektListe.html", target="_self");
        		},
        		theme: "a",
        		icon: "check"
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
function MenuAufbauenHierarchisch(thiz, User, UserId, Pfad){
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
    	'buttons' : {
		 	'neu anmelden': {
		      	click: function () {
		        	window.open(Pfad + "index.html", target="_self");
        		},
        		theme: "a",
        		icon: "home"
      		},
      		'meine Einstellungen': {
		      	click: function () {
		        	//$.mobile.changePage(Pfad + "_show/UserEdit/" + UserId, {transition: "none"});
		        	window.open(Pfad + "_show/UserEdit/" + UserId, target="_self");
        		},
        		theme: "a",
        		icon: "gear"
      		},
      		'Beobachtungen exportieren': {
		      	click: function () {
		      		//$.mobile.changePage(Pfad + "../evab/_list/BeobExport/BeobListe?user=" + User, {transition: "none"});  klappt nicht
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
      		'Datenfelder exportieren': {
		      	click: function () {
		        	window.open(Pfad + "_list/FeldExport/FeldListe");
        		},
        		theme: "a",
        		icon: "arrow-r"
      		},
      		'einfacher Modus': {
		      	click: function () {
		        	window.open(Pfad + "BeobListe.html", target="_self");
        		},
        		theme: "a",
        		icon: "check"
      		},
      		'schliessen': {
                click: function () { return true; },
                icon: "back",
                theme: "c"
            }
    	}
  	})
}

//Menü aufbauen. Wird aufgerufen von Formularen, die wie ArtListe.html einfach oder hierarchisch sein können
function MenuAufbauenAusArtListe(thiz, User, UserId, Pfad){
	//Code um Menü aufzubauen
	$(thiz).simpledialog({
		'mode' : 'bool',
		'prompt' : 'Menü',
    	'buttons' : {
		 	'neu anmelden': {
		      	click: function () {
		        	window.open(Pfad + "index.html", target="_self");
        		},
        		theme: "a",
        		icon: "home"
      		},
      		'meine Einstellungen': {
		      	click: function () {
		        	//$.mobile.changePage(Pfad + "_show/UserEdit/" + UserId, {transition: "none"});
		        	window.open(Pfad + "_show/UserEdit/" + UserId, target="_self");
        		},
        		theme: "a",
        		icon: "gear"
      		},
      		'Beobachtungen exportieren': {
		      	click: function () {
		      		//$.mobile.changePage(Pfad + "../evab/_list/BeobExport/BeobListe?user=" + User, {transition: "none"});  klappt nicht
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

//BeobListe in BeobList.html erneuern. Wird aufgerufen von: BeobListe.html, BeobEdit.html
//Pfad muss mitgegeben werden, weil sonst beim Aufruf von BeobEdit der Pfad zu den Bildern nicht klappt...
function refreshBeobListe(Pfad) {
	$("#beobachtungen").empty();
	$db.view("evab/BeobListe",
		{success: function(data) {
			var i;
			var anzBeob = 0;
			var beob;
			var ListItemContainer = "";
			for(i in data.rows) {                    //Beobachtungen zählen. Wenn noch keine: darauf hinweisen
				key = data.rows[i].key;
				if (key[0] == User) {            //nur eigene Beobachtungen zählen!
					anzBeob = anzBeob + 1;
				}
			}

			//Im Titel der Seite die Anzahl Beobachtungen anzeigen
			var Titel2 = " Beobachtungen";
			if (anzBeob==1){
				Titel2 = " Beobachtung";
			}
			$("#BeobListePageHeader .BeobListePageTitel").text(anzBeob + Titel2);

			if (anzBeob == 0) {
				$("#beobachtungen").append("<li>Sie haben noch keine Beobachtung erfasst</li>");
			} else {
				data.rows.reverse();                 //zuletzt erfasste sind zuoberst
				for(i in data.rows)                  //Liste aufbauen
				{
					beob = data.rows[i].value;
					key = data.rows[i].key;
					if (key[0] == User) {                   //nur eigene Beobachtungen anzeigen!
						var Datum = beob.zDatum;
						var Zeit = beob.zZeit;
						var ArtGruppe = beob.aArtGruppe;
						ImageLink = Pfad + "Artgruppenbilder/" + ArtGruppe + ".png";
						var ArtName = beob.aArtName;
						var externalPage = "_show/BeobEdit/" + beob._id;
						var listItem = "<li class=\"beob ui-li-has-thumb\" id=\"" + beob._id + "\">" +
							"<a href=\"" + externalPage + "\" rel=\"external\">" +
							"<img class=\"ui-li-thumb\" src=\"" + ImageLink + "\" />" +
							"<h3 class=\"aArtName\">" + ArtName + "<\/h3>" +
							"<p class=\"zZeit\">" + Datum + "&nbsp; &nbsp;" + Zeit + "<\/p>" +
							"<\/a> <\/li>";
						ListItemContainer = ListItemContainer + listItem;
					}
				}
			}
			ListItemContainer = ListItemContainer + "<\/ul>";
			$("#beobachtungen").append(ListItemContainer);
			$("#beobachtungen").listview();
			$("#beobachtungen").listview("refresh");
		}
	});
}
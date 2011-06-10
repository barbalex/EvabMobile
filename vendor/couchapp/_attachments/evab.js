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
	    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
	    .appendTo( $.mobile.pageContainer )
	    .delay( 2100 )
	    .fadeOut( 700, function(){
	    	$(this).remove();
		});
};

function MeldungZweizeilig(ErsteZeile, ZweiteZeile) {
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + ErsteZeile + "<br>" + ZweiteZeile +"</h1></div>")
	    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
	    .appendTo( $.mobile.pageContainer )
	    .delay( 2100 )
	    .fadeOut( 700, function(){
	    	$(this).remove();
		});
};
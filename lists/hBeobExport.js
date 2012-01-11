function(head, req) { 
	
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=MeineHierarchischenBeobachtungen.csv",
			"Accept-Charset": "utf-8"
	    }
	});

	var row;
	var name, i, y, z;
	var FeldName;
	var FeldNamen = [];
	var FeldNamenEnthalten = [];
	var Titelzeile;
	var Titellänge;
	var Datensatz, Datensatz;
	var Datensätze = [];
	var Datenzeile;
	var Datenzeilenlänge;

	//Array mit allen Feldnamen erstellen
	while(row = getRow()) {
		Datensatz = row.value;
		//Id-Felder kreieren - sonst haben ausgerechnet Projekte keine hProjektId etc.
		switch (Datensatz.Typ) {
			case "hProjekt":
				Datensatz.hProjektId = Datensatz._id;
			break;
			case "hRaum":
				Datensatz.hRaumId = Datensatz._id;
			break;
			case "hOrt":
				Datensatz.hOrtId = Datensatz._id;
			break;
			case "hZeit":
				Datensatz.hZeitId = Datensatz._id;
			break;
			//für hArt nicht nötig
		}
		Datensätze.push(Datensatz);
		for (name in Datensatz) {
			if (name !== '_id' && name !== '_rev' && name !== 'User') {
				//alle noch nicht im Array enthaltenen Feldnamen ergänzen
				if (FeldNamen.indexOf(name) == -1) {
					FeldNamen.push(name);
				}
			}
		}
	}
	FeldNamen.sort();

	//Titelzeile erstellen
	Titelzeile = '"';
	for (i in FeldNamen) {
		Titelzeile += FeldNamen[i] + '"\t"';
	}

	//letztes t abschneiden, mit n ersetzen
	Titellänge = (Titelzeile.length - 3);
	Titelzeile = Titelzeile.slice(0, Titellänge) + '"\n';

	send(Titelzeile);

	//durch Datensätze loopen. i = Datensatz
	for (y in Datensätze) {
		Datensatz = Datensätze[y];
		//für jeden Datensatz die Liste der enthaltenen Felder erstellen
		FeldNamenEnthalten = [];
		for (name in Datensatz) {
			if (name !== '_id' && name !== '_rev' && name !== 'User') {
				FeldNamenEnthalten.push(name);
			}
		}
		//Durch FeldNamen loopen
		//wenn FeldName des Datensatzes enthalten ist, dessen Wert anfügen
		//sonst leeren Wert
		Datenzeile = '"';
		for (z in FeldNamen) {
			FeldName = FeldNamen[z];
			if (FeldNamenEnthalten.indexOf(FeldNamen[z]) != -1) {
				Datenzeile += eval('Datensatz.' + FeldNamen[z]) + '"\t"';
			} else {
				Datenzeile += '"\t"';
			}
		}
		Datenzeilenlänge = (Datenzeile.length -3);
		//letztes \t abschneiden, mit \n zur nächsten Zeile
		Datenzeile = Datenzeile.slice(0, Datenzeilenlänge) + '"\n';
		send(Datenzeile);
	}
}

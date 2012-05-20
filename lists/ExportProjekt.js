function(head, req) { 
	
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=EvabMobile_Projekte.csv",
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
	var Datensatz;
	var Datensätze = [];
	var Datenzeile;
	var Datenzeilenlänge;

	//Array mit allen Feldnamen erstellen
	while(row = getRow()) {
		Datensatz = row.doc;
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
			case "hArt":
				Datensatz.BeobId = Datensatz._id;
				break;
			case "Beobachtung":
				Datensatz.BeobId = Datensatz._id;
				break;
		}
		Datensätze.push(Datensatz);
		for (name in Datensatz) {
			//war mal auch ausgeschlossen: name !== '_rev' && 
			if (['_id', 'User', '_conflicts', 'committed_update_seq', 'compact_running', 'data_size', 'db_name', 'disk_format_version', 'disk_size', 'doc_count', 'doc_del_count', 'instance_start_time', 'purge_seq', 'update_seq'].indexOf(name) === -1) {
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
		//_attachments zu Anhänge umbenennen
		if (FeldNamen[i] === "_attachments") {
			Titelzeile += '"Anhänge\t"';
		} else {
			Titelzeile += FeldNamen[i] + '"\t"';
		}
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
			//war mal auch ausgeschlossen: name !== '_rev' && 
			if (['_id', 'User', '_conflicts', 'committed_update_seq', 'compact_running', 'data_size', 'db_name', 'disk_format_version', 'disk_size', 'doc_count', 'doc_del_count', 'instance_start_time', 'purge_seq', 'update_seq'].indexOf(name) === -1) {
				FeldNamenEnthalten.push(name);
			}
		}
		//Durch FeldNamen loopen
		//wenn FeldName des Datensatzes enthalten ist, dessen Wert anfügen
		//sonst leeren Wert
		Datenzeile = '"';
		for (z in FeldNamen) {
			if (FeldNamenEnthalten.indexOf(FeldNamen[z]) != -1) {
				Feld = eval('Datensatz.' + FeldNamen[z]);
				Feld = Datensatz[FeldNamen[z]];
				//Bei Anhängen deren Namen, Typ und Grösse in KB auflisten
				if (FeldNamen[z] == "_attachments") {
					for (x in Feld) {
						FeldLength = parseInt(Feld[x]['length']);
						FeldLengthLänge = parseInt(parseInt(FeldLength.length) -3);
						Datenzeile += x + " (" + Feld[x].content_type + ", " + Math.floor(Feld[x]['length']/1000) + " KB), ";
					}
					//letztes Komma und Leerzeichen abschneiden
					Datenzeilenlänge = (Datenzeile.length -2);
					Datenzeile = Datenzeile.slice(0, Datenzeilenlänge);
				} else {
					Datenzeile += Feld;
				}
				Datenzeile += '"\t"';
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
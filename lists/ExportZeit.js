function(head, req) {

	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=EvabMobile_Zeiten.csv",
			"Accept-Charset": "utf-8"
		}
	});

	var row,
		name, i, x, y, z,
		FeldName,
		FeldNamen = [],
		FeldNamenEnthalten = [],
		Titelzeile,
		Titellänge,
		doc,
		docs = [],
		Datenzeile,
		Datenzeilenlänge;

	//Array mit allen Feldnamen erstellen
	while(row = getRow()) {
		doc = row.doc;
		//Id-Felder kreieren - sonst haben ausgerechnet Projekte keine hProjektId etc.
		switch (doc.Typ) {
		case "hProjekt":
			doc.hProjektId = doc._id;
			break;
		case "hRaum":
			doc.hRaumId = doc._id;
			break;
		case "hOrt":
			doc.hOrtId = doc._id;
			break;
		case "hZeit":
			doc.hZeitId = doc._id;
			break;
		case "hArt":
			doc.BeobId = doc._id;
			break;
		case "Beobachtung":
			doc.BeobId = doc._id;
			break;
		}
		docs.push(doc);
		for (name in doc) {
			if (typeof name !== "function") {
				//war mal auch ausgeschlossen: name !== '_rev' && 
				if (['_id', 'User', '_conflicts', 'committed_update_seq', 'compact_running', 'data_size', 'db_name', 'disk_format_version', 'disk_size', 'doc_count', 'doc_del_count', 'instance_start_time', 'purge_seq', 'update_seq'].indexOf(name) === -1) {
					//alle noch nicht im Array enthaltenen Feldnamen ergänzen
					if (FeldNamen.indexOf(name) == -1) {
						FeldNamen.push(name);
					}
				}
			}
		}
	}
	FeldNamen.sort();

	//Titelzeile erstellen
	Titelzeile = '"';
	for (i in FeldNamen) {
		if (typeof i !== "function") {
			//_attachments zu Anhänge umbenennen
			if (FeldNamen[i] === "_attachments") {
				Titelzeile += '"Anhänge\t"';
			} else {
				Titelzeile += FeldNamen[i] + '"\t"';
			}
		}
	}

	//letztes t abschneiden, mit n ersetzen
	Titellänge = (Titelzeile.length - 3);
	Titelzeile = Titelzeile.slice(0, Titellänge) + '"\n';

	send(Titelzeile);

	//durch docs loopen. i = doc
	for (y in docs) {
		if (typeof y !== "function") {
			doc = docs[y];
			//für jeden doc die Liste der enthaltenen Felder erstellen
			FeldNamenEnthalten = [];
			for (name in doc) {
				if (typeof name !== "function") {
					//war mal auch ausgeschlossen: name !== '_rev' && 
					if (['_id', 'User', '_conflicts', 'committed_update_seq', 'compact_running', 'data_size', 'db_name', 'disk_format_version', 'disk_size', 'doc_count', 'doc_del_count', 'instance_start_time', 'purge_seq', 'update_seq'].indexOf(name) === -1) {
						FeldNamenEnthalten.push(name);
					}
				}
			}
			//Durch FeldNamen loopen
			//wenn FeldName des Datensatzes enthalten ist, dessen Wert anfügen
			//sonst leeren Wert
			Datenzeile = '"';
			for (z in FeldNamen) {
				if (typeof z !== "function") {
					if (FeldNamenEnthalten.indexOf(FeldNamen[z]) != -1) {
						Feld = doc[FeldNamen[z]];
						//Bei Anhängen deren Namen, Typ und Grösse in KB auflisten
						if (FeldNamen[z] == "_attachments") {
							for (x in Feld) {
								FeldLength = parseInt(Feld[x]['length'], 10);
								FeldLengthLänge = parseInt(parseInt(FeldLength.length, 10) -3, 10);
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
			}
			Datenzeilenlänge = (Datenzeile.length -3);
			//letztes \t abschneiden, mit \n zur nächsten Zeile
			Datenzeile = Datenzeile.slice(0, Datenzeilenlänge) + '"\n';
			send(Datenzeile);
		}
	}
}
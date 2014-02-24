function(head, req) {

	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=EvabMobile_Beobachtungen.csv",
			"Accept-Charset": "utf-8"
		}
	});

	var row,
		name, i, x, y, z,
		Feld,
		FeldName,
		FeldNamen = [],
		Titelzeile,
		Titellänge,
		doc,
		docs = [],
		Datenzeile,
		Datenzeilenlänge;

	// vereinigtes doc erstellen, dass die Felder aller Hierarchieebenen enthält
	while(row = getRow()) {
		if (row.key[2] === 1) {
			doc = row.doc;
		} else {
			// felder von row.doc in doc schreiben
			// _id und _rev sind dann von row.doc;
			if (doc) {
				doc = ergaenzeFelderVonDoc(doc, row.doc);
			} else {
				// bei nicht hierarchischen Beob gibt es kein key[2] === 1!
				doc = row.doc;
			}
			if (row.key[2] === 5) {
				// Id-Felder kreieren - sonst haben Projekte keine hProjektId etc.
				doc.BeobId = doc._id;
				// doc sammeln und weiter
				docs.push(doc);
				// doc zurücksetzen, sonst übernimmt der nächste des Vorigen Eigenschaften, wenn zwei nicht hierarchische Beobachtungen aufeinander folgen
				doc = null;
			}
		}
	}

	// Array mit allen Feldnamen erstellen
	for (q=0; q<docs.length; q++) {
		doc = docs[q];
		for (name in doc) {
			if (typeof name !== "function") {
				// war mal auch ausgeschlossen: '_rev'
				if (['_id', '_rev', 'User', '_conflicts', 'committed_update_seq', 'compact_running', 'data_size', 'db_name', 'disk_format_version', 'disk_size', 'doc_count', 'doc_del_count', 'instance_start_time', 'purge_seq', 'update_seq'].indexOf(name) === -1) {
					// alle noch nicht im Array enthaltenen Feldnamen ergänzen
					if (FeldNamen.indexOf(name) == -1) {
						FeldNamen.push(name);
					}
				}
			}
		}
	}

	FeldNamen.sort();

	// Titelzeile erstellen
	Titelzeile = '"';
	for (i in FeldNamen) {
		// _attachments zu Anhänge umbenennen
		if (FeldNamen[i] === "_attachments") {
			Titelzeile += '"Anhänge\t"';
		} else {
			Titelzeile += FeldNamen[i] + '"\t"';
		}
	}

	// letztes t abschneiden, mit n ersetzen
	Titellänge = (Titelzeile.length - 3);
	Titelzeile = Titelzeile.slice(0, Titellänge) + '"\n';

	send(Titelzeile);

	// durch docs loopen
	for (y in docs) {
		doc = docs[y];
		// Durch FeldNamen loopen
		// wenn FeldName des Datensatzes enthalten ist, dessen Wert anfügen
		// sonst leeren Wert
		Datenzeile = '"';
		for (z in FeldNamen) {
			if (typeof doc[FeldNamen[z]] !== "undefined") {
				// dieses Feld ist in diesem Dokument enthalten
				Feld = doc[FeldNamen[z]];
				// Bei Anhängen deren Namen, Typ und Grösse in KB auflisten
				if (FeldNamen[z] === "_attachments") {
					for (x in Feld) {
						FeldLength = parseInt(Feld[x]['length'], 10);
						FeldLengthLänge = parseInt(parseInt(FeldLength.length, 10) -3, 10);
						Datenzeile += x + " (" + Feld[x].content_type + ", " + Math.floor(Feld[x]['length']/1000) + " KB), ";
					}
					// letztes Komma und Leerzeichen abschneiden
					Datenzeilenlänge = (Datenzeile.length -2);
					Datenzeile = Datenzeile.slice(0, Datenzeilenlänge);
				} else {
					Datenzeile += Feld;
				}
				Datenzeile += '"\t"';
			} else {
				// Dieses Feld ist im Doc nicht enthalten. Leerwert einsetzen, damit jede Zeile dieselbe Anzahl Spalten hat
				Datenzeile += '"\t"';
			}
		}
		Datenzeilenlänge = (Datenzeile.length -3);
		// letztes \t abschneiden, mit \n zur nächsten Zeile
		Datenzeile = Datenzeile.slice(0, Datenzeilenlänge) + '"\n';
		send(Datenzeile);
	}
}

function ergaenzeFelderVonDoc(doc1, doc2) {
	for (var h in doc2) {
		doc1[h] = doc2[h];
	}
	return doc1;
}
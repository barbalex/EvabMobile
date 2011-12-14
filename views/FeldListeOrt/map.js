function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Tabelle && doc.Tabelle == 'Ort'){
		emit (doc.Reihenfolge, doc);
	}
}
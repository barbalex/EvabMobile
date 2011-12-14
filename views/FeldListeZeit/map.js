function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Tabelle && doc.Tabelle == 'Zeit'){
		emit (doc.Reihenfolge, doc);
	}
}
function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Hierarchiestufe && doc.Hierarchiestufe == 'Raum'){
		emit (doc.Reihenfolge, doc);
	}
}
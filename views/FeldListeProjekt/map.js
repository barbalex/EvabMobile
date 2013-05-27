function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Hierarchiestufe && doc.Hierarchiestufe == 'Projekt'){
		emit (doc.Reihenfolge, null);
	}
}
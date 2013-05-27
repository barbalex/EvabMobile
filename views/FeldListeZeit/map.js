function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Hierarchiestufe && doc.Hierarchiestufe == 'Zeit'){
		emit (doc.Reihenfolge, null);
	}
}
function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Hierarchiestufe && doc.Hierarchiestufe == 'Ort'){
		emit (doc.Reihenfolge, null);
	}
}
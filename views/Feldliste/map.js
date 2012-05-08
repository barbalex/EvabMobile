function(doc) {
	if(doc.Typ && doc.Typ === 'Feld'){
		emit (doc.Reihenfolge, doc);
	}
}
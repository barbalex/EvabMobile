function(doc) {
	if(doc.Typ == 'hZeit' && doc.hOrtId){
		emit (doc.hOrtId, 1);
	}
}
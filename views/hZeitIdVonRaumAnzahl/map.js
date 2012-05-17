function(doc) {
	if(doc.Typ === 'hZeit' && doc.hRaumId){
		emit (doc.hRaumId, 1);
	}
}
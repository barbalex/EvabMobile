function(doc) {
	if(doc.Typ === 'hOrt' && doc.hRaumId){
		emit (doc.hRaumId, 1);
	}
}
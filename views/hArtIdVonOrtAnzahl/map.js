function(doc) {
	if(doc.Typ === 'hArt' && doc.hOrtId){
		emit (doc.hOrtId, 1);
	}
}
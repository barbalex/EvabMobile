function(doc) {
	if(doc.Typ === 'hArt' && doc.hZeitId){
		emit (doc.hZeitId, 1);
	}
}
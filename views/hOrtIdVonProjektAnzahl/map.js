function(doc) {
	if(doc.Typ === 'hOrt' && doc.hProjektId){
		emit (doc.hProjektId, 1);
	}
}
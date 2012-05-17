function(doc) {
	if(doc.Typ === 'hRaum' && doc.hProjektId){
		emit (doc.hProjektId, 1);
	}
}
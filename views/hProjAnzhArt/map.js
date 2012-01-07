function(doc) {
	if(doc.Typ == 'hArt' && doc.hProjektId){
		emit (doc.hProjektId, 1);
	}
}
function(doc) {
	if(doc.Typ == 'hArt' && doc.ProjektId){
		emit (doc.ProjektId, 1);
	}
}
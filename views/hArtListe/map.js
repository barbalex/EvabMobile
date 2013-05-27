function(doc) {
	if(doc.Typ == 'hArt' && doc.hZeitId && doc.User && doc.aArtName){
		emit ([doc.User, doc.hZeitId, doc.aArtName], null);
	}
}
function(doc) {
	if(doc.Typ == 'hRaum' && doc.hProjektId && doc.User && doc.rName){
		emit ([doc.User, doc.hProjektId, doc.rName], doc);
	}
}
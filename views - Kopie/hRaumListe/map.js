function(doc) {
	if(doc.Typ == 'hRaum' && doc.hProjektId && doc.User){
		emit ([doc.User, doc.hProjektId, doc.rName], doc);
	}
}
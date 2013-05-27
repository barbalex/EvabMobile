function(doc) {
	if(doc.Typ == 'hOrt' && doc.hRaumId && doc.User){
		emit ([doc.User, doc.hRaumId, doc.oName], null);
	}
}
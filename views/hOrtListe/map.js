function(doc) {
	if(doc.Typ == 'hOrt' && doc.hRaumId && doc.User && doc.oName){
		emit ([doc.User, doc.hRaumId, doc.oName], doc);
	}
}
function(doc) {
	var User = doc.User;
	if (doc.Typ == 'hOrt') {
	    emit ([User, doc.hProjektId, doc.hRaumId, doc._id, {}, {}], doc);
    }
}
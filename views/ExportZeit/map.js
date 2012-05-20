function(doc) {
	var User = doc.User;
	if (doc.Typ === 'hZeit') {
	    emit ([User, doc.hProjektId, doc.hRaumId, doc.hOrtId, doc._id, {}], null);
    }
}
function(doc) {
	var User = doc.User;
	if (doc.Typ === 'hRaum') {
	    emit ([User, doc.hProjektId, doc._id, {}, {}, {}], null);
    }
}
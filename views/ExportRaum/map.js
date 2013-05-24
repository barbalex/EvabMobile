function(doc) {
	var User = doc.User;
	if (doc.Typ === 'hRaum') {
		emit ([User, doc._id, 2], null);
		emit ([User, doc._id, 1], {_id: doc.hProjektId});
	}
}
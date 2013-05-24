function(doc) {
	var User = doc.User;
	if (doc.Typ === 'hZeit') {
		emit ([User, doc._id, 4], null);
		emit ([User, doc._id, 3], {_id: doc.hOrtId});
		emit ([User, doc._id, 2], {_id: doc.hRaumId});
		emit ([User, doc._id, 1], {_id: doc.hProjektId});
	}
}
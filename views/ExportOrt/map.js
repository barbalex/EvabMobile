function(doc) {
	var User = doc.User;
	if (doc.Typ === 'hOrt') {
		emit ([User, doc._id, 3], null);
		emit ([User, doc._id, 2], {_id: doc.hRaumId});
		emit ([User, doc._id, 1], {_id: doc.hProjektId});
	}
}
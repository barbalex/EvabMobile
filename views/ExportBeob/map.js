function(doc) {
	var User = doc.User;
	if (doc.Typ === 'hArt') {
		emit ([User, doc._id, 5], null);
		emit ([User, doc._id, 4], {_id: doc.hZeitId});
		emit ([User, doc._id, 3], {_id: doc.hOrtId});
		emit ([User, doc._id, 2], {_id: doc.hRaumId});
		emit ([User, doc._id, 1], {_id: doc.hProjektId});
	} else if (doc.Typ === 'Beobachtung') {
		emit ([User, doc._id, 5], null);
	}
}
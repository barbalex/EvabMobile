function(doc) {
	var User = doc.User;
	if (doc.Typ == 'hArt') {
	    emit ([User, doc.hProjektId, doc.hRaumId, doc.hOrtId, doc.hZeitId, doc._id], doc);
    } else if (doc.Typ == 'Beobachtung') {
	    emit ([User, {}, {}, {}, {}, doc._id], doc);
    }
}
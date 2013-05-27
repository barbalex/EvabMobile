function(doc) {
	var User = doc.User;
	if(doc.Typ == 'hProjekt'){
		emit ([User, doc._id, {}, {}, {}, {}], null);
	} else if (doc.Typ == 'hRaum') {
	    emit ([User, doc.hProjektId, doc._id, {}, {}, {}], null);
    } else if (doc.Typ == 'hOrt') {
	    emit ([User, doc.hProjektId, doc.hRaumId, doc._id, {}, {}], null);
    } else if (doc.Typ == 'hZeit') {
	    emit ([User, doc.hProjektId, doc.hRaumId, doc.hOrtId, doc._id, {}], null);
    } else if (doc.Typ == 'hArt') {
	    emit ([User, doc.hProjektId, doc.hRaumId, doc.hOrtId, doc.hZeitId, doc._id], null);
    }
}
function(doc) {
	var User = doc.User;
	if(doc.Typ == 'hProjekt'){
		emit ([User, doc._id, {}, {}, {}, {}], doc);
	} else if (doc.Typ == 'hRaum') {
	    emit ([User, doc.ProjektId, doc._id, {}, {}, {}], doc);
    } else if (doc.Typ == 'hOrt') {
	    emit ([User, doc.ProjektId, doc.RaumId, doc._id, {}, {}], doc);
    } else if (doc.Typ == 'hZeit') {
	    emit ([User, doc.ProjektId, doc.RaumId, doc.OrtId, doc._id, {}], doc);
    } else if (doc.Typ == 'hArt') {
	    emit ([User, doc.ProjektId, doc.RaumId, doc.OrtId, doc.ZeitId, doc._id], doc);
    }
}
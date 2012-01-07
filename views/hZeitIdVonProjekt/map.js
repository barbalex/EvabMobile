function(doc) {
	if(doc.Typ == 'hZeit' && doc.hProjektId){
		emit ([doc.hProjektId, doc._id], null);
	}
}
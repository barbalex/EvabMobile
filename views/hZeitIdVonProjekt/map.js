function(doc) {
	var ProjektId = doc.ProjektId;
	var id = doc._id;
	if(doc.Typ == 'hZeit' && ProjektId){
		emit ([ProjektId, id], null);
	}
}
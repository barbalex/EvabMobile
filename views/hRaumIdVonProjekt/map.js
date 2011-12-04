function(doc) {
	var ProjektId = doc.ProjektId;
	var id = doc._id;
	if(doc.Typ == 'hRaum' && ProjektId){
		emit ([ProjektId, id], null);
	}
}
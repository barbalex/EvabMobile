function(doc) {
	var ProjektId = doc.ProjektId;
	var id = doc._id;
	if(doc.Typ == 'hOrt' && ProjektId){
		emit ([ProjektId, id], null);
	}
}
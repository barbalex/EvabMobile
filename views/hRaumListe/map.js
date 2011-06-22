function(doc) {
	var User = doc.User;
	var ProjektId = doc.ProjektId;
	var rName = doc.rName;
	if(doc.Typ == 'hRaum' && doc.ProjektId && doc.User && doc.rName){
		emit ([User, ProjektId, rName], doc);
	}
}
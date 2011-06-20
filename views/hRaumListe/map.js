function(doc) {
	var User = doc.User;
	var ProjektId = doc.ProjektId;
	if(doc.Typ == 'hRaum' && doc.ProjektId && doc.User){
		emit ([User, ProjektId], doc);
	}
}
function(doc) {
	var User = doc.User;
	if(doc.Typ == 'Beobachtung' && doc.zDatum && doc.zUhrzeit){
		emit (User, doc);
	}
}
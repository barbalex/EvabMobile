function(doc) {
	var User = doc.User;
	var Zeit = doc.zDatum + " " + doc.zUhrzeit;
	if(doc.Typ == 'Beobachtung' && doc.zDatum && doc.zUhrzeit){
		emit ([User, Zeit], doc);
	}
}
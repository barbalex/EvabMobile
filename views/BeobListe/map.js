function(doc) {
	var User = doc.User;
	var Zeit = doc.zDatum + " " + doc.zUhrzeit;
	if(doc.Typ == 'Beobachtung'){
		emit ([User, Zeit], null);
	}
}
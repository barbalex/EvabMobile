function(doc) {
	var User = doc.User;
	if(doc.Typ == 'Beobachtung' && doc.Modus == 'einfach' && doc.zDatum && doc.zUhrzeit){
		emit (User, doc);
	}
}
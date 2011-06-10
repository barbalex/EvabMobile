function(doc) {
	var User = doc.User;
	var Zeit = doc.zDatum + " " + doc.zZeit;
	if(doc.Typ == 'Beobachtung' && doc.Modus == 'einfach' && doc.zZeit){
		emit ([User, Zeit], doc);
	}
}
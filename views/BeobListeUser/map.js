function(doc) {
	var User = doc.User;
	if(doc.Typ == 'Beobachtung' && doc.Modus == 'einfach' && doc.zDatum && doc.zZeit){
		emit (User, doc);
	}
}
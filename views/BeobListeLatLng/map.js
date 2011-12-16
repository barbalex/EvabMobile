function(doc) {
	var User = doc.User;
	var Zeit = doc.zDatum + " " + doc.zUhrzeit;
	if(doc.Typ == 'Beobachtung' && doc.Modus == 'einfach' && doc.zUhrzeit && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg){
		emit ([User, Zeit], doc);
	}
}
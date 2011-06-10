function(doc) {
	var User = doc.User;
	var Zeit = doc.zDatum + " " + doc.zZeit;
	if(doc.Typ == 'Beobachtung' && doc.Modus == 'einfach' && doc.zZeit && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg){
		emit ([User, Zeit], doc);
	}
}
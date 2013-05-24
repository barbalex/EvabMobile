function(doc) {
	if(doc.User && doc.Typ == 'Beobachtung' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg){
		emit (doc.User, null);
	}
}
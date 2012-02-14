function(doc) {
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg){
		emit (doc.User, null);
	}
}
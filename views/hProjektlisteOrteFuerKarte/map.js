function(doc) {
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg && doc.oName){
		emit (doc.User, null);
	}
}
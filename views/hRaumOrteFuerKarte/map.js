function(doc) {
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg && doc.hRaumId){
		emit ([doc.User, doc.hRaumId], null);
	}
}
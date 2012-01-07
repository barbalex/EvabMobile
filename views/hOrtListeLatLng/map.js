function(doc) {
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg && doc.oName && doc.hRaumId){
		emit ([doc.User, doc.hRaumId], doc);
	}
}
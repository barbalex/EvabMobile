function(doc) {
	var User = doc.User;
	var RaumId = doc.RaumId;
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg && doc.oName && doc.RaumId){
		emit ([User, RaumId], doc);
	}
}
function(doc) {
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg && doc.oName && doc.hProjektId){
		emit ([doc.User, doc.hProjektId], null);
	}
}
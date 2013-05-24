function(doc) {
	if(doc.Typ == 'hOrt' && doc.oLongitudeDecDeg && doc.oLatitudeDecDeg && doc.hProjektId){
		emit ([doc.User, doc.hProjektId], null);
	}
}
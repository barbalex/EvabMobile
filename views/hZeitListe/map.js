function(doc) {
	var User = doc.User;
	var OrtId = doc.OrtId;
	var Datum = doc.zDatum;
	var Zeit = doc.zZeit;
	if(doc.Typ == 'hZeit' && doc.OrtId && doc.User && doc.zDatum){
		emit ([User, OrtId, Datum, Zeit], doc);
	}
}
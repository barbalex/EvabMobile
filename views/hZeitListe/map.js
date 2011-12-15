function(doc) {
	var User = doc.User;
	var OrtId = doc.OrtId;
	var Datum = doc.zDatum;
	var Uhrzeit = doc.zUhrzeit;
	if(doc.Typ == 'hZeit' && doc.OrtId && doc.User && doc.zDatum && doc.zUhrzeit){
		emit ([User, OrtId, Datum, Uhrzeit], doc);
	}
}
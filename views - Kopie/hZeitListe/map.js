function(doc) {
	var User = doc.User;
	var Datum = doc.zDatum;
	var Uhrzeit = doc.zUhrzeit;
	if(doc.Typ == 'hZeit' && doc.hOrtId && doc.User && doc.zDatum && doc.zUhrzeit){
		emit ([User, doc.hOrtId, Datum, Uhrzeit], doc);
	}
}
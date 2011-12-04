function(doc) {
	if(doc.Typ == 'UserFeld' && doc.user && doc.FeldName) {
		emit ([doc.user, doc.FeldName], doc);
	}
}
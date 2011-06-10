function(doc) {
	var UserFeld = doc.user + doc.FeldName;
	if(doc.Typ == 'UserFeld' && doc.user && doc.FeldName) {
		emit (UserFeld, doc);
	}
}
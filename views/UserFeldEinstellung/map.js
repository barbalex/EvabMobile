function(doc) {
	if(doc.Typ == 'UserFeldEinstellung' && doc.User && doc.FeldName) {
		emit ([doc.User, doc.FeldName], doc);
	}
}
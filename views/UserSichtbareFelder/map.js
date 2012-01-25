function(doc) {
	if(doc.Typ == 'SichtbareFelder' && doc.User) {
		emit (doc.User, doc);
	}
}
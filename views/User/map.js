function(doc) {
	if(doc.Typ == 'User'){
		emit (doc.UserName, doc);
	}
}
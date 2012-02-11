function(doc) {
	var User = doc.User;
	if(doc.Typ == 'hProjekt'){
		emit ([User, doc._id, {}, {}, {}, {}], doc);
	}
}
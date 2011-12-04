function(doc) {
	if(doc.Typ == 'hProjekt'){
		emit ([doc.User, doc._id], doc);
	}
}
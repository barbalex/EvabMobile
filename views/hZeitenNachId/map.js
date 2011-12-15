function(doc) {
	if(doc.Typ == "hZeit"){
		emit (doc._id, doc);
	}
}
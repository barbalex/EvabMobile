function(doc) {
	if(doc.Typ=="hOrt"){
		emit (doc._id, doc);
	}
}
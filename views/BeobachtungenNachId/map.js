function(doc) {
	if(doc.Typ=="hArt"){
		emit (doc._id, doc);
	}
}
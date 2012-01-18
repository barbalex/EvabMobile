function(doc) {
	if(doc.Typ=="hRaum"){
		emit (doc._id, doc);
	}
}
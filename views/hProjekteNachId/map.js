function(doc) {
	if(doc.Typ=="hProjekt"){
		emit (doc._id, doc);
	}
}
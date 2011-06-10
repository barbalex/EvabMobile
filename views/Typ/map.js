function(doc) {
	if(doc.Typ){
		emit (doc.Typ, doc);
	}
}
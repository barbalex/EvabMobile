function(doc) {
	if(doc.Typ){
		emit (doc.Typ, null);
	}
}
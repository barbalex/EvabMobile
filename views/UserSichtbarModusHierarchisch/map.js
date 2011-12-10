function(doc) {
	if(doc.Typ == 'SichtbarModusHierarchisch' && doc.User && doc.Felder) {
		emit (doc.User, doc);
	}
}
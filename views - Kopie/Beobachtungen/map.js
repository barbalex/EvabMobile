function(doc) {
	if(doc.Typ=="Beobachtung"){
		emit (doc.Typ, null);
	}
}
function(doc) {
	var User = doc.User;
	var Name = doc.rName
	if(doc.Typ == 'hRaum' && doc.rName){
		emit ([User, Name], doc);
	}
}
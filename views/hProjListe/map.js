function(doc) {
	var User = doc.User;
	var Name = doc.pName
	if(doc.Typ == 'hProjekt' && doc.pName){
		emit ([User, Name], doc);
	}
}
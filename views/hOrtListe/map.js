function(doc) {
	var User = doc.User;
	var RaumId = doc.RaumId;
	if(doc.Typ == 'hOrt' && doc.RaumId && doc.User){
		emit ([User, RaumId], doc);
	}
}
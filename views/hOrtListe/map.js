function(doc) {
	var User = doc.User;
	var RaumId = doc.RaumId;
	var oName = doc.oName;
	if(doc.Typ == 'hOrt' && doc.RaumId && doc.User && doc.oName){
		emit ([User, RaumId, oName], doc);
	}
}
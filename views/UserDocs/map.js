function(doc) {
	if(doc.User){
		emit ([doc.User], null);
	}
}
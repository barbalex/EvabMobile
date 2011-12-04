function(doc) {
	var RaumId = doc.RaumId;
	var id = doc._id;
	if(doc.Typ == 'hOrt' && RaumId){
		emit ([RaumId, id], null);
	}
}
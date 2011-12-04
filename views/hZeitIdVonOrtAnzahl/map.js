function(doc) {
	var OrtId = doc.OrtId;
	var id = doc._id;
	if(doc.Typ == 'hZeit' && OrtId){
		emit (OrtId, 1);
	}
}
function(doc) {
	var OrtId = doc.OrtId;
	var id = doc._id;
	if(doc.Typ == 'hArt' && OrtId){
		emit ([OrtId, id], null);
	}
}
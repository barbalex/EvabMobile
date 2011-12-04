function(doc) {
	var ZeitId = doc.ZeitId;
	var id = doc._id;
	if(doc.Typ == 'hArt' && ZeitId){
		emit ([ZeitId, id], null);
	}
}
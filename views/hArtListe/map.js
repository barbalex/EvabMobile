function(doc) {
	var User = doc.User;
	var ZeitId = doc.ZeitId;
	var aArtName = doc.aArtName;
	if(doc.Typ == 'hArt' && doc.ZeitId && doc.User && doc.aArtName){
		emit ([User, ZeitId, aArtName], doc);
	}
}
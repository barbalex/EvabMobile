function(doc) {
	var User = doc.User;
	var ZeitId = doc.ZeitId;
	var bArtName = doc.bArtName;
	if(doc.Typ == 'hArt' && doc.ZeitId && doc.User && doc.bArtName){
		emit ([User, ZeitId, bArtName], doc);
	}
}
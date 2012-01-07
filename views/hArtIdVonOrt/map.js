function(doc) {
	if(doc.Typ == 'hArt' && doc.hOrtId){
		emit ([doc.hOrtId, doc._id], null);
	}
}
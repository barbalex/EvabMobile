function(doc) {
	if(doc.Typ == 'hArt' && doc.hZeitId){
		emit ([doc.hZeitId, doc._id], null);
	}
}
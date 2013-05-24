function(doc) {
	if(doc.Typ === 'hZeit' && doc.hOrtId){
		emit ([doc.hOrtId, doc._id, doc._rev], null);
	}
}
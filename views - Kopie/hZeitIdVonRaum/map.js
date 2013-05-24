function(doc) {
	if(doc.Typ === 'hZeit' && doc.hRaumId){
		emit ([doc.hRaumId, doc._id, doc._rev], null);
	}
}
function(doc) {
	if(doc.Typ === 'hArt' && doc.hRaumId){
		emit ([doc.hRaumId, doc._id, doc._rev], null);
	}
}
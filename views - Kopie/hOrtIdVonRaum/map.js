function(doc) {
	if(doc.Typ === 'hOrt' && doc.hRaumId){
		emit ([doc.hRaumId, doc._id, doc._rev], null);
	}
}
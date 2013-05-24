function(doc) {
	if(doc.Typ === 'hRaum' && doc.hProjektId){
		emit ([doc.hProjektId, doc._id, doc._rev], null);
	}
}
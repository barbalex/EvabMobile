function(doc) {
	if(doc.Typ === 'hOrt' && doc.hProjektId){
		emit ([doc.hProjektId, doc._id, doc._rev], null);
	}
}
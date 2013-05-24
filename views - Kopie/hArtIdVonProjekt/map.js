function(doc) {
	if(doc.Typ === 'hArt' && doc.hProjektId){
		emit ([doc.hProjektId, doc._id, doc._rev], null);
	}
}
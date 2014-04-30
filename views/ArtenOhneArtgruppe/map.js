function(doc) {
	if(doc.Typ && !doc.ArtGruppe && doc.Artname &&(doc.Typ === 'Arteigenschaft')){
		emit ([doc._id], null);
	}
}
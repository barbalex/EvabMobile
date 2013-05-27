function(doc) {
	if(doc.Typ && doc.ArtGruppe && doc.Artname &&(doc.Typ === 'Arteigenschaft' || doc.Typ === 'Unbekannte Art' || doc.Typ === 'Eigene Art')){
		emit ([doc.ArtGruppe, doc.Artname], null);
	}
}
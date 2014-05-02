function(doc) {
	if(doc.Typ && doc.ArtGruppe && doc.Artname &&(doc.Typ === 'Arteigenschaft' || doc.Typ === 'Unbekannte Art' || doc.Typ === 'Eigene Art')) {
		var sortier = doc.Artname;
		if (doc.Typ === "Unbekannte Art") {
			sortier = 1;
		}
		if (doc.Typ === "Eigene Art") {
			sortier = 2;
		}
		emit ([doc.ArtGruppe, sortier, doc.Artname], null);
	}
}
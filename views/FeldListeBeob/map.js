function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.ArtGruppe){
		emit (doc.Reihenfolge, doc);
	}
}
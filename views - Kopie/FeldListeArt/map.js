function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Hierarchiestufe && doc.Hierarchiestufe == 'Art' && doc.ArtGruppe){
		emit (doc.Reihenfolge, doc);
	}
}
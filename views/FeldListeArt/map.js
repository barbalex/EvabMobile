function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Tabelle && doc.Tabelle == 'Art' && doc.ArtGruppe){
		emit (doc.Reihenfolge, doc);
	}
}
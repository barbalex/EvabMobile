function(doc) {
	if(doc.Typ && doc.Typ == 'Feld' && doc.Tabelle && doc.Tabelle == 'Zeit' && doc.ArtGruppe){
		emit (doc.Reihenfolge, doc);
	}
}
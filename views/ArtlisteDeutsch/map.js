function(doc) {
	var L = doc.ArtNameD.substring(0, 1);
  	if(doc.Typ && doc.ArtNameD && doc.ArtGruppe && doc.ArtBezeichnung &&(doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art')){
		emit ([doc.ArtGruppe, L, doc.ArtBezeichnung], doc);
	}
}
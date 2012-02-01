function(doc) {
	var L = doc.ArtNameD.substring(0, 1);
  	if(doc.Typ && doc.ArtBezeichnungD && doc.ArtGruppe &&(doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art')){
		emit ([doc.ArtGruppe, L, doc.ArtBezeichnungD], doc);
	}
}
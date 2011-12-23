function(doc) {
	var L = doc.ArtNameL.substring(0, 1);
  	if(doc.Typ == 'Unbekannte Art' && doc.ArtGruppe == 'Unbekannt'){
		emit ([L, doc.ArtBezeichnung], doc);
	}
}
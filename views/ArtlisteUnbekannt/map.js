function(doc) {
  if(doc.Typ == 'Unbekannte Art' && doc.ArtGruppe == 'Unbekannt'){
		emit (doc.ArtBezeichnung, doc);
	}
}
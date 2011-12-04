function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Pilze'){
		emit (doc.ArtBezeichnung, doc);
	}
}
function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Koecherfliegen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Flora'){
		emit (doc.ArtBezeichnung, doc);
	}
}
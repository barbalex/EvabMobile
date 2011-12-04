function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Reptilien'){
		emit (doc.ArtBezeichnung, doc);
	}
}
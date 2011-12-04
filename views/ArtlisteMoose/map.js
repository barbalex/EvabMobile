function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Moose'){
		emit (doc.ArtBezeichnung, doc);
	}
}
function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Krebse'){
		emit (doc.ArtBezeichnung, doc);
	}
}
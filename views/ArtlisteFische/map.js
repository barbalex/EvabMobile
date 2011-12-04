function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Fische'){
		emit (doc.ArtBezeichnung, doc);
	}
}
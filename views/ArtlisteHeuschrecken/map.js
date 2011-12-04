function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Heuschrecken'){
		emit (doc.ArtBezeichnung, doc);
	}
}
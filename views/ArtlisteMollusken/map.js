function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Mollusken'){
		emit (doc.ArtBezeichnung, doc);
	}
}
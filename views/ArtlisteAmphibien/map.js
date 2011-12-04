function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Amphibien'){
		emit (doc.ArtBezeichnung, doc);
	}
}
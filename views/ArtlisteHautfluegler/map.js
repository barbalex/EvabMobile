function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Hautfluegler'){
		emit (doc.ArtBezeichnung, doc);
	}
}
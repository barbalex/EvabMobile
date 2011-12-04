function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Voegel'){
		emit (doc.ArtBezeichnung, doc);
	}
}
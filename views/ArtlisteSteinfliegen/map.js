function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Steinfliegen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
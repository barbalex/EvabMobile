function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Kaefer'){
		emit (doc.ArtBezeichnung, doc);
	}
}
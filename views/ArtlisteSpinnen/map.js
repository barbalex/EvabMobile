function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art') && doc.ArtGruppe == 'Spinnen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
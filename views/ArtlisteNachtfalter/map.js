function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Nachtfalter'){
		emit (doc.ArtBezeichnung, doc);
	}
}
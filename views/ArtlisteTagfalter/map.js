function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Tagfalter'){
		emit (doc.ArtBezeichnung, doc);
	}
}
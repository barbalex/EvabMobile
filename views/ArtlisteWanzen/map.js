function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Wanzen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
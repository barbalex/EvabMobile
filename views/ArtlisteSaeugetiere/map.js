function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Saeugetiere'){
		emit (doc.ArtBezeichnung, doc);
	}
}
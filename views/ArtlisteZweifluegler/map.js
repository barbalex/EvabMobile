function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art') && doc.ArtGruppe == 'Zweifluegler'){
		emit (doc.ArtBezeichnung, doc);
	}
}
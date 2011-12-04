function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Libellen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
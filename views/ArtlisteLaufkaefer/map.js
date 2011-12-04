function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Laufkaefer'){
		emit (doc.ArtBezeichnung, doc);
	}
}
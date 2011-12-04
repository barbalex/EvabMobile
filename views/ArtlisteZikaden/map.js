function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && doc.ArtGruppe == 'Zikaden'){
		emit (doc.ArtBezeichnung, doc);
	}
}
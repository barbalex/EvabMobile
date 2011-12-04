function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art') && (doc.ArtGruppe == 'Tausendfuessler' || doc.ArtGruppe == 'Tausendfüsser')){
		emit (doc.ArtBezeichnung, doc);
	}
}
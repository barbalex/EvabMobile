function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Tausendfuessler' || doc.ArtGruppe == 'Tausendfüsser'){
		emit (doc.ArtBezeichnung, doc);
	}
}
function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Netzfluegler'){
		emit (doc.ArtBezeichnung, doc);
	}
}
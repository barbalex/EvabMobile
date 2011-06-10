function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Reptilien'){
		emit (doc.ArtBezeichnung, doc);
	}
}
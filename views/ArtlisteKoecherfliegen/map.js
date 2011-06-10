function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Koecherfliegen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
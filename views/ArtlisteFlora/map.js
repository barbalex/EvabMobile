function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Flora'){
		emit (doc.ArtBezeichnung, doc);
	}
}
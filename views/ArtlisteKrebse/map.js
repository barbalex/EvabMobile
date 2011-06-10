function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Krebse'){
		emit (doc.ArtBezeichnung, doc);
	}
}
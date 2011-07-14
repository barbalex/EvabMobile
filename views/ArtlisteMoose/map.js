function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Moose'){
		emit (doc.ArtBezeichnung, doc);
	}
}
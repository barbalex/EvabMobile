function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Voegel'){
		emit (doc.ArtBezeichnung, doc);
	}
}
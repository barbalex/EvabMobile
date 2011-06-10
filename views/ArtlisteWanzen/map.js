function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Wanzen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
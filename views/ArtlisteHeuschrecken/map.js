function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Heuschrecken'){
		emit (doc.ArtBezeichnung, doc);
	}
}
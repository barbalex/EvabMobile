function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Steinfliegen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Spinnen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
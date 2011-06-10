function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Eintagsfliegen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
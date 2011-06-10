function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Saeugetiere'){
		emit (doc.ArtBezeichnung, doc);
	}
}
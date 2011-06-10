function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Amphibien'){
		emit (doc.ArtBezeichnung, doc);
	}
}
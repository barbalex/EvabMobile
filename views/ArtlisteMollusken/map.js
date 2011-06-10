function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Mollusken'){
		emit (doc.ArtBezeichnung, doc);
	}
}
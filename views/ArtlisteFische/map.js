function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Fische'){
		emit (doc.ArtBezeichnung, doc);
	}
}
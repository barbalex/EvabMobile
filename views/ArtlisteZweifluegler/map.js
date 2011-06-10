function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Zweifluegler'){
		emit (doc.ArtBezeichnung, doc);
	}
}
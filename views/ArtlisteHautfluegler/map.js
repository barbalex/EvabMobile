function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Hautfluegler'){
		emit (doc.ArtBezeichnung, doc);
	}
}
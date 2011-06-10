function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Kaefer'){
		emit (doc.ArtBezeichnung, doc);
	}
}
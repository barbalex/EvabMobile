function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Laufkaefer'){
		emit (doc.ArtBezeichnung, doc);
	}
}
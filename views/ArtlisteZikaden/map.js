function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Zikaden'){
		emit (doc.ArtBezeichnung, doc);
	}
}
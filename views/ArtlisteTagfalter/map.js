function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Tagfalter'){
		emit (doc.ArtBezeichnung, doc);
	}
}
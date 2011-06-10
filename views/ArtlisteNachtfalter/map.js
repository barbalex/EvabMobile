function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Nachtfalter'){
		emit (doc.ArtBezeichnung, doc);
	}
}
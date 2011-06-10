function(doc) {
  if(doc.Typ == 'Art' && doc.ArtGruppe == 'Libellen'){
		emit (doc.ArtBezeichnung, doc);
	}
}
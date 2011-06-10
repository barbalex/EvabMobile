function(doc) {
  if(doc.Typ && doc.Typ == 'ArtGruppe' && doc.ArtGruppe){
		emit (doc.ArtGruppe, null);
	}
}
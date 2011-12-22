function(doc) {
  	if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art') && doc.ArtGruppe && doc.ArtGruppe_2_L){
		emit (doc.ArtGruppe, doc);
	}
}
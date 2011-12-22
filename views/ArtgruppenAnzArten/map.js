function(doc) {
	var AG2L_Vorhanden = null;
	if (doc.ArtGruppe_2_L) {
		AG2L_Vorhanden = true;
	}
  	if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art') && doc.ArtGruppe){
		emit ([doc.ArtGruppe, AG2L_Vorhanden], 1);
	}
}
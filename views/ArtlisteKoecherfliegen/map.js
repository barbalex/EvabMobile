﻿function(doc) {
	var L = doc.ArtNameL.substring(0, 1);
  	if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art') && doc.ArtGruppe == 'Koecherfliegen'){
		emit ([L, doc.ArtBezeichnungL], doc);
	}
}
﻿function(doc) {
  if((doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art') && doc.ArtGruppe == 'Netzfluegler'){
		emit (doc.ArtBezeichnung, doc);
	}
}
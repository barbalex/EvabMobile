﻿function(doc) {
	if(doc.Typ && doc.ArtGruppe && doc.ArtBezeichnungL &&(doc.Typ === 'Art' || doc.Typ === 'Unbekannte Art' || doc.Typ === 'Eigene Art')){
		emit ([doc.ArtGruppe, doc.ArtBezeichnungL], doc);
	}
}
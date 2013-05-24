function(doc) {	
  	if(doc.Typ && doc.ArtNameD && (doc.ArtNameD !== null) && doc.ArtBezeichnungD && (doc.ArtBezeichnungD !== null) && doc.ArtGruppe &&(doc.Typ == 'Art' || doc.Typ == 'Unbekannte Art' || doc.Typ == 'Eigene Art')){
  		var L = doc.ArtNameD.substring(0, 1);
		emit ([doc.ArtGruppe, L, doc.ArtBezeichnungD], doc);
	}
}
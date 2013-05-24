function(doc) {
	if(doc.User && ((doc.Typ == 'Beobachtung' && doc.zDatum && doc.zUhrzeit) || (doc.Typ == 'hArt' && doc.hZeitId && doc.aArtName) || (doc.Typ == 'hZeit' && doc.hOrtId && doc.User && doc.zDatum && doc.zUhrzeit) || (doc.Typ == 'hOrt' && doc.hRaumId && doc.oName) || (doc.Typ == 'hRaum' && doc.hProjektId && doc.rName) || (doc.Typ == 'hProjekt' && doc.pName))) {
		emit (doc.User, null);
	}
}
function(head, req) { 
	var row;
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=MeineHierarchischenBeobachtungen.csv",
			"Accept-Charset": "utf-8"
	    }
	});
	send('ProjektId\tpName\tpBemerkungen\tRaumId\trName\trBemerkungen\tOrtId\toName\toXKoord\toYKoord\toLongitudeDecDeg\toLatitudeDecDeg\toLagegenauigkeit\toBemerkungen\tZeitId\tzDatum\tzZeit\tzGenauigkeit\tzDeckungDefinition\tzBemerkungen\tArtId\taArtGruppe\taArtName\taArtId\taMeldungTyp\taArtNameUnsicher\taVorhandensein\taArtNameVerifiziertDurch\taArtNameBemerkungen\taAutor\taMenge\taBemerkungen\n');
	while(row = getRow()) {
		var RaumId = "";
		if (row.key[2].length > 0) {
			RaumId = row.key[2];
		}
		var OrtId = "";
		if (row.key[3].length > 0) {
			OrtId = row.key[3];
		}
		var ZeitId = "";
		if (row.key[4].length > 0) {
			ZeitId = row.key[4];
		}
		var ArtId = "";
		if (row.key[5].length > 0) {
			ArtId = row.key[5];
		}
		send('"' + row.key[1] + '"\t"' + (row.value.pName || "") + '"\t"' + (row.value.pBemerkungen || "") + '"\t"' + RaumId + '"\t"' + (row.value.rName || "") + '"\t"' + (row.value.rBemerkungen || "") + '"\t"' + OrtId + '"\t"' + (row.value.oName || "") + '"\t"' + (row.value.oXKoord || "") + '"\t"' + (row.value.oYKoord || "") + '"\t"' + (row.value.oLongitudeDecDeg || "") + '"\t"' + (row.value.oLatitudeDecDeg || "") + '"\t"' + (row.value.oLagegenauigkeit || "") + '"\t"' + (row.value.oBemerkungen || "") + '"\t"' + ZeitId + '"\t"' + (row.value.zDatum || "") + '"\t"' + (row.value.zZeit || "") + '"\t"' + (row.value.zGenauigkeit || "") + '"\t"' + (row.value.zDeckungDefinition || "") + '"\t"' + (row.value.zBemerkungen || "") + '"\t"' + ArtId + '"\t"' + (row.value.aArtGruppe || "") + '"\t"' + (row.value.aArtName || "") + '"\t"' + (row.value.aArtId || "") + '"\t"' + (row.value.aMeldungTyp || "") + '"\t"' + (row.value.aArtNameUnsicher || "") + '"\t"' + (row.value.aVorhandensein || "") + '"\t"' + (row.value.aArtNameVerifiziertDurch || "") + '"\t"' + (row.value.aArtNameBemerkungen || "") + '"\t"' + (row.value.aAutor || "") + '"\t"' + (row.value.aMenge || "") + '"\t"' + (row.value.aBemerkungen || "") + '"\n');
	}
}


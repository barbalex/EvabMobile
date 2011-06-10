function(head, req) { 
	var row;
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=MeineBeobachtungen.csv",
			"Accept-Charset": "utf-8"
	    }
	});
	send('bArtGruppe, bArtName, bArtId, bAutor, oXKoord, oYKoord, zDatum, zZeit \n');
	while(row = getRow()) {
		send('"' + row.value.bArtGruppe + '", "' + row.value.bArtName + '", "' + row.value.bArtId + '", "' + row.value.bAutor + '", "' + row.value.oXKoord + '", "' + row.value.oYKoord + '", "' + row.value.zDatum + '", "' + row.value.zZeit + '" \n');
	}
}


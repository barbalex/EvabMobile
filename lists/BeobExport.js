function(head, req) { 
	var row;
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=MeineBeobachtungen.csv",
			"Accept-Charset": "utf-8"
	    }
	});
	send('aArtGruppe, aArtName, aArtId, aAutor, oXKoord, oYKoord, zDatum, zZeit \n');
	while(row = getRow()) {
		send('"' + row.value.aArtGruppe + '", "' + row.value.aArtName + '", "' + row.value.aArtId + '", "' + row.value.aAutor + '", "' + row.value.oXKoord + '", "' + row.value.oYKoord + '", "' + row.value.zDatum + '", "' + row.value.zZeit + '" \n');
	}
}


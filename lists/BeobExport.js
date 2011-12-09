function(head, req) { 
	var row;
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=MeineBeobachtungen.csv",
			"Accept-Charset": "utf-8"
	    }
	});
	send('BeobId\taArtGruppe\taArtName\taArtId\taAutor\toXKoord\toYKoord\tzDatum\tzZeit\n');
	while(row = getRow()) {
		send('"' + row.value._id + '"\t"' + row.value.aArtGruppe + '"\t"' + row.value.aArtName + '"\t"' + row.value.aArtId + '"\t"' + (row.value.aAutor || "") + '"\t"' + (row.value.oXKoord || "") + '"\t"' + (row.value.oYKoord || "") + '"\t"' + (row.value.zDatum || "") + '"\t"' + (row.value.zZeit || "") + '"\n');
	}
}


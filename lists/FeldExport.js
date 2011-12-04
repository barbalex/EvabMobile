function(head, req) {
	var row;
	start({
  		"headers": {
    	    "Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=FelddefinitionenEvabMobile.csv",
			"Accept-Charset": "utf-8"
		}
	});
	send('Tabelle\tFeldName\tReihenfolge\tFeldBeschriftung\tFeldBeschreibung\tRolleModusEinfach\tFormularelement\tFormElementTyp\tFeldNameEvab\tFeldNameZdsf\tFeldNameCscf\tArtGruppe\n');
	while(row = getRow()) {
		send('"' + row.value.Tabelle + '"\t"' + row.value.FeldName + '"\t"' + row.value.Reihenfolge + '"\t"' + row.value.FeldBeschriftung + '"\t"' + row.value.FeldBeschreibung + '"\t"' + row.value.RolleModusEinfach + '"\t"' + row.value.Formularelement + '"\t"' + row.value.FormElementTyp + '"\t"' + row.value.FeldNameEvab + '"\t"' + row.value.FeldNameZdsf + '"\t"' + row.value.FeldNameCscf + '"\t"' + row.value.ArtGruppe + '" \n');
	}
}

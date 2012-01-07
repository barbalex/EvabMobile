function(head, req) {
	var row;
	start({
  		"headers": {
    	    "Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=FelddefinitionenEvabMobile.csv",
			"Accept-Charset": "utf-8"
		}
	});
	send('Hierarchiestufe\tFeldName\tReihenfolge\tFeldBeschriftung\tFeldBeschreibung\tFormularelement\tInputTyp\tFeldNameEvab\tFeldNameZdsf\tFeldNameCscf\tFeldNameNism\tFeldNameWslFlechten\FeldNameWslPilze\tArtGruppe\tOptionen\tStandardwert\tSliderMinimum\tSliderMaximum\n');
	while(row = getRow()) {
		send('"' + (row.value.Hierarchiestufe || "") + '"\t"' + (row.value.FeldName || "") + '"\t"' + (row.value.Reihenfolge || "") + '"\t"' + (row.value.FeldBeschriftung || "") + '"\t"' + (row.value.FeldBeschreibung || "") + '"\t"' + (row.value.Formularelement || "") + '"\t"' + (row.value.InputTyp || "") + '"\t"' + (row.value.FeldNameEvab || "") + '"\t"' + (row.value.FeldNameZdsf || "") + '"\t"' + (row.value.FeldNameCscf || "") + '"\t"' + (row.value.FeldNameNism || "") + '"\t"' + (row.value.FeldNameWslFlechten || "") + '"\t"' + (row.value.FeldNameWslPilze || "") + '"\t"' + (row.value.ArtGruppe || "") + '"\t"' + (row.value.Optionen || "") + '"\t"' + (row.value.Standardwert || "") + '"\t"' + (row.value.SliderMinimum || "") + '"\t"' + (row.value.SliderMaximum || "") + '" \n');
	}
}

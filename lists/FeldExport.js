function(head, req) {
	var row;
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=FelddefinitionenEvabMobile.csv",
			"Accept-Charset": "utf-8"
		}
	});
	send('Hierarchiestufe\tFeldName\tReihenfolge\tFeldBeschriftung\tFeldBeschreibung\tFormularelement\tInputTyp\tFeldNameEvab\tFeldNameZdsf\tFeldNameCscf\tFeldNameNism\tFeldNameWslFlechten\tFeldNameWslPilze\tArtGruppe\tOptionen\tStandardwert\tSliderMinimum\tSliderMaximum\n');
	while(row = getRow()) {
		send('"' + (row.doc.Hierarchiestufe || "") + '"\t"' + (row.doc.FeldName || "") + '"\t"' + (row.doc.Reihenfolge || "") + '"\t"' + (row.doc.FeldBeschriftung || "") + '"\t"' + (row.doc.FeldBeschreibung || "") + '"\t"' + (row.doc.Formularelement || "") + '"\t"' + (row.doc.InputTyp || "") + '"\t"' + (row.doc.FeldNameEvab || "") + '"\t"' + (row.doc.FeldNameZdsf || "") + '"\t"' + (row.doc.FeldNameCscf || "") + '"\t"' + (row.doc.FeldNameNism || "") + '"\t"' + (row.doc.FeldNameWslFlechten || "") + '"\t"' + (row.doc.FeldNameWslPilze || "") + '"\t"' + (row.doc.ArtGruppe || "") + '"\t"' + (row.doc.Optionen || "") + '"\t"' + (row.doc.Standardwert || "") + '"\t"' + (row.doc.SliderMinimum || "") + '"\t"' + (row.doc.SliderMaximum || "") + '" \n');
	}
}
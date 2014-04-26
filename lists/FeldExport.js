function(head, req) {
	var row;
	start({
		"headers": {
			"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=FelddefinitionenEvabMobile.csv",
			"Accept-Charset": "utf-8"
		}
	});
	send('ID\tHierarchiestufe\tFeldName\tReihenfolge\tFeldBeschriftung\tFeldBeschreibung\tFormularelement\tInputTyp\tFeldNameEvab\tFeldNameZdsf\tFeldNameCscf\tFeldNameNism\tFeldNameWslFlechten\tFeldNameWslPilze\tArtGruppe\tOptionen\tStandardwert\tSliderMinimum\tSliderMaximum\n');
	while(row = getRow()) {
		doc = row.doc;
		send('"' + doc._id + '"\t"' + (doc.Hierarchiestufe || "") + '"\t"' + (doc.FeldName || "") + '"\t"' + (doc.Reihenfolge || "") + '"\t"' + (doc.FeldBeschriftung || "") + '"\t"' + (doc.FeldBeschreibung || "") + '"\t"' + (doc.Formularelement || "") + '"\t"' + (doc.InputTyp || "") + '"\t"' + (doc.FeldNameEvab || "") + '"\t"' + (doc.FeldNameZdsf || "") + '"\t"' + (doc.FeldNameCscf || "") + '"\t"' + (doc.FeldNameNism || "") + '"\t"' + (doc.FeldNameWslFlechten || "") + '"\t"' + (doc.FeldNameWslPilze || "") + '"\t"' + (doc.ArtGruppe || "") + '"\t"' + (doc.Optionen || "") + '"\t"' + (JSON.stringify(doc.Standardwert) || "") + '"\t"' + (doc.SliderMinimum || "") + '"\t"' + (doc.SliderMaximum || "") + '" \n');
	}
}
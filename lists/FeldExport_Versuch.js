function(head, req) {
	var row;
	start({
  		"headers": {
    	    "Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=FelddefinitionenEvabMobile.csv",
			"Accept-Charset": "utf-8"
		}
	});

	var Titel = "";
	var WerteObject = {};
	var Werte = "\n";
	var FeldName;
	while (row = getRow()) {
		FeldName = row.value.FeldName;
		Titel += FeldName + '\t';
		eval("WerteObject." + FeldName) = row.value;
	}

	/*//letztes t abschneiden, mit n ersetzen
	var Titellaenge = (Titel.length - 1);
	Titel = Titel.slice(0, Titellaenge);
	Titel += 'n';*/

	send(Titel);

	while(row = getRow()) {
		send('"' + (row.value.Hierarchiestufe || "") + '"\t"' + (row.value.FeldName || "") + '"\t"' + (row.value.Reihenfolge || "") + '"\t"' + (row.value.FeldBeschriftung || "") + '"\t"' + (row.value.FeldBeschreibung || "") + '"\t"' + (row.value.Formularelement || "") + '"\t"' + (row.value.InputTyp || "") + '"\t"' + (row.value.FeldNameEvab || "") + '"\t"' + (row.value.FeldNameZdsf || "") + '"\t"' + (row.value.FeldNameCscf || "") + '"\t"' + (row.value.ArtGruppe || "") + '"\t"' + (row.value.Optionen || "") + '"\t"' + (row.value.Standardwert || "") + '"\t"' + (row.value.SliderMinimum || "") + '"\t"' + (row.value.SliderMaximum || "") + '" \n');
	}
	//send(Werte);
}

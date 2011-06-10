function(head, req) {
	var row;
	start({
  		  "headers": {
    	    		"Content-Type": "text/csv",
			"Content-disposition": "attachment;filename=Felddefinitionen.csv",
			"Accept-Charset": "utf-8"
		  }
	});
	send('Tabelle, FeldName, Reihenfolge, FeldBeschriftung, FeldBeschreibung, RolleModusEinfach, Formularelement, FormElementTyp, FeldNameEvab, FeldNameZdsf, FeldNameCscf, ArtGruppe \n');
	while(row = getRow()) {
		send('"' + row.value.Tabelle + '", "' + row.value.FeldName + '", "' + row.value.Reihenfolge + '", "' + row.value.FeldBeschriftung + '", "' + row.value.FeldBeschreibung + '", "' + row.value.RolleModusEinfach + '", "' + row.value.Formularelement + '", "' + row.value.FormElementTyp + '", "' + row.value.FeldNameEvab + '", "' + row.value.FeldNameZdsf + '", "' + row.value.FeldNameCscf + '", "' + row.value.ArtGruppe + '" \n');
	}
}

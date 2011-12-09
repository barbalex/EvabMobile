function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		Tabelle: doc.Tabelle,
		FeldName: doc.FeldName,
		FeldBeschriftung: doc.FeldBeschriftung,
		FeldBeschreibung: doc.FeldBeschreibung,
		Reihenfolge: doc.Reihenfolge,		
		FeldNameEvab: doc.FeldNameEvab,
		FeldNameZdsf: doc.FeldNameZdsf,
		FeldNameCscf: doc.FeldNameCscf,
		Formularelement: doc.Formularelement,
		InputTyp: doc.InputTyp,
		ArtGruppe: doc.ArtGruppe,
		Optionen: doc.Optionen,
		Standardwert: doc.Standardwert,
		SliderMinimum: doc.SliderMinimum,
		SliderMaximum: doc.SliderMaximum
	};
	return Mustache.to_html(this.templates.FeldRead, stash);
}

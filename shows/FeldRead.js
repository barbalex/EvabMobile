function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		Hierarchiestufe: doc.Hierarchiestufe,
		FeldName: doc.FeldName,
		FeldBeschriftung: doc.FeldBeschriftung,
		FeldBeschreibung: doc.FeldBeschreibung || "-",
		Reihenfolge: doc.Reihenfolge,		
		FeldNameEvab: doc.FeldNameEvab || "-",
		FeldNameZdsf: doc.FeldNameZdsf || "-",
		FeldNameCscf: doc.FeldNameCscf || "-",
		FeldNameNism: doc.FeldNameNism || "-",
		FeldNameWslPilze: doc.FeldNameWslPilze || "-",
		FeldNameWslFlechten: doc.FeldNameWslFlechten || "-",
		Formularelement: doc.Formularelement || "-",
		InputTyp: doc.InputTyp || "-",
		ArtGruppe: doc.ArtGruppe || "-",
		Optionen: doc.Optionen || "-",
		Standardwert: doc.Standardwert || "-",
		SliderMinimum: doc.SliderMinimum || "-",
		SliderMaximum: doc.SliderMaximum || "-"
	};
	return Mustache.to_html(this.templates.FeldRead, stash);
}

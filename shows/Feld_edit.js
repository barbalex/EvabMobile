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
		RolleModusEinfach: doc.RolleModusEinfach,
		Formularelement: doc.Formularelement,
		FormElementTyp: doc.FormElementTyp,
		ArtGruppe: doc.ArtGruppe
	};
	return Mustache.to_html(this.templates.FeldEdit, stash);
}

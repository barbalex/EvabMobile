function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		ProjektId: doc.ProjektId,
		RaumId: doc.RaumId,
		OrtId: doc.OrtId,
		ZeitId: doc.ZeitId,
		aArtGruppe: doc.aArtGruppe,
		aArtName: doc.aArtName,
		aArtId: doc.aArtId
	};
	return Mustache.to_html(this.templates.hArtEdit, stash);
}

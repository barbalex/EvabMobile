function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		ArtBezeichnungL: doc.ArtBezeichnungL,
		ArtGruppe: doc.ArtGruppe
	};
	return Mustache.to_html(this.templates.ArtEdit, stash);
}

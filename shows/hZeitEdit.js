function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		hProjektId: doc.hProjektId,
		hRaumId: doc.hRaumId,
		hOrtId: doc.hOrtId,
		zDatum: doc.zDatum,
		zUhrzeit: doc.zUhrzeit
	};
	return Mustache.to_html(this.templates.hZeitEdit, stash);
}

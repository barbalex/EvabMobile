function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		ProjektId: doc.ProjektId
	};
	return Mustache.to_html(this.templates.hOrtListe, stash);
}

function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev
	};
	return Mustache.to_html(this.templates.hRaumListe, stash);
}

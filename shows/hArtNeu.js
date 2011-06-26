function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		ProjektId: doc.ProjektId,
		RaumId: doc.RaumId,
		OrtId: doc.OrtId
	};
	return Mustache.to_html(this.templates.hArtNeu, stash);
}

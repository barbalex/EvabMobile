function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		rName: doc.rName,
		rBemerkungen: doc.rBemerkungen
	};
	return Mustache.to_html(this.templates.hRaumEdit, stash);
}

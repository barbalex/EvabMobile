function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		pName: doc.pName,
		pBemerkungen: doc.pBemerkungen
	};
	return Mustache.to_html(this.templates.hProjektEdit, stash);
}

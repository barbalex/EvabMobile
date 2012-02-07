function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		pName: doc.pName
	};
	return Mustache.to_html(this.templates.hProjektEdit, stash);
}

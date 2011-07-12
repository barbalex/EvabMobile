function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		UserName: doc.UserName,
		Autor: doc.Autor,
		Email: doc.Email,
		Modus: doc.Modus
	};
	return Mustache.to_html(this.templates.UserEdit, stash);
}

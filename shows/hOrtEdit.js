function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		ProjektId: doc.ProjektId,
		RaumId: doc.RaumId,
		oName: doc.oName,
		oXKoord: doc.oXKoord,
		oYKoord: doc.oYKoord,
		oLatitudeDecDeg: doc.oLatitudeDecDeg,
		oLongitudeDecDeg: doc.oLongitudeDecDeg,
		oLagegenauigkeit: doc.oLagegenauigkeit
	};
	return Mustache.to_html(this.templates.hOrtEdit, stash);
}

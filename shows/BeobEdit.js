function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		aArtName: doc.aArtName,
		aArtId: doc.aArtId,
		aArtGruppe: doc.aArtGruppe,
		aAutor: doc.aAutor,
		oXKoord: doc.oXKoord,
		oYKoord: doc.oYKoord,
		oLongitudeDecDeg: doc.oLongitudeDecDeg,
		oLatitudeDecDeg: doc.oLatitudeDecDeg,
		oLagegenauigkeit: doc.oLagegenauigkeit,
		zDatum: doc.zDatum,
		zUhrzeit: doc.zUhrzeit
	};
	return Mustache.to_html(this.templates.BeobEdit, stash);
}

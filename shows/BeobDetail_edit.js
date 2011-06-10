function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stash = {
		id: doc._id,
		rev: doc._rev,
		bArtName: doc.bArtName,
		bArtId: doc.bArtId,
		bArtGruppe: doc.bArtGruppe,
		bAutor: doc.bAutor,
		oXKoord: doc.oXKoord,
		oYKoord: doc.oYKoord,
		oLongitudeDecDeg: doc.oLongitudeDecDeg,
		oLatitudeDecDeg: doc.oLatitudeDecDeg,
		oLagegenauigkeit: doc.oLagegenauigkeit,
		zDatum: doc.zDatum,
		zZeit: doc.zZeit
	};
	return Mustache.to_html(this.templates.BeobDetailEdit, stash);
}

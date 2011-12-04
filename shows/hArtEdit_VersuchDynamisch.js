function(doc, req) {
	var Mustache = require("vendor/couchapp/lib/mustache");
	var stashInhalt = "{";
	for (myvar in doc){
		if (doc.hasOwnProperty(myvar)) {
			myname = myvar.name;
			myvalue = myvar.value;
			stashInhalt += myname + ':"' myvalue + '",';
		}
	}
	stashInhalt += "}"
	var stash = stashInhalt;
	return Mustache.to_html(this.templates.hArtEdit, stash);
}

function(doc) {
	var userliste = [],
		_ = require("views/lib/underscore");
	if(doc.Typ && doc.Typ === 'Feld') {
		if (doc.SichtbarImModusEinfach && doc.SichtbarImModusEinfach.length > 0) {
			// alle user ergänzen
			userliste = _.union(userliste, doc.SichtbarImModusEinfach);
		}

		if (doc.SichtbarImModusHierarchisch && doc.SichtbarImModusHierarchisch.length > 0) {
			// alle User ergänzen
			userliste = _.union(userliste, doc.SichtbarImModusHierarchisch);
		}

		if (doc.Standardwert) {
			// alle User ergänzen
			userliste = _.union(userliste, _.keys(doc.Standardwert));
		}

		if (userliste.length > 0) {
			_.each(userliste, function(user) {
				emit (user, null);
			});
		}
	}
}
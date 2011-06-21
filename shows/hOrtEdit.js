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
		oLagegenauigkeit: doc.oLagegenauigkeit,
		oObergrenzeHöhe: doc.oObergrenzeHöhe,
		oUntergerenzeHöhe: doc.oUntergerenzeHöhe,
		oGenauigkeitHöhe: doc.oGenauigkeitHöhe,
		oFundortbeschrieb: doc.oFundortbeschrieb,
		oGemeinde: doc.oGemeinde,
		oWeltenNr: doc.oWeltenNr,
		oStandort: doc.oStandort,
		oLebensraumDelarze: doc.oLebensraumDelarze,
		oLebensraumUmfeld: doc.oLebensraumUmfeld,
		oArealDelarze: doc.oArealDelarze,
		oSubstratDelarze: doc.oSubstratDelarze,
		oSubstratZdsf: doc.oSubstratZdsf,
		oSubstratCscf: doc.oSubstratCscf,
		oStrukturDelarze: doc.oStrukturDelarze,
		oSpezialobjektDelarze: doc.oSpezialobjektDelarze,
		oTotholzZustand: doc.oTotholzZustand,
		oAnthropStörungenDelarze: doc.oAnthropStörungenDelarze,
		oDynamischeProzesseDelarze: doc.oDynamischeProzesseDelarze,
		oHydrologieDelarze: doc.oHydrologieDelarze,
		oLänge: doc.oLänge,
		oBreite: doc.oBreite,
		oTiefe: doc.oTiefe,
		oFläche: doc.oFläche,
		oFlächeKlassiert: doc.oFlächeKlassiert,
		oHangneigung: doc.oHangneigung,
		oExposition: doc.oExposition,
		oBodenPh: doc.oBodenPh,
		oBodenBemerkungen: doc.oBodenBemerkungen,
		oBemerkungen: doc.oBemerkungen
	};
	return Mustache.to_html(this.templates.hOrtEdit, stash);
}

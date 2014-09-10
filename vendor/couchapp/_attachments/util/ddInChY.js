/**
 * wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict';

module.exports = function(breite, länge) {
    var DdInWgs84BreiteGrad = require('./util/ddInWgs84BreiteGrad'),
        breiteGrad = DdInWgs84BreiteGrad(breite),
        DdInWgs84BreiteMin = require('./util/ddInWgs84BreiteMin'),
        breiteMin = DdInWgs84BreiteMin(breite),
        DdInWgs84BreiteSec = require('./util/ddInWgs84BreiteSec'),
        breiteSec = DdInWgs84BreiteSec(breite),
        DdInWgs84LängeGrad = require('./util/ddInWgs84LaengeGrad'),
        längeGrad = DdInWgs84LängeGrad(länge),
        DdInWgs84LängeMin = require('./util/ddInWgs84LaengeMin'),
        längeMin = DdInWgs84LängeMin(länge),
        DdInWgs84LängeSec = require('./util/ddInWgs84LaengeSec'),
        längeSec = DdInWgs84LängeSec(länge),
        Wgs84InChY = require('./util/wgs84InChY');
    return Math.floor(Wgs84InChY(breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, längeSec));
};
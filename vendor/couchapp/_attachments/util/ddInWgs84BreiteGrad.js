/**
 * wandelt decimal degrees (vom GPS) in WGS84 um
 * @return {number}
 */

'use strict';

module.exports = function(Breite) {
    return Math.floor(Breite);
};
/**
 * Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict';

module.exports = function(breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, längeSec) {
    var lat,
        lng,
        lat_aux,
        lng_aux,
        x;

    // Converts degrees dec to sex
    lat = breiteSec + breiteMin*60 + breiteGrad*3600;
    lng = längeSec + längeMin*60 + längeGrad*3600;

    // Axiliary values (% Bern)
    lat_aux = (lat - 169028.66)/10000;
    lng_aux = (lng - 26782.5)/10000;

    x = 200147.07
        + 308807.95 * lat_aux
        +   3745.25 * Math.pow(lng_aux,2)
        +     76.63 * Math.pow(lat_aux,2)
        -    194.56 * Math.pow(lng_aux,2) * lat_aux
        +    119.79 * Math.pow(lat_aux,3);

    return x;
};
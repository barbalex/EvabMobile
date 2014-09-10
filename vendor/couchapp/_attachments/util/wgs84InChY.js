/**
 * Wandelt WGS84 in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict';

module.exports = function(breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, läengeSec) {
    var lat,
        lng,
        lat_aux,
        lng_aux,
        y;

    // Converts degrees dec to sex
    lat = breiteSec + breiteMin*60 + breiteGrad*3600;
    lng = läengeSec + längeMin*60 + längeGrad*3600;

    // Axiliary values (% Bern)
    lat_aux = (lat - 169028.66)/10000;
    lng_aux = (lng - 26782.5)/10000;

    // Process Y
    y = 600072.37
        + 211455.93 * lng_aux
        -  10938.51 * lng_aux * lat_aux
        -      0.36 * lng_aux * Math.pow(lat_aux,2)
        -     44.54 * Math.pow(lng_aux,3);

    return y;
};
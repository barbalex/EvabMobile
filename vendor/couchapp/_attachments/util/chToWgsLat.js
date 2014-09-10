/**
 * Convert CH y/x to WGS lat
 * @return {number}
 */

'use strict';

module.exports = function(y, x) {
    // Converts militar to civil and to unit = 1000km
    var lat,
        y_aux,
        x_aux;

    // Axiliary values (% Bern)
    y_aux = (y - 600000)/1000000;
    x_aux = (x - 200000)/1000000;

    // Process lat
    lat = 16.9023892
        +  3.238272 * x_aux
        -  0.270978 * Math.pow(y_aux,2)
        -  0.002528 * Math.pow(x_aux,2)
        -  0.0447   * Math.pow(y_aux,2) * x_aux
        -  0.0140   * Math.pow(x_aux,3);

    // Unit 10000" to 1 " and converts seconds to degrees (dec)
    lat = lat * 100/36;

    return lat;
};
/**
 * Convert CH y/x to WGS long
 * @return {number}
 */

'use strict'

module.exports = function (y, x) {
  // Converts militar to civil and to unit = 1000km
  var lng,
    y_aux,
    x_aux

  // Axiliary values (% Bern)
  y_aux = (y - 600000) / 1000000
  x_aux = (x - 200000) / 1000000

  // Process long
  lng = 2.6779094
    + 4.728982 * y_aux
    + 0.791484 * y_aux * x_aux
    + 0.1306 * y_aux * Math.pow(x_aux, 2)
    - 0.0436 * Math.pow(y_aux, 3)

  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lng = lng * 100 / 36

  return lng
}

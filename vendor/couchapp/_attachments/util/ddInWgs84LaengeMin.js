/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (Laenge) {
  var LaengeGrad = Math.floor(Laenge)
  return Math.floor((Laenge - LaengeGrad) * 60)
}

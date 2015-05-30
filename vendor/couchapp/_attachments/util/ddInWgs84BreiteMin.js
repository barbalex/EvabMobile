/**
 * wandelt Projektionen um
 * @return {number}
 */

'use strict'

module.exports = function (Breite) {
  var BreiteGrad = Math.floor(Breite)
  return Math.floor((Breite - BreiteGrad) * 60)
}

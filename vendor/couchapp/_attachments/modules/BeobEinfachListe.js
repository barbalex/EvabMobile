/**
 * Modell für die Liste der einfachen Beobachtungen
 */

'use strict';

var _ = require('underscore')
    , Backbone = require('backbone')
    , BeobEinfach = require('./BeobEinfach')
    ;

var BeobEinfachListe = Backbone.Collection.extend({
    model: BeobEinfach
    , idAttribute: '_id'
});

module.exports = BeobEinfachListe;
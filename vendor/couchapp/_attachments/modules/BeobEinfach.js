/**
 * Modell für einfache Beobachtungen
 */

'use strict';

var _ = require('underscore')
    , Backbone = require('backbone')
    ;

var BeobEinfach = Backbone.Model.extend({
    idAttribute: '_id'
});

module.exports = BeobEinfach;
'use strict';

module.exports = function() {
    var jetzt = new Date(),
        Std = jetzt.getHours(),
        StdAusgabe = ((Std < 10) ? "0" + Std : Std),
        Min = jetzt.getMinutes(),
        MinAusgabe = ((Min < 10) ? "0" + Min : Min),
        Sek = jetzt.getSeconds(),
        SekAusgabe = ((Sek < 10) ? "0" + Sek : Sek);
    return StdAusgabe + ":" + MinAusgabe + ":" + SekAusgabe;
};
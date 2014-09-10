'use strict';

module.exports = function() {
    var jetzt = new Date(),
        Jahr = jetzt.getFullYear(),
        Mnt = jetzt.getMonth()+1,
        MntAusgabe = ((Mnt < 10) ? "0" + Mnt : Mnt),
        Tag = jetzt.getDate(),
        TagAusgabe = ((Tag < 10) ? "0" + Tag : Tag);
    return Jahr + "-" + MntAusgabe + "-" + TagAusgabe;
};
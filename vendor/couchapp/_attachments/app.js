(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./vendor/couchapp/_attachments/evab.js":[function(require,module,exports){
/*
Diese Funktionen werden in evab auf mehreren Seiten benutzt
*/

var $ = require('jquery')
var _ = require('underscore')

window.em = window.em || {}

window.em.melde = function (Meldung) {
  'use strict'
  $("<div id='meldung' data-role='popup' class='ui-content' data-overlay-theme='a'><a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right'>Close</a>" + Meldung + '</div>')
    .css({'line-height': '95%', 'font-weight': 'bold'})
    .appendTo($.mobile.pageContainer)
  $('#meldung').popup({
    afterclose: function () {
      // Meldung wieder aus pageContainer entfernen
      $('#meldung').remove()
    }
  }).popup('open')
}

// wird in FeldEdit.html verwendet
window.em.geheZurueckFE = function () {
  'use strict'
  window.em.leereStorageFeldEdit()
  if (window.localStorage.zurueck && window.localStorage.zurueck !== 'FelderWaehlen.html') {
    // via die Feldliste zurück
    window.em.leereStorageFeldEdit()
    $.mobile.navigate('FeldListe.html')
  } else if (window.localStorage.zurueck && window.localStorage.zurueck === 'FelderWaehlen.html') {
    // direkt zurück, Feldliste auslassen
    window.em.leereStorageFeldEdit()
    window.em.leereStorageFeldListe()
    // TODO: Geht zwar richtig zurück. Springt dann aber direkt zur BeobListe.html!
    $.mobile.navigate('FelderWaehlen.html')
    delete window.localStorage.zurueck
  } else {
    // uups, kein zurück vorhanden
    window.em.leereAlleVariabeln()
    $.mobile.navigate('BeobListe.html')
  }
}

// Neue Beobachtungen werden gespeichert
// ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
// aufgerufen bloss von Artenliste.html
window.em.speichereNeueBeob = function (aArtBezeichnung) {
  'use strict'
  var doc = {},
    erstelleNeuesDatum = require('./util/erstelleNeuesDatum'),
    erstelleNeueUhrzeit = require('./util/erstelleNeueUhrzeit')
  doc.User = window.localStorage.Email
  doc.aAutor = window.localStorage.Autor
  doc.aArtGruppe = window.localStorage.aArtGruppe
  // delete window.localStorage.aArtGruppe
  doc.aArtName = aArtBezeichnung
  doc.aArtId = window.localStorage.aArtId
  if (window.localStorage.Von === 'hArtListe' || window.localStorage.Von === 'hArtEdit') {
    doc.Typ = 'hArt'
    doc.hProjektId = window.localStorage.ProjektId
    doc.hRaumId = window.localStorage.RaumId
    doc.hOrtId = window.localStorage.OrtId
    doc.hZeitId = window.localStorage.ZeitId
    doc.aArtId = window.localStorage.aArtId
    window.em.speichereNeueBeob_02(doc)
  } else {
    // window.localStorage.Von == "BeobListe" || window.localStorage.Von == "BeobEdit"
    doc.Typ = 'Beobachtung'
    doc.zDatum = erstelleNeuesDatum()
    doc.zUhrzeit = erstelleNeueUhrzeit()
    window.em.speichereNeueBeob_02(doc)
  }
}

// Neue Beobachtungen werden gespeichert
// ausgelöst durch BeobListe.html, BeobEdit.html, hArtListe.html oder hArtEdit.html
// dies ist der letzte Schritt:
// Autor anfügen und weiter zum Edit-Formular
window.em.speichereNeueBeob_02 = function (doc) {
  'use strict'
  var $db = $.couch.db('evab')
  $db.saveDoc(doc, {
    success: function (data) {
      var row_objekt = {}
      // doc um id und rev ergänzen
      doc._id = data.id
      doc._rev = data.rev
      if (doc.Typ === 'hArt') {
        // Variabeln verfügbar machen
        window.localStorage.hArtId = data.id
        // damit hArtEdit.html die hArt nicht aus der DB holen muss
        window.em.hArt = doc
        window.localStorage.aArtId = window.em.hArt.aArtId
        window.localStorage.aArtName = window.em.hArt.aArtName
        window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
        // window.em.hArtListe ergänzen, damit bei der nächsten Art kontrolliert werden kann, ob sie schon erfasst wurde
        row_objekt.id = data.id
        row_objekt.doc = doc
        // Vorsicht: window.em.hArtListe existiert nicht, wenn in hArtEdit F5 gedrückt wurde!
        if (window.em.hArtListe && window.em.hArtListe.rows) {
          window.em.hArtListe.rows.push(row_objekt)
          // jetzt die Liste neu sortieren
          window.em.hArtListe.rows = _.sortBy(window.em.hArtListe.rows, function (row) {
            return row.doc.aArtName
          })
        }
        if (window.localStorage.hArtSicht === 'liste') {
          $.mobile.navigate('hArtEditListe.html')
        } else {
          $.mobile.navigate('hArtEdit.html')
        }
      } else {
        // Variabeln verfügbar machen
        window.localStorage.BeobId = data.id
        // damit BeobEdit.html die Beob nicht aus der DB holen muss
        window.em.Beobachtung = doc
        // Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
        window.em.leereStorageBeobListe()
        $.mobile.navigate('BeobEdit.html')
      }
    },
    error: function () {
      window.em.melde('Beobachtung nicht gespeichert.')
    }
  })
}

// Speichert, wenn in BeobEdit oder hArtEdit eine neue Art und ev. auch eine neue Artgruppe gewählt wurde
// erwartet window.localStorage.Von = von welchem Formular aufgerufen wurde
window.em.speichereBeobNeueArtgruppeArt = function (aArtName) {
  'use strict'
  var docId
  if (window.localStorage.Von === 'BeobListe' || window.localStorage.Von === 'BeobEdit') {
    docId = window.localStorage.BeobId
  } else {
    docId = window.localStorage.hArtId
  }
  var $db = $.couch.db('evab')
  $db.openDoc(docId, {
    success: function (beob) {
      if (window.localStorage.aArtGruppe) {
        beob.aArtGruppe = window.localStorage.aArtGruppe
      }
      beob.aArtName = aArtName
      beob.aArtId = window.localStorage.aArtId
      $db.saveDoc(beob, {
        success: function (data) {
          if (window.localStorage.Von === 'BeobListe' || window.localStorage.Von === 'BeobEdit') {
            // Variabeln verfügbar machen
            window.localStorage.BeobId = docId
            // Globale Variablen für BeobListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
            window.em.leereStorageBeobListe()
            $.mobile.navigate('BeobEdit.html')
          } else {
            // Variabeln verfügbar machen
            window.localStorage.hArtId = docId
            // damit hArtEdit.html die hArt nicht aus der DB holen muss
            window.em.hArt = data
            window.localStorage.aArtId = window.em.hArt.aArtId
            window.localStorage.aArtName = window.em.hArt.aArtName
            window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
            // window.em.hArtListe anpassen
            // Vorsicht: window.em.hArtListe existiert nicht, wenn in hArtEdit F5 gedrückt wurde!
            if (window.em.hArtListe && window.em.hArtListe.rows) {
              _.each(window.em.hArtListe.rows, function (row) {
                var hArt = row.doc
                if (hArt._id == docId) {
                  hArt.aArtGruppe = window.localStorage.aArtGruppe
                  hArt.aArtName = aArtName
                  hArt.aArtId = window.localStorage.aArtId
                }
              })
              // window.em.hArtListe neu sortieren
              window.em.hArtListe.rows = _.sortBy(window.em.hArtListe.rows, function (row) {
                return row.doc.aArtName
              })
            }
            delete window.localStorage.aArtGruppe
            if (window.localStorage.hArtSicht === 'liste') {
              $.mobile.navigate('hArtEditListe.html')
            } else {
              $.mobile.navigate('hArtEdit.html')
            }
          }
        },
        error: function () {
          window.em.melde('Fehler: Beobachtung nicht gespeichert')
        }
      })
    }
  })
}

window.em.erstelleNeueZeit = function () {
  'use strict'
  // Neue Zeiten werden erstellt
  // ausgelöst durch hZeitListe.html oder hZeitEdit.html
  // dies ist der erste Schritt: doc bilden
  var doc = {},
    $hZeitEdit = $('#hZeitEdit'),
    erstelleNeuesDatum = require('./util/erstelleNeuesDatum'),
    erstelleNeueUhrzeit = require('./util/erstelleNeueUhrzeit')
  doc.Typ = 'hZeit'
  doc.User = window.localStorage.Email
  doc.hProjektId = window.localStorage.ProjektId
  doc.hRaumId = window.localStorage.RaumId
  doc.hOrtId = window.localStorage.OrtId
  doc.zDatum = erstelleNeuesDatum()
  doc.zUhrzeit = erstelleNeueUhrzeit()
  // an hZeitEdit.html übergeben
  window.em.hZeit = doc
  // Variabeln verfügbar machen
  delete window.localStorage.ZeitId
  window.localStorage.Status = 'neu'
  // Globale Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
  delete window.em.ZeitListe
  // Vorsicht: Von hZeitEdit.html aus samepage transition!
  if ($hZeitEdit.length > 0 && $hZeitEdit.attr('data-url') !== 'hZeitEdit') {
    // Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
    // das Objekt muss über die window.localStorage übermittelt werden
    window.localStorage.hZeit = JSON.stringify(window.em.hZeit)
    window.open('hZeitEdit.html', '_self')
  } else if ($hZeitEdit.length > 0 && $hZeitEdit.attr('data-url') === 'hZeitEdit') {
    // $(":mobile-pagecontainer").pagecontainer("change", "#hZeitEdit.html", { allowSamePageTransition : true });    FUNKTIONIERT NICHT
    window.localStorage.hZeit = JSON.stringify(window.em.hZeit)
    window.open('hZeitEdit.html', '_self')
  } else {
    $.mobile.navigate('hZeitEdit.html')
  }
}

// erstellt einen neuen Ort
// wird aufgerufen von: hOrtEdit.html, hOrtListe.html
// erwartet Username, hProjektId, hRaumId
window.em.erstelleNeuenOrt = function () {
  'use strict'
  var doc = {},
    $hOrtEdit = $('#hOrtEdit')
  doc.Typ = 'hOrt'
  doc.User = window.localStorage.Email
  doc.hProjektId = window.localStorage.ProjektId
  doc.hRaumId = window.localStorage.RaumId
  // an hOrtEdit.html übergeben
  window.em.hOrt = doc
  // Variabeln verfügbar machen
  delete window.localStorage.OrtId
  // Globale Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
  window.em.leereStorageOrtListe('mitLatLngListe')
  window.localStorage.Status = 'neu'  // das löst bei initiiereOrtEdit die Verortung aus
  // Vorsicht: Von hOrtEdit.html aus samepage transition!
  if ($hOrtEdit.length > 0 && $hOrtEdit.attr('data-url') !== 'hOrtEdit') {
    // Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
    // das Objekt muss über die window.localStorage übermittelt werden
    window.localStorage.hOrt = JSON.stringify(window.em.hOrt)
    window.open('hOrtEdit.html', '_self')
  } else if ($hOrtEdit.length > 0 && $hOrtEdit.attr('data-url') === 'hOrtEdit') {
    // $(":mobile-pagecontainer").pagecontainer("change", "#hOrtEdit.html", {allowSamePageTransition : true})    FUNKTIONIERT NICHT
    window.localStorage.hOrt = JSON.stringify(window.em.hOrt)
    window.open('hOrtEdit.html', '_self')
  } else {
    $.mobile.navigate('hOrtEdit.html')
  }
}

window.em.erstelleNeuenRaum = function () {
  'use strict'
  var doc = {},
    $hRaumEdit = $('#hRaumEdit')
  doc.Typ = 'hRaum'
  doc.User = window.localStorage.Email
  doc.hProjektId = window.localStorage.ProjektId
  // in Objekt speichern, das an hRaumEdit.html übergeben wird
  window.em.hRaum = doc
  // Variabeln verfügbar machen
  delete window.localStorage.RaumId
  window.localStorage.Status = 'neu'
  // Globale Variablen für RaumListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
  window.em.leereStorageRaumListe('mitLatLngListe')
  // Vorsicht: Von hRaumEdit.html aus same page transition!
  if ($hRaumEdit.length > 0 && $hRaumEdit.attr('data-url') !== 'hRaumEdit') {
    // Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
    // das Objekt muss über die window.localStorage übermittelt werden
    window.localStorage.hRaum = JSON.stringify(window.em.hRaum)
    window.open('hRaumEdit.html', '_self')
  } else if ($hRaumEdit.length > 0 && $hRaumEdit.attr('data-url') === 'hRaumEdit') {
    // $(":mobile-pagecontainer").pagecontainer("change", "#hRaumEdit.html", {allowSamePageTransition : "true"})   FUNKTIONIERT NICHT
    window.localStorage.hRaum = JSON.stringify(window.em.hRaum)
    window.open('hRaumEdit.html', '_self')
  } else {
    $.mobile.navigate('hRaumEdit.html')
  }
}

// erstellt ein Objekt für ein neues Projekt und öffnet danach hProjektEdit.html
// das Objekt wird erst von initiiereProjektEdit gespeichert (einen DB-Zugriff sparen)
window.em.erstelleNeuesProjekt = function () {
  'use strict'
  var doc = {},
    $hProjektEdit = $('#hProjektEdit')
  doc.Typ = 'hProjekt'
  doc.User = window.localStorage.Email
  // damit hProjektEdit.html die hArt nicht aus der DB holen muss
  window.em.hProjekt = doc
  // ProjektId faken, sonst leitet die edit-Seite an die oberste Liste weiter
  delete window.localStorage.ProjektId
  window.localStorage.Status = 'neu'
  // Globale Variablen für hProjektListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
  window.em.leereStorageProjektListe('mitLatLngListe')
  // Vorsicht: Von hProjektEdit.html aus same page transition!
  if ($hProjektEdit.length > 0 && $hProjektEdit.attr('data-url') !== 'hProjektEdit') {
    // Wenn die data-url ein Pfad ist, verursacht changePage einen Fehler: b.data("page") is undefined
    // das Objekt muss über die window.localStorage übermittelt werden
    window.localStorage.hProjekt = JSON.stringify(window.em.hProjekt)
    window.open('hProjektEdit.html', '_self')
  } else if ($hProjektEdit.length > 0 && $hProjektEdit.attr('data-url') === 'hProjektEdit') {
    // $.mobile.navigate($hProjektEdit, {allowSamePageTransition: true})    FUNKTIONIERT NICHT
    window.localStorage.hProjekt = JSON.stringify(window.em.hProjekt)
    window.open('hProjektEdit.html', '_self')
  } else {
    $.mobile.navigate('hProjektEdit.html')
  }
}

window.em.öffneMeineEinstellungen = function () {
  'use strict'
  $.mobile.navigate('UserEdit.html')
}

window.em.löscheDokument = function (DocId) {
  'use strict'
  var $db = $.couch.db('evab')
  return $db.openDoc(DocId, {
    success: function (document) {
      $db.removeDoc(document, {
        success: function () {
          return true
        },
        error: function () {
          return false
        }
      })
    },
    error: function () {
      return false
    }
  })
}

// initiiert Variabeln, fixe Felder und dynamische Felder in BeobEdit.html
// wird aufgerufen von BeobEdit.html und Felder_Beob.html
window.em.initiiereBeobEdit = function () {
  'use strict'
  // Anhänge ausblenden, weil sie sonst beim Wechsel stören
  // $('#AnhängeBE').hide()
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  if (window.em.FeldlisteBeobEdit) {
    window.em.initiiereBeobEdit_2()
  } else {
    // das dauert länger - hinweisen
    $('#BeobEditFormHtml').html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>')
    // holt die Feldliste aus der DB
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListeBeob?include_docs=true', {
      success: function (data) {
        // Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
        window.em.FeldlisteBeobEdit = data
        window.em.initiiereBeobEdit_2()
      }
    })
  }
}

// allfällige Beob übernehmen von speichereNeueBeob
// um die DB-Abfrage zu sparen
window.em.initiiereBeobEdit_2 = function () {
  'use strict'
  // achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
  if (window.em.Beobachtung && (!window.localStorage.Von || window.localStorage.Von !== 'BeobEdit')) {
    window.em.initiiereBeobEdit_3()
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.BeobId, {
      success: function (data) {
        window.em.Beobachtung = data
        window.em.initiiereBeobEdit_3()
      }
    })
  }
}

window.em.initiiereBeobEdit_3 = function () {
  'use strict'
  // diese (globalen) Variabeln werden in BeobEdit.html gebraucht
  // bei neuen Beob hat das Objekt noch keine ID
  if (window.em.Beobachtung._id) {
    window.localStorage.BeobId = window.em.Beobachtung._id
  } else {
    window.localStorage.BeobId = 'neu'
  }
  window.localStorage.aArtGruppe = window.em.Beobachtung.aArtGruppe
  window.localStorage.aArtName = window.em.Beobachtung.aArtName
  window.localStorage.aArtId = window.em.Beobachtung.aArtId
  window.localStorage.oLongitudeDecDeg = window.em.Beobachtung.oLongitudeDecDeg || ''
  window.localStorage.oLatitudeDecDeg = window.em.Beobachtung.oLatitudeDecDeg || ''
  window.localStorage.oLagegenauigkeit = window.em.Beobachtung.oLagegenauigkeit || ''
  window.localStorage.oXKoord = window.em.Beobachtung.oXKoord
  window.localStorage.oYKoord = window.em.Beobachtung.oYKoord
  window.em.setzeFixeFelderInBeobEdit(window.em.Beobachtung)
  window.em.erstelleDynamischeFelderBeobEdit()
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// generiert in BeobEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// und aktualisiert die Links für pagination
// Mitgeben: id der Beobachtung, Username
window.em.erstelleDynamischeFelderBeobEdit = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFürBeobEditForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  } else {
    htmlContainer = ''
  }
  // nötig, weil sonst die dynamisch eingefügten Elemente nicht erscheinen (Felder) bzw. nicht funktionieren (links)
  $('#BeobEditFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  window.em.aktiviereFlipswitches('#BeobEditFormHtml', window.em.Beobachtung)

  $('#BeobEdit').trigger('create').trigger('refresh')
}

// setzt die Values in die hart codierten Felder im Formular BeobEdit.html
// erwartet das Objekt Beob, welches die Werte enthält
window.em.setzeFixeFelderInBeobEdit = function () {
  'use strict'
  var $aArtGruppeBE = $('#aArtGruppeBE'),
    $aArtNameBE = $('#aArtNameBE')
  $aArtGruppeBE.selectmenu()
  $aArtGruppeBE.html("<option value='" + window.em.Beobachtung.aArtGruppe + "'>" + window.em.Beobachtung.aArtGruppe + '</option>')
  $aArtGruppeBE.val(window.em.Beobachtung.aArtGruppe)
  // JQUERY MOBILE BRACHT MANCHMAL LANGE UM ZU INITIALIIEREN
  // OHNE TIMEOUT REKLAMIERT ES BEIM REFRESH, DAS WIDGET SEI NOCH NICHT INITIALISIERT!!!!
  // NACH EIN MAL VERZÖGERN HAT ES ABER WIEDER FUNKTIONIERT????!!!!
  setTimeout(function () {
    $aArtGruppeBE.selectmenu('refresh')
  }, 0)
  $aArtNameBE.selectmenu()
  $aArtNameBE.html("<option value='" + window.em.Beobachtung.aArtName + "'>" + window.em.Beobachtung.aArtName + '</option>')
  $aArtNameBE.val(window.em.Beobachtung.aArtName)
  $aArtNameBE.selectmenu('refresh')
  $("[name='aAutor']").val(window.em.Beobachtung.aAutor)
  $("[name='oXKoord']").val(window.em.Beobachtung.oXKoord)
  $("[name='oYKoord']").val(window.em.Beobachtung.oYKoord)
  $("[name='oLagegenauigkeit']").val(window.em.Beobachtung.oLagegenauigkeit)
  $("[name='zDatum']").val(window.em.Beobachtung.zDatum)
  $("[name='zUhrzeit']").val(window.em.Beobachtung.zUhrzeit)
}

// generiert das Html für das Formular in BeobEdit.html
// erwartet Feldliste als Objekt; Beob als Objekt, Artgruppe
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFürBeobEditForm = function () {
  'use strict'
  var htmlContainer = '',
    ArtGruppe = window.em.Beobachtung.aArtGruppe,
    FeldWert
  _.each(window.em.FeldlisteBeobEdit.rows, function (row) {
    var Feld = row.doc,
      FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    if ((Feld.User === window.localStorage.Email || Feld.User === 'ZentrenBdKt') && Feld.SichtbarImModusEinfach.indexOf(window.localStorage.Email) !== -1 && ['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1) {
      // In Hierarchiestufe Art muss die Artgruppe im Feld Artgruppen enthalten sein
      // vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
      if (Feld.Hierarchiestufe !== 'Art' || (typeof Feld.ArtGruppe !== 'undefined' && (Feld.ArtGruppe.indexOf(ArtGruppe) >= 0 || Feld.ArtGruppe[0] === 'alle'))) {
        if (window.localStorage.Status === 'neu' && Feld.Standardwert && Feld.Standardwert[window.localStorage.Email]) {
          FeldWert = Feld.Standardwert[window.localStorage.Email]
          // Objekt Beob um den Standardwert ergänzen, um später zu speichern
          window.em.Beobachtung[FeldName] = FeldWert
        } else {
          // "" verhindert die Anzeige von undefined im Feld
          FeldWert = window.em.Beobachtung[FeldName] || ''
        }
        htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
      }
    }
  })
  if (window.localStorage.Status === 'neu') {
    // in neuen Datensätzen dynamisch erstellte Standardwerte speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.Beobachtung, {
      success: function (data) {
        window.em.Beobachtung._id = data.id
        window.em.Beobachtung._rev = data.rev
        window.localStorage.BeobId = data.id
        window.em.GetGeolocation(data.id, 'Beobachtung')
      }
    })
    delete window.localStorage.Status
  } else {
    // Neue Datensätze haben keine Attachments
    window.em.zeigeAttachments(window.em.Beobachtung, 'BE')
  }
  return htmlContainer
}

// BeobListe in BeobList.html vollständig neu aufbauen
window.em.initiiereBeobliste = function () {
  'use strict'
  // hat BeobEdit.html eine BeobListe übergeben?
  if (window.em.BeobListe) {
    // Beobliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiiereBeobliste_2()
  } else {
    // Beobliste aus DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/BeobListe?startkey=["' + window.localStorage.Email + '",{}]&endkey=["' + window.localStorage.Email + '"]&descending=true&include_docs=true', {
      success: function (data) {
        // BeobListe für BeobEdit bereitstellen
        window.em.BeobListe = data
        window.em.initiiereBeobliste_2()
      }
    })
  }
}

window.em.initiiereBeobliste_2 = function () {
  'use strict'
  var anzBeob = window.em.BeobListe.rows.length,
    beob,
    listItemContainer = '',
    Titel2,
    artgruppenname

  // Im Titel der Seite die Anzahl Beobachtungen anzeigen
  Titel2 = ' Beobachtungen'
  if (anzBeob === 1) {
    Titel2 = ' Beobachtung'
  }
  $('#BeobListePageHeader')
    .find('.BeobListePageTitel')
    .text(anzBeob + Titel2)

  if (anzBeob === 0) {
    listItemContainer = '<li><a href="#" class="erste NeueBeobBeobListe">Erste Beobachtung erfassen</a></li>'
  } else {
    _.each(window.em.BeobListe.rows, function (row) {
      beob = row.doc
      artgruppenname = encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + '.png'
      if (beob.aArtGruppe === 'DiverseInsekten') {
        artgruppenname = 'unbenannt.png'
      }
      listItemContainer += "<li class='beob ui-li-has-thumb' id='"
      listItemContainer += beob._id
      listItemContainer += "'><a href='#'><img class='ui-li-thumb' src='"
      listItemContainer += 'Artgruppenbilder/' + artgruppenname
      listItemContainer += "' /><h3 class='aArtName'>"
      listItemContainer += beob.aArtName
      listItemContainer += "<\/h3><p class='zUhrzeit'>"
      listItemContainer += beob.zDatum
      listItemContainer += '&nbsp; &nbsp;'
      listItemContainer += beob.zUhrzeit
      listItemContainer += '<\/p><\/a> <\/li>'
    })
  }
  $('#BeoblisteBL')
    .html(listItemContainer)
    .listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#BeobListe')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// löscht Anhänge
// erwartet den Datensatz als Objekt und das Objekt, dass geklickt wurde
window.em.löscheAnhang = function (that, Objekt, id) {
  'use strict'
  if (Objekt) {
    // Es wurde ein Objekt übergeben, keine DB-Abfrage nötig
    window.em.löscheAnhang_2(that, Objekt)
  } else {
    // Objekt aus der DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(id, {
      success: function (data) {
        window.em[Objekt.Typ] = data
        window.em.löscheAnhang_2(that, window.em[Objekt.Typ])
      },
      error: function () {
        window.em.melde('Fehler: Anhang wurde nicht entfernt')
      }
    })
  }
}

window.em.löscheAnhang_2 = function (that, Objekt) {
  'use strict'
  var Dateiname = that.id
  // Anhang aus Objekt entfernen
  delete window.em[Objekt.Typ]._attachments[Dateiname]
  // Objekt in DB speichern
  $db.saveDoc(window.em[Objekt.Typ], {
    success: function (data) {
      // rev im Objekt ergänzen
      // die globale Variable heisst gleich, wie der Typ im Objekt
      window.em[Objekt.Typ]._rev = data.rev
      // im Formular den Anhang und die Lösch-Schaltfläche entfernen
      $(that).parent().parent().remove()
    },
    error: function () {
      window.em.melde('Fehler: Anhänge werden nicht richtig angezeigt')
    }
  })
}

// initiiert UserEdit.html
window.em.initiiereUserEdit = function () {
  'use strict'
  $('#ue_Email').val(window.localStorage.Email)
  $("[name='Datenverwendung']").checkboxradio()
  if (window.localStorage.Autor) {
    $('#Autor').val(window.localStorage.Autor)
  }
  $.couch.userDb(function (db) {
    db.openDoc('org.couchdb.user:' + window.localStorage.Email, {
      success: function (User) {
        // fixe Felder aktualisieren
        if (User.Datenverwendung) {
          $('#' + User.Datenverwendung).prop('checked', true).checkboxradio('refresh')
          window.localStorage.Datenverwendung = User.Datenverwendung
        } else {
          // Standardwert setzen
          $('#JaAber').prop('checked', true).checkboxradio('refresh')
        }
        window.em.blendeMenus()
        window.em.speichereLetzteUrl()
      },
      error: function () {
        console.log('Fehler in window.em.initiiereUserEdit')
        // Standardwert setzen
        $('#JaAber').prop('checked', true).checkboxradio('refresh')
      }
    })
  })
}

// initiiert Installieren.html
// kurz, da keine Daten benötigt werden
window.em.initiiereInstallieren = function () {
  'use strict'
  window.em.blendeMenus()
  window.em.speichereLetzteUrl()
}

// generiert in hProjektEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Projekts, Username
// bei neuen Projekten wird das zuvor erzeugte Projekt übernommen, um die DB-Anfrage zu sparen
window.em.initiiereProjektEdit = function () {
  'use strict'
  // Anhänge ausblenden, weil sonst beim Einblenden diejenigen des vorigen Datensatzes aufblitzen
  // $('#AnhängehPE').hide().trigger('updatelayout')
  // window.em.hProjekt existiert schon bei neuem Projekt
  if (window.em.hProjekt) {
    window.em.initiiereProjektEdit_2()
  } else if (window.localStorage.Status === 'neu' && window.localStorage.hProjekt) {
    // wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
    window.em.hProjekt = JSON.parse(window.localStorage.hProjekt)
    delete window.localStorage.hProjekt
    window.em.initiiereProjektEdit_2()
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.ProjektId, {
      success: function (data) {
        window.em.hProjekt = data
        window.em.initiiereProjektEdit_2()
      },
      error: function () {
        // hoppla, zu dieser ID gibt es kein Projekt > Speicher löschen und Liste anzeigen
        window.em.leereStorageProjektEdit('mitLatLngListe')
        $.mobile.navigate('hProjektListe.html')
      }
    })
  }
}

window.em.initiiereProjektEdit_2 = function () {
  'use strict'
  // fixe Felder aktualisieren
  $('#pName').val(window.em.hProjekt.pName)
  // Variabeln bereitstellen (bei neuen Projekten wird ProjektId später nachgeschoben)
  if (window.em.hProjekt._id) {
    window.localStorage.ProjektId = window.em.hProjekt._id
  } else {
    window.localStorage.ProjektId = 'neu'
  }
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  if (window.em.FeldlisteProjekt) {
    window.em.initiiereProjektEdit_3()
  } else {
    // das dauert länger - Hinweis einblenden
    $('#hProjektEditFormHtml').html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>')
    // Feldliste aus der DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListeProjekt?include_docs=true', {
      success: function (Feldliste) {
        window.em.FeldlisteProjekt = Feldliste
        window.em.initiiereProjektEdit_3()
      }
    })
  }
}

window.em.initiiereProjektEdit_3 = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFürProjektEditForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  }
  $('#hProjektEditFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  window.em.aktiviereFlipswitches('#hProjektEditFormHtml', window.em.hProjekt)
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// generiert das Html für das Formular in hProjektEdit.html
// erwartet Feldliste als Objekt; Projekt als Objekt
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFürProjektEditForm = function () {
  'use strict'
  var Feld = {},
    FeldName,
    FeldWert,
    htmlContainer = ''
  _.each(window.em.FeldlisteProjekt.rows, function (row) {
    Feld = row.doc
    FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    if ((Feld.User === window.localStorage.Email || Feld.User === 'ZentrenBdKt') && Feld.SichtbarImModusHierarchisch.indexOf(window.localStorage.Email) !== -1 && FeldName !== 'pName') {
      if (window.localStorage.Status === 'neu' && Feld.Standardwert && Feld.Standardwert[window.localStorage.Email]) {
        FeldWert = Feld.Standardwert[window.localStorage.Email]
        // window.em.hProjekt um den Standardwert ergänzen, um später zu speichern
        window.em.hProjekt[FeldName] = FeldWert
      } else {
        // "" verhindert die Anzeige von undefined im Feld
        FeldWert = window.em.hProjekt[FeldName] || ''
      }
      htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
    }
  })
  if (window.localStorage.Status === 'neu') {
    $('#pName').focus()
    // in neuen Datensätzen dynamisch erstellte Standardwerte speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hProjekt, {
      success: function (data) {
        window.em.hProjekt._id = data.id
        window.em.hProjekt._rev = data.rev
        //
        window.localStorage.ProjektId = data.id
      }
    })
    delete window.localStorage.Status
  } else {
    // neue Datensätze haben keine Attachments
    window.em.zeigeAttachments(window.em.hProjekt, 'hPE')
  }
  return htmlContainer
}

// initiiert FeldEdit.html
window.em.initiiereFeldEdit = function () {
  'use strict'
  // Bei neuem Feld gibt es Feld schon
  if (window.em.Feld) {
    window.em.initiiereFeldEdit_2()
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.FeldId, {
      success: function (doc) {
        // Feld bereitstellen
        window.em.Feld = doc
        window.em.initiiereFeldEdit_2()
      }
    })
  }
}

window.em.initiiereFeldEdit_2 = function () {
  'use strict'
  var SichtbarImModusHierarchisch = window.em.Feld.SichtbarImModusHierarchisch,
    $SichtbarImModusHierarchisch = $('#SichtbarImModusHierarchisch'),
    SichtbarInHArtEditListe = window.em.Feld.SichtbarInHArtEditListe,
    $SichtbarInHArtEditListe = $('#SichtbarInHArtEditListe'),
    SichtbarImModusEinfach = window.em.Feld.SichtbarImModusEinfach,
    $SichtbarImModusEinfach = $('#SichtbarImModusEinfach'),
    Standardwert,
    $Standardwert = $('#Standardwert')

  // alle radio und checkboxen leeren (damit keine voher gewählten Werte verbleiben)
  window.em.checkAllRadiosOfForm('FeldEdit', false)

  // Sichtbarkeit anzeigen
  if (SichtbarImModusHierarchisch && SichtbarImModusHierarchisch.indexOf(window.localStorage.Email) >= 0) {
    $SichtbarImModusHierarchisch
      .val('ja')
      .parent().removeClass('ui-flipswitch-active')
  } else {
    $SichtbarImModusHierarchisch
      .val('nein')
      .parent().addClass('ui-flipswitch-active')
  }
  if (SichtbarInHArtEditListe && SichtbarInHArtEditListe.indexOf(window.localStorage.Email) >= 0) {
    $SichtbarInHArtEditListe
      .val('ja')
      .parent().removeClass('ui-flipswitch-active')
  } else {
    $SichtbarInHArtEditListe
      .val('nein')
      .parent().addClass('ui-flipswitch-active')
  }
  if (SichtbarImModusEinfach && SichtbarImModusEinfach.indexOf(window.localStorage.Email) >= 0) {
    $SichtbarImModusEinfach.val('ja')
    $SichtbarImModusEinfach.parent().removeClass('ui-flipswitch-active')
  } else {
    $SichtbarImModusEinfach.val('nein')
    $SichtbarImModusEinfach.parent().addClass('ui-flipswitch-active')
  }

  // Artgruppe Aufbauen, wenn Hierarchiestufe == Art
  if (window.em.Feld.Hierarchiestufe === 'Art') {
    window.em.ArtGruppeAufbauenFeldEdit(window.em.Feld.ArtGruppe)
  }

  // allfälligen Standardwert anzeigen
  // Standardwert ist Objekt, darin werden die Standardwerte aller Benutzer gespeichert
  // darum hier auslesen und setzen
  // Zuerst leeren Wert setzen, sonst bleibt letzter, wenn keiner existiert!
  $Standardwert.val('')
  if (window.em.Feld.Standardwert) {
    Standardwert = window.em.Feld.Standardwert[window.localStorage.Email]
    if (Standardwert) {
      $Standardwert.val(Standardwert)
    }
  }

  if (window.em.Feld.FeldName) {
    // fix in Formulare eingebaute Felder: Standardwerte ausblenden und erklären
    if (['aArtGruppe', 'aArtName'].indexOf(window.em.Feld.FeldName) > -1) {
      $Standardwert
        .attr('placeholder', 'Keine Voreinstellung möglich')
        .attr('disabled', true)
    // ausschalten, soll jetzt im Feld verwaltet werden
    /*} else if (window.em.Feld.FeldName === "aAutor") {
      $Standardwert.attr("placeholder", 'Bitte im Menü "meine Einstellungen" voreinstellen')
      $Standardwert.attr("disabled", true)*/
    } else if (['oXKoord', 'oYKoord', 'oLatitudeDecDeg', 'oLongitudeDecDeg', 'oLagegenauigkeit'].indexOf(window.em.Feld.FeldName) > -1) {
      $Standardwert
        .attr('placeholder', 'Lokalisierung erfolgt automatisch, keine Voreinstellung möglich')
        .attr('disabled', true)
    } else if (['zDatum', 'zUhrzeit'].indexOf(window.em.Feld.FeldName) > -1) {
      $Standardwert
        .attr('placeholder', 'Standardwert ist "jetzt", keine Voreinstellung möglich')
        .attr('disabled', true)
    }
  }
  $('.FeldEditHeaderTitel').text(window.em.Feld.Hierarchiestufe + ': ' + window.em.Feld.FeldBeschriftung)

  // Radio Felder initiieren (ausser ArtGruppe, das wird dynamisch erzeugt)
  $("input[name='Hierarchiestufe']").checkboxradio()
  $('#' + window.em.Feld.Hierarchiestufe).prop('checked', true).checkboxradio('refresh')
  $("input[name='Formularelement']").checkboxradio()
  $('#' + window.em.Feld.Formularelement).prop('checked', true).checkboxradio('refresh')
  $("input[name='InputTyp']").checkboxradio()
  $('#' + window.em.Feld.InputTyp).prop('checked', true).checkboxradio('refresh')

  // Werte in übrige Felder einfügen
  $('#FeldName').val(window.em.Feld.FeldName)
  $('#FeldBeschriftung').val(window.em.Feld.FeldBeschriftung)
  $('#FeldBeschreibung').val(window.em.Feld.FeldBeschreibung) // Textarea - anders refreshen?
  $('#Reihenfolge').val(window.em.Feld.Reihenfolge)
  $('#FeldNameEvab').val(window.em.Feld.FeldNameEvab)
  $('#FeldNameZdsf').val(window.em.Feld.FeldNameZdsf)
  $('#FeldNameCscf').val(window.em.Feld.FeldNameCscf)
  $('#FeldNameNism').val(window.em.Feld.FeldNameNism)
  $('#FeldNameWslFlechten').val(window.em.Feld.FeldNameWslFlechten)
  $('#FeldNameWslPilze').val(window.em.Feld.FeldNameWslPilze)
  $('#Optionen').val(window.em.Feld.Optionen) // Textarea - anders refreshen?
  $('#SliderMinimum').val(window.em.Feld.SliderMinimum)
  $('#SliderMaximum').val(window.em.Feld.SliderMaximum)

  window.em.erstelleSelectFeldFolgtNach() // BESSER: Nur aufrufen, wenn erstaufbau oder auch Feldliste zurückgesetzt wurde
  window.em.speichereLetzteUrl()
  // abhängige Felder blenden
  window.em.blendeDatentypabhängigeFelder()
  window.em.blendeMenus()
  // Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
  $(":jqmData(role='page')").focus()
}

// wird von FeldEdit.html aufgerufen
// erstellt das Selectmenu, um die Reihenfolge-Position des Felds zu bestimmen
window.em.erstelleSelectFeldFolgtNach = function () {
  'use strict'
  // Nur bei eigenen Feldern anzeigen
  if (window.em.Feld.User !== 'ZentrenBdKt') {
    if (window.em.Feldliste) {
      // Feldliste aus globaler Variable verwenden - muss nicht geparst werden
      window.em.erstelleSelectFeldFolgtNach_2()
    } else {
      var $db = $.couch.db('evab')
      $db.view('evab/FeldListe?include_docs=true', {
        success: function (data) {
          window.em.Feldliste = data
          window.em.erstelleSelectFeldFolgtNach_2()
        }
      })
    }
  }
}

window.em.erstelleSelectFeldFolgtNach_2 = function () {
  'use strict'
  var tempFeld,
    optionen = [],
    htmlContainer
  optionen.push('')
  _.each(window.em.Feldliste.rows, function (row) {
    tempFeld = row.doc
    // Liste aufbauen
    // Nur eigene Felder und offizielle
    if (tempFeld.User === window.localStorage.Email || tempFeld.User === 'ZentrenBdKt') {
      optionen.push(tempFeld.FeldName)
    }
  })
  htmlContainer = window.em.generiereHtmlFürSelectmenu('FeldFolgtNach', 'Feld folgt nach:', '', optionen, 'SingleSelect')
  $('#FeldFolgtNachDiv').html(htmlContainer).trigger('create').trigger('refresh')
}

// wird benutzt in FeldEdit.html
// von je einer Funktion in FeldEdit.html und evab.js
// Funktion ist zweigeteilt, um wenn möglich Datenbankabfragen zu sparen
window.em.ArtGruppeAufbauenFeldEdit = function (ArtGruppenArrayIn) {
  'use strict'
  if (window.em.Artgruppen) {
    // Artgruppen von globaler Variable holen
    window.em.ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn)
  } else if (window.localStorage.Artgruppen) {
    // Artgruppen aus window.localStorage holen und parsen
    window.em.Artgruppen = JSON.parse(window.localStorage.Artgruppen)
    window.em.ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn)
  } else {
    // Artgruppen aus DB holen
    var $db = $.couch.db('evab')
    $('select#ArtGruppe').empty()
    $db.view('evab/Artgruppen', {
      success: function (data) {
        window.em.Artgruppen = data
        window.localStorage.Artgruppen = JSON.stringify(data)
        window.em.ArtGruppeAufbauenFeldEdit_2(ArtGruppenArrayIn)
      }
    })
  }
}

window.em.ArtGruppeAufbauenFeldEdit_2 = function (ArtGruppenArrayIn) {
  'use strict'
  var ArtGruppe,
    listItemContainer = "<fieldset data-role='controlgroup'><legend>In diesen Artgruppen kann das Feld angezeigt werden (erforderlich):</legend>",
    listItem,
    ArtGruppenArray = ArtGruppenArrayIn || []
  _.each(window.em.Artgruppen.rows, function (row) {
    ArtGruppe = row.key
    listItem = "<input type='checkbox' class='custom Feldeigenschaften' name='ArtGruppe' id='"
    listItem += ArtGruppe
    listItem += "' value='"
    listItem += ArtGruppe
    if (ArtGruppenArray.indexOf(ArtGruppe) !== -1) {
      listItem += "' checked='checked"
    }
    listItem += "'/>\n<label for='"
    listItem += ArtGruppe
    listItem += "'>"
    listItem += ArtGruppe
    listItem += '</label>'
    listItemContainer += listItem
  })
  listItemContainer += '\n</fieldset>'
  $('#Artgruppenliste_FeldEdit').html(listItemContainer).trigger('create').trigger('refresh')
  $('#SichtbarInHArtEditListeFieldContain').show()
}

// initiiert FeldListe.html
window.em.initiiereFeldliste = function () {
  'use strict'
  // hat FeldEdit.html eine Feldliste übergeben?
  if (window.em.Feldliste) {
    // Feldliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiiereFeldliste_2()
  } else {
    // FeldListe aus DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListe?include_docs=true', {
      success: function (data) {
        window.em.Feldliste = data
        window.em.initiiereFeldliste_2()
      }
    })
  }
}

window.em.initiiereFeldliste_2 = function () {
  'use strict'
  var tempFeld,
    anzFelder = 0,
    ImageLink,
    listItemContainer = '',
    Hierarchiestufe,
    FeldBeschriftung,
    FeldBeschreibung
  _.each(window.em.Feldliste.rows, function (row) {
    tempFeld = row.doc
    // Liste aufbauen
    // Nur eigene Felder und offizielle
    if (tempFeld.User === window.localStorage.Email || tempFeld.User === 'ZentrenBdKt') {
      Hierarchiestufe = tempFeld.Hierarchiestufe
      FeldBeschriftung = tempFeld.FeldBeschriftung || '(ohne Feldbeschriftung)'
      FeldBeschreibung = ''
      if (tempFeld.FeldBeschreibung) {
        FeldBeschreibung = tempFeld.FeldBeschreibung
      }
      ImageLink = 'Hierarchiebilder/' + Hierarchiestufe + '.png'
      listItemContainer += "<li class='Feld ui-li-has-thumb' FeldId='"
      listItemContainer += tempFeld._id
      listItemContainer += "'><a href='#'><img class='ui-li-thumb' src='"
      listItemContainer += ImageLink + "' /><h2>"
      listItemContainer += Hierarchiestufe
      listItemContainer += ': '
      listItemContainer += FeldBeschriftung
      listItemContainer += '<\/h2><p>'
      listItemContainer += FeldBeschreibung
      listItemContainer += '</p><\/a><\/li>'
      // Felder zählen
      anzFelder += 1
    }
  })
  // Im Titel der Seite die Anzahl Beobachtungen anzeigen
  $('#FeldListeHeader')
    .find('.FeldListeTitel')
    .text(anzFelder + ' Felder')
  $('#FeldListeFL')
    .html(listItemContainer)
    .listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#FeldListePage')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// wird benutzt von hOrtEdit.html, BeobEdit.html und Karte.html
// die Felder werden aus window.localStorage übernommen, die Liste ihrer Namen wird als Array FelderArray überbeben
// die Felder werden in der DB und im übergebenen Objekt "DatensatzObjekt" gespeichert
// und anschliessend in Formularfeldern aktualisiert
// function speichereKoordinaten übernimmt id und den ObjektNamen
// kontrolliert, ob das Objekt existiert
// wenn nein wird es aus der DB geholt
window.em.speichereKoordinaten = function (id, ObjektName) {
  'use strict'
  // kontrollieren, ob Ort oder Beob als Objekt vorliegt
  if (window.em[ObjektName]) {
    // ja: Objekt verwenden
    window.em.speichereKoordinaten_2(id, ObjektName)
  } else {
    // nein: Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(id, {
      success: function (data) {
        window.em[ObjektName] = data
        window.em.speichereKoordinaten_2(id, ObjektName)
      },
      error: function () {
        window.em.melde('Fehler: Koordinaten nicht gespeichert')
      }
    })
  }
}

// setzt das DatensatzObjekt voraus
// aktualisiert darin die Felder, welche in FelderArray aufgelistet sind
// Variablen müssen in Objekt und window.localStorage denselben Namen verwenden
window.em.speichereKoordinaten_2 = function (id, ObjektName) {
  'use strict'
  var FelderArray = ['oLongitudeDecDeg', 'oLongitudeDecDeg', 'oLatitudeDecDeg', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'oHöhe', 'oHöheGenauigkeit']
  window.em.speichereFelderAusLocalStorageInObjekt(ObjektName, FelderArray, 'FormularAktualisieren')
  // nun die Koordinaten in den Zeiten und Arten dieses Objekts aktualisieren
  window.em.speichereFelderAusLocalStorageInObjektliste('ZeitenVonOrt', FelderArray, 'hOrtId', id, 'hZeitIdVonOrt')
  window.em.speichereFelderAusLocalStorageInObjektliste('ArtenVonOrt', FelderArray, 'hOrtId', id, 'hArtIdVonOrt')
}

// übernimmt eine Liste von Feldern und eine Objektliste (via Name)
// sucht in der Objektliste nach den Objekten mit der BezugsId
// aktualisiert diese Objekte
// wird verwendet, um die Koordinaten von Orten in Zeiten und Arten zu schreiben
// im ersten Schritt prüfen, ob die Objektliste vorhanden ist. Wenn nicht, aus DB holen
window.em.speichereFelderAusLocalStorageInObjektliste = function (ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert, Querystring) {
  'use strict'
  if (window.em[ObjektlistenName]) {
    // vorhandene Objektliste nutzen
    window.em.speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert)
  } else {
    // Objektliste aus DB holen
    var viewname = 'evab/' + Querystring + '?startkey=["' + BezugsIdWert + '"]&endkey=["' + BezugsIdWert + '",{}]&include_docs=true'
    var $db = $.couch.db('evab')
    $db.view(viewname, {
      success: function (data) {
        window.em[ObjektlistenName] = data
        window.em.speichereFelderAusLocalStorageInObjektliste_2(ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert)
      }
    })
  }
}

window.em.speichereFelderAusLocalStorageInObjektliste_2 = function (ObjektlistenName, FelderArray, BezugsIdName, BezugsIdWert) {
  'use strict'
  // in allen Objekten in der Objektliste
  var DsBulkListe = {},
    Docs = [],
    doc
  // nur machen, wenn rows vorhanden!
  if (window.em[ObjektlistenName].rows.length > 0) {
    _.each(window.em[ObjektlistenName].rows, function (row) {
      doc = row.doc
      // Objekte mit dem richtigen Wert in der BezugsId suchen (z.B. die richtige hOrtId)
      if (doc[BezugsIdName] && doc[BezugsIdName] === BezugsIdWert) {
        // im Objekt alle in FelderArray aufgelisteten Felder suchen
        _.each(FelderArray, function (feldname) {
          // und ihre Werte aktualisieren
          if (window.localStorage[feldname]) {
            if (window.em.myTypeOf(window.localStorage[feldname]) === 'integer') {
              doc[feldname] = parseInt(window.localStorage[feldname], 10)
            } else if (window.em.myTypeOf(window.localStorage[feldname]) === 'float') {
              doc[feldname] = parseFloat(window.localStorage[feldname])
            } else {
              doc[feldname] = window.localStorage[feldname]
            }
          } else {
            delete doc[feldname]
          }
        })
        Docs.push(doc)
      }
    })
    DsBulkListe.docs = Docs
    // Objektliste in DB speichern
    $.ajax({
      type: 'POST',
      url: '../../_bulk_docs',
      contentType: 'application/json',
      data: JSON.stringify(DsBulkListe)
    }).done(function (data) {
      var objekt,
        doc
      // _rev in den Objekten in Objektliste aktualisieren
      // für alle zurückgegebenen aktualisierten Zeilen
      // offenbar muss data zuerst geparst werden ??!!
      data = JSON.parse(data)
      _.each(data, function (ds, index) {
        // das zugehörige Objekt in der Objektliste suchen
        objekt = _.find(window.em[ObjektlistenName].rows, function (row) {
          doc = row.doc
          return doc._id === data[index].id
        })
        objekt._rev = data[index].rev
      })
    })
  }
}

// Neue Daten liegen in window.localStorage vor
// sie werden in Objekt und in DB geschrieben
// Variablen müssen in Objekt und window.localStorage denselben Namen verwenden
// FelderArray enthält eine Liste der Namen der zu aktualisierenden Felder
// ObjektName ist der Name des zu aktualisierenden Objekts bzw. Datensatzes
window.em.speichereFelderAusLocalStorageInObjekt = function (ObjektName, FelderArray, FormularAktualisieren) {
  'use strict'
  // Objekt aktualisieren
  _.each(FelderArray, function (feldname) {
    if (window.localStorage[feldname]) {
      if (window.em.myTypeOf(window.localStorage[feldname]) === 'integer') {
        window.em[ObjektName][feldname] = parseInt(window.localStorage[feldname], 10)
      } else if (window.em.myTypeOf(window.localStorage[feldname]) === 'float') {
        window.em[ObjektName][feldname] = parseFloat(window.localStorage[feldname])
      } else {
        window.em[ObjektName][feldname] = window.localStorage[feldname]
      }
    } else {
      delete window.em[ObjektName][feldname]
    }
  })
  // in DB speichern
  var $db = $.couch.db('evab')
  $db.saveDoc(window.em[ObjektName], {
    success: function (data) {
      window.em[ObjektName]._rev = data.rev
      if (FormularAktualisieren) {
        window.em.aktualisiereKoordinatenfelderInFormular(ObjektName)
      }
    }
  })
}

// übernimmt ein Objekt (via dessen Namen) und eine Liste von Feldern (FelderArray)
// setzt in alle Felder mit den Namen gemäss FelderArray die Werte gemäss Objekt
window.em.aktualisiereKoordinatenfelderInFormular = function (ObjektName, FelderArray) {
  'use strict'
  _.each(FelderArray, function (feldname) {
    $("[name='" + feldname + "']").val(window.em[ObjektName][feldname] || null)
  })
}

// dient der Unterscheidung von Int und Float
// NICHT BENUTZT
window.em.isInt = function (n) {
  'use strict'
  return typeof n === 'number' && parseFloat(n) == parseInt(n, 10) && !isNaN(n)
}

// Hilfsfunktion, die typeof ersetzt und ergänzt
// typeof gibt bei input-Feldern immer String zurück!
window.em.myTypeOf = function (Wert) {
  'use strict'
  if (typeof Wert === 'boolean') {
    return 'boolean'
  } else if (parseInt(Wert, 10) && parseFloat(Wert) && parseInt(Wert, 10) != parseFloat(Wert) && parseInt(Wert, 10) == Wert) {
    // es ist eine Float
    return 'float'
  } else if (parseInt(Wert, 10) == Wert) {
    // es ist eine Integer
    return 'integer'
  } else {
    // als String behandeln
    return 'string'
  }
}

// Übernimmt einen Feldnamen, einen feldwert
// und eine Datensatzliste (z.B. alle Räume eines Projekts) sowie ihren Namen
// speichert das neue Feld in alle Datensätze der Liste in der DB
// und aktualisiert die Liste selber, damit sie das nächste mal nicht in der DB geholt werden muss
// NICHT IM GEBRAUCH
window.em.speichereFeldInDatensatzliste = function (Feldname, Feldwert, DatensatzlisteName) {
  'use strict'
  var DsBulkListe = {},
    Docs = [],
    doc
  // nur machen, wenn Datensätze da sind
  _.each(DatensatzlisteName.rows, function (row) {
    doc = row.doc
    if (Feldwert) {
      if (window.em.myTypeOf(Feldwert) === 'float') {
        doc[Feldname] = parseFloat(Feldwert)
      } else if (window.em.myTypeOf(Feldwert) === 'integer') {
        doc[Feldname] = parseInt(Feldwert, 10)
      } else {
        doc[Feldname] = Feldwert
      }
    } else if (doc[Feldname]) {
      delete doc[Feldname]
    }
    Docs.push(doc)
  })
  DsBulkListe.docs = Docs
  $.ajax({
    type: 'POST',
    url: '../../_bulk_docs',
    contentType: 'application/json',
    data: JSON.stringify(DsBulkListe)
  })
}

// löscht Datensätze in Massen
// nimmt das Ergebnis einer Abfrage entgegen, welche im key einen Array hat
// Array[0] ist fremde _id (mit der die Abfrage gefiltert wurde),
// Array[1] die _id des zu löschenden Datensatzes und Array[2] dessen _rev
window.em.loescheIdIdRevListe = function (Datensatzobjekt) {
  'use strict'
  var ObjektMitDeleteListe = {},
    Docs = []
  _.each(Datensatzobjekt.rows, function (row) {
    // unsere Daten sind im key
    var rowkey = row.key,
      Datensatz = {}
    Datensatz._id = rowkey[1]
    Datensatz._rev = rowkey[2]
    Datensatz._deleted = true
    Docs.push(Datensatz)
  })
  ObjektMitDeleteListe.docs = Docs
  $.ajax({
    type: 'POST',
    url: '../../_bulk_docs',
    contentType: 'application/json',
    data: JSON.stringify(ObjektMitDeleteListe)
  })
}

window.em.initiiereProjektliste = function () {
  'use strict'
  // hat hProjektEdit.html eine Projektliste übergeben?
  if (window.em.Projektliste) {
    window.em.initiiereProjektliste_2()
  } else {
    // Daten für die Projektliste aus DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/hProjListe?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{}]&include_docs=true', {
      success: function (data) {
        // Projektliste für hProjektEdit bereitstellen
        window.em.Projektliste = data
        window.em.initiiereProjektliste_2()
      }
    })
  }
}

window.em.initiiereProjektliste_2 = function () {
  'use strict'
  var anzProj = window.em.Projektliste.rows.length,
    listItem,
    listItemContainer = '',
    Titel2

  // Im Titel der Seite die Anzahl Projekte anzeigen
  Titel2 = ' Projekte'
  if (anzProj === 1) {
    Titel2 = ' Projekt'
  }
  $('#hProjektListePageHeader')
    .find('.hProjektListePageTitel')
    .text(anzProj + Titel2)

  if (anzProj === 0) {
    listItemContainer = "<li><a href='#' class='erste NeuesProjektProjektListe'>Erstes Projekt erfassen</a></li>"
  } else {
    _.each(window.em.Projektliste.rows, function (row) {
      var Proj = row.doc,
        key = row.key,
        pName = key[1]
      listItem = "<li ProjektId='" + Proj._id + "' class='Projekt'>"
      listItem += "<a href='#'>"
      listItem += '<h3>' + pName + '<\/h3><\/a><\/li>'
      listItemContainer += listItem
    })
  }
  $('#ProjektlistehPL')
    .html(listItemContainer)
    .listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#hProjektListe')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// generiert in hRaumEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Raums, Username
// Bei neuen Räumen wird der Raum übernommen um eine DB-Abfrage zu sparen
window.em.initiiereRaumEdit = function () {
  'use strict'
  // Anhänge ausblenden, weil sie sonst beim Wechsel stören
  // $('#AnhängehRE').hide()
  if (window.em.hRaum) {
    window.em.initiiereRaumEdit_2()
  } else if (window.localStorage.Status === 'neu' && window.localStorage.hRaum) {
    // wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
    window.em.hRaum = JSON.parse(window.localStorage.hRaum)
    delete window.localStorage.hRaum
    window.em.initiiereRaumEdit_2()
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.RaumId, {
      success: function (data) {
        window.em.hRaum = data
        window.em.initiiereRaumEdit_2()
      }
    })
  }
}

window.em.initiiereRaumEdit_2 = function () {
  'use strict'
  // fixes Feld setzen
  $('#rName').val(window.em.hRaum.rName)
  // Variabeln bereitstellen
  window.localStorage.ProjektId = window.em.hRaum.hProjektId
  // bei neuen Räumen hat das Objekt noch keine ID
  if (window.em.hRaum._id) {
    window.localStorage.RaumId = window.em.hRaum._id
  } else {
    window.localStorage.RaumId = 'neu'
  }
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  if (window.em.FeldlisteRaumEdit) {
    window.em.initiiereRaumEdit_3()
  } else {
    // das dauert länger - hinweisen
    $('#hRaumEditFormHtml').html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>')
    // holt die Feldliste aus der DB
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListeRaum?include_docs=true', {
      success: function (Feldliste) {
        // Variabeln bereitstellen
        window.em.FeldlisteRaumEdit = Feldliste
        window.em.initiiereRaumEdit_3()
      }
    })
  }
}

window.em.initiiereRaumEdit_3 = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFuerRaumEditForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  }
  $('#hRaumEditFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  window.em.aktiviereFlipswitches('#hRaumEditFormHtml', window.em.hRaum)
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// generiert das Html für das Formular in hRaumEdit.html
// erwartet Feldliste als Objekt; window.em.hRaum als Objekt
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFuerRaumEditForm = function () {
  'use strict'
  var Feld = {},
    FeldName,
    FeldWert,
    htmlContainer = ''
  _.each(window.em.FeldlisteRaumEdit.rows, function (row) {
    Feld = row.doc
    FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    if ((Feld.User === window.localStorage.Email || Feld.User === 'ZentrenBdKt') && Feld.SichtbarImModusHierarchisch.indexOf(window.localStorage.Email) !== -1 && FeldName !== 'rName') {
      if (window.localStorage.Status === 'neu' && Feld.Standardwert && Feld.Standardwert[window.localStorage.Email]) {
        FeldWert = Feld.Standardwert[window.localStorage.Email]
        // Objekt window.em.hRaum um den Standardwert ergänzen, um später zu speichern
        window.em.hRaum[FeldName] = FeldWert
      } else {
        // "" verhindert die Anzeige von undefined im Feld
        FeldWert = window.em.hRaum[FeldName] || ''
      }
      htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
    }
  })
  // In neuen Datensätzen allfällige Standardwerte speichern
  if (window.localStorage.Status === 'neu') {
    $('#rName').focus()
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hRaum, {
      success: function (data) {
        window.em.hRaum._id = data.id
        window.em.hRaum._rev = data.rev
        window.localStorage.RaumId = data.id
      }
    })
    delete window.localStorage.Status
  } else {
    // Attachments gibt's bei neuen Datensätzen nicht
    window.em.zeigeAttachments(window.em.hRaum, 'hRE')
  }
  return htmlContainer
}

window.em.initiiereRaumListe = function () {
  'use strict'
  // hat hRaumEdit.html eine RaumListe übergeben?
  if (window.em.RaumListe) {
    // Raumliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiiereRaumListe_2()
  } else {
    // Raumliste aud DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/hRaumListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.ProjektId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // RaumListe für haumEdit bereitstellen
        window.em.RaumListe = data
        window.em.initiiereRaumListe_2()
      }
    })
  }
}

window.em.initiiereRaumListe_2 = function () {
  'use strict'
  var anzRaum = window.em.RaumListe.rows.length,
    Raum,
    rName,
    listItemContainer = '',
    Titel2

  // Im Titel der Seite die Anzahl Räume anzeigen
  Titel2 = ' Räume'
  if (anzRaum === 1) {
    Titel2 = ' Raum'
  }
  $('#hRaumListePageHeader')
    .find('.hRaumListePageTitel')
    .text(anzRaum + Titel2)

  if (anzRaum === 0) {
    listItemContainer = '<li><a href="#" name="NeuerRaumRaumListe" class="erste">Ersten Raum erfassen</a></li>'
  } else {
    _.each(window.em.RaumListe.rows, function (row) {
      Raum = row.doc
      rName = Raum.rName
      listItemContainer += "<li RaumId='" + Raum._id + "' class='Raum'><a href='#'><h3>" + rName + '<\/h3><\/a><\/li>'
    })
  }
  $('#RaumlistehRL')
    .html(listItemContainer)
    .listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#hRaumListe')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// generiert in hOrtEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id des Orts
window.em.initiiereOrtEdit = function () {
  'use strict'
  // Anhänge ausblenden, weil sie sonst beim Wechsel stören
  // $('#AnhängehOE').hide()
  if (window.em.hOrt) {
    window.em.initiiereOrtEdit_2()
  } else if (window.localStorage.Status === 'neu' && window.localStorage.hOrt) {
    // wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
    window.em.hOrt = JSON.parse(window.localStorage.hOrt)
    delete window.localStorage.hOrt
    window.em.initiiereOrtEdit_2()
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.OrtId, {
      success: function (data) {
        window.em.hOrt = data
        window.em.initiiereOrtEdit_2()
      }
    })
  }
}

window.em.initiiereOrtEdit_2 = function () {
  'use strict'
  // fixe Felder aktualisieren
  $("[name='oName']").val(window.em.hOrt.oName)
  $("[name='oXKoord']").val(window.em.hOrt.oXKoord)
  $("[name='oYKoord']").val(window.em.hOrt.oYKoord)
  $("[name='oLagegenauigkeit']").val(window.em.hOrt.oLagegenauigkeit)
  // Variabeln bereitstellen
  window.localStorage.ProjektId = window.em.hOrt.hProjektId
  window.localStorage.RaumId = window.em.hOrt.hRaumId
  // bei neuen Orten hat das Objekt noch keine ID
  if (window.em.hOrt._id) {
    window.localStorage.OrtId = window.em.hOrt._id
  } else {
    window.localStorage.OrtId = 'neu'
  }
  // Lat Lng werden geholt. Existieren sie nicht, erhalten Sie den Wert ""
  window.localStorage.oLongitudeDecDeg = window.em.hOrt.oLongitudeDecDeg
  window.localStorage.oLatitudeDecDeg = window.em.hOrt.oLatitudeDecDeg
  window.localStorage.oLagegenauigkeit = window.em.hOrt.oLagegenauigkeit
  window.localStorage.oXKoord = window.em.hOrt.oXKoord
  window.localStorage.oYKoord = window.em.hOrt.oYKoord
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  if (window.em.FeldlisteOrtEdit) {
    window.em.initiiereOrtEdit_3()
  } else {
    // das dauert länger - hinweisen
    $('#hOrtEditFormHtml').html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>')
    // holt die Feldliste aus der DB
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListeOrt?include_docs=true', {
      success: function (Feldliste) {
        // Globale Variable erstellen, damit ab dem zweiten mal die vorige Abfrage gespaart werden kann
        window.em.FeldlisteOrtEdit = Feldliste
        window.em.initiiereOrtEdit_3()
      }
    })
  }
}

window.em.initiiereOrtEdit_3 = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFürOrtEditForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  }
  $('#hOrtEditFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  window.em.aktiviereFlipswitches('#hOrtEditFormHtml', window.em.hOrt)
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// generiert das Html für das Formular in hOrtEdit.html
// erwartet Feldliste als Objekt (aus der globalen Variable); window.em.hOrt als Objekt
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFürOrtEditForm = function () {
  'use strict'
  var Feld = {},
    FeldName,
    FeldWert,
    htmlContainer = ''
  _.each(window.em.FeldlisteOrtEdit.rows, function (row) {
    'use strict'
    Feld = row.doc
    FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    if ((Feld.User === window.localStorage.Email || Feld.User === 'ZentrenBdKt') && Feld.SichtbarImModusHierarchisch.indexOf(window.em.hOrt.User) !== -1 && (FeldName !== 'oName') && (FeldName !== 'oXKoord') && (FeldName !== 'oYKoord') && (FeldName !== 'oLagegenauigkeit')) {
      'use strict'
      if (window.localStorage.Status === 'neu' && Feld.Standardwert && Feld.Standardwert[window.localStorage.Email]) {
        'use strict'
        FeldWert = Feld.Standardwert[window.localStorage.Email]
        // Objekt window.em.hOrt um den Standardwert ergänzen, um später zu speichern
        window.em.hOrt[FeldName] = FeldWert
      } else {
        // "" verhindert die Anzeige von undefined im Feld
        FeldWert = window.em.hOrt[FeldName] || ''
      }
      htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
    }
  })
  // Allfällige Standardwerte speichern
  if (window.localStorage.Status === 'neu') {
    'use strict'
    $("[name='oName']").focus()
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hOrt, {
      success: function (data) {
        'use strict'
        window.em.hOrt._id = data.id
        window.em.hOrt._rev = data.rev
        window.localStorage.OrtId = data.id
        window.em.GetGeolocation(data.id, 'hOrt')
      }
    })
    // Status zurücksetzen - es soll nur ein mal verortet werden
    delete window.localStorage.Status
  } else {
    // Attachments gibt es bei neuen Orten nicht
    window.em.zeigeAttachments(window.em.hOrt, 'hOE')
  }
  return htmlContainer
}

// erstellt die Ortliste in hOrtListe.html
window.em.initiiereOrtListe = function () {
  'use strict'
  // hat hOrtEdit.html eine OrtListe übergeben?
  if (window.em.OrtListe) {
    // Ortliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiiereOrtListe_2()
  } else {
    // Ortliste aus DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/hOrtListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.RaumId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.RaumId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // OrtListe für hOrtEdit bereitstellen
        window.em.OrtListe = data
        window.em.initiiereOrtListe_2()
      }
    })
  }
}

window.em.initiiereOrtListe_2 = function () {
  'use strict'
  var anzOrt = window.em.OrtListe.rows.length,
    Ort,
    listItemContainer = '',
    Titel2

  // Im Titel der Seite die Anzahl Orte anzeigen
  Titel2 = ' Orte'
  if (anzOrt === 1) {
    Titel2 = ' Ort'
  }
  $('#hOrtListePageHeader')
    .find('.hOrtListePageTitel')
    .text(anzOrt + Titel2)

  if (anzOrt === 0) {
    listItemContainer = '<li><a href="#" class="erste NeuerOrtOrtListe">Ersten Ort erfassen</a></li>'
  } else {
    _.each(window.em.OrtListe.rows, function (row) {
      Ort = row.doc
      listItemContainer += "<li OrtId='" + Ort._id + "' class='Ort'><a href='#'><h3>" + Ort.oName + '<\/h3><\/a><\/li>'
    })
  }
  $('#OrtlistehOL')
    .html(listItemContainer)
    .listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#hOrtListe')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// generiert in hZeitEdit.html dynamisch die von den Sichtbarkeits-Einstellungen abhängigen Felder
// Mitgeben: id der Zeit
window.em.initiiereZeitEdit = function () {
  'use strict'
  // Anhänge ausblenden, weil sie sonst beim Wechsel stören
  // $('#AnhängehZE').hide()
  // hZeit existiert schon bei neuer Zeit
  // alert("window.em.hZeit = " + JSON.stringify(window.em.hZeit))
  if (window.em.hZeit) {
    window.em.initiiereZeitEdit_2()
  } else if (window.localStorage.Status === 'neu' && window.localStorage.hZeit) {
    // wenn mit window.open von neu gekommen, existiert die globale Variable nicht mehr
    window.em.hZeit = JSON.parse(window.localStorage.hZeit)
    delete window.localStorage.hZeit
    window.em.initiiereZeitEdit_2()
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.ZeitId, {
      success: function (data) {
        window.em.hZeit = data
        window.em.initiiereZeitEdit_2()
      }
    })
  }
}

window.em.initiiereZeitEdit_2 = function () {
  'use strict'
  // fixe Felder aktualisieren
  $("[name='zDatum']").val(window.em.hZeit.zDatum)
  $("[name='zUhrzeit']").val(window.em.hZeit.zUhrzeit)
  // Variabeln bereitstellen
  window.localStorage.ProjektId = window.em.hZeit.hProjektId
  window.localStorage.RaumId = window.em.hZeit.hRaumId
  window.localStorage.OrtId = window.em.hZeit.hOrtId
  // bei neuen Zeiten hat das Objekt noch keine ID
  if (window.em.hZeit._id) {
    window.localStorage.ZeitId = window.em.hZeit._id
  }
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  if (window.em.FeldlisteZeitEdit) {
    window.em.initiiereZeitEdit_3()
  } else {
    // Feldliste aus der DB holen
    // das dauert länger - hinweisen
    $('#hZeitEditFormHtml').html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>')
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListeZeit?include_docs=true', {
      success: function (Feldliste) {
        window.em.FeldlisteZeitEdit = Feldliste
        window.em.initiiereZeitEdit_3()
      }
    })
  }
}

window.em.initiiereZeitEdit_3 = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFuerZeitEditForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  }
  $('#hZeitEditFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  window.em.aktiviereFlipswitches('#hZeitEditFormHtml', window.em.hZeit)
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// erstellt die Liste der Zeiten in Formular hZeitListe.html
window.em.initiiereZeitListe = function () {
  'use strict'
  // hat hZeitEdit.html eine ZeitListe übergeben?
  if (window.em.ZeitListe) {
    // Zeitliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiiereZeitListe_2()
  } else {
    // Zeitliste aus DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/hZeitListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.OrtId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.OrtId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // ZeitListe für hZeitEdit bereitstellen
        window.em.ZeitListe = data
        window.em.initiiereZeitListe_2()
      }
    })
  }
}

window.em.initiiereZeitListe_2 = function () {
  'use strict'
  var anzZeit = window.em.ZeitListe.rows.length,
    Zeit,
    key,
    listItemContainer = '',
    Titel2,
    zZeitDatum

  // Im Titel der Seite die Anzahl Zeiten anzeigen
  Titel2 = ' Zeiten'
  if (anzZeit === 1) {
    Titel2 = ' Zeit'
  }
  $('#hZeitListePageHeader')
    .find('.hZeitListePageTitel')
    .text(anzZeit + Titel2)

  if (anzZeit === 0) {
    listItemContainer = '<li><a href="#" class="erste NeueZeitZeitListe">Erste Zeit erfassen</a></li>'
  } else {
    _.each(window.em.ZeitListe.rows, function (row) {
      Zeit = row.doc
      key = row.key
      zZeitDatum = key[2] + '&nbsp; &nbsp;' + key[3]
      listItemContainer += "<li ZeitId='" + Zeit._id + "' class='Zeit'><a href='#'><h3>" + zZeitDatum + '<\/h3><\/a><\/li>'
    })
  }
  $('#ZeitlistehZL')
    .html(listItemContainer)
    .listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#hZeitListe')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// generiert das Html für das Formular in hZeitEdit.html
// erwartet Feldliste als Objekt; Zeit als Objekt
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFuerZeitEditForm = function () {
  'use strict'
  var Feld = {},
    FeldName,
    FeldWert,
    htmlContainer = ''
  _.each(window.em.FeldlisteZeitEdit.rows, function (row) {
    Feld = row.doc
    FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    if ((Feld.User === window.em.hZeit.User || Feld.User === 'ZentrenBdKt') && Feld.SichtbarImModusHierarchisch.indexOf(window.em.hZeit.User) !== -1 && FeldName !== 'zDatum' && FeldName !== 'zUhrzeit') {
      if (window.localStorage.Status === 'neu' && Feld.Standardwert && window.em.hZeit[FeldName]) {
        FeldWert = Feld.Standardwert[window.em.hZeit.User] || ''
        // Objekt window.em.hZeit um den Standardwert ergänzen, um später zu speichern
        window.em.hZeit[FeldName] = FeldWert
      } else {
        FeldWert = window.em.hZeit[FeldName] || ''
      }
      htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
    }
  // window.localStorage.Status wird schon im aufrufenden function gelöscht!
  })
  if (window.localStorage.Status === 'neu') {
    // in neuen Datensätzen dynamisch erstellte Standardwerte speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hZeit, {
      success: function (data) {
        window.em.hZeit._id = data.id
        window.em.hZeit._rev = data.rev
        window.localStorage.ZeitId = data.id
      }
    })
    delete window.localStorage.Status
  } else {
    // Neue Datensätze haben keine Attachments
    window.em.zeigeAttachments(window.em.hZeit, 'hZE')
  }
  return htmlContainer
}

// managt den Aufbau aller Daten und Felder für hArtEdit.html
// erwartet die hArtId
// wird aufgerufen von hArtEdit.html bei pageshow
window.em.initiierehArtEdit = function () {
  'use strict'
  // markieren, dass die Einzelsicht aktiv ist
  window.localStorage.hArtSicht = 'einzel'
  // achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
  if (window.em.hArt && (!window.localStorage.Von || window.localStorage.Von !== 'hArtEdit')) {
    window.em.initiierehArtEdit_2(window.em.hArt)
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.hArtId, {
      success: function (data) {
        window.em.hArt = data
        window.localStorage.aArtId = window.em.hArt.aArtId
        window.localStorage.aArtName = window.em.hArt.aArtName
        window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
        window.em.initiierehArtEdit_2(data)
      }
    })
  }
}

window.em.initiierehArtEdit_2 = function () {
  'use strict'
  // hier werden Variablen gesetzt,
  // in die fixen Felder Werte eingesetzt,
  // die dynamischen Felder aufgebaut
  // und die Nav-Links gesetzt

  // Anhänge ausblenden, weil sie sonst beim Wechsel stören
  // $('#AnhängehAE').hide()

  // diese (globalen) Variabeln werden in hArtEdit.html gebraucht
  // Variabeln bereitstellen
  window.localStorage.ProjektId = window.em.hArt.hProjektId
  window.localStorage.RaumId = window.em.hArt.hRaumId
  window.localStorage.OrtId = window.em.hArt.hOrtId
  window.localStorage.ZeitId = window.em.hArt.hZeitId
  // bei neuen hArt hat das Objekt noch keine ID
  if (window.em.hArt._id) {
    window.localStorage.hArtId = window.em.hArt._id
  } else {
    window.localStorage.hArtId = 'neu'
  }
  window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
  window.localStorage.aArtName = window.em.hArt.aArtName
  window.localStorage.aArtId = window.em.hArt.aArtId
  // fixe Felder aktualisieren
  $('#aArtGruppe')
    .val(window.em.hArt.aArtGruppe)
    .html("<option value='" + window.em.hArt.aArtGruppe + "'>" + window.em.hArt.aArtGruppe + '</option>')
    .selectmenu()
    .selectmenu('refresh')
  // JQUERY MOBILE BRACHT MANCHMAL LANGE UM ZU INITIALIIEREN
  // OHNE TIMEOUT REKLAMIERT ES BEIM REFRESH, DAS WIDGET SEI NOCH NICHT INITIALISIERT!!!!
  // NACH EIN MAL VERZÖGERN HAT ES ABER WIEDER FUNKTIONIERT????!!!!
  /*setTimeout(function() {
    $("#aArtGruppe").selectmenu("refresh")
  }, 0)*/
  $('#aArtName')
    .val(window.em.hArt.aArtName)
    .html("<option value='" + window.em.hArt.aArtName + "'>" + window.em.hArt.aArtName + '</option>')
    .selectmenu()
    .selectmenu('refresh')
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  if (window.em.FeldlistehArtEdit) {
    window.em.erstelleDynamischeFelderhArtEdit()
  } else {
    // Feldliste aus der DB holen
    // das dauert länger - hinweisen
    $('#hArtEditFormHtml').html('<p class="HinweisDynamischerFeldaufbau">Die Felder werden aufgebaut...</p>')
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListeArt?include_docs=true', {
      success: function (data) {
        window.em.FeldlistehArtEdit = data
        window.em.erstelleDynamischeFelderhArtEdit()
      }
    })
  }
}

// generiert dynamisch die Artgruppen-abhängigen Felder
// Mitgeben: Feldliste, Beobachtung
window.em.erstelleDynamischeFelderhArtEdit = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFürhArtEditForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  }
  $('#hArtEditFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  window.em.aktiviereFlipswitches('#hArtEditFormHtml', window.em.hArt)
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// Flipswitches mit Wert "nein" aktiv schalten
// dazu muss der Wert aus der Objekt-Variabeln geholt werden
// keine Ahnung, wieso das jQuery-mobile nicht macht
window.em.aktiviereFlipswitches = function (dom_element, objekt_variable) {
  'use strict'
  $(dom_element)
    .find("select[data-role='flipswitch']")
    .each(function () {
      if (objekt_variable[this.name] === 'nein') {
        $(this).parent().addClass('ui-flipswitch-active')
      }
    })
}

// generiert das Html für Formular in hArtEdit.html
// erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFürhArtEditForm = function () {
  'use strict'
  var Feld = {},
    FeldName,
    FeldWert,
    htmlContainer = '',
    ArtGruppe = window.em.hArt.aArtGruppe
  _.each(window.em.FeldlistehArtEdit.rows, function (row) {
    Feld = row.doc
    FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    // Vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
    if ((Feld.User === window.em.hArt.User || Feld.User === 'ZentrenBdKt') && Feld.SichtbarImModusHierarchisch.indexOf(window.em.hArt.User) !== -1 && (typeof Feld.ArtGruppe !== 'undefined' && (Feld.ArtGruppe.indexOf(ArtGruppe) >= 0 || Feld.ArtGruppe[0] === 'alle')) && (FeldName !== 'aArtId') && (FeldName !== 'aArtGruppe') && (FeldName !== 'aArtName')) {
      if (window.em.hArt[FeldName] && window.localStorage.Status === 'neu' && Feld.Standardwert && Feld.Standardwert[window.em.hArt.User]) {
        FeldWert = Feld.Standardwert[window.em.hArt.User]
        // Objekt window.em.hArt um den Standardwert ergänzen, um später zu speichern
        window.em.hArt[FeldName] = FeldWert
      } else {
        // "" verhindert, dass im Feld undefined erscheint
        FeldWert = window.em.hArt[FeldName] || ''
      }
      htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
    }
  })
  if (window.localStorage.Status === 'neu') {
    // in neuen Datensätzen dynamisch erstellte Standardwerte speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hArt, {
      success: function (data) {
        window.em.hArt._id = data.id
        window.em.hArt._rev = data.rev
        window.localStorage.hArtId = data.id
      }
    })
    delete window.localStorage.Status
  } else {
    // Neue Datensätze haben keine Anhänge
    window.em.zeigeAttachments(window.em.hArt, 'hAE')
  }
  return htmlContainer
}

// initiiert BeobListe.html
window.em.initiierehArtListe = function () {
  'use strict'
  // hat hArtEdit.html eine hArtListe übergeben?
  if (window.em.hArtListe) {
    // Beobliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiierehArtListe_2()
  } else {
    // Beobliste aus DB holen
    var $db = $.couch.db('evab')
    $db.view('evab/hArtListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.ZeitId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.ZeitId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // Liste bereitstellen, um Datenbankzugriffe zu reduzieren
        window.em.hArtListe = data
        window.em.initiierehArtListe_2()
      }
    })
  }
}

window.em.initiierehArtListe_2 = function () {
  'use strict'
  var anzArt = window.em.hArtListe.rows.length,
    listItemContainer = '',
    Titel2,
    hArtTemp,
    $ArtlistehAL = $('#ArtlistehAL')

  // Im Titel der Seite die Anzahl Arten anzeigen
  Titel2 = ' Arten'
  if (anzArt === 1) {
    Titel2 = ' Art'
  }
  $('#hArtListePageHeader')
    .find('.hArtListePageTitel')
    .text(anzArt + Titel2)

  if (anzArt === 0) {
    listItemContainer = '<li><a href="#" class="erste NeueBeobhArtListe">Erste Art erfassen</a></li>'
  } else {
    _.each(window.em.hArtListe.rows, function (row) {
      hArtTemp = row.doc
      if (hArtTemp) {
        listItemContainer += window.em.erstelleHtmlFürBeobInHArtListe(hArtTemp)
      }
    })
  }
  $ArtlistehAL.html(listItemContainer)
  $ArtlistehAL.listview('refresh')
  window.em.blendeMenus()
  // Fokus in das Suchfeld setzen
  $('#hArtListe')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
  window.em.speichereLetzteUrl()
}

// übernimmt eine hArt
// retourniert das html für deren Zeile in der Liste
window.em.erstelleHtmlFürBeobInHArtListe = function (beob) {
  'use strict'
  var artgruppenname = encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + '.png',
    listItem
  if (beob.aArtGruppe === 'DiverseInsekten') {
    // das leere Bild anzeigen
    artgruppenname = 'unbenannt.png'
  }
  listItem = "<li class='beob ui-li-has-thumb' hArtId='" + beob._id + "' aArtGruppe='" + beob.aArtGruppe + "'" + "' aArtId='" + beob.aArtId + "'>" +
    "<a href='#'>" +
    "<img class='ui-li-thumb' src='Artgruppenbilder/" + artgruppenname + "' />" +
    '<h3>' + beob.aArtName + '<\/h3>' +
    '<\/a> <\/li>'
  return listItem
}

// generiert das Html für ein Formularelement
// erwartet diverse Übergabewerte
// der htmlContainer wird zurück gegeben
// OhneLabel: Für die Tabelle in hArtEditListe.html werden die Felder ohne Label benötigt, weil dieses im Spaltentitel steht
window.em.generiereHtmlFürFormularelement = function (Feld, FeldWert, OhneLabel) {
  'use strict'
  var htmlContainer = '',
    SliderMinimum,
    SliderMaximum,
    optionen = Feld.Optionen || ['Bitte in Feldverwaltung Optionen erfassen'],
    FeldName = Feld.FeldName,
    FeldBeschriftung = Feld.FeldBeschriftung || FeldName
  // abfangen, wenn Inputtyp vergessen wurde
  Feld.InputTyp = Feld.InputTyp || 'text'
  switch (Feld.Formularelement) {
    case 'textinput':
      htmlContainer = window.em.generiereHtmlFürTextinput(FeldName, FeldBeschriftung, FeldWert, Feld.InputTyp, OhneLabel)
      break
    case 'textarea':
      htmlContainer = window.em.generiereHtmlFürTextarea(FeldName, FeldBeschriftung, FeldWert, OhneLabel)
      break
    case 'toggleswitch':
      htmlContainer = window.em.generiereHtmlFürToggleswitch(FeldName, FeldBeschriftung, FeldWert, OhneLabel)
      break
    case 'checkbox':
      htmlContainer = window.em.generiereHtmlFürCheckbox(FeldName, FeldBeschriftung, FeldWert, optionen, OhneLabel)
      break
    case 'radio':
      htmlContainer = window.em.generiereHtmlFürRadio(FeldName, FeldBeschriftung, FeldWert, optionen, OhneLabel)
      break
    case 'selectmenu':
      htmlContainer = window.em.generiereHtmlFürSelectmenu(FeldName, FeldBeschriftung, FeldWert, optionen, 'SingleSelect', OhneLabel)
      break
    case 'multipleselect':
      htmlContainer = window.em.generiereHtmlFürSelectmenu(FeldName, FeldBeschriftung, FeldWert, optionen, 'MultipleSelect', OhneLabel)
      break
    case 'slider':
      SliderMinimum = Feld.SliderMinimum || 0
      SliderMaximum = Feld.SliderMaximum || 100
      htmlContainer = window.em.generiereHtmlFürSlider(FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum, OhneLabel)
      break
    case null:
      // Abfangen, wenn das Formularelement nicht gewählt wurde
      htmlContainer = window.em.generiereHtmlFürTextinput(FeldName, FeldBeschriftung, FeldWert, Feld.InputTyp, OhneLabel)
      break
  }
  return htmlContainer
}

// generiert den html-Inhalt für Textinputs
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürTextinput = function (FeldName, FeldBeschriftung, FeldWert, InputTyp, OhneLabel) {
  'use strict'
  var htmlContainer = '<div class="ui-field-contain">'
  if (!OhneLabel) {
    htmlContainer += '<label for="'
    htmlContainer += FeldName
    htmlContainer += '">'
    htmlContainer += FeldBeschriftung
    htmlContainer += ':</label>'
  }
  htmlContainer += '<input id="'
  htmlContainer += FeldName
  htmlContainer += '" name="'
  htmlContainer += FeldName
  htmlContainer += '" type="'
  htmlContainer += InputTyp
  htmlContainer += '" value="'
  htmlContainer += FeldWert
  htmlContainer += '" class="speichern"/></div>'
  return htmlContainer
}

// generiert den html-Inhalt für Slider
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürSlider = function (FeldName, FeldBeschriftung, FeldWert, SliderMinimum, SliderMaximum, OhneLabel) {
  'use strict'
  var htmlContainer = '<div class="ui-field-contain">'
  if (!OhneLabel) {
    htmlContainer += '<label for="'
    htmlContainer += FeldName
    htmlContainer += '">'
    htmlContainer += FeldBeschriftung
    htmlContainer += ':</label>'
  }
  htmlContainer += '<input class="speichernSlider" type="range" data-highlight="true" name="'
  htmlContainer += FeldName
  htmlContainer += '" id="'
  htmlContainer += FeldName
  htmlContainer += '" value="'
  htmlContainer += FeldWert
  htmlContainer += '" min="'
  htmlContainer += SliderMinimum
  htmlContainer += '" max="'
  htmlContainer += SliderMaximum
  htmlContainer += '"/></div>'
  return htmlContainer
}

// generiert den html-Inhalt für Textarea
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürTextarea = function (FeldName, FeldBeschriftung, FeldWert, OhneLabel) {
  'use strict'
  var htmlContainer = '<div class="ui-field-contain">'
  if (!OhneLabel) {
    htmlContainer += '<label for="'
    htmlContainer += FeldName
    htmlContainer += '">'
    htmlContainer += FeldBeschriftung
    htmlContainer += ':</label>'
  }
  htmlContainer += '<textarea id="'
  htmlContainer += FeldName
  htmlContainer += '" name="'
  htmlContainer += FeldName
  htmlContainer += '" class="speichern">'
  htmlContainer += FeldWert
  htmlContainer += '</textarea></div>'
  return htmlContainer
}

// generiert den html-Inhalt für Toggleswitch
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürToggleswitch = function (FeldName, FeldBeschriftung, FeldWert, OhneLabel) {
  'use strict'
  var htmlContainer = "<div class='ui-field-contain'>"
  if (!OhneLabel) {
    htmlContainer += "<label for='"
    htmlContainer += FeldName
    htmlContainer += "'>"
    htmlContainer += FeldBeschriftung
    htmlContainer += '</label>'
  }
  htmlContainer += "<select name='"
  htmlContainer += FeldName
  htmlContainer += "' id='"
  htmlContainer += FeldName
  htmlContainer += "' data-role='flipswitch' value='"
  htmlContainer += FeldWert
  htmlContainer += "' class='speichern flipswitch'><option value='ja'>ja</option><option value='nein'>nein</option></select></div>"
  return htmlContainer
}

// generiert den html-Inhalt für Checkbox
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürCheckbox = function (FeldName, FeldBeschriftung, FeldWert, optionen, OhneLabel) {
  'use strict'
  var htmlContainer = "<div class='ui-field-contain'><fieldset data-role='controlgroup'>"
  if (!OhneLabel) {
    htmlContainer += '<legend>'
    htmlContainer += FeldBeschriftung
    htmlContainer += '</legend>'
  }
  htmlContainer += window.em.generiereHtmlFürCheckboxOptionen(FeldName, FeldWert, optionen)
  htmlContainer += '</fieldset></div>'
  return htmlContainer
}

// generiert den html-Inhalt für Optionen von Checkbox
// wird von generiereHtmlFürCheckbox aufgerufen
window.em.generiereHtmlFürCheckboxOptionen = function (FeldName, FeldWert, optionen) {
  'use strict'
  var htmlContainer = '',
    listItem,
    id
  _.each(optionen, function (option) {
    id = _.uniqueId(FeldName + '_option_')
    listItem = "<label for='"
    listItem += id
    listItem += "'>"
    listItem += option
    listItem += "</label><input type='checkbox' name='"
    listItem += FeldName
    listItem += "' id='"
    listItem += id
    listItem += "' value='"
    listItem += option
    listItem += "' class='custom speichern'"
    if (FeldWert.indexOf(option) >= 0) {
      listItem += " checked='checked'"
    }
    listItem += '/>'
    htmlContainer += listItem
  })
  return htmlContainer
}

// generiert den html-Inhalt für Radio
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürRadio = function (FeldName, FeldBeschriftung, FeldWert, optionen, OhneLabel) {
  'use strict'
  var htmlContainer = "<div class='ui-field-contain'><fieldset data-role='controlgroup'>"
  if (!OhneLabel) {
    htmlContainer += '<legend>'
    htmlContainer += FeldBeschriftung
    htmlContainer += '</legend>'
  }
  htmlContainer += window.em.generiereHtmlFürRadioOptionen(FeldName, FeldWert, optionen)
  htmlContainer += '</fieldset></div>'
  return htmlContainer
}

// generiert den html-Inhalt für Optionen von Radio
// wird von generiereHtmlFürRadio aufgerufen
window.em.generiereHtmlFürRadioOptionen = function (feldname, feldwert, optionen) {
  'use strict'
  var htmlContainer = '',
    listItem,
    id,
    feldname_eindeutig = _.uniqueId(feldname + '_')
  _.each(optionen, function (option) {
    id = _.uniqueId(feldname + '_option_')
    listItem = "<label for='"
    listItem += id
    listItem += "'>"
    listItem += option
    listItem += "</label><input class='speichern' type='radio' name='"
    // listItem += feldname
    listItem += feldname_eindeutig
    listItem += "'"
    listItem += " id='"
    listItem += id
    listItem += "'"
    listItem += " value='"
    listItem += option
    if (feldwert === option) {
      listItem += "' checked='checked"
    }
    listItem += "'/>"
    htmlContainer += listItem
  })
  return htmlContainer
}

// generiert den html-Inhalt für Selectmenus
// wird von erstellehArtEdit aufgerufen
window.em.generiereHtmlFürSelectmenu = function (FeldName, FeldBeschriftung, FeldWert, optionen, MultipleSingleSelect, OhneLabel, icon) {
  'use strict'
  var htmlContainer = "<div class='ui-field-contain'>",
    id
  id = _.uniqueId(FeldName + '_')
  if (!OhneLabel) {
    htmlContainer += "<label for='"
    htmlContainer += id
    htmlContainer += "' class='select'>"
    htmlContainer += FeldBeschriftung
    htmlContainer += '</label>'
  }
  htmlContainer += "<select name='"
  htmlContainer += FeldName
  htmlContainer += "' id='"
  htmlContainer += id
  htmlContainer += "' value='"
  htmlContainer += FeldWert.toString()
  htmlContainer += "' data-native-menu='false'"
  if (MultipleSingleSelect === 'MultipleSelect') {
    htmlContainer += " multiple='multiple'"
  }
  if (icon) {
    htmlContainer += " data-icon='" + icon + "'"
  }
  htmlContainer += " class='speichern'>"
  if (MultipleSingleSelect === 'MultipleSelect') {
    htmlContainer += window.em.generiereHtmlFuerMultipleselectOptionen(FeldName, FeldWert, optionen)
  } else {
    htmlContainer += window.em.generiereHtmlFuerSelectmenuOptionen(FeldName, FeldWert, optionen)
  }
  htmlContainer += '</select></div>'
  return htmlContainer
}

// generiert den html-Inhalt für Optionen von Selectmenu
// wird von generiereHtmlFürSelectmenu aufgerufen
window.em.generiereHtmlFuerSelectmenuOptionen = function (feldname, feldwert, optionen) {
  'use strict'
  var htmlContainer = "<option value=''></option>",
    listItem
  _.each(optionen, function (option) {
    listItem = "<option value='"
    listItem += option
    listItem += "' class='speichern'"
    if (feldwert === option) {
      listItem += " selected='selected'"
    }
    listItem += '>'
    listItem += option
    listItem += '</option>'
    htmlContainer += listItem
  })
  return htmlContainer
}

// generiert den html-Inhalt für Optionen von MultipleSelect
// wird von generiereHtmlFürSelectmenu aufgerufen
// FeldWert ist ein Array
window.em.generiereHtmlFuerMultipleselectOptionen = function (feldname, feldwert, optionen) {
  'use strict'
  var htmlContainer = "<option value=''></option>",
    listItem
  _.each(optionen, function (option) {
    listItem = "<option value='"
    listItem += option
    listItem += "' class='speichern'"
    if (feldwert.indexOf(option) !== -1) {
      listItem += " selected='selected'"
    }
    listItem += '>'
    listItem += option
    listItem += '</option>'
    htmlContainer += listItem
  })
  return htmlContainer
}

// von oben trennen, sonst wird es vom linter zusammengefügt
(function (jQuery) {
  // friendly helper http://tinyurl.com/6aow6yn
  // Läuft durch alle Felder im Formular
  // Wenn ein Wert enthalten ist, wird Feldname und Wert ins Objekt geschrieben
  // nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
  jQuery.fn.serializeObject = function () {
    var o = {},
      a = this.serializeArray()
    $.each(a, function () {
      if (this.value) {
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]]
          }
          o[this.name].push(this.value)
        } else {
          if (window.em.myTypeOf(this.value) === 'integer') {
            // typ ist Int
            o[this.name] = parseInt(this.value, 10)
          } else if (window.em.myTypeOf(this.value) === 'float') {
            // typ ist Float
            o[this.name] = parseFloat(this.value)
          } else {
            // anderer Typ, als String behandeln
            o[this.name] = this.value
          }
        }
      }
    })
    return o
  }
  // friendly helper http://tinyurl.com/6aow6yn
  // Läuft durch alle Felder im Formular
  // Feldname und Wert aller Felder werden ins Objekt geschrieben
  // so können auch bei soeben gelöschten Feldinhalten das entsprechende Feld im doc gelöscht werden
  // siehe Beispiel in FeldEdit.html
  // nicht vergessen: Typ, _id und _rev dazu geben, um zu speichern
  jQuery.fn.serializeObjectNull = function () {
    var o = {},
      a = this.serializeArray()
    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]]
        }
        o[this.name].push(this.value)
      } else {
        if (window.em.myTypeOf(this.value) === 'integer') {
          // typ ist Int
          o[this.name] = parseInt(this.value, 10)
        } else if (window.em.myTypeOf(this.value) === 'float') {
          // typ ist Float
          o[this.name] = parseFloat(this.value)
        } else {
          // anderer Typ, als String behandeln
          o[this.name] = this.value
        }
      }
    })
    return o
  }
})(jQuery)

window.em.checkAllCheckboxesOfForm = function (pagename, checktoggle) {
  'use strict'
  var checkboxes = $('#' + pagename).find('input')
  _.each(checkboxes, function (checkbox) {
    if (checkbox.type === 'checkbox') {
      checkbox.checked = checktoggle
      $('#' + checkbox.id).checkboxradio('refresh')
    }
  })
}

window.em.checkAllRadiosOfForm = function (pagename, checktoggle) {
  'use strict'
  var radios = $('#' + pagename).find('input')
  _.each(radios, function (radio) {
    if (radio.type === 'radio') {
      radio.checked = checktoggle
      $('#' + radio.id).checkboxradio('refresh')
    }
  })
}

// verorted mit Hilfe aller Methoden
// wird benutzt von BeobEdit.html und hOrtEdit.html
// erwartet die docId, um am Ende der Verortung die neuen Koordinaten zu speichern
window.em.GetGeolocation = function (docId, OrtOderBeob) {
  'use strict'
  // benötigte Variabeln setzen
  window.localStorage.docId = docId
  // Zweck: Genau solange animieren, wie verortet wird
  window.localStorage.NavbarVerortungAnimieren = 'true'
  // übergebene Herkunft (Ort oder Beob) für die listeners bereitstellen
  window.localStorage.OrtOderBeob = OrtOderBeob
  // dem Benutzer zeigen, dass verortet wird
  window.em.NavbarVerortungAnimieren()
  // Koordinaten zurücksetzen
  delete window.localStorage.oXKoord
  delete window.localStorage.oYKoord
  delete window.localStorage.oLongitudeDecDeg
  delete window.localStorage.oLatitudeDecDeg
  delete window.localStorage.oLagegenauigkeit
  delete window.localStorage.oHöhe
  delete window.localStorage.oHöheGenauigkeit
  // Mit der Verortung beginnen
  window.em.watchID = null
  window.em.watchID = navigator.geolocation.watchPosition(window.em.onGeolocationSuccess, window.em.onGeolocationError, { frequency: 3000, enableHighAccuracy: true })
  // nach spätestens 20 Sekunden aufhören
  window.em.stop = setTimeout('window.em.stopGeolocation()', 20000)
  return window.em.watchID
}

// solange verortet wird,
// wird die Verortung in der Navbar jede Sekunde ein- und ausgeblendet
window.em.NavbarVerortungAnimieren = function () {
  'use strict'
  if (window.localStorage.NavbarVerortungAnimieren && window.localStorage.NavbarVerortungAnimieren === 'true') {
    $('.neu').removeClass('ui-btn-active')
    $('.verorten').addClass('ui-btn-active').fadeToggle('slow')
    setTimeout('window.em.NavbarVerortungAnimieren()', 1000)
  } else {
    $('.verorten').removeClass('ui-btn-active').fadeIn('slow')
  // $(".neu").addClass("ui-btn-active")
  }
}

window.em.GeolocationAuslesen = function (position) {
  'use strict'
  var DdInChX = require('./util/ddInChX'),
    DdInChY = require('./util/ddInChY')
  window.localStorage.oLagegenauigkeit = Math.floor(position.coords.accuracy)
  window.localStorage.oLongitudeDecDeg = position.coords.longitude
  window.localStorage.oLatitudeDecDeg = position.coords.latitude
  window.localStorage.oXKoord = DdInChX(position.coords.latitude, position.coords.longitude)
  window.localStorage.oYKoord = DdInChY(position.coords.latitude, position.coords.longitude)
  $("[name='oXKoord']").val(window.localStorage.oXKoord)
  $("[name='oYKoord']").val(window.localStorage.oYKoord)
  $("[name='oLongitudeDecDeg']").val(position.coords.longitude)
  $("[name='oLatitudeDecDeg']").val(position.coords.latitude)
  $("[name='oLagegenauigkeit']").val(position.coords.accuracy)
  if (position.coords.altitude > 0) {
    $("[name='oHöhe']").val(position.coords.altitude)
    $("[name='oHöheGenauigkeit']").val(position.coords.altitudeAccuracy)
    window.localStorage.oHöhe = position.coords.altitude
    window.localStorage.oHöheGenauigkeit = position.coords.altitudeAccuracy
  }
  window.em.speichereKoordinaten(window.localStorage.docId, window.localStorage.OrtOderBeob)
}

// Position ermitteln war erfolgreich
window.em.onGeolocationSuccess = function (position) {
  'use strict'
  // nur erste Position akzeptieren oder solche, die genauer sind als vorige
  if (!window.localStorage.oLagegenauigkeit || position.coords.accuracy < window.localStorage.oLagegenauigkeit) {
    if (position.coords.accuracy < 100) {
      window.em.GeolocationAuslesen(position)
      if (position.coords.accuracy <= 5) {
        window.em.stopGeolocation()
      }
    }
  }
}

// Position ermitteln war nicht erfolgreich
// onError Callback receives a PositionError object
window.em.onGeolocationError = function (error) {
  'use strict'
  window.em.melde('Keine Position erhalten\n' + error.message)
  window.em.stopGeolocation()
}

// Beendet Ermittlung der Position
window.em.stopGeolocation = function () {
  'use strict'
  // Positionssuche beenden
  // wenn keine watchID mehr, wurde sie schon beendet
  // stop timeout stoppen
  clearTimeout(window.em.stop)
  delete window.em.stop
  delete window.localStorage.VerortungAbgeschlossen
  // Vorsicht: In BeobEdit.html und hOrtEdit.html ist watchID nicht defined
  if (typeof window.em.watchID !== 'undefined') {
    navigator.geolocation.clearWatch(window.em.watchID)
    delete window.em.watchID
  }
  // Animation beenden
  delete window.localStorage.NavbarVerortungAnimieren
  // auf den Erfolg reagieren
  if (window.localStorage.oLagegenauigkeit > 30) {
    window.em.melde('Koordinaten nicht sehr genau\nAuf Karte verorten?')
  } else if (!window.localStorage.oLagegenauigkeit) {
    // Felder leeren
    $("[name='oXKoord']").val('')
    $("[name='oYKoord']").val('')
    $("[name='oLongitudeDecDeg']").val('')
    $("[name='oLatitudeDecDeg']").val('')
    $("[name='oLagegenauigkeit']").val('')
    $("[name='oHöhe']").val('')
    $("[name='oHöheGenauigkeit']").val('')
    // Diesen neuen Stand speichern (allfällige alte Koordinaten werden verworfen)
    window.em.speichereKoordinaten(window.localStorage.docId, window.localStorage.OrtOderBeob)
    window.em.melde('Keine genaue Position erhalten')
  }
  // Variablen aufräumen
  delete window.localStorage.docId
  delete window.localStorage.OrtOderBeob
}

// damit kann bei erneuter Anmeldung window.em.öffneZuletztBenutzteSeite() die letzte Ansicht wiederherstellen
// host wird NICHT geschrieben, weil sonst beim Wechsel von lokal zu iriscouch Fehler!
window.em.speichereLetzteUrl = function () {
  'use strict'
  window.localStorage.LetzteUrl = window.location.pathname + window.location.search
}

window.em.holeAutor = function () {
  'use strict'
  // aAutor holen
  var $db = $.couch.db('evab')
  $db.openDoc('f19cd49bd7b7a150c895041a5d02acb0', {
    success: function (doc) {
      if (doc.Standardwert) {
        if (doc.Standardwert[window.localStorage.Email]) {
          window.localStorage.Autor = doc.Standardwert[window.localStorage.Email]
        }
      }
    }
  })
}

// speichert Anhänge
// setzt ein passendes Formular mit den feldern _rev und _attachments voraus
// nimmt den Formnamen entgegen respektive einen Anhang dazu, damit die Form ID eindeutig sein kann
// wird benutzt von allen Formularen mit Anhängen
window.em.speichereAnhänge = function (id, Objekt, Page) {
  'use strict'
  // prüfen, ob der Datensatz als Objekt übergeben wurde
  if (Objekt) {
    // das Objekt verwenden
    window.em.speichereAnhänge_2(id, Objekt, Page)
  } else {
    // Objekt aus der DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(id, {
      success: function (data) {
        window.em[Objekt.Typ] = data
        window.em.speichereAnhänge_2(id, data, Page)
      },
      error: function () {
        window.em.melde('Fehler: Anhang nicht gespeichert')
      }
    })
  }
}

window.em.speichereAnhänge_2 = function (id, Objekt, Page) {
  'use strict'
  var $db = $.couch.db('evab')
  $('#_rev' + Page).val(window.em[Objekt.Typ]._rev)
  $('#FormAnhänge' + Page).ajaxSubmit({
    url: '/evab/' + id,
    success: function () {
      // doc nochmals holen, damit der Anhang mit Dateiname dabei ist
      $db.openDoc(id, {
        success: function (data2) {
          window.em[Objekt.Typ] = data2
          // show attachments in form
          window.em.zeigeAttachments(data2, Page)
        },
        error: function () {
          window.em.melde('Uups, Anhang wird erst beim nächsten Mal angezeigt')
        }
      })
    },
    // form.jquery.js meldet einen Fehler, obwohl der Vorgang funktioniert!
    error: function () {
      // doc nochmals holen, damit der Anhang mit Dateiname dabei ist
      $db.openDoc(id, {
        success: function (data3) {
          window.em[Objekt.Typ] = data3
          window.em.zeigeAttachments(data3, Page)
        },
        error: function () {
          window.em.melde('Uups, Anhang wird erst beim nächsten Mal angezeigt')
        }
      })
    }
  })
}

// zeigt Anhänge im Formular an
// setzt ein passendes Formular mit dem Feld _attachments + Page voraus
// und eine div namens Anhänge + Page, in der die Anhänge angezeigt werden
// wird benutzt von allen (h)Beobachtungs-Edit-Formularen
// erwartet Page, damit sowohl das AttachmentFeld als auch das div um die Anhänge reinzuhängen eindeutig sind
window.em.zeigeAttachments = function (doc, Page) {
  'use strict'
  var htmlContainer = '',
    url
  $('#_attachments' + Page).val('')
  if (doc._attachments) {
    $.each(doc._attachments, function (Dateiname) {
      url = '/evab/' + doc._id + '/' + Dateiname
      // url_zumLöschen = url + "?" + doc._rev  // theoretisch kann diese rev bis zum Löschen veraltet sein, praktisch kaum
      htmlContainer += "<div><a href='"
      htmlContainer += url
      htmlContainer += "' data-inline='true' data-role='button' target='_blank'>"
      htmlContainer += Dateiname
      htmlContainer += "</a><button name='LöscheAnhang' id='"
      htmlContainer += Dateiname
      htmlContainer += "' data-icon='delete' data-inline='true' data-iconpos='notext'/></div>"
    })
  }
  $('#Anhänge' + Page).html(htmlContainer).trigger('create')
  // Fokus auf Page richten, damit die Pagination mit den Pfeiltasten funktioniert
  $(":jqmData(role='page')").focus()
}

// initiiert FelderWaehlen.html
// generiert dynamisch die Felder im Checkbox Felder
// checked diejenigen, die der User anzeigen will
window.em.initiiereFelderWählen = function () {
  'use strict'
  var TextUeberListe_FW,
    FeldlisteViewname
  // Je nach aufrufender Seite Variabeln setzen
  switch (window.localStorage.AufrufendeSeiteFW) {
    case 'hProjektEdit':
      TextUeberListe_FW = '<h3>Felder für Projekte wählen:</h3>'
      window.localStorage.FeldlisteFwName = 'FeldlisteProjekt'
      FeldlisteViewname = 'FeldListeProjekt'
      window.localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Projekt' && FeldName !== 'pName'"
      break
    case 'hRaumEdit':
      TextUeberListe_FW = '<h3>Felder für Räume wählen:</h3>'
      window.localStorage.FeldlisteFwName = 'FeldlisteRaumEdit'
      FeldlisteViewname = 'FeldListeRaum'
      window.localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Raum' && FeldName !== 'rName'"
      break
    case 'hOrtEdit':
      TextUeberListe_FW = '<h3>Felder für Orte wählen:</h3>'
      window.localStorage.FeldlisteFwName = 'FeldlisteOrtEdit'
      FeldlisteViewname = 'FeldListeOrt'
      window.localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Ort' && FeldName !== 'oName' && FeldName !== 'oXKoord' && FeldName !== 'oYKoord' && FeldName !== 'oLagegenauigkeit'"
      break
    case 'hZeitEdit':
      TextUeberListe_FW = '<h3>Felder für Zeiten wählen:</h3>'
      window.localStorage.FeldlisteFwName = 'FeldlisteZeitEdit'
      FeldlisteViewname = 'FeldListeZeit'
      window.localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Zeit' && Feld.FeldName !== 'zDatum' && Feld.FeldName !== 'zUhrzeit'"
      break
    case 'hArtEdit':
      TextUeberListe_FW = '<h3>Felder für Art wählen:</h3><p>Die Felder der Hierarchiestufe Art werden nur in den in der Feldverwaltung definierten Artgruppen angezeigt!</p>'
      window.localStorage.FeldlisteFwName = 'FeldlistehArtEdit'
      FeldlisteViewname = 'FeldListeArt'
      window.localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Art' && (Feld.FeldName !== 'aArtGruppe') && (Feld.FeldName !== 'aArtName') && (Feld.FeldName !== 'aArtId')"
      break
    case 'hArtEditListe':
      TextUeberListe_FW = '<h3>Felder für Artliste wählen:</h3><p>Die Felder der Hierarchiestufe Art werden nur in den in der Feldverwaltung definierten Artgruppen angezeigt!</p>'
      window.localStorage.FeldlisteFwName = 'FeldlistehArtEdit' // dieselbe Liste verwenden, weil die Einstellungen in window.em.FeldlistehArtEdit bei jeder Wahl angepasst werden, inkl. _rev. Und beim Anpassen der letzte Wert aus window.em.FeldlistehArtEdit genommen wird, ohne die DB abzufragen, weil das sonst zu langsam ist
      FeldlisteViewname = 'FeldListeArt'
      window.localStorage.KriterienFürZuWählendeFelder = "Feld.Hierarchiestufe === 'Art' && (Feld.FeldName !== 'aArtGruppe') && (Feld.FeldName !== 'aArtName') && (Feld.FeldName !== 'aArtId')"
      break
    case 'BeobEdit':
      TextUeberListe_FW = '<h3>Felder für Beobachtungen wählen:</h3><p>Die Felder der Hierarchiestufe Art werden nur in den in der Feldverwaltung definierten Artgruppen angezeigt!</p>'
      window.localStorage.FeldlisteFwName = 'FeldlisteBeobEdit'
      FeldlisteViewname = 'FeldListeBeob'
      window.localStorage.KriterienFürZuWählendeFelder = "['aArtGruppe', 'aArtName', 'aAutor', 'aAutor', 'oXKoord', 'oYKoord', 'oLagegenauigkeit', 'zDatum', 'zUhrzeit'].indexOf(FeldName) === -1"
      break
  }
  $('#TextUeberListe_FW').html(TextUeberListe_FW)
  // Feldliste nur abfragen, wenn sie nicht schon als globale Variable existiert
  // Für FelderWaehlen.html könnte an sich immer die vollständige Liste verwendet werden
  // besser ist aber, dieselbe Liste zu teilen, die in derselben Hierarchiestufe für die Anzeige der Felder verwendet wird
  // darum wird hier für jede Seite eine eigene verwendet
  if (window.em[window.localStorage.FeldlisteFwName]) {
    window.em.initiiereFelderWählen_2()
  } else {
    // holt die Feldliste aus der DB
    var $db = $.couch.db('evab')
    $db.view('evab/' + FeldlisteViewname + '?include_docs=true', {
      success: function (data) {
        window.em[window.localStorage.FeldlisteFwName] = data
        window.em.initiiereFelderWählen_2()
      }
    })
  }
}

window.em.initiiereFelderWählen_2 = function () {
  'use strict'
  var htmlContainer = "<div class='ui-field-contain'>\n\t<fieldset data-role='controlgroup'>",
    anzFelder = 0,
    Feld,
    FeldName,
    FeldBeschriftung,
    listItem
  _.each(window.em[window.localStorage.FeldlisteFwName].rows, function (row) {
    Feld = row.doc
    FeldName = Feld.FeldName
    // Nur eigene und offizielle Felder berücksichtigen
    if (Feld.User === window.localStorage.Email || Feld.User === 'ZentrenBdKt') {
      // im Formular fix integrierte Felder nicht aufbauen
      if (eval(window.localStorage.KriterienFürZuWählendeFelder)) {
        anzFelder += 1
        FeldBeschriftung = Feld.Hierarchiestufe + ': ' + Feld.FeldBeschriftung
        if (Feld.Hierarchiestufe === 'Art' && Feld.ArtGruppe && Feld.ArtGruppe[0] !== 'alle' && Feld.ArtGruppe.indexOf(window.localStorage.aArtGruppe) === -1) {
          FeldBeschriftung += "<span style='font-weight:normal;'> (nicht sichtbar in Artgruppe " + window.localStorage.aArtGruppe + ')</span>'
        }
        listItem = "<label for='"
        listItem += FeldName
        listItem += "'>"
        listItem += FeldBeschriftung
        listItem += "</label><input type='checkbox' name='"
        listItem += 'Felder'
        listItem += "' id='"
        listItem += FeldName
        listItem += "' FeldId='"
        listItem += Feld._id
        listItem += "' value='"
        listItem += FeldName
        listItem += "' class='custom'"
        if (window.localStorage.AufrufendeSeiteFW === 'BeobEdit') {
          if (Feld.SichtbarImModusEinfach) {
            if (Feld.SichtbarImModusEinfach.indexOf(window.localStorage.Email) !== -1) {
              // wenn sichtbar, anzeigen
              listItem += " checked='checked'"
            }
          }
        } else if (window.localStorage.AufrufendeSeiteFW === 'hArtEditListe') {
          if (Feld.SichtbarInHArtEditListe) {
            if (Feld.SichtbarInHArtEditListe.indexOf(window.localStorage.Email) !== -1) {
              // wenn sichtbar, anzeigen
              listItem += " checked='checked'"
            }
          }
        } else {
          if (Feld.SichtbarImModusHierarchisch) {
            if (Feld.SichtbarImModusHierarchisch.indexOf(window.localStorage.Email) !== -1) {
              // wenn sichtbar, anzeigen
              listItem += " checked='checked'"
            }
          }
        }
        listItem += '/>'
        htmlContainer += listItem
      }
    }
  })
  $('#FelderWaehlenPageHeader')
    .find('.FelderWaehlenPageTitel')
    .text(anzFelder + ' Felder')
  htmlContainer += '</fieldset></div>'
  $('#FeldlisteFW').html(htmlContainer).trigger('create')
  $("input[name='Felder']").checkboxradio()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// kreiert ein neues Feld
// wird benutzt von FeldListe.html und FeldEdit.html
window.em.neuesFeld = function () {
  'use strict'
  var NeuesFeld = {},
    hierarchiestufe
  NeuesFeld.Typ = 'Feld'
  NeuesFeld.User = window.localStorage.Email
  NeuesFeld.SichtbarImModusEinfach = []
  NeuesFeld.SichtbarImModusHierarchisch = []
  NeuesFeld.SichtbarInHArtEditListe = []
  // Hierarchiestufe aufgrund der Herkunft wählen
  switch (window.localStorage.zurueck) {
    case 'hProjektEdit.html':
    case 'hProjektListe.html':
      hierarchiestufe = 'Projekt'
      break
    case 'hRaumEdit.html':
    case 'hRaumListe.html':
      hierarchiestufe = 'Raum'
      break
    case 'hOrtEdit.html':
    case 'hOrtListe.html':
      hierarchiestufe = 'Ort'
      break
    case 'hZeitEdit.html':
    case 'hZeitListe.html':
      hierarchiestufe = 'Zeit'
      break
    default:
      hierarchiestufe = 'Art'
      break
  }
  NeuesFeld.Hierarchiestufe = hierarchiestufe
  // Feldtyp vorwählen
  NeuesFeld.Formularelement = 'textinput'
  NeuesFeld.InputTyp = 'text'
  // gleich sichtbar stellen
  NeuesFeld.SichtbarImModusEinfach.push(window.localStorage.Email)
  NeuesFeld.SichtbarImModusHierarchisch.push(window.localStorage.Email)
  NeuesFeld.SichtbarInHArtEditListe.push(window.localStorage.Email)
  var $db = $.couch.db('evab')
  $db.saveDoc(NeuesFeld, {
    success: function (data) {
      window.localStorage.FeldId = data.id
      NeuesFeld._id = data.id
      NeuesFeld._rev = data.rev
      window.em.Feld = NeuesFeld
      // Feldliste soll neu aufgebaut werden
      window.em.leereStorageFeldListe()
      $(':mobile-pagecontainer').pagecontainer('change', 'FeldEdit.html', { allowSamePageTransition: true })
    },
    error: function () {
      window.em.melde('Fehler: Feld nicht erzeugt')
    }
  })
}

// MOMENTAN NICHT BENUTZT
window.em.prüfeAnmeldung = function () {
  'use strict'
  // Username Anmeldung überprüfen
  // Wenn angemeldet, globale Variable Username aktualisieren
  // Wenn nicht angemeldet, Anmeldedialog öffnen
  if (!window.localStorage.Email) {
    $.ajax({
      url: '/_session',
      dataType: 'json',
      async: false
    }).done(function (session) {
      if (session.userCtx.name !== undefined && session.userCtx.name !== null) {
        window.localStorage.Email = session.userCtx.name
      } else {
        window.localStorage.UserStatus = 'neu'
        $.mobile.navigate('index.html')
      }
    })
  }
}

// setzt die OrtId, damit hOrtEdit.html am richtigen Ort öffnet
// und ruft dann hOrtEdit.html auf
// wird von den Links in der Karte benutzt
window.em.öffneOrt = function (OrtId) {
  'use strict'
  window.localStorage.OrtId = OrtId
  $.mobile.navigate('hOrtEdit.html')
}

// setzt die BeobId, damit BeobEdit.html am richtigen Ort öffnet
// und ruft dann BeobEdit.html auf
// wird von den Links in der Karte auf BeobListe.html benutzt
window.em.öffneBeob = function (BeobId) {
  'use strict'
  window.localStorage.BeobId = BeobId
  $.mobile.navigate('BeobEdit.html')
}

// wird benutzt in Artenliste.html
// wird dort aufgerufen aus pageshow und pageinit, darum hierhin verlagert
// erwartet einen filterwert
// Wenn mehrmals nacheinander dieselbe Artenliste aufgerufen wird, soll wenn möglich die alte Liste verwendet werden können
// möglich ist dies wenn diese Faktoren gleich sind: Artgruppe, allfällige Unterauswahl
window.em.initiiereArtenliste = function (filterwert) {
  'use strict'
  // wenn alle drei Faktoren gleich sind, direkt die Artenliste erstellen
  // nur wenn eine Artenliste existiert. Grund: window.em.Artenliste lebt nicht so lang wie window.localStorage
  // aber die Artenliste aus der window.localStorage zu parsen macht auch keinen sinn
  if (window.em.Artenliste && window.localStorage.aArtGruppeZuletzt === window.localStorage.aArtGruppe) {
    window.em.erstelleArtenliste(filterwert)
  } else {
    // sonst aus der DB holen
    window.em.holeArtenliste(filterwert)
  }
  // letzte Artgruppe aktualisieren
  window.localStorage.aArtGruppeZuletzt = window.localStorage.aArtGruppe
}

// wird benutzt in Artenliste.html
// aufgerufen von initiiereArtenliste
window.em.holeArtenliste = function (filterwert) {
  'use strict'
  var viewname = 'evab/Artliste?startkey=["' + encodeURIComponent(window.localStorage.aArtGruppe) + '"]&endkey=["' + encodeURIComponent(window.localStorage.aArtGruppe) + '",{},{}]&include_docs=true'
  var $db = $.couch.db('evab')
  $db.view(viewname, {
    success: function (data) {
      window.em.Artenliste = data.rows
      window.em.erstelleArtenliste(filterwert)
    }
  })
}

// bekommt eine Artenliste und baut damit im Formular die Artenliste auf
// filterwert: übergebener Teil aus der Artbezeichnung
window.em.erstelleArtenliste = function (filterwert) {
  'use strict'
  var html = '',
    ArtBezeichnung,
    artenliste_gefiltert
  // gefiltert werden muss nur, wenn mehr als 200 Arten aufgelistet würden
  if (window.em.Artenliste.length > 0) {
    if (filterwert) {
      // artenliste filtern
      artenliste_gefiltert = _.filter(window.em.Artenliste, function (art) {
        ArtBezeichnung = art.key[2]
        return ArtBezeichnung.toLowerCase().indexOf(filterwert) > -1
      })
      if (artenliste_gefiltert.length > 0) {
        if (artenliste_gefiltert.length > 200) {
          html = '<li class="artlistenhinweis">' + artenliste_gefiltert.length + ' Arten gefiltert.<br>Um Mobilgeräte nicht zu überfordern, <b>werden nur die ersten 200 angezeigt</b>.<br>Versuchen Sie einen strengeren Filter</li>'
        } else {
          html = '<li class="artlistenhinweis">' + artenliste_gefiltert.length + ' Arten gefiltert</li>'
        }
        // html der ersten 200 aufbauen
        _.each(_.first(artenliste_gefiltert, 200), function (art_row) {
          ArtBezeichnung = art_row.key[2]
          html += window.em.holeHtmlFürArtInArtenliste(art_row.doc, ArtBezeichnung)
        })

      } else {
        html = '<li class="artlistenhinweis">Keine Arten gefunden</li>'
      }
    } else {
      // kein Filter gesetzt
      if (window.em.Artenliste.length > 200) {
        html = '<li class="artlistenhinweis">Die Artengruppe hat ' + window.em.Artenliste.length + ' Arten.<br>Um Mobilgeräte nicht zu überfordern, <b>werden nur die ersten 200 angezeigt</b>.<br>Tipp: Setzen Sie einen Filter</li>'
      } else {
        html = '<li class="artlistenhinweis">' + window.em.Artenliste.length + ' Arten</li>'
      }
      // erste zweihundert anzeigen
      _.each(_.first(window.em.Artenliste, 200), function (art_row) {
        ArtBezeichnung = art_row.key[2]
        html += window.em.holeHtmlFürArtInArtenliste(art_row.doc, ArtBezeichnung)
      })
    }
  } else {
    // Artenliste.length ==== 0
    html = '<li class="artlistenhinweis">Die Artengruppe enthält keine Arten</li>'
  }
  $('#al_ArtenListe')
    .html(html)
    .show()
    .listview('refresh')
  // Fokus in das Suchfeld setzen
  $('#Artenliste')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()

}

window.em.holeHtmlFürArtInArtenliste = function (Art, ArtBezeichnung) {
  'use strict'
  var html = "<li name='ArtListItem' ArtBezeichnung='"
  html += ArtBezeichnung
  html += "' ArtId='"
  html += Art._id
  html += "'>"
  html += "<a href='#'><h3>"
  html += ArtBezeichnung
  html += '<\/h3>'
  if (Art.HinweisVerwandschaft) {
    html += '<p>' + Art.HinweisVerwandschaft + '<\/p>'
  }
  html += '<\/a><\/li>'
  return html
}

// wird benutzt in Artgruppenliste.html
// aufgerufen von erstelleArtgruppenListe
window.em.erstelleArtgruppenListe = function () {
  'use strict'
  // Artgruppenliste verfügbar machen
  if (window.em.Artgruppenliste) {
    window.em.erstelleArtgruppenListe_2()
  } else if (window.localStorage.Artgruppenliste) {
    window.em.Artgruppenliste = JSON.parse(window.localStorage.Artgruppenliste)
    window.em.erstelleArtgruppenListe_2()
  } else {
    var $db = $.couch.db('evab')
    $db.view('evab/Artgruppen?include_docs=true', {
      success: function (data) {
        // Artgruppenliste bereitstellen
        window.em.Artgruppenliste = data
        window.localStorage.Artgruppenliste = JSON.stringify(window.em.Artgruppenliste)
        window.em.erstelleArtgruppenListe_2()
      }
    })
  }
}

// wird benutzt in Artgruppenliste.html
// aufgerufen von erstelleArtgruppenListe
window.em.erstelleArtgruppenListe_2 = function () {
  'use strict'
  var html = '',
    ArtGruppe,
    AnzArten
  _.each(window.em.Artgruppenliste.rows, function (row) {
    ArtGruppe = row.key
    AnzArten = row.doc.AnzArten
    html += "<li name='ArtgruppenListItem' ArtGruppe='" + ArtGruppe + "'>"
    html += "<a href='#'><h3>" + ArtGruppe + "<\/h3><span class='ui-li-count'>" + AnzArten + '</span><\/a><\/li>'
  })
  $('#agl_ArtgruppenListe')
    .html(html)
    .listview('refresh')
  $('#agl_Hinweistext')
    .empty()
    .remove()
  // Fokus in das Suchfeld setzen
  $('#Artgruppenliste')
    .find('.ui-input-search')
    .children('input')[0]
    .focus()
}

// Stellt die Daten des Users bereit
// In der Regel nach gelungener Anmeldung
// Auch wenn eine Seite direkt geöffnet wird und die Userdaten vermisst
// braucht den Usernamen
window.em.stelleUserDatenBereit = function () {
  'use strict'
  window.em.holeAutor()
  $.couch.userDb(function (db) {
    db.openDoc('org.couchdb.user:' + window.localStorage.Email, {
      success: function (doc) {
        if (doc.Datenverwendung) {
          window.localStorage.Datenverwendung = doc.Datenverwendung
        } else {
          // Datenverwendung existiert nicht
          // Kann es sein, dass dieser User sein Konto ursprünglich in ArtenDb erstellt hat
          $.mobile.navigate('UserEdit.html')
          return
        }
        window.em.öffneZuletztBenutzteSeite()
      }
    })
  })
}

// wird benutzt von window.em.stelleUserDatenBereit()
// öffnet die zuletzt benutzte Seite oder BeobListe.html
window.em.öffneZuletztBenutzteSeite = function () {
  'use strict'
  var LetzteUrl
  // unendliche Schlaufe verhindern, falls LetzteUrl auf diese Seite verweist
  if (window.localStorage.LetzteUrl && window.localStorage.LetzteUrl !== '/evab/_design/evab/index.html') {
    LetzteUrl = window.localStorage.LetzteUrl
  } else {
    LetzteUrl = 'BeobListe.html'
  }
  $.mobile.navigate(LetzteUrl)
}

// die nachfolgenden funktionen bereinigen die window.localStorage und die globalen Variabeln
// sie entfernen die im jeweiligen Formular ergänzten window.localStorage-Einträge
// mitLatLngListe gibt an, ob die Liste für die Karte auch entfernt werden soll

window.em.leereAlleVariabeln = function (ohneClear) {
  'use strict'
  // ohne clear: nötig, wenn man in FelderWaehlen.html ist und keine aufrufende Seite kennt
  // Username soll erhalten bleiben
  if (!ohneClear) {
    window.localStorage.clear()
  }
  delete window.localStorage.Autor
  window.em.leereStorageProjektListe('mitLatLngListe')
  window.em.leereStorageProjektEdit('mitLatLngListe')
  window.em.leereStorageRaumListe('mitLatLngListe')
  window.em.leereStorageRaumEdit('mitLatLngListe')
  window.em.leereStorageOrtListe('mitLatLngListe')
  window.em.leereStorageOrtEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStoragehArtListe()
  window.em.leereStoragehArtEdit()
  window.em.leereStorageBeobListe()
  window.em.leereStorageBeobEdit()
  window.em.leereStorageFeldListe()
  window.em.leereStorageFeldEdit()
}

window.em.leereStorageProjektListe = function (mitLatLngListe) {
  'use strict'
  delete window.em.Projektliste
  if (mitLatLngListe) {
    delete window.em.hOrteLatLngProjektliste
  }
}

// ohneId wird beim paginaten benutzt, da die ID übermittelt werden muss
window.em.leereStorageProjektEdit = function (mitLatLngListe, ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.ProjektId
  }
  delete window.em.hProjekt
  if (mitLatLngListe) {
    delete window.em.hOrteLatLngProjekt
  }
  // hierarchisch tiefere Listen löschen
  delete window.em.RaeumeVonProjekt
  delete window.em.OrteVonProjekt
  delete window.em.OrteVonRaum
  delete window.em.ZeitenVonProjekt
  delete window.em.ZeitenVonRaum
  delete window.em.ZeitenVonOrt
  delete window.em.ArtenVonProjekt
  delete window.em.ArtenVonRaum
  delete window.em.ArtenVonOrt
  delete window.em.ArtenVonZeit
}

window.em.leereStorageRaumListe = function (mitLatLngListe) {
  'use strict'
  delete window.em.RaumListe
  if (mitLatLngListe) {
    delete window.em.hOrteLatLngProjekt
  }
  delete window.em.RaeumeVonProjekt
}

window.em.leereStorageRaumEdit = function (mitLatLngListe, ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.RaumId
  }
  delete window.em.hRaum
  if (mitLatLngListe) {
    delete window.em.hOrteLatLngRaum
  }
  // hierarchisch tiefere Listen löschen
  delete window.em.OrteVonProjekt
  delete window.em.OrteVonRaum
  delete window.em.ZeitenVonProjekt
  delete window.em.ZeitenVonRaum
  delete window.em.ZeitenVonOrt
  delete window.em.ArtenVonProjekt
  delete window.em.ArtenVonRaum
  delete window.em.ArtenVonOrt
  delete window.em.ArtenVonZeit
}

window.em.leereStorageOrtListe = function (mitLatLngListe) {
  'use strict'
  delete window.em.OrtListe
  if (mitLatLngListe) {
    delete window.em.hOrteLatLngRaum
  }
  delete window.em.OrteVonProjekt
  delete window.em.OrteVonRaum
}

window.em.leereStorageOrtEdit = function (ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.OrtId
  }
  delete window.em.hOrt
  delete window.localStorage.oXKoord
  delete window.localStorage.oYKoord
  delete window.localStorage.oLagegenauigkeit
  delete window.localStorage.oLatitudeDecDeg
  delete window.localStorage.oLongitudeDecDeg
  delete window.localStorage.aArtId
  delete window.localStorage.aArtName
  delete window.localStorage.aArtGruppe
  // hierarchisch tiefere Listen löschen
  delete window.em.ZeitenVonProjekt
  delete window.em.ZeitenVonRaum
  delete window.em.ZeitenVonOrt
  delete window.em.ArtenVonProjekt
  delete window.em.ArtenVonRaum
  delete window.em.ArtenVonOrt
  delete window.em.ArtenVonZeit
  // allfällige Lokalisierung abbrechen
  if (typeof window.em.watchID !== 'undefined') {
    window.em.stopGeolocation()
  }
}

window.em.leereStorageZeitListe = function () {
  'use strict'
  delete window.em.ZeitListe
  delete window.em.ZeitenVonProjekt
  delete window.em.ZeitenVonRaum
  delete window.em.ZeitenVonOrt
}

window.em.leereStorageZeitEdit = function (ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.ZeitId
  }
  delete window.em.hZeit
  // hierarchisch tiefere Listen löschen
  delete window.em.ArtenVonProjekt
  delete window.em.ArtenVonRaum
  delete window.em.ArtenVonOrt
  delete window.em.ArtenVonZeit
}

window.em.leereStoragehArtListe = function () {
  'use strict'
  delete window.em.hArtListe
  delete window.em.ArtenVonProjekt
  delete window.em.ArtenVonRaum
  delete window.em.ArtenVonOrt
  delete window.em.ArtenVonZeit
}

window.em.leereStoragehArtEdit = function (ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.hArtId
  }
  delete window.em.hArt
}

window.em.leereStorageBeobListe = function () {
  'use strict'
  delete window.em.BeobListe
  delete window.em.BeobListeLatLng
}

window.em.leereStorageBeobEdit = function (ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.BeobId
  }
  delete window.em.Beobachtung
  delete window.localStorage.oXKoord
  delete window.localStorage.oYKoord
  delete window.localStorage.oLagegenauigkeit
  delete window.localStorage.oLatitudeDecDeg
  delete window.localStorage.oLongitudeDecDeg
  delete window.localStorage.aArtId
  delete window.localStorage.aArtName
  delete window.localStorage.aArtGruppe
  // allfällige Lokalisierung abbrechen
  if (typeof window.em.watchID !== 'undefined') {
    window.em.stopGeolocation()
  }
}

window.em.leereStorageFeldListe = function () {
  'use strict'
  delete window.em.Feldliste
  delete window.em.FeldlisteBeobEdit
  delete window.em.FeldlistehArtEdit
  delete window.em.FeldlistehArtEditListe
  delete window.em.FeldlisteZeitEdit
  delete window.em.FeldlisteOrtEdit
  delete window.em.FeldlisteRaumEdit
  delete window.em.FeldlisteProjekt
}

window.em.leereStorageFeldEdit = function (ohneId) {
  'use strict'
  if (!ohneId) {
    delete window.localStorage.FeldId
  }
  delete window.em.Feld
}

// setzt alle Felder im Modus Hierarchisch sichtbar
// Erwartet die Email
// Modus einfach wird hier nicht eingestellt: Die minimalen Felder sind fix programmiert
// wird verwendet in: Signup.html, UserEdit.html
window.em.erstelleSichtbareFelder = function () {
  'use strict'
  var viewname = 'evab/FeldListeFeldName?include_docs=true'
  var $db = $.couch.db('evab')
  $db.view(viewname, {
    success: function (data) {
      var Feld
      _.each(data.rows, function (row) {
        Feld = row.doc
        // Nur ausgewählte offizielle Felder berücksichtigen
        // if (Feld.User === "ZentrenBdKt") {
        if (['pBemerkungen', 'rBemerkungen', 'oLatitudeDecDeg', 'oLongitudeDecDeg', 'oHöhe', 'oHöheGenauigkeit', 'oBemerkungen', 'zBemerkungen', 'aArtNameUnsicher', 'aArtNameEigener', 'aArtNameBemerkungen', 'aMenge', 'aBemerkungen'].indexOf(Feld.FeldName) > -1) {
          $db.openDoc(Feld._id, {
            success: function (Feld) {
              var Username = window.localStorage.Email
              Feld.SichtbarImModusHierarchisch.push(Username)
              $db.saveDoc(Feld)
            }
          })
        }
      })
    }
  })
}

// erstellt die sichtbaren Felder
// wird benutzt von: Signup.html
window.em.speichereAutorAlsStandardwert = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.openDoc('f19cd49bd7b7a150c895041a5d02acb0', {
    success: function (Feld) {
      // Falls Standardwert noch nicht existiert,
      // muss zuerst das Objekt geschaffen werden
      if (!Feld.Standardwert) {
        Feld.Standardwert = {}
      }
      Feld.Standardwert[window.localStorage.Email] = window.localStorage.Autor
      $db.saveDoc(Feld, {
        success: function () {
          // Felder sictbar schalten
          window.em.erstelleSichtbareFelder()
          // Feldliste soll neu aufgebaut werden
          window.em.leereStorageFeldListe()
          $.mobile.navigate('BeobListe.html')
        },
        error: function () {
          window.em.erstelleSichtbareFelder()
          window.em.melde('Konto erfolgreich erstellt\nAnmeldung gescheitert\nBitte melden Sie sich neu an')
        }
      })
    },
    error: function () {
      window.em.erstelleSichtbareFelder()
      window.em.melde('Konto erfolgreich erstellt\nAnmeldung gescheitert\nBitte melden Sie sich neu an')
    }
  })
}

/*
*validiert email-adressen
*Quelle: http://stackoverflow.com/questions/2507030/email-validation-using-jquery
*/
window.em.validateEmail = function (email) {
  'use strict'
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
  return emailReg.test(email)
}

// testet, ob die lokale Version erreichbar ist
// wenn ja, wird diese geöffnet, sonst arteigenschaften.ch
window.em.öffneEigenschaftenVonArt = function (id) {
  'use strict'
  var url,
    // neues Fenster jetzt schon gründen
    // wenn man window.open nach dem callback ausführt, öffnet das Fenster als popup
    win = window.open('', '_blank')

  $.ajax({
    type: 'HEAD',
    url: 'http://127.0.0.1:5984/artendb/_design/artendb/index.html'
  })
    .done(function () {
      // lokale db ist erreichbar, diese verwenden
      url = 'http://127.0.0.1:5984/artendb/_design/artendb/index.html?id=' + id
      // url des im neuen tab geöffneten Fensters anpassen
      win.location.href = url
    })
    .fail(function () {
      // lokale db ist nicht erreichbar
      url = 'http://arteigenschaften.ch/artendb/_design/artendb/index.html?id=' + id
      // url des im neuen tab geöffneten Fensters anpassen
      win.location.href = url
    })
}

// wenn Artenliste.html initiiert wird
window.em.handleAlPageinit = function () {
  'use strict'
  $(document)
    .on('keypress', window.em.handleAlKeypress)

  $('#Artenliste')
    .on('click', '#al_filter_setzen', window.em.handleAlAlFilterClick)
    .on('click', '.ui-icon-delete', window.em.handleAlUiIconDeleteClick)
    .on('click', '#al_standardgruppe', window.em.handleAlAlStandardgruppeClick)

  $('#al_ArtenListe')
    .on('click', "[name='ArtListItem']", function (event) {
      event.preventDefault()
      window.em.handleAlArtListItemClick(this)
    })
}

// wenn Artenliste.html gezeigt wird
window.em.handleAlPageshow = function () {
  'use strict'
  window.em.initiiereArtenliste('')
  if (window.em.gruppe_merken) {
    $('#al_standardgruppe').removeClass('ui-disabled')
  } else {
    $('#al_standardgruppe').addClass('ui-disabled')
  }
}

// wenn Artenliste.html verschwindet
window.em.handleAlPagehide = function () {
  'use strict'
  $('#al_ArtenListe').hide()
}

// wenn in Artenliste.html eine Taste gedrückt wird
window.em.handleAlKeypress = function (event) {
  'use strict'
  if (event.which === 13) {
    var filterwert = $('#al_filter').val().toLowerCase()
    window.em.initiiereArtenliste(filterwert)
  }
}

// wenn in Artenliste.html #al_filter_setzen geklickt wird
window.em.handleAlAlFilterClick = function () {
  'use strict'
  var filterwert = $('#al_filter').val().toLowerCase()
  window.em.initiiereArtenliste(filterwert)
}

// wenn in Artenliste.html .ui-icon-delete geklickt wird
window.em.handleAlUiIconDeleteClick = function () {
  'use strict'
  var filterwert = ''
  window.em.initiiereArtenliste(filterwert)
}

// wenn in Artenliste.html #al_standardgruppe geklickt wird
window.em.handleAlAlStandardgruppeClick = function () {
  'use strict'
  delete window.em.gruppe_merken
  $.mobile.navigate('Artgruppenliste.html')
}

// wenn in Artenliste.html [name='ArtListItem'] geklickt wird
window.em.handleAlArtListItemClick = function (that) {
  'use strict'
  var ArtBezeichnung = $(that).attr('ArtBezeichnung'),
    artid = $(that).attr('artid'),
    harten_mit_gleicher_artid = []

  // kontrollieren, ob diese Art schon erfasst wurde
  // Vorsicht: window.em.hArtListe existiert nicht, wenn in hArtEdit F5 gedrückt wurde!
  if (window.em.hArtListe && window.em.hArtListe.rows) {
    harten_mit_gleicher_artid = _.filter(window.em.hArtListe.rows, function (row) {
      return row.doc.aArtId === artid && artid !== undefined
    })
  }

  if (harten_mit_gleicher_artid.length > 0) {
    window.em.melde('Diese Art wurde bereits erfasst')
  } else {
    window.localStorage.aArtId = artid
    if (window.localStorage.Status === 'neu') {
      window.em.speichereNeueBeob(ArtBezeichnung)
    } else {
      window.em.speichereBeobNeueArtgruppeArt(ArtBezeichnung)
    }
  }
}

// wenn Artgruppenliste.html erscheint
window.em.handleAglPageshow = function () {
  'use strict'
  window.em.erstelleArtgruppenListe()
  delete window.em.gruppe_merken
}

// wenn Artgruppenliste.html verschwindet
window.em.handleAglPagehide = function () {
  'use strict'
  $('#agl_standardgruppe').html('nächste Gruppe merken')
}

// wenn Artgruppenliste.html initiiert wird
window.em.handleAglPageinit = function () {
  'use strict'
  // Vorsicht: Genauer als body funktioniert hier nicht,
  // weil die nested List im DOM jedes mal eine eigene Page aufbaut
  $('body')
    .on('click', "[name='ArtgruppenListItem']", function (event) {
      event.preventDefault()
      window.em.handleAglArtgruppenListItemClick(this)
    })

  $('#Artgruppenliste')
    .on('click', '#agl_standardgruppe', window.em.handleAglAglStandardgruppeClick)
}

// wenn in Artgruppenliste.html [name='ArtgruppenListItem'] geklickt wird
window.em.handleAglArtgruppenListItemClick = function (that) {
  'use strict'
  window.localStorage.aArtGruppe = $(that).attr('ArtGruppe')
  // wenn die Gruppe gemerkt werden soll, sie als globale Variable speichern
  if (window.em.gruppe_merken) {
    window.em.gruppe_merken = $(that).attr('ArtGruppe')
  }
  $.mobile.navigate('Artenliste.html')
}

// wenn in Artgruppenliste.html #agl_standardgruppe geklickt wird
window.em.handleAglAglStandardgruppeClick = function () {
  'use strict'
  if ($(this).html() === 'nächste Gruppe merken') {
    window.em.gruppe_merken = true
    $(this).html('nächste Gruppe wird gemerkt')
  } else {
    delete window.em.gruppe_merken
    $(this).html('nächste Gruppe merken')
  }
}

// wenn BeobEdit.html erscheint
window.em.handleBeobEditPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu BeobListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.BeobId || window.localStorage.BeobId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('BeobListe.html')
    return
  }
  window.em.initiiereBeobEdit()
}

// wenn BeobEdit.html verschwindet
window.em.handleBeobEditPagehide = function () {
  'use strict'
  if (typeof window.em.watchID !== 'undefined') {
    window.em.stopGeolocation()
  }
}

// wenn BeobEdit.html initiiert wird
window.em.handleBeobEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.BeobId || window.localStorage.BeobId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('BeobListe.html')
    return
  }

  $('#BeobEditHeader')
    .on('click', '#OeffneBeobListeBeobEdit', window.em.handleOeffneBeobListeBeobEditClick)

  $('#BeobEditForm')
    .on('click', '.aArtGruppe', function (event) {
      event.preventDefault()
      window.em.handleBeobEditAArtGruppeClick()
    })
    .on('click', '.aArtName', function (event) {
      event.preventDefault()
      window.em.handleBeobEditAArtnameClick()
    })
    .on('change', '.speichern', window.em.handleBeobEditSpeichernChange)
    // Eingabe im Zahlenfeld abfangen (blur)
    // Ende des Schiebens abfangen (slidestop)
    .on('blur slidestop', '.speichernSlider', window.em.speichereBeob)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereBeob)

  $('#BeobEditPageFooterNavbar')
    .on('click', '#NeueBeobBeobEdit', function (event) {
      event.preventDefault()
      window.em.handleNeueBeobBeobEditClick()
    })
    .on('click', '#waehleFelderBeobEdit', function (event) {
      event.preventDefault()
      window.em.handleWaehleFelderBeobEditClick()
    })
    .on('click', '#OeffneKarteBeobEdit', function (event) {
      event.preventDefault()
      window.em.handleBeobEditOeffneKarteClick()
    })
    .on('click', '#verorteBeobBeobEdit', function (event) {
      event.preventDefault()
      window.em.GetGeolocation(window.localStorage.BeobId, 'Beob')
    })
    .on('click', '#LoescheBeobBeobEdit', function (event) {
      event.preventDefault()
      $('#beob_löschen_meldung').popup('open')
    })

  $('#beob_löschen_meldung')
    .on('click', '#beob_löschen_meldung_ja_loeschen', window.em.löscheBeob)

  $('#FormAnhängeBE')
    .on('change', '.speichernAnhang', window.em.handleBeobEditSpeichernAnhangChange)
    .on('click', "[name='LöscheAnhang']", function (event) {
      event.preventDefault()
      window.em.löscheAnhang(this, window.em.Beobachtung, window.localStorage.BeobId)
    })

  $('#BeobEdit')
    .on('swipeleft', '#BeobEditContent', window.em.handleBeobEditContentSwipeleft)
    .on('swiperight', '#BeobEditContent', window.em.handleBeobEditContentSwiperight)
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      // zum vorigen Datensatz wechseln
      window.em.nächsteVorigeBeob('vorige')
    })
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      // zum nächsten Datensatz wechseln
      window.em.nächsteVorigeBeob('nächste')
    })
    .on('keyup', function (event) {
      'use strict'
      // Wechsel zwischen Datensätzen via Pfeiltasten steuern
      // nicht in separate Funktion auslagern, weil IE9 event.preventDefault nicht kenn (und hier jQuery das abfängt)
      // nur reagieren, wenn BeobEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#BeobEdit').is(':visible')) {
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          // Left arrow
          window.em.nächsteVorigeBeob('vorige')
          event.preventDefault()
        } else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          // Right arrow
          window.em.nächsteVorigeBeob('nächste')
          event.preventDefault()
        }
      }
    })

  $('#MenuBeobEdit')
    .on('click', '.menu_arteigenschaften', window.em.handleBeobEditMenuArteigenschaftenClick)
    .on('click', '.menu_hierarchischer_modus', window.em.handleBeobEditMenuHierarchischerModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleBeobEditMenuFelderVerwaltenClick)
    .on('click', '.menu_beob_exportieren', window.em.handleBeobEditMenuBeobExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleBeobEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in BeobEdit.html #OeffneBeobListeBeobEdit geklickt wird
window.em.handleOeffneBeobListeBeobEditClick = function () {
  'use strict'
  window.em.leereStorageBeobEdit()
  $.mobile.navigate('BeobListe.html')
}

// wenn in BeobEdit.html #NeueBeobBeobEdit geklickt wird
// neue Beobachtung erfassen
window.em.handleNeueBeobBeobEditClick = function () {
  'use strict'
  // Globale Variable für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
  window.em.leereStorageBeobListe()
  window.localStorage.Status = 'neu'
  window.localStorage.Von = 'BeobEdit'
  if (window.em.gruppe_merken) {
    // Artgruppenliste auslassen
    // window.localStorage.ArtGruppe ist schon gesetzt
    $.mobile.navigate('Artenliste.html')
  } else {
    $.mobile.navigate('Artgruppenliste.html')
  }
}

// wenn in BeobEdit.html .aArtGruppe geklickt wird
// Editieren von Beobachtungen managen, ausgehend von Artgruppe
window.em.handleBeobEditAArtGruppeClick = function () {
  'use strict'
  // Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
  window.em.leereStorageBeobListe()
  delete window.localStorage.Status // ja kein Status neu
  window.localStorage.Von = 'BeobEdit'
  if (window.em.gruppe_merken) {
    // Artgruppenliste auslassen
    // window.localStorage.aArtGruppe ist schon gesetzt
    $.mobile.navigate('Artenliste.html')
  } else {
    $.mobile.navigate('Artgruppenliste.html')
  }
}

// wenn in BeobEdit.html #waehleFelderBeobEdit geklickt wird
// sichtbare Felder wählen
window.em.handleWaehleFelderBeobEditClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'BeobEdit'
  $.mobile.navigate('FelderWaehlen.html')
}

// wenn in BeobEdit.html .aArtName geklickt wird
// Editieren von Beobachtungen managen, ausgehend von ArtName
window.em.handleBeobEditAArtnameClick = function () {
  'use strict'
  // Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
  window.em.leereStorageBeobListe()
  window.localStorage.Von = 'BeobEdit'
  $.mobile.navigate('Artenliste.html')
}

// wenn in BeobEdit.html .speichern geändert wird
// Für jedes Feld bei Änderung speichern
window.em.handleBeobEditSpeichernChange = function () {
  'use strict'
  var $oXKoord = $("[name='oXKoord']"),
    $oYKoord = $("[name='oYKoord']"),
    ChToWgsLng = require('./util/chToWgsLng'),
    ChToWgsLat = require('./util/chToWgsLat')
  if (['oXKoord', 'oYKoord'].indexOf(this.name) > -1 && $oXKoord.val() && $oYKoord.val()) {
    // Wenn Koordinaten und beide erfasst
    window.localStorage.oXKoord = $oXKoord.val()
    window.localStorage.oYKoord = $oYKoord.val()
    // Längen- und Breitengrade berechnen
    window.localStorage.oLongitudeDecDeg = ChToWgsLng(window.localStorage.oYKoord, window.localStorage.oXKoord)
    window.localStorage.oLatitudeDecDeg = ChToWgsLat(window.localStorage.oYKoord, window.localStorage.oXKoord)
    window.localStorage.oLagegenauigkeit = null
    // und Koordinaten speichern
    window.em.speichereKoordinaten(window.localStorage.BeobId, 'Beobachtung')
  } else {
    window.em.speichereBeob(this)
  }
}

// wenn in BeobEdit.html .speichernAnhang geändert wird
// Änderungen im Formular für Anhänge speichern
window.em.handleBeobEditSpeichernAnhangChange = function () {
  'use strict'
  var _attachments = $('#_attachmentsBE').val()
  if (_attachments && _attachments.length !== 0) {
    window.em.speichereAnhänge(window.localStorage.BeobId, window.em.Beobachtung, 'BE')
  }
}

// wenn in BeobEdit.html #OeffneKarteBeobEdit geklickt wird
window.em.handleBeobEditOeffneKarteClick = function () {
  'use strict'
  window.localStorage.zurueck = 'BeobEdit'
  $.mobile.navigate('Karte.html')
}

// wenn in BeobEdit.html auf #BeobEditContent nach links gewischt wird
window.em.handleBeobEditContentSwipeleft = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsteVorigeBeob('nächste')
  }
}

// wenn in BeobEdit.html auf #BeobEditContent nach rechts gewischt wird
window.em.handleBeobEditContentSwiperight = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsteVorigeBeob('vorige')
  }
}

// wenn in BeobEdit.html .menu_arteigenschaften geklickt wird
window.em.handleBeobEditMenuArteigenschaftenClick = function () {
  'use strict'
  window.em.öffneEigenschaftenVonArt(window.localStorage.aArtId)
}

// wenn in BeobEdit.html .menu_hierarchischer_modus geklickt wird
window.em.handleBeobEditMenuHierarchischerModusClick = function () {
  'use strict'
  window.em.leereStorageBeobEdit()
  $.mobile.navigate('hProjektListe.html')
}

// wenn in BeobEdit.html .menu_felder_verwalten geklickt wird
window.em.handleBeobEditMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'BeobEdit.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in BeobEdit.html .menu_beob_exportieren geklickt wird
window.em.handleBeobEditMenuBeobExportierenClick = function () {
  'use strict'
  window.open('_list/ExportBeob/ExportBeob?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuBeobEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in BeobEdit.html .menu_einstellungen geklickt wird
window.em.handleBeobEditMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'BeobEdit.html'
  window.em.öffneMeineEinstellungen()
}

// wenn BeobListe.html erscheint
window.em.handleBeobListePageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  }
  window.em.initiiereBeobliste()
}

// Wenn BeobListe.html initiiert wird
window.em.handleBeobListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  }

  $('#BeobListePageFooter')
    .on('click', '#OeffneKarteBeobListe', function (event) {
      event.preventDefault()
      window.em.handleBeobListeOeffneKarteBeobListeClick()
    })

  $('#BeobListePageHeader')
    .on('click', '#OeffneProjektListeBeobListe', function (event) {
      event.preventDefault()
      $.mobile.navigate('hProjektListe.html')
    })

  $('#BeoblisteBL')
    .on('swipeleft click', '.beob', window.em.handleBeobListeBeobSwipeleftClick)
    .on('taphold', '.beob', window.em.handleBeobListeBeobTaphold)
    .on('swipeleft', '.erste', window.em.erstelleNeueBeob_1_Artgruppenliste)

  $('#BeobListe')
    .on('click', '.NeueBeobBeobListe', function (event) {
      event.preventDefault()
      window.em.erstelleNeueBeob_1_Artgruppenliste()
    })
    .on('swiperight', '#BeobListePageContent', window.em.handleBeobListeBeobListePageContentSwiperight)

  $('#MenuBeobListe')
    .on('click', '.menu_hierarchischer_modus', window.em.handleBeobListeMenuHierarchischerModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleBeobListeMenuFelderVerwaltenClick)
    .on('click', '.menu_beob_exportieren', window.em.handleBeobListeMenuBeobExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleBeobListeMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in BeobListe.html .beob geklickt oder nach links geswiped wird
window.em.handleBeobListeBeobSwipeleftClick = function () {
  window.localStorage.BeobId = $(this).attr('id')
  $.mobile.navigate('BeobEdit.html')
}

// wenn in BeobListe.html .beob taphold
window.em.handleBeobListeBeobTaphold = function () {
  // FUNKTIONIERT NICHT, WEIL JQUERY MOBILE NACH TAPHOLD IMMER EINEN TAP AUSFÜHRT!!!!!!!!!!!!!!!
  console.log('taphold')
}

// wenn in BeobListe.html #OeffneKarteBeobListe geklickt wird
window.em.handleBeobListeOeffneKarteBeobListeClick = function () {
  'use strict'
  window.localStorage.zurueck = 'BeobListe'
  $.mobile.navigate('Karte.html')
}

// wenn in BeobListe.html #BeobListePageContent nach rechts gewischt wird
window.em.handleBeobListeBeobListePageContentSwiperight = function () {
  'use strict'
  $.mobile.navigate('hProjektListe.html')
}

// wenn in BeobListe.html .menu_hierarchischer_modus geklickt wird
window.em.handleBeobListeMenuHierarchischerModusClick = function () {
  'use strict'
  $.mobile.navigate('hProjektListe.html')
}

// wenn in BeobListe.html .menu_felder_verwalten geklickt wird
window.em.handleBeobListeMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'BeobListe.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in BeobListe.html .menu_beob_exportieren geklickt wird
window.em.handleBeobListeMenuBeobExportierenClick = function () {
  'use strict'
  window.open('_list/ExportBeob/ExportBeob?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuBeobListe')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in BeobListe.html .menu_einstellungen geklickt wird
window.em.handleBeobListeMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'BeobListe.html'
  window.em.öffneMeineEinstellungen()
}

// wenn FeldEdit.html erscheint
// Sollte keine id vorliegen, zu FeldListe.html wechseln
// das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
// oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
window.em.handleFeldEditPageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.FeldId || window.localStorage.FeldId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    window.em.geheZurueckFE()
  }
  window.em.initiiereFeldEdit()
}

// wenn FeldEdit.html initiiert wird
// Code, der nur beim ersten Aufruf der Seite laufen soll
window.em.handleFeldEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.FeldId || window.localStorage.FeldId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('BeobListe.html')
  }

  $('#FeldEditHeader')
    .on('click', '#zurueckFeldEdit', function (event) {
      event.preventDefault()
      window.em.geheZurueckFE()
    })

  $('#UserFeldForm')
    .on('change', '.meineEinstellungen', window.em.handleFeldEditMeineEinstellungenChange)
    .on('change', '#Standardwert', window.em.handleFeldEditStandardwertChange)

  $('#FeldEditForm')
    .on('change', '.Feldeigenschaften', window.em.handleFeldEditFeldeigenschaftenChange)
    .on('change', '#FeldFolgtNach', window.em.handleFeldEditFeldFolgtNachChange)

  $('#fe_löschen_meldung')
    .on('click', '#fe_löschen_meldung_ja_loeschen', window.em.handleFeldEditFeLoeschenMeldungJaClick)

  $('#FeldEdit')
    .on('swipeleft', '#FeldEditContent', window.em.geheZumNächstenFeld)
    .on('swiperight', '#FeldEditContent', window.em.geheZumVorigenFeld)
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      window.em.geheZumVorigenFeld()
    })
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      window.em.geheZumNächstenFeld()
    })
    .on('keyup', function (event) {
      'use strict'
      // wenn in FeldEdit.htm eine Taste gedrückt wird
      // mit Pfeiltasten Datensätze wechseln
      // nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#FeldEdit').is(':visible')) {
        // Left arrow
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          window.em.geheZumVorigenFeld()
          event.preventDefault()
        }
        // Right arrow
        else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          window.em.geheZumNächstenFeld()
          event.preventDefault()
        }
      }
    })

  $('#FeldEditFooter')
    .on('click', '#NeuesFeldFeldEdit', function (event) {
      event.preventDefault()
      window.em.neuesFeld()
    })
    .on('click', '#LoescheFeldFeldEdit', function (event) {
      event.preventDefault()
      window.em.handleFeldEditLoescheFeldFeldEditClick()
    })

  $('#MenuFeldEdit')
    .on('click', '.menu_datenfelder_exportieren', window.em.handleFeldEditMenuDatenfelderExportierenClick)
}

window.em.handleFeldEditMeineEinstellungenChange = function () {
  'use strict'
  var feldname = this.name,
    feldwert = this.value
  // prüfen, ob das Feld als Objekt vorliegt
  if (window.em.Feld) {
    // bestehendes Objekt verwenden
    window.em.handleFeldEditMeineEinstellungenChange_2(feldname, feldwert)
  } else {
    // Objekt aus der DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.FeldId, {
      success: function (data) {
        window.em.Feld = data
        window.em.handleFeldEditMeineEinstellungenChange_2(feldname, feldwert)
      },
      error: function () {
        window.em.melde('Fehler: Die letzte Änderung wurde nicht gespeichert')
      }
    })
  }
}

window.em.handleFeldEditMeineEinstellungenChange_2 = function (feldname, feldwert) {
  'use strict'
  // Sichtbarkeitseinstellungen: In einem Array werden die User aufgelistet, welche das Feld sehen
  // Es muss geprüft werden, ob der aktuelle User in diesem Array enthalten ist
  if (feldwert === 'ja') {
    // User ergänzen, wenn noch nicht enthalten
    window.em.Feld[feldname] = _.union(window.em.Feld[feldname], window.localStorage.Email)
  } else if (feldwert === 'nein') {
    // User entfernen, wenn enthalten
    window.em.Feld[feldname] = _.without(window.em.Feld[feldname], window.localStorage.Email)
  }
  var $db = $.couch.db('evab')
  $db.saveDoc(window.em.Feld, {
    success: function (data) {
      window.em.Feld._rev = data.rev
    },
    error: function () {
      window.em.melde('Fehler: Die letzte Änderung wurde nicht gespeichert')
    }
  })
}

// wenn in FeldEdit.htm .Feldeigenschaften geändert wird
// jedes Feld aus Feldeigenschaften bei Änderung speichern
window.em.handleFeldEditFeldeigenschaftenChange = function () {
  'use strict'
  window.localStorage.FeldWert = this.value
  if (this.name) {
    window.localStorage.FeldName = this.name
    window.localStorage.AlterFeldWert = window.em.Feld[this.name]
  } else {
    window.localStorage.FeldName = this.id
    window.localStorage.AlterFeldWert = window.em.Feld[this.id]
  }
  // Felder der Datenzentren dürfen nicht verändert werden
  // ausser Standardwert, dessen Änderung wird aber in einer anderen Funktion verarbeitet
  // aber: Der Benutzer soll wählen können, in welchen Artgruppen er ein solches Feld anzeigt
  if (window.em.Feld.User === 'ZentrenBdKt' && window.localStorage.FeldName !== 'ArtGruppe') {
    // feldwert zurücksetzen
    if (window.localStorage.AlterFeldWert) {
      $('#' + window.localStorage.FeldName).val(window.localStorage.AlterFeldWert)
    } else {
      $('#' + window.localStorage.FeldName).val('')
    }
    delete window.localStorage.FeldName
    delete window.localStorage.FeldWert
    delete window.localStorage.AlterFeldWert
    window.em.melde('Dies ist ein geschütztes Feld eines öffentlichen Datenzentrums<br><br>Statt dieses zu ändern können Sie ein eigenes Feld erstellen')
  } else if (window.localStorage.FeldName === 'FeldName') {
    // Wenn eigener Feldname verändert wird, kontrollieren, dass er nicht schon verwendet wurde
    // ohne explizit auf undefined zu prüfen, akzeptierte die Bedingung einen alten feldwert von
    // undefined als o.k.!!!!
    if (window.localStorage.AlterFeldWert !== 'undefined' && window.localStorage.AlterFeldWert) {
      // wenn ein alter Feldname existiert,
      // zählen, in wievielen Datensätzen das Feld verwendet wird
      var $db = $.couch.db('evab')
      $db.view('evab/FeldSuche?key="' + window.localStorage.Email + '"&include_docs=true', {
        success: function (data) {
          var anzVorkommen = 0,
            Datensatz,
            feldname,
            ds
          // zählen, in wievielen Datensätzen das bisherige Feld verwendet wird
          _.each(data.rows, function (row) {
            Datensatz = row.doc
            feldname = Datensatz[window.localStorage.AlterFeldWert]
            if (feldname) {
              anzVorkommen++
            }
          })
          if (anzVorkommen === 0) {
            // alter Feldname wurde noch in keinem Datensatz verwendet
            // prüfen, ob der neue Feldname schon existiert
            // wenn ja: melden, zurückstellen
            // wenn nein: speichern
            window.em.prüfeFeldNamen()
          } else {
            // Feldname wird schon verwendet > melden, zurückstellen
            ds = 'Datensätzen'
            if (anzVorkommen === 1) {
              ds = 'Datensatz'
            }
            $('#FeldName').val(window.localStorage.AlterFeldWert)
            delete window.localStorage.FeldName
            delete window.localStorage.FeldWert
            delete window.localStorage.AlterFeldWert
            window.em.melde('Dieses Feld wird in ' + anzVorkommen + ' ' + ds + ' verwendet.<br>Es kann deshalb nicht verändert werden.<br>Bereinigen Sie zuerst die Daten.')
          }
        }
      })
    } else {
      // Vorher gab es keinen Feldnamen
      // prüfen, ob der neue Feldname schon existiert
      // wenn ja: melden, zurückstellen
      // wenn nein: speichern
      window.em.prüfeFeldNamen()
    }
  } else if (window.localStorage.FeldName === 'Hierarchiestufe' && window.localStorage.FeldWert === 'Art') {
    $('.FeldEditHeaderTitel').text(window.localStorage.FeldWert + ': ' + window.em.Feld.FeldBeschriftung)
    window.em.leereStorageFeldListe()
    window.em.speichereFeldeigenschaften()
    // Wenn die Hierarchiestufe zu Art geändert wird, muss das Feld für die Artgruppe aufgebaut werden
    window.em.ArtGruppeAufbauenFeldEdit()
    window.em.melde('Jetzt müssen Sie wählen, in welchen Artgruppen dieses Feld angezeigt werden kann')
  } else if (window.localStorage.FeldName === 'Hierarchiestufe' && window.localStorage.FeldWert !== 'Art') {
    $('.FeldEditHeaderTitel').text(window.localStorage.FeldWert + ': ' + window.em.Feld.FeldBeschriftung)
    if (window.em.Feld.Hierarchiestufe === 'Art') {
      // Wenn die Hierarchiestufe Art war und geändert wird, muss das Feld für die Artgruppe entfernt werden
      $('#Artgruppenliste_FeldEdit').empty()
      $('#SichtbarInHArtEditListeFieldContain').hide()
    }
    window.em.leereStorageFeldListe()
    window.em.speichereFeldeigenschaften()
  } else {
    if (window.localStorage.FeldName === 'FeldBeschriftung') {
      $('.FeldEditHeaderTitel').text(window.em.Feld.Hierarchiestufe + ': ' + window.localStorage.FeldWert)
    }
    window.em.speichereFeldeigenschaften()
  }
  window.em.blendeDatentypabhängigeFelder()
}

window.em.blendeDatentypabhängigeFelder = function () {
  'use strict'
  var $feldedit_inputtyp = $('#feldedit_inputtyp'),
    $feldedit_optionen = $('#feldedit_optionen'),
    $feldedit_slider = $('.feldedit_slider')
  switch (window.em.Feld.Formularelement) {
    case 'textinput':
      $feldedit_inputtyp.show()
      $feldedit_optionen.hide()
      $feldedit_slider.hide()
      break
    case 'selectmenu':
    case 'multipleselect':
    case 'radio':
    case 'checkbox':
      $feldedit_optionen.show()
      $feldedit_inputtyp.hide()
      $feldedit_slider.hide()
      break
    case 'slider':
      $feldedit_slider.show()
      $feldedit_inputtyp.hide()
      $feldedit_optionen.hide()
      break
    default:
      $feldedit_slider.hide()
      $feldedit_inputtyp.hide()
      $feldedit_optionen.hide()
      break
  }
}

// wenn in FeldEdit.htm #FeldFolgtNach geändert wird
window.em.handleFeldEditFeldFolgtNachChange = function () {
  'use strict'
  window.em.setzeReihenfolgeMitVorgänger(this.value)
  // Feldliste soll neu aufgebaut werden
  delete window.em.Feldliste
}

// wenn in FeldEdit.htm #Standardwert geändert wird
window.em.handleFeldEditStandardwertChange = function () {
  'use strict'
  var optionen = $('#Optionen').val() || [],  // undefined verhindern
    Feldwert = this.value || [],  // undefined verhindern
    LetzterFeldwert,
    StandardwertOptionen,
    $Standardwert = $('#Standardwert')
  if (optionen.length > 0) {
    // es gibt Optionen. Der Standardwert muss eine oder allenfalls mehrere Optionen sein
    LetzterFeldwert = []
    if (window.em.Feld.Standardwert) {
      if (window.em.Feld.Standardwert[window.localStorage.Email]) {
        LetzterFeldwert = window.em.Feld.Standardwert[window.localStorage.Email]
      }
    }
    // Standardwert in Array verwandeln
    StandardwertOptionen = []
    if (Feldwert.length > 0) {
      // Fehler verhindern, falls feldwert undefined ist
      StandardwertOptionen = Feldwert.split(',')
    }
    if (['multipleselect', 'checkbox'].indexOf(window.em.Feld.Formularelement) > -1) {
      // alle StandardwertOptionen müssen Optionen sein
      _.each(StandardwertOptionen, function (standardwertoption) {
        if (optionen.indexOf(standardwertoption) === -1) {
          // ein Wert ist keine Option, abbrechen
          $Standardwert.val(LetzterFeldwert)
          window.em.melde('Bitte wählen Sie eine oder mehrere der Optionen')
        // return ist hier nicht nötig
        }
      })
      // alle Werte sind Optionen
      window.em.speichereStandardwert()
    } else if (['toggleswitch', 'selectmenu', 'radio'].indexOf(window.em.Feld.Formularelement) > -1) {
      // Array darf nur ein Element enthalten
      if (StandardwertOptionen.length > 1) {
        // Array enthält mehrere Optionen, nicht zulässig
        $Standardwert.val(LetzterFeldwert)
        window.em.melde('Bitte wählen Sie nur EINE der Optionen')
      } else {
        // Array enthält eine einzige Option
        _.each(StandardwertOptionen, function (standardwertoption) {
          if (optionen.indexOf(standardwertoption) === -1) {
            // der Wert ist keine Option, abbrechen
            $Standardwert.val(LetzterFeldwert)
            window.em.melde('Bitte wählen Sie eine der Optionen')
          // return ist hier nicht nötig
          }
        })
        // alle Werte sind Optionen
        window.em.speichereStandardwert()
      // return ist hier nicht nötig
      }
    } else {
      // Optionen sind erfasst, Feld braucht aber keine. Alle Werte akzeptieren
      window.em.speichereStandardwert()
    }
  } else {
    // Es gibt keine Optionen. Alle Standardwerte akzeptieren
    window.em.speichereStandardwert()
  }
}

// wenn in FeldEdit.htm #LoescheFeldFeldEdit geklickt wird
// Beim Löschen rückfragen
window.em.handleFeldEditLoescheFeldFeldEditClick = function () {
  'use strict'
  if (window.em.Feld.User === 'ZentrenBdKt') {
    window.em.melde('Dies ist ein Feld eines nationalen Datenzentrums<br><br>Es kann nicht gelöscht werden<br><br>Sie können es ausblenden')
  } else {
    $('#fe_löschen_meldung').popup('open')
  }
}

// wenn in FeldEdit.htm #fe_löschen_meldung_ja_loeschen geklickt wird
window.em.handleFeldEditFeLoeschenMeldungJaClick = function () {
  'use strict'
  if (!window.em.Feld.FeldName) {
    // Ohne Feldname kann nicht kontrolliert werden, in wievielen Datensätzen das Feld vorkommt
    window.em.löscheFeld()
  } else {
    var $db = $.couch.db('evab')
    // zählen, in wievielen Datensätzen das Feld verwendet wird
    $db.view('evab/FeldSuche?key="' + window.localStorage.Email + '"&include_docs=true', {
      success: function (data) {
        var anzVorkommen = 0,
          Datensatz,
          feldname,
          ds
        _.each(data.rows, function (row) {
          Datensatz = row.doc
          feldname = Datensatz[window.em.Feld.FeldName]
          if (feldname) {
            anzVorkommen++
          }
        })
        if (anzVorkommen === 0) {
          window.em.löscheFeld()
        } else {
          ds = 'Datensätzen'
          if (anzVorkommen === 1) {
            ds = 'Datensatz'
          }
          window.em.melde('Löschen abgebrochen:<br>Dieses Feld wird in ' + anzVorkommen + ' ' + ds + ' verwendet<br>Bereinigen Sie zuerst die Daten')
        }
      }
    })
  }
}

// wenn in FeldEdit.htm .menu_datenfelder_exportieren geklickt wird
window.em.handleFeldEditMenuDatenfelderExportierenClick = function () {
  'use strict'
  window.open('_list/FeldExport/FeldListe?include_docs=true')
  $('#MenuFeldEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn FelderWaehlen.html erscheint
window.em.handleFelderWählenPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu BeobListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.AufrufendeSeiteFW || window.localStorage.AufrufendeSeiteFW === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('BeobListe.html')
    return
  }
  window.em.initiiereFelderWählen()
}

// wenn FelderWaehlen.html verschwindet
window.em.handleFelderWählenPagehide = function () {
  'use strict'
  // globale Variablen aufräumen
  delete window.localStorage.FeldlisteFwName
  delete window.localStorage.KriterienFürZuWählendeFelder
  // ausgeschaltet, weil es das braucht, wenn man von FelderWahlen direkt nach FeldEdit springt und dann zu FeldWaehlen zurück
  // delete window.localStorage.AufrufendeSeiteFW
  // verhindern, dass beim nächsten Mal zuerst die alten Felder angezeigt werden
  $('#FeldlisteFW').empty()
}

// wenn FelderWaehlen.html initiiert wird
window.em.handleFelderWählenPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  } else if (!window.localStorage.AufrufendeSeiteFW || window.localStorage.AufrufendeSeiteFW === 'undefined') {
    // oh, kein zurück bekannt
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('BeobListe.html')
  }

  $('#FelderWaehlenPage')
    .on('click', '#FelderWaehlenPage_back', function (event) {
      event.preventDefault()
      $.mobile.navigate(window.localStorage.AufrufendeSeiteFW + '.html')
    })

  $('#FeldlisteFW')
    .on('change', "input[name='Felder']", window.em.handleFelderWählenInputFelderChange)
    // aus unbekanntem Grund funktioniert .on nicht aber .bind schon
    .bind('taphold', "input[name='Felder']", function (event) {
      'use strict'
      event.preventDefault()
      // event.target ist immer das label
      var FeldName = $(event.target).prop('for')
      window.em.öffneFeld(FeldName)
    })
}

// wenn in FelderWaehlen.html input[name='Felder'] geändert wird
// Felder speichern (checkbox)
window.em.handleFelderWählenInputFelderChange = function () {
  'use strict'
  var FeldName = $(this).prop('id'),
    FeldId = $(this).attr('feldid'),
    Feld,
    feldrow,
    feld_mit_sichtbarkeit,
    sichtbar_für_benutzer
  feldrow = _.find(window.em[window.localStorage.FeldlisteFwName].rows, function (row) {
    return row.doc._id === FeldId
  })
  Feld = feldrow.doc
  // Bei BeobEdit.html muss SichtbarImModusEinfach gesetzt werden, sonst SichtbarImModusHierarchisch
  if (window.localStorage.AufrufendeSeiteFW === 'BeobEdit') {
    feld_mit_sichtbarkeit = 'SichtbarImModusEinfach'
  } else if (window.localStorage.AufrufendeSeiteFW === 'hArtEditListe') {
    feld_mit_sichtbarkeit = 'SichtbarInHArtEditListe'
  } else {
    // eines der hierarchischen Formulare
    feld_mit_sichtbarkeit = 'SichtbarImModusHierarchisch'
  }
  sichtbar_für_benutzer = Feld[feld_mit_sichtbarkeit] || []
  if ($('#' + FeldName).prop('checked') === true) {
    sichtbar_für_benutzer.push(window.localStorage.Email)
  } else {
    sichtbar_für_benutzer = _.without(sichtbar_für_benutzer, window.localStorage.Email)
  }
  Feld[feld_mit_sichtbarkeit] = sichtbar_für_benutzer
  // Änderung in DB speichern
  var $db = $.couch.db('evab')
  $db.saveDoc(Feld, {
    success: function (data) {
      // neue rev holen (aktualisiert auch Feldliste-Objekt)
      Feld._rev = data.rev
    },
    error: function () {
      window.em.melde('Fehler: nicht gespeichert<br>Vielleicht klicken Sie zu schnell?')
    }
  })
}

window.em.öffneFeld = function (FeldName) {
  'use strict'
  var $db = $.couch.db('evab')
  $db.view('evab/FeldListeFeldName?key="' + FeldName + '"&include_docs=true', {
    success: function (data) {
      window.localStorage.FeldId = data.rows[0].doc._id
      window.localStorage.zurueck = 'FelderWaehlen.html'
      $.mobile.navigate('FeldEdit.html')
    }
  })
}

// wenn FeldListe.html erscheint
window.em.handleFeldListePageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }
  window.em.initiiereFeldliste()
}

// wenn FeldListe.html initiiert wird
window.em.handleFeldListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }

  // sicherstellen, dass zurueck nie leer ist
  if (!window.localStorage.zurueck) {
    window.localStorage.zurueck = 'BeobListe.html'
  }

  $('#FeldListeFL')
    .on('click', '.Feld', function (event) {
      event.preventDefault()
      window.em.handleFeldListeFeldClick(this)
    })

  $('#FeldListeFooter')
    .on('click', '#NeuesFeldFeldListe', function (event) {
      event.preventDefault()
      window.em.neuesFeld()
    })

  $('#MenuFeldListe')
    .on('click', '.menu_datenfelder_exportieren', window.em.handleFeldListeMenuDatenfelderExportierenClick)

  $('#FeldListeHeader')
    .on('click', '#FeldListeBackButton', function (event) {
      event.preventDefault()
      window.em.handleFeldListeBackButtonClick()
    })
}

// wenn in FeldListe.html .Feld geklickt wird
// Feld öffnen
window.em.handleFeldListeFeldClick = function (that) {
  'use strict'
  window.localStorage.FeldId = $(that).attr('FeldId')
  $.mobile.navigate('FeldEdit.html')
}

// wenn in FeldListe.html .menu_datenfelder_exportieren geklickt wird
window.em.handleFeldListeMenuDatenfelderExportierenClick = function () {
  'use strict'
  window.open('_list/FeldExport/FeldListe?include_docs=true')
  // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
  // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
  $('#MenuFeldListe').popup().popup('close')
}

// wenn in FeldListe.html #FeldListeBackButton geklickt wird
window.em.handleFeldListeBackButtonClick = function () {
  'use strict'
  if (window.localStorage.hArtSicht === 'liste' && window.localStorage.zurueck === 'hArtEdit.html') {
    $.mobile.navigate('hArtEditListe.html')
  } else {
    $.mobile.navigate(window.localStorage.zurueck)
  }
  delete window.localStorage.zurueck
}

// wenn hArtEdit.html erscheint
window.em.handleHArtEditPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.Status && !window.localStorage.hArtId) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiierehArtEdit()
}

// wenn hArtEdit.html initiiert wird
window.em.handleHArtEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.hArtId || window.localStorage.hArtId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $('#hArtEditPageHeader')
    .on('click', "[name='OeffneArtListehArtEdit']", function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneArtListehArtEditClick()
    })
    .on('click', '.OeffneZeithArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneZeithArtEditClick()
    })
    .on('click', '.OeffneOrthArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneOrthArtEditClick()
    })
    .on('click', '.OeffneRaumhArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneRaumhArtEditClick()
    })
    .on('click', '.OeffneProjekthArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneProjekthArtEditClick()
    })

  $('#hArtEditForm')
    // Für jedes Feld bei Änderung speichern
    .on('change', '.speichern', window.em.speichereHArt)
    // Eingabe im Zahlenfeld abfangen
    .on('blur', '.speichernSlider', window.em.speichereHArt)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereHArt)
    // Ende des Schiebens abfangen
    .on('slidestop', '.speichernSlider', window.em.speichereHArt)
    // Editieren von Beobachtungen managen, ausgehend von Artgruppe
    .on('click', '.aArtGruppe', function (event) {
      event.preventDefault()
      window.em.zuArtgruppenliste()
    })
    // Editieren von Beobachtungen managen, ausgehend von ArtName
    .on('click', '.aArtName', function (event) {
      event.preventDefault()
      window.em.zuArtliste()
    })

  $('#hArtEditPageFooter')
    // Neue Beobachtung managen
    .on('click', '#NeueBeobhArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditNeueBeobhArtEditClick()
    })
    // sichtbare Felder wählen
    .on('click', '#waehleFelderhArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditWähleFelderClick()
    })
    // Code für den Art-Löschen-Dialog
    .on('click', '#LoescheBeobhArtEdit', function (event) {
      event.preventDefault()
      $('#hae_löschen_meldung').popup('open')
    })
    // Code für den Art-Löschen-Dialog
    .on('click', '#öffnehArtEditListe', function (event) {
      event.preventDefault()
      $.mobile.navigate('hArtEditListe.html')
    })

  $('#hae_löschen_meldung')
    .on('click', '#hae_löschen_meldung_ja_loeschen', window.em.löscheHArt)

  $('#hArtEdit')
    .on('swipeleft', window.em.handleHArtEditSwipeleft)
    .on('swiperight', window.em.handleHArtEditSwiperight)
    // Pagination Pfeil voriger initialisieren
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      window.em.nächsteVorigeArt('vorige')
    })
    // Pagination Pfeil nächster initialisieren
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      window.em.nächsteVorigeArt('nächste')
    })
    // Pagination Pfeiltasten initialisieren
    .on('keyup', function (event) {
      'use strict'
      // nur reagieren, wenn hArtEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#hArtEdit').is(':visible')) {
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          // Left arrow
          window.em.nächsteVorigeArt('vorige')
          event.preventDefault()
        } else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          // Right arrow
          window.em.nächsteVorigeArt('nächste')
          event.preventDefault()
        }
      }
    })

  $('#FormAnhängehAE')
    .on('click', "[name='LöscheAnhang']", function (event) {
      event.preventDefault()
      window.em.handleHArtEditLöscheAnhangClick(this)
    })
    // Änderungen im Formular für Anhänge speichern
    .on('change', '.speichernAnhang', window.em.handleHArtEditSpeichernAnhangChange)

  $('#MenuhArtEdit')
    .on('click', '.menu_arteigenschaften', window.em.handleHArtEditMenuArteigenschaftenClick)
    .on('click', '.menu_einfacher_modus', window.em.handleHArtEditMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleHArtEditMenuFelderVerwaltenClick)
    .on('click', '.menu_beob_exportieren', window.em.handleHArtEditMenuBeobExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleHArtEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn hArtEditListe.html erscheint
window.em.handleHArtEditListePageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.Status && !window.localStorage.hArtId) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiierehArtEditListe()
}

// managt den Aufbau aller Daten und Felder für hArtEditListe.html
// Artliste und hArt holen
window.em.initiierehArtEditListe = function () {
  'use strict'
  // markieren, dass die Listensicht aktiv ist
  window.localStorage.hArtSicht = 'liste'
  // hat hArtEdit.html eine hArtListe übergeben?
  /*if (window.em.hArtListe) {
    // Beobliste aus globaler Variable holen - muss nicht geparst werden
    window.em.initiierehArtEditListe_2()
  } else {*/
  // Beobliste aus DB holen
  // Problem: Wenn in hArtEdit ein Wert geändert wurde, ist er sonst nicht aktuell
  // Alternative: Beim Speichern window.em.hArtListe nachführen
  var $db = $.couch.db('evab')
  $db.view('evab/hArtListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.ZeitId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.ZeitId + '" ,{}]&include_docs=true', {
    success: function (data) {
      var hart_row
      // Liste bereitstellen, um Datenbankzugriffe zu reduzieren
      window.em.hArtListe = data
      // window.em.hArt herstellen, falls nicht vorhanden
      if (!window.em.hArt && window.localStorage.hArtId) {
        hart_row = _.find(window.em.hArtListe.rows, function (row) {
          return row.doc._id === window.localStorage.hArtId
        })
        window.em.hArt = hart_row.doc
        window.localStorage.aArtId = window.em.hArt.aArtId
        window.localStorage.aArtName = window.em.hArt.aArtName
        window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
      }
      window.em.initiierehArtEditListe_2()
    }
  })
// }
}

// Artgruppe ermitteln
window.em.initiierehArtEditListe_2 = function () {
  'use strict'
  var anzArt = window.em.hArtListe.rows.length,
    Titel2,
    artgruppen = [],
    artgruppe

  // Im Titel der Seite die Anzahl Arten anzeigen
  Titel2 = ' Arten'
  if (anzArt === 1) {
    Titel2 = ' Art'
  }
  $('#hArtEditListePageHeader')
    .find('.hArtEditListePageTitel')
    .text(anzArt + Titel2)

  if (anzArt === 0) {
    // Sollte nicht vorkommen, weil man nur aus einer existierenden Beobachtung in die Liste wechseln kann
  } else {
    // Felder bestimmen, die in der Tabelle angezeigt werden können
    // Es sind alle EINER ARTENGRUPPE
    // wenn also die Liste mehr als eine Artengruppe enthält, muss der Benutzer eine davon wählen
    // also zuerst eine Liste der Artengruppen erstellen
    _.each(window.em.hArtListe.rows, function (row) {
      if (row.doc.aArtGruppe) {
        artgruppen.push(row.doc.aArtGruppe)
      }
    })
    // artgruppen-array reduzieren, damit jede Artgruppe nur ein mal vorkommt
    artgruppen = _.uniq(artgruppen)
    if ((!window.em.hArt || !window.em.hArt.aArtGruppe) && artgruppen.length > 1) {
      // Benutzer muss eine Artgruppe wählen
      $('#hael_artgruppen_popup_fieldcontain').html(window.em.erstelleHtmlFürHaelArtgruppenPopupRadiogroup(artgruppen)).trigger('create')
      $('#hael_artgruppen_popup').popup().popup('open')
    } else {
      // die Artgruppen der zuletzt gewählten Art nehmen
      artgruppe = window.em.hArt.aArtGruppe
      window.em.initiierehArtEditListe_3(artgruppe)
    }
  }

}

// Feldliste holen
window.em.initiierehArtEditListe_3 = function (artgruppe) {
  'use strict'
  // prüfen, ob die Feldliste schon geholt wurde
  // wenn ja: deren globale Variable verwenden
  // immer neu holen, sonst hat man veraltete Daten, wenn zuvor in hArtEdit Felder geändert wurden
  /*if (window.em.FeldlistehArtEditListe) {
    window.em.initiierehArtEditListe_4(artgruppe)
  } else {*/
  // Feldliste aus der DB holen
  var $db = $.couch.db('evab')
  $db.view('evab/FeldListeArt?include_docs=true', {
    success: function (data) {
      window.em.FeldlistehArtEditListe = data
      window.em.initiierehArtEditListe_4(artgruppe)
    }
  })
  // }

}

// baut das HTML für die hArtEditListeForm auf
window.em.initiierehArtEditListe_4 = function (artgruppe) {
  'use strict'
  var htmlContainer = '<table id="hArtEditListeTable" data-role="table" class="ui-body-d ui-responsive felder_tabelle" data-mode="reflow">',
    htmlContainerHead,
    htmlContainerBody,
    feldliste = [],
    beob_der_gewählten_artgruppe_rows

  // zuerst mal ermitteln, welche Felder für diese Artgruppe und diesen User im Formular eingeblendet werden sollen
  _.each(window.em.FeldlistehArtEditListe.rows, function (row) {
    var Feld = row.doc,
      FeldName = Feld.FeldName
    if (Feld.Hierarchiestufe === 'Art' && (Feld.User === window.localStorage.Email || Feld.User === 'ZentrenBdKt') && Feld.SichtbarInHArtEditListe && Feld.SichtbarInHArtEditListe.indexOf(window.localStorage.Email) !== -1 && (typeof Feld.ArtGruppe !== 'undefined' && (Feld.ArtGruppe.indexOf(artgruppe) >= 0 || Feld.ArtGruppe[0] === 'alle')) && (FeldName !== 'aArtId') && (FeldName !== 'aArtGruppe') && (FeldName !== 'aArtName')) {
      feldliste.push(Feld)
    }
  })

  // mit diesen Feldern den Head aufbauen
  // dazu wird der Feldname gebraucht
  // Die Art wird immer angezeigt
  htmlContainerHead = '<thead><tr class="ui-bar-d"><th data-priority="1">Art</th>'
  _.each(feldliste, function (feld) {
    htmlContainerHead += '<th>'
    htmlContainerHead += feld.FeldBeschriftung
    htmlContainerHead += '</th>'
  })
  htmlContainerHead += '</tr></thead>'

  // Den Body aufbauen
  htmlContainerBody = '<tbody>'
  // Beobachtungen der gewählten Artgruppe wählen
  beob_der_gewählten_artgruppe_rows = _.filter(window.em.hArtListe.rows, function (row) {
    return row.doc.aArtGruppe === artgruppe
  })
  // pro hArt das html erzeugen
  _.each(beob_der_gewählten_artgruppe_rows, function (row) {
    var hart = row.doc,
      optionen = [],
      artname = hart.aArtName
    optionen.push(hart.aArtName)
    htmlContainerBody += '<tr class="hart" hartid="'
    htmlContainerBody += hart._id
    htmlContainerBody += '">'
    // Artname ergänzen
    htmlContainerBody += '<td>'
    htmlContainerBody += window.em.generiereHtmlFürSelectmenu('aArtName_hael', '', artname, optionen, 'SingleSelect', true, 'arrow-r')
    htmlContainerBody += '</td>'
    // dynamische Felder setzen
    _.each(feldliste, function (feld) {
      var FeldName = feld.FeldName,
        FeldWert
      // feldwert setzen
      if (window.em.hArt[FeldName] && window.localStorage.Status === 'neu' && feld.Standardwert && feld.Standardwert[window.em.hArt.User]) {
        FeldWert = feld.Standardwert[window.em.hArt.User]
        // Objekt window.em.hArt um den Standardwert ergänzen, um später zu speichern
        window.em.hArt[FeldName] = FeldWert
      } else {
        // "" verhindert, dass im Feld undefined erscheint
        FeldWert = hart[FeldName] || ''
      }
      // html generieren
      htmlContainerBody += '<td>'
      htmlContainerBody += window.em.generiereHtmlFürFormularelement(feld, FeldWert, true)
      htmlContainerBody += '</td>'
    })
    // Tabellenzeile abschliessen
    htmlContainerBody += '</tr>'
  })

  htmlContainerBody += '</tbody>'

  // head und body zusammensetzen
  htmlContainer += htmlContainerHead
  htmlContainer += htmlContainerBody
  // Tabelle abschliessen
  htmlContainer += '</table>'

  // htmlContainer in Formular setzen
  $('#hArtEditListeForm').html(htmlContainer).trigger('create').trigger('refresh')
  $('#hArtEditListeTable').table().table('refresh')
  // jetzt alle Flipswitsches, die "nein" sind, aktiv setzen
  _.each(beob_der_gewählten_artgruppe_rows, function (row) {
    window.em.aktiviereFlipswitches("[hartid='" + row.id + "']", row.doc)
  })
  // Menus blenden und letzte url speichern
  window.em.blendeMenus()
  window.em.speichereLetzteUrl()
}

window.em.erstelleHtmlFürHaelArtgruppenPopupRadiogroup = function (artgruppen) {
  'use strict'
  var html = '<fieldset id="hael_artgruppen_popup_fieldset" data-role="controlgroup">'
  _.each(artgruppen, function (artgruppe) {
    html += '<input type="radio" name="hael_artgruppen_popup_input" id="hael_'
    html += artgruppe
    html += '" value="'
    html += artgruppe
    html += '" class="hael_artgruppen_popup_input">'
    html += '<label for="hael_'
    html += artgruppe
    html += '" class="hael_artgruppen_popup_input_label" artgruppe="'
    html += artgruppe
    html += '">'
    html += artgruppe
    html += '</label>'
  })
  html += '</fieldset>'
  return html
}

// managt das Initialisieren einer Art in hArtEditListe.html
// erwartet die hArtId
// wird aufgerufen von hArtEditListe.html, wenn der Fokus in einen Datensatz kommt
window.em.initiierehArtEditListeArt = function (hartid) {
  'use strict'
  // Infos zur Art holen
  // achtung: wenn soeben die Art geändert wurde, müssen ArtId und ArtName neu geholt werden
  if (window.em.hArt && window.em.hArt._id === hartid && (!window.localStorage.Von || window.localStorage.Von !== 'hArtEdit')) {
    window.em.initiierehArtEditListeArt_2(window.em.hArt)
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(hartid, {
      success: function (data) {
        window.em.hArt = data
        window.em.initiierehArtEditListeArt_2(data)
        window.localStorage.aArtId = window.em.hArt.aArtId
        window.localStorage.aArtName = window.em.hArt.aArtName
        window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
      }
    })
  }
}

window.em.initiierehArtEditListeArt_2 = function (hart) {
  'use strict'
  // bei neuen hArt hat das Objekt noch keine ID
  if (hart._id) {
    window.localStorage.hArtId = hart._id
  } else {
    window.localStorage.hArtId = 'neu'
  }
  window.localStorage.aArtGruppe = hart.aArtGruppe
  window.localStorage.aArtName = hart.aArtName
  window.localStorage.aArtId = hart.aArtId
}

// generiert dynamisch die Artgruppen-abhängigen Felder
// Mitgeben: Feldliste, Beobachtung
window.em.erstelleDynamischeFelderhArtEditListe = function () {
  'use strict'
  var htmlContainer = window.em.generiereHtmlFürhArtEditListeForm()
  // Linie nur anfügen, wenn Felder erstellt wurden
  if (htmlContainer) {
    htmlContainer = '<hr />' + htmlContainer
  }
  $('#hArtEditListeFormHtml').html(htmlContainer).trigger('create').trigger('refresh')
  window.em.blendeMenus()
  // letzte url speichern - hier und nicht im pageshow, damit es bei jedem Datensatzwechsel passiert
  window.em.speichereLetzteUrl()
}

// generiert das Html für Formular in hArtEdit.html
// erwartet ArtGruppe; Feldliste als Objekt; Beobachtung als Objekt
// der htmlContainer wird zurück gegeben
window.em.generiereHtmlFürhArtEditListeForm = function () {
  'use strict'
  var Feld = {},
    FeldName,
    FeldWert,
    htmlContainer = '',
    ArtGruppe = window.em.hArt.aArtGruppe
  _.each(window.em.FeldlistehArtEditListe.rows, function (row) {
    Feld = row.doc
    FeldName = Feld.FeldName
    // nur sichtbare eigene Felder. Bereits im Formular integrierte Felder nicht anzeigen
    // Vorsicht: Erfasst jemand ein Feld der Hierarchiestufe Art ohne Artgruppe, sollte das keinen Fehler auslösen
    if ((Feld.User === window.em.hArt.User || Feld.User === 'ZentrenBdKt') && Feld.SichtbarInHArtEditListe.indexOf(window.em.hArt.User) !== -1 && (typeof Feld.ArtGruppe !== 'undefined' && (Feld.ArtGruppe.indexOf(ArtGruppe) >= 0 || Feld.ArtGruppe[0] === 'alle')) && (FeldName !== 'aArtId') && (FeldName !== 'aArtGruppe') && (FeldName !== 'aArtName')) {
      if (window.em.hArt[FeldName] && window.localStorage.Status === 'neu' && Feld.Standardwert && Feld.Standardwert[window.em.hArt.User]) {
        FeldWert = Feld.Standardwert[window.em.hArt.User]
        // Objekt window.em.hArt um den Standardwert ergänzen, um später zu speichern
        window.em.hArt[FeldName] = FeldWert
      } else {
        // "" verhindert, dass im Feld undefined erscheint
        FeldWert = window.em.hArt[FeldName] || ''
      }
      htmlContainer += window.em.generiereHtmlFürFormularelement(Feld, FeldWert)
    }
  })
  if (window.localStorage.Status === 'neu') {
    // in neuen Datensätzen dynamisch erstellte Standardwerte speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hArt, {
      success: function (data) {
        window.em.hArt._id = data.id
        window.em.hArt._rev = data.rev
        window.localStorage.hArtId = data.id
      }
    })
    delete window.localStorage.Status
  } else {
    // Neue Datensätze haben keine Anhänge
    window.em.zeigeAttachments(window.em.hArt, 'hAE')
  }
  return htmlContainer
}

// wenn hArtEditListe.html initiiert wird
window.em.handleHArtEditListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.hArtId || window.localStorage.hArtId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $('#hArtEditListePageHeader')
    .on('click', "[name='OeffneArtListehArtEdit']", function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneArtListehArtEditClick()
    })
    .on('click', '.OeffneZeithArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneZeithArtEditClick()
    })
    .on('click', '.OeffneOrthArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneOrthArtEditClick()
    })
    .on('click', '.OeffneRaumhArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneRaumhArtEditClick()
    })
    .on('click', '.OeffneProjekthArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditÖffneProjekthArtEditClick()
    })

  $('#hArtEditListeForm')
    // Für jedes Feld bei Änderung speichern
    .on('change', '.speichern', window.em.speichereHArt)
    // Eingabe im Zahlenfeld abfangen
    .on('blur', '.speichernSlider', window.em.speichereHArt)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereHArt)
    // Ende des Schiebens abfangen
    .on('slidestop', '.speichernSlider', window.em.speichereHArt)
    // Sobald auf einen Datensatz geklickt wird, ihn initiieren - falls noch nicht geschehen
    .on('click', '.hart', function () {
      'use strict'
      var hartid = $(this).attr('hartid')
      if (!window.localStorage.hArtId || window.localStorage.hArtId !== hartid) {
        // die Art muss initiiert werden
        window.localStorage.hArtId = hartid
        window.em.initiierehArtEditListeArt(hartid)
      }
    })

  $('#hArtEditListePageFooter')
    // Neue Beobachtung managen
    .on('click', '#NeueBeobhArtEdit', function (event) {
      event.preventDefault()
      window.em.handleHArtEditNeueBeobhArtEditClick()
    })
    // sichtbare Felder wählen
    .on('click', '#waehleFelderhArtEditListe', function (event) {
      event.preventDefault()
      window.em.handleHArtEditListeWähleFelderClick()
    })
    // In Einzelansicht wechseln
    .on('click', '#hArtEditListeEinzelsicht', function (event) {
      event.preventDefault()
      $.mobile.navigate('hArtEdit.html')
    })

  $('#hArtEditListe')
    // Editieren von Beobachtungen managen, ausgehend von ArtName
    // irgendwie funktioniert das hier nicht. Keine Ahnung wieso
    .on('click', "[name='aArtName_hael']", function (event) {
      event.preventDefault()
      window.em.zuArtliste()
    })
    // darum so gegriffen:
    .on('click', ".hart [role='button']", function (event) {
      if ($(this).next('select').attr('name') === 'aArtName_hael') {
        // ja, das ist die Art
        event.preventDefault()
        window.em.zuArtliste()
      }
    })
    .on('click', '.hael_artgruppen_popup_input_label', function () {
      window.em.initiierehArtEditListe_3($(this).attr('artgruppe'))
      $('#hael_artgruppen_popup').popup('close')
    })

  $('#MenuhArtEditListe')
    .on('click', '.menu_einfacher_modus', window.em.handleHArtEditMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleHArtEditMenuFelderVerwaltenClick)
    .on('click', '.menu_beob_exportieren', window.em.handleHArtEditMenuBeobExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleHArtEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in hArtEditListe.html #waehleFelderhArtEditListe geklickt wird
window.em.handleHArtEditListeWähleFelderClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'hArtEditListe'
  $.mobile.navigate('FelderWaehlen.html')
}

// wenn hArtListe.html erscheint
window.em.handleHArtListePageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.ZeitId || window.localStorage.ZeitId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiierehArtListe()
}

// wenn hArtListe.html initiiert wird
window.em.handleHArtListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.ZeitId || window.localStorage.ZeitId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $('#hArtListePageHeader')
    // Link zu Raum in Navbar und Titelleiste
    .on('click', "[name='OeffneZeithArtListe']", function (event) {
      event.preventDefault()
      window.em.handleHArtListeOeffneZeitClick()
    })
    .on('click', '#OeffneOrthArtListe', function (event) {
      event.preventDefault()
      window.em.handleHArtListeÖffneOrtClick()
    })
    .on('click', '#OeffneRaumhArtListe', function (event) {
      event.preventDefault()
      window.em.handleHArtListeÖffneRaumClick()
    })
    .on('click', '#OeffneProjekthArtListe', function (event) {
      event.preventDefault()
      window.em.handleHArtListeÖffneProjektClick()
    })

  $('#hArtListe')
    // Neue Beobachtung managen
    .on('click', '.NeueBeobhArtListe', function (event) {
      event.preventDefault()
      window.em.öffneArtgruppenliste_hal()
    })
    .on('swiperight', window.em.handleHArtListeSwiperight)

  $('#ArtlistehAL')
    .on('swipeleft', '.erste', window.em.öffneArtgruppenliste_hal)
    .on('swipeleft click', '.beob', window.em.handleHArtListeBeobClick)

  $('#MenuhArtListe')
    .on('click', '.menu_einfacher_modus', window.em.handleHArtListeMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleHArtListeMenuFelderVerwaltenClick)
    .on('click', '.menu_beob_exportieren', window.em.handleHArtListeMenuFelderVerwaltenClick)
    .on('click', '.menu_einstellungen', window.em.handleHArtListeMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in hArtListe.html [name='OeffneZeithArtListe'] geklickt wird
window.em.handleHArtListeOeffneZeitClick = function () {
  'use strict'
  window.em.leereStoragehArtListe()
  $.mobile.navigate('hZeitEdit.html')
}

// wenn in hArtListe.html #OeffneOrthArtListe geklickt wird
window.em.handleHArtListeÖffneOrtClick = function () {
  'use strict'
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  $.mobile.navigate('hOrtEdit.html')
}

// wenn in hArtListe.html #OeffneRaumhArtListe geklickt wird
window.em.handleHArtListeÖffneRaumClick = function () {
  'use strict'
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  $.mobile.navigate('hRaumEdit.html')
}

// wenn in hArtListe.html #OeffneProjekthArtListe geklickt wird
window.em.handleHArtListeÖffneProjektClick = function () {
  'use strict'
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

// wenn in hArtListe.html .beob geklickt wird
window.em.handleHArtListeBeobClick = function () {
  'use strict'
  window.localStorage.hArtId = $(this).attr('hArtId')
  if (window.localStorage.hArtSicht === 'liste') {
    $.mobile.navigate('hArtEditListe.html')
  } else {
    $.mobile.navigate('hArtEdit.html')
  }
}

// wenn in hArtListe.html nach rechts gewischt wird
window.em.handleHArtListeSwiperight = function () {
  'use strict'
  $.mobile.navigate('hZeitListe.html')
}

// wenn in hArtListe.html .menu_einfacher_modus geklickt wird
window.em.handleHArtListeMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

// wenn in hArtListe.html .menu_felder_verwalten geklickt wird
window.em.handleHArtListeMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hArtListe.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in hArtListe.html .menu_beob_exportieren geklickt wird
window.em.handleHArtListeMenuBeobExportierenClick = function () {
  'use strict'
  window.open('_list/ExportBeob/ExportBeob?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuhArtListe')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in hArtListe.html .menu_einstellungen geklickt wird
window.em.handleHArtListeMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hArtListe.html'
  window.em.öffneMeineEinstellungen()
}

// wenn hOrtEdit.html erscheint
window.em.handleHOrtEditPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.OrtId || window.localStorage.OrtId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiiereOrtEdit()
}

// wenn hOrtEdit.html verschwindet
window.em.handleHOrtEditPagehide = function () {
  'use strict'
  if (typeof window.em.watchID !== 'undefined') {
    window.em.stopGeolocation()
  }
}

// wenn hOrtEdit.html initiiert wird
window.em.handleHOrtEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.OrtId || window.localStorage.OrtId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  // inaktive tabs inaktivieren
  $(document)
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#OrtEditHeader')
    .on('click', "[name='OeffneOrtListeOrtEdit']", function (event) {
      event.preventDefault()
      window.em.handleHOrtEditÖffneOrtListeClick()
    })
    .on('click', '#OeffneRaumOrtEdit', function (event) {
      event.preventDefault()
      window.em.handleHOrtEditÖffneRaumClick()
    })
    .on('click', '#OeffneZeitListeOrtEdit', function (event) {
      event.preventDefault()
      $.mobile.navigate('hZeitListe.html')
    })
    .on('click', '#OeffneProjektOrtEdit', function (event) {
      event.preventDefault()
      window.em.handleHOrtEditÖffneProjektClick()
    })

  $('#hOrtEditForm')
    // Für jedes Feld bei Änderung speichern
    .on('change', '.speichern', window.em.handleHOrtEditSpeichernChange)
    // Eingabe im Zahlenfeld abfangen
    .on('blur', '.speichernSlider', window.em.speichereHOrtEdit)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereHOrtEdit)
    // Ende des Schiebens abfangen
    .on('slidestop', '.speichernSlider', window.em.speichereHOrtEdit)

  $('#FormAnhängehOE')
    // Änderungen im Formular für Anhänge speichern
    .on('change', '.speichernAnhang', window.em.handleHOrtEditSpeichernAnhangChange)
    .on('click', "[name='LöscheAnhang']", function (event) {
      event.preventDefault()
      window.em.löscheAnhang(this, window.em.hOrt, window.localStorage.OrtId)
    })

  $('#hOrtEdit')
    .on('swipeleft', '#OrtEditContent', window.em.handleHOrtEditContentSwipeleft)
    .on('swiperight', '#OrtEditContent', window.em.handleHOrtEditContentSwiperight)
    // Pagination Pfeil voriger initialisieren
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      window.em.nächsterVorigerOrt('voriger')
    })
    // Pagination Pfeil nächster initialisieren
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      window.em.nächsterVorigerOrt('nächster')
    })
    // Pagination Pfeiltasten initialisieren
    .on('keyup', function (event) {
      'use strict'
      // nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#hOrtEdit').is(':visible')) {
        // Left arrow
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          window.em.nächsterVorigerOrt('voriger')
          event.preventDefault()
        }
        // Right arrow
        else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          window.em.nächsterVorigerOrt('nächster')
          event.preventDefault()
        }
      }
    })

  $('#OrtEditFooter')
    // neuen Ort erstellen
    .on('click', '#NeuerOrtOrtEdit', function (event) {
      event.preventDefault()
      window.em.erstelleNeuenOrt()
    })
    // sichtbare Felder wählen
    .on('click', '#waehleFelderOrtEdit', function (event) {
      event.preventDefault()
      window.em.handleHOrtEditWähleFelderClick()
    })
    // Code für den Ort-Löschen-Dialog
    .on('click', '#LoescheOrtOrtEdit', function (event) {
      event.preventDefault()
      window.em.handleHOrtEditLöscheOrtClick(this)
    })
    // Karte managen
    .on('click', '#KarteOeffnenOrtEdit', function (event) {
      event.preventDefault()
      window.em.handleHOrtEditKarteÖffnenClick()
    })
    .on('click', '#VerortungOrtEdit', function (event) {
      event.preventDefault()
      window.em.GetGeolocation(window.localStorage.OrtId, 'Ort')
    })

  $('#hoe_löschen_meldung')
    .on('click', '#hoe_löschen_meldung_ja_loeschen', window.em.handleHOrtEditLöschenMeldungJaClick)

  $('#MenuOrtEdit')
    .on('click', '.menu_einfacher_modus', window.em.handleHOrtEditMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleHOrtEditMenuFelderVerwaltenClick)
    .on('click', '.menu_orte_exportieren', window.em.handleHOrtEditMenuOrteExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleHOrtEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in hOrtEdit.html [name='OeffneOrtListeOrtEdit'] geklickt wird
window.em.handleHOrtEditÖffneOrtListeClick = function () {
  'use strict'
  window.em.leereStorageOrtEdit()
  $.mobile.navigate('hOrtListe.html')
}

// wenn in hOrtEdit.html #OeffneRaumOrtEdit geklickt wurde
window.em.handleHOrtEditÖffneRaumClick = function () {
  'use strict'
  // sonst wird bei Rückkehr die alte Liste angezeigt, egal von welchem Raum man kommt!
  window.em.leereStorageOrtListe()
  $.mobile.navigate('hRaumEdit.html')
}

// wenn in hOrtEdit.html #OeffneProjektOrtEdit geklickt wird
window.em.handleHOrtEditÖffneProjektClick = function () {
  'use strict'
  // sonst wird bei Rückkehr die alte Liste angezeigt, egal von welchem Raum man kommt!
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

// wenn in hOrtEdit.html .speichern geändert wird
window.em.handleHOrtEditSpeichernChange = function () {
  'use strict'
  var Feldname = this.name,
    $oXKoord = $("[name='oXKoord']"),
    $oYKoord = $("[name='oYKoord']"),
    ChToWgsLng = require('./util/chToWgsLng'),
    ChToWgsLat = require('./util/chToWgsLat')
  if (['oXKoord', 'oYKoord'].indexOf(Feldname) > -1 && $oXKoord.val() && $oYKoord.val()) {
    // Wenn Koordinaten und beide erfasst
    window.localStorage.oXKoord = $oXKoord.val()
    window.localStorage.oYKoord = $oYKoord.val()
    // Längen- und Breitengrade berechnen
    window.localStorage.oLongitudeDecDeg = ChToWgsLng(window.localStorage.oYKoord, window.localStorage.oXKoord)
    window.localStorage.oLatitudeDecDeg = ChToWgsLat(window.localStorage.oYKoord, window.localStorage.oXKoord)
    window.localStorage.oLagegenauigkeit = null
    // und Koordinaten speichern
    window.em.speichereKoordinaten(window.localStorage.OrtId, 'hOrt')
  } else {
    window.em.speichereHOrtEdit(this)
  }
}

// wenn in hOrtEdit.html .speichernAnhang ändert
window.em.handleHOrtEditSpeichernAnhangChange = function () {
  'use strict'
  var _attachments = $('#_attachmentshOE').val()
  if (_attachments && _attachments.length !== 0) {
    window.em.speichereAnhänge(window.localStorage.OrtId, window.em.hOrt, 'hOE')
  }
}

// wenn in hOrtEdit.html #waehleFelderOrtEdit geklickt wird
window.em.handleHOrtEditWähleFelderClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'hOrtEdit'
  $.mobile.navigate('FelderWaehlen.html')
}

// wenn in hOrtEdit.html #LoescheOrtOrtEdit geklickt wird
window.em.handleHOrtEditLöscheOrtClick = function () {
  'use strict'
  // Anzahl Zeiten von Ort zählen
  var $db = $.couch.db('evab')
  $db.view('evab/hZeitIdVonOrt?startkey=["' + window.localStorage.OrtId + '"]&endkey=["' + window.localStorage.OrtId + '",{},{}]', {
    success: function (Zeiten) {
      var anzZeiten = Zeiten.rows.length
      $db.view('evab/hArtIdVonOrt?startkey=["' + window.localStorage.OrtId + '"]&endkey=["' + window.localStorage.OrtId + '",{},{}]', {
        success: function (Arten) {
          var anzArten = Arten.rows.length,
            $hoe_löschen_meldung = $('#hoe_löschen_meldung'),
            zeiten_text = (anzZeiten === 1 ? ' Zeit und ' : ' Zeiten und '),
            arten_text = (anzArten === 1 ? ' Art' : ' Arten'),
            meldung = 'Ort inklusive ' + anzZeiten + zeiten_text + anzArten + arten_text + ' löschen?'
          $('#hoe_löschen_meldung_meldung').html(meldung)
          // Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
          $hoe_löschen_meldung.data('Arten', Arten)
          $hoe_löschen_meldung.data('Zeiten', Zeiten)
          // popup öffnen
          $hoe_löschen_meldung.popup('open')
        }
      })
    }
  })
}

// wenn in hOrtEdit.html #hoe_löschen_meldung_ja_loeschen geklickt wird
window.em.handleHOrtEditLöschenMeldungJaClick = function () {
  'use strict'
  var $hoe_löschen_meldung = $('#hoe_löschen_meldung')[0]
  window.em.löscheOrt($.data($hoe_löschen_meldung, 'Arten'), $.data($hoe_löschen_meldung, 'Zeiten'))
}

// wenn in hOrtEdit.html #KarteOeffnenOrtEdit geklickt wird
window.em.handleHOrtEditKarteÖffnenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hOrtEdit'
  $.mobile.navigate('Karte.html')
}

// wenn in hOrtEdit.html #OrtEditContent nach links gewischt wird
window.em.handleHOrtEditContentSwipeleft = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsterVorigerOrt('nächster')
  }
}

// wenn in hOrtEdit.html #OrtEditContent nach rechts gewischt wird
window.em.handleHOrtEditContentSwiperight = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsterVorigerOrt('voriger')
  }
}

// wenn in hOrtEdit.html .menu_einfacher_modus geklickt wird
window.em.handleHOrtEditMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

// wenn in hOrtEdit.html .menu_felder_verwalten geklickt wird
window.em.handleHOrtEditMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hOrtEdit.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in hOrtEdit.html .menu_orte_exportieren geklickt wird
window.em.handleHOrtEditMenuOrteExportierenClick = function () {
  'use strict'
  window.open('_list/ExportOrt/ExportOrt?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuOrtEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in hOrtEdit.html .menu_einstellungen geklickt wird
window.em.handleHOrtEditMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hOrtEdit.html'
  window.em.öffneMeineEinstellungen()
}

// wenn hOrtListe.html erscheint
window.em.handleHOrtListePageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.RaumId || window.localStorage.RaumId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiiereOrtListe()
}

// wenn hOrtListe.html initiiert wird
window.em.handleHOrtListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.RaumId || window.localStorage.RaumId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  // inaktive tabs inaktivieren
  $(document)
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#hOrtListePageHeader')
    // Link zu Raum in Navbar und Titelleiste
    .on('click', "[name='OeffneRaumOrtListe']", function (event) {
      event.preventDefault()
      window.em.handleHOrtListeÖffneRaumClick()
    })
    .on('click', '#OeffneProjektOrtListe', function (event) {
      event.preventDefault()
      window.em.handleHOrtListeÖffneProjektClick()
    })

  $('#hOrtListe')
    // neuen Ort erstellen
    .on('click', '.NeuerOrtOrtListe', function (event) {
      event.preventDefault()
      window.em.erstelleNeuenOrt()
    })
    .on('swiperight', '#hOrtListePageContent', window.em.handleHOrtListePageContentSwiperight)

  $('#OrtlistehOL')
    .on('swipeleft', '.Ort', window.em.handleHOrtListeSwipeleft)
    .on('click', '.Ort', function (event) {
      event.preventDefault()
      window.em.handleHOrtListeOrtClick(this)
    })
    .on('swipeleft', '.erste', window.em.erstelleNeuenOrt)

  $('#hOrtListePageFooter')
    .on('click', '#OeffneKarteOrtListe', function (event) {
      event.preventDefault()
      window.em.handleHOrtListeÖffneKarteClick()
    })

  $('#MenuOrtListe')
    .on('click', '.menu_einfacher_modus', window.em.handleHOrtListeMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleHOrtListeMenuFelderVerwaltenClick)
    .on('click', '.menu_orte_exportieren', window.em.handleHOrtListeMenuOrteExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleHOrtListeMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in hOrtListe.html [name='OeffneRaumOrtListe'] geklickt wird
window.em.handleHOrtListeÖffneRaumClick = function () {
  'use strict'
  window.em.leereStorageOrtListe()
  $.mobile.navigate('hRaumEdit.html')
}

// wenn in hOrtListe.html #OeffneProjektOrtListe geklickt wird
window.em.handleHOrtListeÖffneProjektClick = function () {
  'use strict'
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

// wenn in hOrtListe.html nach links gewischt wird
window.em.handleHOrtListeSwipeleft = function () {
  'use strict'
  window.localStorage.OrtId = $(this).attr('OrtId')
  $.mobile.navigate('hZeitListe.html')
}

// wenn in hOrtListe.html .Ort geklickt wird
window.em.handleHOrtListeOrtClick = function (that) {
  'use strict'
  window.localStorage.OrtId = $(that).attr('OrtId')
  $.mobile.navigate('hOrtEdit.html')
}

// wenn in hOrtListe.html #hOrtListePageContent nach rechts gewischt wird
window.em.handleHOrtListePageContentSwiperight = function () {
  'use strict'
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  $.mobile.navigate('hRaumListe.html')
}

// wenn in hOrtListe.html #OeffneKarteOrtListe geklickt wird
window.em.handleHOrtListeÖffneKarteClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hOrtListe'
  $.mobile.navigate('Karte.html')
}

// wenn in hOrtListe.html .menu_einfacher_modus geklickt wird
window.em.handleHOrtListeMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

// wenn in hOrtListe.html .menu_felder_verwalten geklickt wird
window.em.handleHOrtListeMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hOrtListe.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in hOrtListe.html .menu_orte_exportieren geklickt wird
window.em.handleHOrtListeMenuOrteExportierenClick = function () {
  'use strict'
  window.open('_list/ExportOrt/ExportOrt?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuOrtListe')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in hOrtListe.html .menu_einstellungen geklickt wird
window.em.handleHOrtListeMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hOrtListe.html'
  window.em.öffneMeineEinstellungen()
}

// wenn hProjektEdit.html angezeigt wird
window.em.handleHProjektEditPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.ProjektId || window.localStorage.ProjektId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiiereProjektEdit()
}

// wenn hProjektEdit.html initiiert wird
window.em.handleHProjektEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.ProjektId || window.localStorage.ProjektId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $(document)
    // inaktive tabs inaktivieren
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#hProjektEditHeader')
    .on('click', "[name='OeffneProjektListeProjektEdit']", function (event) {
      event.preventDefault()
      window.em.handleHProjektEditÖffneProjektListeClick()
    })
    .on('click', '#OeffneRaumListeProjektEdit', function (event) {
      event.preventDefault()
      $.mobile.navigate('hRaumListe.html')
    })

  $('#hProjektEditForm')
    // Für jedes Feld bei Änderung speichern
    .on('change', '.speichern', window.em.speichereHProjektEdit)
    // Eingabe im Zahlenfeld abfangen
    // Ende des Schiebens abfangen
    .on('blur slidestop', '.speichernSlider', window.em.speichereHProjektEdit)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereHProjektEdit)

  $('#FormAnhängehPE')
    // Änderungen im Formular für Anhänge speichern
    .on('change', '.speichernAnhang', window.em.handleHProjektEditSpeichernAnhangChange)
    .on('click', "[name='LöscheAnhang']", function (event) {
      event.preventDefault()
      window.em.löscheAnhang(this, window.em.hProjekt, window.localStorage.ProjektId)
    })

  $('#hProjektEdit')
    .on('swipeleft', '#hProjektEditContent', window.em.handleHProjektEditContentSwipeleft)
    .on('swiperight', '#hProjektEditContent', window.em.handleHProjektEditContentSwiperight)
    // Pagination Pfeil voriger initialisieren
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      window.em.nächstesVorigesProjekt('voriges')
    })
    // Pagination Pfeil nächster initialisieren
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      window.em.nächstesVorigesProjekt('nächstes')
    })
    // Pagination Pfeiltasten initialisieren
    .on('keyup', function (event) {
      'use strict'
      // nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#hProjektEdit').is(':visible')) {
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          // Left arrow
          window.em.nächstesVorigesProjekt('voriges')
          event.preventDefault()
        } else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          // Right arrow
          window.em.nächstesVorigesProjekt('nächstes')
          event.preventDefault()
        }
      }
    })

  $('#hProjektEditFooter')
    // Code für den Projekt-Löschen-Dialog
    .on('click', '#LöscheProjektProjektEdit', function (event) {
      event.preventDefault()
      window.em.handleHProjektEditLöscheProjektClick(this)
    })
    // neues Projekt erstellen
    .on('click', '#NeuesProjektProjektEdit', function (event) {
      event.preventDefault()
      window.em.erstelleNeuesProjekt()
    })
    // sichtbare Felder wählen
    .on('click', '#waehleFelderProjektEdit', function (event) {
      event.preventDefault()
      window.em.handleHProjektEditWähleFelderClick()
    })
    .on('click', '#KarteOeffnenProjektEdit', function (event) {
      event.preventDefault()
      window.em.handleHProjektEditKarteÖffnenClick()
    })

  $('#hpe_löschen_meldung')
    .on('click', '#hpe_löschen_meldung_ja_loeschen', window.em.handleHProjektEditLöschenMeldungJaClick)

  $('#MenuProjektEdit')
    .on('click', '.menu_einfacher_modus', window.em.handleHProjektEditMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleHProjektEditMenuFelderVerwaltenClick)
    .on('click', '.menu_projekte_exportieren', window.em.handleHProjektEditMenuProjekteExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleHProjektEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

// wenn in hProjektEdit.html [name='OeffneProjektListeProjektEdit'] geklickt wird
window.em.handleHProjektEditÖffneProjektListeClick = function () {
  'use strict'
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('hProjektListe.html')
}

// wenn in hProjektEdit.html .speichernAnhang geändert wird
window.em.handleHProjektEditSpeichernAnhangChange = function () {
  'use strict'
  var _attachments = $('#_attachmentshPE').val()
  if (_attachments && _attachments.length > 0) {
    window.em.speichereAnhänge(window.localStorage.ProjektId, window.em.hProjekt, 'hPE')
  }
}

// wenn in hProjektEdit.html #LöscheProjektProjektEdit geklickt wird
window.em.handleHProjektEditLöscheProjektClick = function () {
  'use strict'
  // Anzahl Räume des Projekts zählen
  // die Abfrage verwenden, um die Datensätze später direkt zu löschen, ohne weitere DB-Abfrage
  var $db = $.couch.db('evab')
  $db.view('evab/hRaumIdVonProjekt?startkey=["' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.ProjektId + '",{},{}]', {
    success: function (Raeume) {
      var anzRaeume = Raeume.rows.length
      // Anzahl Orte des Projekts zählen
      $db.view('evab/hOrtIdVonProjekt?startkey=["' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.ProjektId + '",{},{}]', {
        success: function (Orte) {
          var anzOrte = Orte.rows.length
          // Anzahl Zeiten des Projekts zählen
          $db.view('evab/hZeitIdVonProjekt?startkey=["' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.ProjektId + '",{},{}]', {
            success: function (Zeiten) {
              var anzZeiten = Zeiten.rows.length
              // Anzahl Arten des Projekts zählen
              $db.view('evab/hArtIdVonProjekt?startkey=["' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.ProjektId + '",{},{}]', {
                success: function (Arten) {
                  var anzArten = Arten.rows.length,
                    $hoe_löschen_meldung = $('#hoe_löschen_meldung'),
                    räume_text = (anzRaeume === 1 ? ' Raum, ' : ' Räume, '),
                    orte_text = (anzOrte === 1 ? ' Ort, ' : ' Orte, '),
                    zeiten_text = (anzZeiten === 1 ? ' Zeit und ' : ' Zeiten und '),
                    arten_text = (anzArten === 1 ? ' Art' : ' Arten'),
                    meldung = 'Projekt inklusive ' + anzRaeume + räume_text + anzOrte + orte_text + anzZeiten + zeiten_text + anzArten + arten_text + ' löschen?'
                  $('#hpe_löschen_meldung_meldung').html(meldung)
                  // Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
                  $hoe_löschen_meldung.data('Arten', Arten)
                  $hoe_löschen_meldung.data('Zeiten', Zeiten)
                  $hoe_löschen_meldung.data('Orte', Orte)
                  $hoe_löschen_meldung.data('Raeume', Raeume)
                  // popup öffnen
                  $('#hpe_löschen_meldung').popup('open')
                }
              })
            }
          })
        }
      })
    }
  })
}

// wenn in hProjektEdit.html #hpe_löschen_meldung_ja_loeschen geklickt wird
window.em.handleHProjektEditLöschenMeldungJaClick = function () {
  'use strict'
  var $hpe_löschen_meldung = $('#hpe_löschen_meldung')[0]
  window.em.löscheProjekt($.data($hpe_löschen_meldung, 'Arten'), $.data($hpe_löschen_meldung, 'Zeiten'), $.data($hpe_löschen_meldung, 'Orte'), $.data($hpe_löschen_meldung, 'Raeume'))
}

// wenn in hProjektEdit.html #waehleFelderProjektEdit geklickt wird
window.em.handleHProjektEditWähleFelderClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'hProjektEdit'
  $.mobile.navigate('FelderWaehlen.html')
}

// wenn in hProjektEdit.html #hProjektEditContent nach links gewischt wird
window.em.handleHProjektEditContentSwipeleft = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächstesVorigesProjekt('nächstes')
  }
}

// wenn in hProjektEdit.html #hProjektEditContent nach rechts gewischt wird
window.em.handleHProjektEditContentSwiperight = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächstesVorigesProjekt('voriges')
  }
}

// wenn in hProjektEdit.html #KarteOeffnenProjektEdit geklickt wird
window.em.handleHProjektEditKarteÖffnenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hProjektEdit'
  $.mobile.navigate('Karte.html')
}

// wenn in hProjektEdit.html .menu_einfacher_modus geklickt wird
window.em.handleHProjektEditMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

// wenn in hProjektEdit.html .menu_felder_verwalten geklickt wird
window.em.handleHProjektEditMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hProjektEdit.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in hProjektEdit.html .menu_projekte_exportieren geklickt wird
window.em.handleHProjektEditMenuProjekteExportierenClick = function () {
  'use strict'
  window.open('_list/ExportProjekt/ExportProjekt?startkey=["' + window.localStorage.Email + '",{},{},{},{},{}]&endkey=["' + window.localStorage.Email + '"]&descending=true&include_docs=true')
  $('#MenuProjektEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in hProjektEdit.html .menu_einstellungen geklickt wird
window.em.handleHProjektEditMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hProjektEdit.html'
  window.em.öffneMeineEinstellungen()
}

// Öffnet das vorige oder nächste Projekt
// voriges des ersten => hProjektListe.html
// nächstes des letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
// wird benutzt in hProjektEdit.html
window.em.nächstesVorigesProjekt = function (NächstesOderVoriges) {
  'use strict'
  // prüfen, ob Projektliste schon existiert
  // nur abfragen, wenn sie noch nicht existiert
  if (window.em.Projektliste) {
    // globale Variable Projektliste existiert noch
    window.em.nächstesVorigesProjekt_2(NächstesOderVoriges)
  } else {
    // keine Projektliste übergeben
    // neu aus DB erstellen
    var $db = $.couch.db('evab')
    $db.view('evab/hProjListe?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{}]&include_docs=true', {
      success: function (data) {
        // Projektliste bereitstellen
        window.em.Projektliste = data
        window.em.nächstesVorigesProjekt_2(NächstesOderVoriges)
      }
    })
  }
}

window.em.nächstesVorigesProjekt_2 = function (NächstesOderVoriges) {
  'use strict'
  var i,
    ProjIdAktuell,
    AnzProj
  for (i = 0; window.em.Projektliste.rows.length; i++) {
    ProjIdAktuell = window.em.Projektliste.rows[i].doc._id
    AnzProj = window.em.Projektliste.rows.length - 1  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (ProjIdAktuell === window.localStorage.ProjektId) {
      switch (NächstesOderVoriges) {
        case 'nächstes':
          if (i < AnzProj) {
            window.localStorage.ProjektId = window.em.Projektliste.rows[i + 1].doc._id
            window.em.leereStorageProjektEdit('mitLatLngListe', 'ohneId')
            window.em.initiiereProjektEdit()
            return
          } else {
            window.em.melde('Das ist das letzte Projekt')
            return
          }
          break
        case 'voriges':
          if (i > 0) {
            window.localStorage.ProjektId = window.em.Projektliste.rows[i - 1].doc._id
            window.em.leereStorageProjektEdit('mitLatLngListe', 'ohneId')
            window.em.initiiereProjektEdit()
            return
          } else {
            window.em.leereStorageProjektEdit()
            $.mobile.navigate('hProjektListe.html')
            return
          }
          break
      }
    }
  }
}

// wird benutzt in hProjektEdit.html
window.em.löscheProjekt = function (Arten, Zeiten, Orte, Raeume) {
  'use strict'
  // nur löschen, wo Datensätze vorkommen
  if (Raeume.rows.length > 0) {
    window.em.loescheIdIdRevListe(Raeume)
  }
  if (Orte.rows.length > 0) {
    window.em.loescheIdIdRevListe(Orte)
  }
  if (Zeiten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Zeiten)
  }
  if (Arten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Arten)
  }
  // zuletzt das Projekt
  if (window.em.hProjekt) {
    // Objekt verwenden
    window.em.löscheProjekt_2()
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.ProjektId, {
      success: function (data) {
        window.em.hProjekt = data
        window.em.löscheProjekt_2()
      },
      error: function () {
        window.em.melde('Fehler: Projekt nicht gelöscht')
      }
    })
  }
}

window.em.löscheProjekt_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.hProjekt, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.Projektliste && window.em.Projektliste.rows) {
        window.em.Projektliste.rows = _.reject(window.em.Projektliste.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine Projektliste mehr. Storage löschen
        window.em.leereStorageProjektListe('mitLatLngListe')
      }
      // Projektedit zurücksetzen
      window.em.leereStorageProjektEdit('mitLatLngListe')
      $.mobile.navigate('hProjektListe.html')
    // $(":mobile-pagecontainer").pagecontainer("change", "hProjektListe.html")
    // $(":mobile-pagecontainer").pagecontainer("change", "hProjektListe.html", {reload: true})
    },
    error: function () {
      window.em.melde('Fehler: Projekt nicht gelöscht')
    }
  })
}

// wird benutzt in hProjektEdit.html
window.em.validierehProjektEdit = function () {
  'use strict'
  if (!$("[name='pName']").val()) {
    window.em.melde('Bitte Projektnamen eingeben')
    setTimeout(function () {
      $("[name='pName']").focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  return true
}

// wird benutzt in hProjektEdit.html
window.em.speichereHProjektEdit = function () {
  'use strict'
  var that = this
  if (window.em.hProjekt) {
    window.em.speichereHProjektEdit_2(that)
  } else {
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.ProjektId, {
      success: function (data) {
        window.em.hProjekt = data
        window.em.speichereHProjektEdit_2(that)
      },
      error: function () {
        window.em.melde('Fehler: Änderung in ' + that.name + ' nicht gespeichert')
      }
    })
  }
}

window.em.speichereHProjektEdit_2 = function (that) {
  'use strict'
  var FeldnameDb,
    Feldwert,
    feldinfos
  // Feldname und -wert ermitteln
  feldinfos = window.em.holeFeldInfosVonElement(that)
  FeldnameDb = feldinfos.feldname_db
  Feldwert = feldinfos.feldwert
  if (window.em.validierehProjektEdit()) {
    if (FeldnameDb === 'pName') {
      // Variablen für Projektliste zurücksetzen, damit sie beim nächsten Aufruf neu aufgebaut wird
      window.em.leereStorageProjektListe('mitLatLngListe')
    }
    if (Feldwert) {
      if (window.em.myTypeOf(Feldwert) === 'float') {
        window.em.hProjekt[FeldnameDb] = parseFloat(Feldwert)
      } else if (window.em.myTypeOf(Feldwert) === 'integer') {
        window.em.hProjekt[FeldnameDb] = parseInt(Feldwert)
      } else {
        window.em.hProjekt[FeldnameDb] = Feldwert
      }
    } else if (window.em.hProjekt[FeldnameDb]) {
      delete window.em.hProjekt[FeldnameDb]
    }
    // alles speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hProjekt, {
      success: function (data) {
        window.em.hProjekt._rev = data.rev
        // window.ZuletztGespeicherteProjektId wird benutzt, damit auch nach einem
        // Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
        // Zuletzt gespeicherte ProjektId NACH dem speichern setzen
        // sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
        // darum zwischenspeichern
        window.em.hProjektIdZwischenspeicher = window.localStorage.ProjektId
        // setTimeout("window.ZuletztGespeicherteProjektId = window.em.hProjektIdZwischenspeicher", 1000) AUSGESCHALTET, DA ZuletztGespeicherteProjektId NIRGENDS VERWENDET WIRD
        setTimeout('delete window.em.hProjektIdZwischenspeicher', 1500)
        // nicht aktualisierte hierarchisch tiefere Listen löschen
        delete window.em.OrteVonRaum
        delete window.em.ZeitenVonRaum
        delete window.em.ZeitenVonOrt
        delete window.em.ArtenVonRaum
        delete window.em.ArtenVonOrt
        delete window.em.ArtenVonZeit
      },
      error: function () {
        console.log('Fehler in function speichereHProjektEdit_2(that)')
      // melde("Fehler: Änderung in " + FeldnameDb + " nicht gespeichert")
      }
    })
  }
}

// Öffnet den vorigen oder nächsten Ort
// voriger des ersten => OrtListe
// nächster des letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
// wird benutzt in hOrtEdit.html
window.em.nächsterVorigerOrt = function (NächsterOderVoriger) {
  'use strict'
  // prüfen, ob OrtListe schon existiert
  // nur abfragen, wenn sie noch nicht existiert
  if (window.em.OrtListe) {
    // Ortliste liegt als Variable vor
    window.em.nächsterVorigerOrt_2(NächsterOderVoriger)
  } else {
    // keine Ortliste vorhanden
    // neu aus DB erstellen
    var $db = $.couch.db('evab')
    $db.view('evab/hOrtListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.RaumId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.RaumId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // OrtListe für hOrtListe.html bereitstellen
        window.em.OrtListe = data
        window.em.nächsterVorigerOrt_2(NächsterOderVoriger)
      }
    })
  }
}

window.em.nächsterVorigerOrt_2 = function (NächsterOderVoriger) {
  'use strict'
  var i,
    OrtIdAktuell,
    AnzOrt
  for (i = 0; window.em.OrtListe.rows.length; i++) {
    OrtIdAktuell = window.em.OrtListe.rows[i].doc._id
    AnzOrt = window.em.OrtListe.rows.length - 1  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (OrtIdAktuell === window.localStorage.OrtId) {
      switch (NächsterOderVoriger) {
        case 'nächster':
          if (i < AnzOrt) {
            window.localStorage.OrtId = window.em.OrtListe.rows[i + 1].doc._id
            window.em.leereStorageOrtEdit('ohneId')
            window.em.initiiereOrtEdit()
            return
          } else {
            window.em.melde('Das ist der letzte Ort')
            return
          }
          break
        case 'voriger':
          if (i > 0) {
            window.localStorage.OrtId = window.em.OrtListe.rows[i - 1].doc._id
            window.em.leereStorageOrtEdit('ohneId')
            window.em.initiiereOrtEdit()
            return
          } else {
            window.em.leereStorageOrtEdit()
            $.mobile.navigate('hOrtListe.html')
            return
          }
          break
      }
    }
  }
}

// wird benutzt in hOrtEdit.html
window.em.validatehOrtEdit = function () {
  'use strict'
  if (!$("[name='oName']").val()) {
    window.em.melde('Bitte Ortnamen eingeben')
    setTimeout(function () {
      $("[name='oName']").focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  return true
}

// wird benutzt in hOrtEdit.html
window.em.speichereHOrtEdit = function (that) {
  'use strict'
  // die eventhandler übergeben this nicht über die Klammer
  var _this = that || this
  // prüfen, ob Ort existiert
  if (window.em.hOrt) {
    // bestehedes Objekt verwenden
    window.em.speichereHOrtEdit_2(_this)
  } else {
    // kein Ort > aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.OrtId, {
      success: function (data) {
        window.em.hOrt = data
        window.em.speichereHOrtEdit_2(_this)
      },
      error: function () {
        console.log('Fehler in function speichereHOrtEdit')
      // melde("Fehler: Änderung in " + Feldname + " nicht gespeichert")
      }
    })
  }
}

window.em.speichereHOrtEdit_2 = function (that) {
  'use strict'
  var FeldnameDb,
    Feldwert,
    feldinfos
  // Feldname und -wert ermitteln
  feldinfos = window.em.holeFeldInfosVonElement(that)
  FeldnameDb = feldinfos.feldname_db
  Feldwert = feldinfos.feldwert
  if (window.em.validatehOrtEdit()) {
    if (FeldnameDb === 'oName') {
      // Variablen für OrtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
      window.em.leereStorageOrtListe('mitLatLngListe')
    }
    // Werte aus dem Formular aktualisieren
    if (Feldwert) {
      if (window.em.myTypeOf(Feldwert) === 'float') {
        window.em.hOrt[FeldnameDb] = parseFloat(Feldwert)
      } else if (window.em.myTypeOf(Feldwert) === 'integer') {
        window.em.hOrt[FeldnameDb] = parseInt(Feldwert, 10)
      } else {
        window.em.hOrt[FeldnameDb] = Feldwert
      }
    } else if (window.em.hOrt[FeldnameDb]) {
      delete window.em.hOrt[FeldnameDb]
    }
    // alles speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hOrt, {
      success: function (data) {
        window.em.hOrt._rev = data.rev
        // window.ZuletztGespeicherteOrtId wird benutzt, damit auch nach einem
        // Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
        // Zuletzt gespeicherte OrtId NACH dem speichern setzen
        // sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
        // darum zwischenspeichern
        window.em.OrtIdZwischenspeicher = window.localStorage.OrtId
        // setTimeout("window.ZuletztGespeicherteOrtId = window.em.OrtIdZwischenspeicher", 1000)  AUSGESCHALTET, DA ZuletztGespeicherteOrtId NIRGENDS BENUTZT WIRD
        setTimeout('delete window.em.OrtIdZwischenspeicher', 1500)
        // nicht aktualisierte hierarchisch tiefere Listen löschen
        delete window.em.ZeitenVonProjekt
        delete window.em.ZeitenVonRaum
        delete window.em.ArtenVonProjekt
        delete window.em.ArtenVonRaum
        delete window.em.ArtenVonZeit
      },
      error: function () {
        console.log('Fehler in function speichereHOrtEdit_2(that)')
      // melde("Fehler: Änderung in " + FeldnameDb + " nicht gespeichert")
      }
    })
  }
}

// wird benutzt in hOrtEdit.html
window.em.löscheOrt = function (Arten, Zeiten) {
  'use strict'
  // nur löschen, wo Datensätze vorkommen
  if (Zeiten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Zeiten)
  }
  if (Arten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Arten)
  }
  // zuletzt den Ort löschen
  if (window.em.hOrt) {
    // Objekt nutzen
    window.em.löscheOrt_2()
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.OrtId, {
      success: function (data) {
        window.em.hOrt = data
        window.em.löscheOrt_2()
      },
      error: function () {
        window.em.melde('Fehler: Der Ort wurde nicht gelöscht')
      }
    })
  }
}

window.em.löscheOrt_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.hOrt, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.OrtListe && window.em.OrtListe.rows) {
        window.em.OrtListe.rows = _.reject(window.em.OrtListe.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine Ortliste mehr. Storage löschen
        window.em.leereStorageOrtListe('mitLatLngListe')
      }
      window.em.leereStorageOrtEdit('mitLatLngListe')
      $.mobile.navigate('hOrtListe.html')
    },
    error: function () {
      window.em.melde('Fehler: Der Ort wurde nicht gelöscht')
    }
  })
}

// wird verwendet in hArtListe.html
window.em.öffneArtgruppenliste_hal = function () {
  'use strict'
  // Globale Variablen für hArtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
  // window.em.leereStoragehArtListe()
  window.localStorage.Status = 'neu'
  window.localStorage.Von = 'hArtListe'
  delete window.localStorage.aArtGruppe // verhindern, dass eine Artgruppe übergeben wird
  $.mobile.navigate('Artgruppenliste.html')
}

// wenn in hArtEdit.html auf [name='OeffneArtListehArtEdit'] geklickt wird
window.em.handleHArtEditÖffneArtListehArtEditClick = function () {
  'use strict'
  window.em.leereStoragehArtEdit()
  $.mobile.navigate('hArtListe.html')
}

// wenn in hArtEdit.html auf .OeffneZeithArtEdit geklickt wird
window.em.handleHArtEditÖffneZeithArtEditClick = function () {
  'use strict'
  window.em.leereStoragehArtEdit()
  window.em.leereStoragehArtListe()
  $.mobile.navigate('hZeitEdit.html')
}

// wenn in hArtEdit.html .OeffneOrthArtEdit geklickt wird
window.em.handleHArtEditÖffneOrthArtEditClick = function () {
  'use strict'
  window.em.leereStoragehArtEdit()
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  $.mobile.navigate('hOrtEdit.html')
}

// wenn in hArtEdit.html .OeffneRaumhArtEdit geklickt wird
window.em.handleHArtEditÖffneRaumhArtEditClick = function () {
  'use strict'
  window.em.leereStoragehArtEdit()
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  $.mobile.navigate('hRaumEdit.html')
}

// wenn in hArtEdit.html .OeffneProjekthArtEdit geklickt wird
window.em.handleHArtEditÖffneProjekthArtEditClick = function () {
  'use strict'
  window.em.leereStoragehArtEdit()
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

// wenn in hArtEdit.html .speichernAnhang geändert wird
window.em.handleHArtEditSpeichernAnhangChange = function () {
  'use strict'
  var _attachments = $('#_attachmentshAE').val()
  if (_attachments && _attachments.length !== 0) {
    window.em.speichereAnhänge(window.localStorage.hArtId, window.em.hArt, 'hAE')
  }
}

// wenn in hArtEdit.html #NeueBeobhArtEdit geklickt wird
window.em.handleHArtEditNeueBeobhArtEditClick = function () {
  'use strict'
  window.localStorage.Status = 'neu'
  window.em.zuArtgruppenliste()
}

// wenn in hArtEdit.html #waehleFelderhArtEdit geklickt wird
window.em.handleHArtEditWähleFelderClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'hArtEdit'
  $.mobile.navigate('FelderWaehlen.html')
}

// wenn in hArtEdit.html nach links gewischt wird
window.em.handleHArtEditSwipeleft = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsteVorigeArt('nächste')
  }
}

// wenn in hArtEdit.html nach rechts gewischt wird
window.em.handleHArtEditSwiperight = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsteVorigeArt('vorige')
  }
}

// wenn in hArtEdit.html [name='LöscheAnhang'] geklickt wird
window.em.handleHArtEditLöscheAnhangClick = function (that) {
  'use strict'
  window.em.löscheAnhang(that, window.em.hArt, window.localStorage.hArtId)
}

// wenn in hArtEdit.html .menu_arteigenschaften geklickt wird
window.em.handleHArtEditMenuArteigenschaftenClick = function () {
  'use strict'
  window.em.öffneEigenschaftenVonArt(window.em.hArt.aArtId)
}

// wenn in hArtEdit.html .menu_einfacher_modus geklickt wird
window.em.handleHArtEditMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStoragehArtEdit()
  window.em.leereStoragehArtListe()
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

// wenn in hArtEdit.html .menu_felder_verwalten geklickt wird
window.em.handleHArtEditMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hArtEdit.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in hArtEdit.html .menu_beob_exportieren geklickt wird
window.em.handleHArtEditMenuBeobExportierenClick = function () {
  'use strict'
  window.open('_list/ExportBeob/ExportBeob?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuhArtEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn in hArtEdit.html .menu_einstellungen geklickt wird
window.em.handleHArtEditMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hArtEdit.html'
  window.em.öffneMeineEinstellungen()
}

// wenn hProjektListe erscheint
window.em.handleHProjektListePageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  }
  window.em.initiiereProjektliste()
}

// wenn hProjektListe initiiert wird
window.em.handleHProjektListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  }

  $(document)
    // inaktive tabs inaktivieren
    // BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF id des header NICHT FUNKTIONIERTE!!!???
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#hProjektListePageHeader')
    .on('click', '#OeffneProjektListeProjektListe', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })
    .on('click', '#OeffneBeobListeProjektListe', function (event) {
      event.preventDefault()
      $.mobile.navigate('BeobListe.html')
    })

  $('#hProjektListe')
    // neues Projekt erstellen
    .on('click', '.NeuesProjektProjektListe', function (event) {
      event.preventDefault()
      window.em.erstelleNeuesProjekt()
    })
    .on('swiperight', window.em.handleProjektListeSwiperight)

  $('#ProjektlistehPL')
    .on('swipeleft', '.Projekt', window.em.handleProjektListeSwipeleft)
    .on('click', '.Projekt', function (event) {
      event.preventDefault()
      window.em.handleProjektListeProjektClick(this)
    })
    .on('swipeleft', '.erste', window.em.erstelleNeuesProjekt)

  $('#ProjektListePageFooter')
    .on('click', '#OeffneKarteProjektListe', function (event) {
      event.preventDefault()
      window.em.handleProjektListeÖffneKarteClick()
    })

  $('#MenuProjektListe')
    .on('click', '.menu_einfacher_modus', window.em.handleProjektListeMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleProjektListeMenuFelderVerwaltenClick)
    .on('click', '.menu_projekte_exportieren', window.em.handleHProjektListeMenuProjekteExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleProjektListeMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

window.em.handleProjektListeSwipeleft = function () {
  'use strict'
  window.localStorage.ProjektId = $(this).attr('ProjektId')
  $.mobile.navigate('hRaumListe.html')
}

window.em.handleProjektListeProjektClick = function (that) {
  'use strict'
  window.localStorage.ProjektId = $(that).attr('ProjektId')
  $.mobile.navigate('hProjektEdit.html')
}

window.em.handleProjektListeSwiperight = function () {
  'use strict'
  $.mobile.navigate('BeobListe.html')
}

window.em.handleProjektListeÖffneKarteClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hProjektListe'
  $.mobile.navigate('Karte.html')
}

window.em.handleProjektListeMenuEinfacherModusClick = function () {
  'use strict'
  $.mobile.navigate('BeobListe.html')
}

window.em.handleProjektListeMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hProjektListe.html'
  $.mobile.navigate('FeldListe.html')
}

// wenn in hProjektListe.html .menu_projekte_exportieren geklickt wird
window.em.handleHProjektListeMenuProjekteExportierenClick = function () {
  'use strict'
  window.open('_list/ExportProjekt/ExportProjekt?startkey=["' + window.localStorage.Email + '",{},{},{},{},{}]&endkey=["' + window.localStorage.Email + '"]&descending=true&include_docs=true')
  $('#MenuProjektListe')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

window.em.handleProjektListeMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hProjektListe.html'
  window.em.öffneMeineEinstellungen()
}

// wenn hRaumEdit erscheint
window.em.handleRaumEditPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.RaumId || window.localStorage.RaumId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiiereRaumEdit()
}

// wenn hRaumEdit initiiert wird
window.em.handleRaumEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.RaumId || window.localStorage.RaumId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $('#RaumEditHeader')
    .on('click', "[name='OeffneRaumListeRaumEdit']", function (event) {
      event.preventDefault()
      window.em.handleRaumEditÖffneRaumListeClick()
    })
    // Link zu Projekt in Navbar und Titelleiste
    .on('click', '#ProjektOeffnenRaumEdit', function (event) {
      event.preventDefault()
      window.em.handleRaumEditProjektÖffnenClick()
    })
    // Link zu Ortliste in Navbar
    .on('click', '#OrtListeOeffnenRaumEdit', function (event) {
      event.preventDefault()
      $.mobile.navigate('hOrtListe.html')
    })

  $('#hRaumEditForm')
    // Für jedes Feld bei Änderung speichern
    .on('change', '.speichern', window.em.speichereRaum)
    // Eingabe im Zahlenfeld abfangen
    .on('blur', '.speichernSlider', window.em.speichereRaum)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereRaum)
    // Ende des Schiebens abfangen
    .on('slidestop', '.speichernSlider', window.em.speichereRaum)

  $('#hRaumEditFooter')
    // Code für den Raum-Löschen-Dialog
    .on('click', '#LoescheRaumRaumEdit', function (event) {
      event.preventDefault()
      window.em.handleRaumEditLöscheRaumClick()
    })

  $('#hre_löschen_meldung')
    .on('click', '#hre_löschen_meldung_ja_loeschen', function () {
      var $hre_löschen_meldung = $('#hre_löschen_meldung')[0]
      window.em.löscheRaum($.data($hre_löschen_meldung, 'Arten'), $.data($hre_löschen_meldung, 'Zeiten'), $.data($hre_löschen_meldung, 'Orte'))
    })

  $(document)
    // inaktive tabs inaktivieren
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#hRaumEdit')
    .on('swipeleft', '#hRaumEditContent', window.em.handleRaumEditContentSwipreleft)
    .on('swiperight', '#hRaumEditContent', window.em.handleRaumEditContentSwiperight)
    // Pagination Pfeil voriger initialisieren
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      window.em.nächsterVorigerRaum('voriger')
    })
    // Pagination Pfeil nächster initialisieren
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      window.em.nächsterVorigerRaum('nächster')
    })
    // Pagination Pfeiltasten initialisieren
    .on('keyup', function (event) {
      'use strict'
      // nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#hRaumEdit').is(':visible')) {
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          // Left arrow
          window.em.nächsterVorigerRaum('voriger')
          event.preventDefault()
        } else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          // Right arrow
          window.em.nächsterVorigerRaum('nächster')
          event.preventDefault()
        }
      }
    })

  // Änderungen im Formular für Anhänge speichern
  $('#FormAnhängehRE')
    .on('change', '.speichernAnhang', window.em.handleRaumEditSpeichernAnhangChange)
    .on('click', "[name='LöscheAnhang']", function (event) {
      event.preventDefault()
      window.em.löscheAnhang(this, window.em.hRaum, window.localStorage.RaumId)
    })

  $('#hRaumEditFooter')
    // neuen Raum erstellen
    .on('click', '#NeuerRaumRaumEdit', function (event) {
      event.preventDefault()
      window.em.erstelleNeuenRaum()
    })
    // sichtbare Felder wählen
    .on('click', '#waehleFelderRaumEdit', function (event) {
      event.preventDefault()
      window.em.handleRaumEditWähleFelderClick()
    })
    .on('click', '#KarteOeffnenRaumEdit', function (event) {
      event.preventDefault()
      window.em.handleRaumEditÖffneKarteClick()
    })

  $('#MenuRaumEdit')
    .on('click', '.menu_einfacher_modus', window.em.handleRaumEditMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleRaumEditMenuFelderVerwaltenClick)
    .on('click', '.menu_raeume_exportieren', window.em.handleRaumEditMenuExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleRaumEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

window.em.handleRaumEditÖffneRaumListeClick = function () {
  'use strict'
  window.em.leereStorageRaumEdit()
  $.mobile.navigate('hRaumListe.html')
}

window.em.handleRaumEditSpeichernAnhangChange = function () {
  'use strict'
  var _attachments = $('#_attachmentshRE').val()
  if (_attachments && _attachments.length > 0) {
    window.em.speichereAnhänge(window.localStorage.RaumId, window.em.hRaum, 'hRE')
  }
}

window.em.handleRaumEditLöscheRaumClick = function () {
  'use strict'
  // Anzahl Orte des Raums zählen
  var $db = $.couch.db('evab')
  $db.view('evab/hOrtIdVonRaum?startkey=["' + window.localStorage.RaumId + '"]&endkey=["' + window.localStorage.RaumId + '",{},{}]', {
    success: function (Orte) {
      var anzOrte = Orte.rows.length
      // Anzahl Zeiten des Raums zählen
      $db.view('evab/hZeitIdVonRaum?startkey=["' + window.localStorage.RaumId + '"]&endkey=["' + window.localStorage.RaumId + '",{},{}]', {
        success: function (Zeiten) {
          var anzZeiten = Zeiten.rows.length
          // Anzahl Arten des Raums zählen
          $db.view('evab/hArtIdVonRaum?startkey=["' + window.localStorage.RaumId + '"]&endkey=["' + window.localStorage.RaumId + '",{},{}]', {
            success: function (Arten) {
              var anzArten = Arten.rows.length,
                $hre_löschen_meldung = $('#hre_löschen_meldung'),
                orte_text = (anzOrte === 1 ? ' Ort, ' : ' Orte, '),
                zeiten_text = (anzZeiten === 1 ? ' Zeit und ' : ' Zeiten und '),
                arten_text = (anzArten === 1 ? ' Art' : ' Arten'),
                meldung = 'Raum inklusive ' + anzOrte + orte_text + anzZeiten + zeiten_text + anzArten + arten_text + ' löschen?'
              $('#hre_löschen_meldung_meldung').html(meldung)
              // Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
              $hre_löschen_meldung.data('Arten', Arten)
              $hre_löschen_meldung.data('Zeiten', Zeiten)
              $hre_löschen_meldung.data('Orte', Orte)
              // popup öffnen
              $hre_löschen_meldung.popup('open')
            }
          })
        }
      })
    }
  })
}

window.em.handleRaumEditProjektÖffnenClick = function () {
  'use strict'
  window.em.leereStorageRaumListe('mitLatLngListe')
  $.mobile.navigate('hProjektEdit.html')
}

window.em.handleRaumEditWähleFelderClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'hRaumEdit'
  $.mobile.navigate('FelderWaehlen.html')
}

window.em.handleRaumEditContentSwipreleft = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsterVorigerRaum('nächster')
  }
}

window.em.handleRaumEditContentSwiperight = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsterVorigerRaum('voriger')
  }
}

window.em.handleRaumEditÖffneKarteClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hRaumEdit'
  $.mobile.navigate('Karte.html')
}

window.em.handleRaumEditMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

window.em.handleRaumEditMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hRaumEdit.html'
  $.mobile.navigate('FeldListe.html')
}

window.em.handleRaumEditMenuExportierenClick = function () {
  'use strict'
  window.open('_list/ExportRaum/ExportRaum?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuRaumEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

window.em.handleRaumEditMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hRaumEdit.html'
  window.em.öffneMeineEinstellungen()
}

window.em.löscheRaum = function (Arten, Zeiten, Orte) {
  'use strict'
  // nur löschen, wo Datensätze vorkommen
  if (Orte.rows.length > 0) {
    window.em.loescheIdIdRevListe(Orte)
  }
  if (Zeiten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Zeiten)
  }
  if (Arten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Arten)
  }
  if (window.em.hRaum) {
    // Objekt benutzen
    window.em.löscheRaum_2()
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.RaumId, {
      success: function (data) {
        window.em.hRaum = data
        window.em.löscheRaum_2()
      },
      error: function () {
        window.em.melde('Fehler: Raum nicht gelöscht')
      }
    })
  }
}

window.em.löscheRaum_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.hRaum, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.RaumListe) {
        window.em.RaumListe.rows = _.reject(window.em.RaumListe.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine Raumliste mehr. Storage löschen
        window.em.leereStorageRaumListe('mitLatLngListe')
      }
      // RaumListe zurücksetzen, damit sie beim nächsten Aufruf neu aufgebaut wird
      window.em.leereStorageRaumEdit('mitLatLngListe')
      $.mobile.navigate('hRaumListe.html')
    },
    error: function () {
      window.em.melde('Fehler: Raum nicht gelöscht')
    }
  })
}

window.em.validierehRaumEdit = function () {
  'use strict'
  if (!$('#rName').val()) {
    window.em.melde('Bitte Raumnamen eingeben')
    setTimeout(function () {
      $('#rName').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  return true
}

window.em.speichereRaum = function () {
  'use strict'
  var that = this
  // prüfen, ob Objekt Raum existiert
  // fehlt z.B. nach refresh
  if (window.em.hRaum) {
    window.em.speichereRaum_2(that)
  } else {
    // kein Raum > aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.RaumId, {
      success: function (data) {
        window.em.hRaum = data
        window.em.speichereRaum_2(that)
      },
      error: function () {
        window.em.melde('Fehler: Änderung in ' + that.name + ' nicht gespeichert')
      }
    })
  }

}

window.em.speichereRaum_2 = function (that) {
  'use strict'
  var FeldnameDb,
    Feldwert,
    feldinfos
  // Feldname und -wert ermitteln
  feldinfos = window.em.holeFeldInfosVonElement(that)
  FeldnameDb = feldinfos.feldname_db
  Feldwert = feldinfos.feldwert
  if (window.em.validierehRaumEdit()) {
    if (FeldnameDb === 'rName') {
      // RaumListe zurücksetzen, damit sie beim nächsten Aufruf neu aufgebaut wird
      window.em.leereStorageRaumListe('mitLatLngListe')
    }
    if (Feldwert) {
      if (window.em.myTypeOf(Feldwert) === 'float') {
        window.em.hRaum[FeldnameDb] = parseFloat(Feldwert)
      } else if (window.em.myTypeOf(Feldwert) === 'integer') {
        window.em.hRaum[FeldnameDb] = parseInt(Feldwert, 10)
      } else {
        window.em.hRaum[FeldnameDb] = Feldwert
      }
    } else if (window.em.hRaum[FeldnameDb]) {
      delete window.em.hRaum[FeldnameDb]
    }
    // alles speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hRaum, {
      success: function (data) {
        window.em.hRaum._rev = data.rev
        // window.ZuletztGespeicherteRaumId wird benutzt, damit auch nach einem
        // Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
        // Zuletzt gespeicherte RaumId NACH dem speichern setzen
        // sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
        // darum zwischenspeichern
        window.em.RaumIdZwischenspeicher = window.localStorage.RaumId
        // setTimeout("window.ZuletztGespeicherteRaumId = window.em.RaumIdZwischenspeicher", 1000)  AUSGESCHALTET, DA ZuletztGespeicherteRaumId NIRGENDS GEBRAUCHT
        setTimeout('delete window.em.RaumIdZwischenspeicher', 1500)
        // nicht aktualisierte hierarchisch tiefere Listen löschen
        delete window.em.OrteVonProjekt
        delete window.em.ZeitenVonProjekt
        delete window.em.ZeitenVonOrt
        delete window.em.ArtenVonProjekt
        delete window.em.ArtenVonOrt
        delete window.em.ArtenVonZeit
      },
      error: function () {
        console.log('Fehler in function speichereRaum_2(that)')
      }
    })
  }
}

// Öffnet den vorigen oder nächsten Raum
// voriger des ersten => RaumListe
// nächster des letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
window.em.nächsterVorigerRaum = function (NächsterOderVoriger) {
  'use strict'
  // prüfen, ob RaumListe schon existiert
  // nur abfragen, wenn sie noch nicht existiert
  if (window.em.RaumListe) {
    // globale Variable RaumListe existiert noch
    window.em.nächsterVorigerRaum_2(NächsterOderVoriger)
  } else {
    // keine Raumliste übergeben
    // neu aus DB erstellen
    var $db = $.couch.db('evab')
    $db.view('evab/hRaumListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.ProjektId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // RaumListe bereitstellen
        window.em.RaumListe = data
        window.em.nächsterVorigerRaum_2(NächsterOderVoriger)
      }
    })
  }
}

window.em.nächsterVorigerRaum_2 = function (NächsterOderVoriger) {
  'use strict'
  var i,
    RaumIdAktuell,
    AnzRaum
  for (i = 0; window.em.RaumListe.rows.length; i++) {
    RaumIdAktuell = window.em.RaumListe.rows[i].doc._id
    AnzRaum = window.em.RaumListe.rows.length - 1  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (RaumIdAktuell === window.localStorage.RaumId) {
      switch (NächsterOderVoriger) {
        case 'nächster':
          if (i < AnzRaum) {
            window.localStorage.RaumId = window.em.RaumListe.rows[i + 1].doc._id
            window.em.leereStorageRaumEdit('mitLatLngListe', 'ohneId')
            window.em.initiiereRaumEdit()
            return
          } else {
            window.em.melde('Das ist der letzte Raum')
            return
          }
          break
        case 'voriger':
          if (i > 0) {
            window.localStorage.RaumId = window.em.RaumListe.rows[i - 1].doc._id
            window.em.leereStorageRaumEdit('mitLatLngListe', 'ohneId')
            window.em.initiiereRaumEdit()
            return
          } else {
            window.em.leereStorageRaumEdit()
            $.mobile.navigate('hRaumListe.html')
            return
          }
          break
      }
    }
  }
}

// wenn hRaumListe erscheint
window.em.handleHRaumListePageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.ProjektId || window.localStorage.ProjektId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiiereRaumListe()
}

// wenn hRaumListe initiiert wird
window.em.handleHRaumListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.ProjektId || window.localStorage.ProjektId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $(document)
    // inaktive tabs inaktivieren
    // BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF id des header NICHT FUNKTIONIERTE!!!???
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#hRaumListePageHeader')
    // Link zu Projekt in Navbar und Titelleiste
    .on('click', "[name='ProjektEditOeffnenRaumListe']", function (event) {
      event.preventDefault()
      window.em.handleRaumListeÖffneProjektEditClick()
    })

  $('#hRaumListe')
    // neuen Raum erstellen
    .on('click', "[name='NeuerRaumRaumListe']", function (event) {
      event.preventDefault()
      window.em.erstelleNeuenRaum()
    })
    .on('swiperight', '#hRaumListePageContent', window.em.handleRaumListeContentSwiperight)

  $('#RaumlistehRL')
    .on('swipeleft', '.Raum', window.em.handleRaumListeSwipeleft)
    .on('click', '.Raum', function (event) {
      event.preventDefault()
      window.em.handleRaumListeRaumClick(this)
    })
    .on('swipeleft', '.erste', window.em.erstelleNeuenRaum)

  $('#hRaumListePageFooter')
    .on('click', '#KarteOeffnenRaumListe', function (event) {
      event.preventDefault()
      window.em.handleRaumListeÖffneKarteClick()
    })

  $('#MenuRaumListe')
    .on('click', '.menu_einfacher_modus', window.em.handleHRaumListeMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleRaumListeMenuFelderVerwaltenClick)
    .on('click', '.menu_raeume_exportieren', window.em.handleHRaumListeMenuExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleRaumListeMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_arten_importieren', window.em.öffneArtenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

window.em.handleRaumListeÖffneProjektEditClick = function () {
  'use strict'
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

window.em.handleRaumListeSwipeleft = function () {
  'use strict'
  window.localStorage.RaumId = $(this).attr('RaumId')
  $.mobile.navigate('hOrtListe.html')
}

window.em.handleRaumListeRaumClick = function (that) {
  'use strict'
  window.localStorage.RaumId = $(that).attr('RaumId')
  $.mobile.navigate('hRaumEdit.html')
}

window.em.handleRaumListeContentSwiperight = function () {
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektListe.html')
}

window.em.handleRaumListeÖffneKarteClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hRaumListe'
  $.mobile.navigate('Karte.html')
}

window.em.handleHRaumListeMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

window.em.handleRaumListeMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hRaumListe.html'
  $.mobile.navigate('FeldListe.html')
}

window.em.handleRaumListeMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hRaumListe.html'
  window.em.öffneMeineEinstellungen()
}

window.em.handleHRaumListeMenuExportierenClick = function () {
  'use strict'
  window.open('_list/ExportRaum/ExportRaum?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuRaumListe')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

// wenn hZeitEdit.html erscheint
window.em.handleHZeitEditPageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.ZeitId || window.localStorage.ZeitId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
  }
  window.em.initiiereZeitEdit()
}

// wenn hZeitEdit.html initiiert wird
window.em.handleHZeitEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  } else if ((!window.localStorage.Status || window.localStorage.Status === 'undefined') && (!window.localStorage.ZeitId || window.localStorage.ZeitId === 'undefined')) {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
  }

  $(document)
    // inaktive tabs inaktivieren
    // BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF hZeitListePageHeader NICHT FUNKTIONIERTE!!!???
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#ZeitEditPageHeader')
    .on('click', "[name='OeffneZeitListeZeitEdit']", function (event) {
      event.preventDefault()
      window.em.leereStorageZeitEdit()
      $.mobile.navigate('hZeitListe.html')
    })
    .on('click', '#OeffneOrtZeitEdit', function (event) {
      event.preventDefault()
      window.em.handleZeitEditÖffneOrtClick()
    })
    .on('click', '#OeffneArtListeZeitEdit', function (event) {
      event.preventDefault()
      $.mobile.navigate('hArtListe.html')
    })
    .on('click', '#OeffneRaumZeitEdit', function (event) {
      event.preventDefault()
      window.em.handleZeitEditÖffneRaumClick()
    })
    .on('click', '#OeffneProjektZeitEdit', function (event) {
      event.preventDefault()
      window.em.handleZeitEditÖffneProjektClick()
    })

  $('#hZeitEditForm')
    // Für jedes Feld bei Änderung speichern
    .on('change', '.speichern', window.em.speichereHZeitEdit)
    // Eingabe im Zahlenfeld abfangen
    .on('blur', '.speichernSlider', window.em.speichereHZeitEdit)
    // Klicken auf den Pfeilen im Zahlenfeld abfangen
    .on('mouseup', '.ui-slider-input', window.em.speichereHZeitEdit)
    // Ende des Schiebens abfangen
    .on('slidestop', '.speichernSlider', window.em.speichereHZeitEdit)

  $('#FormAnhängehZE')
    // Änderungen im Formular für Anhänge speichern
    .on('change', '.speichernAnhang', window.em.handleZeitEditSpeichernAnhangChange)
    .on('click', "[name='LöscheAnhang']", function (event) {
      event.preventDefault()
      window.em.löscheAnhang(this, window.em.hZeit, window.localStorage.ZeitId)
    })

  $('#hZeitEdit')
    .on('swipeleft', '#ZeitEditPageContent', window.em.handleZeitEditContentSwipeleft)
    .on('swiperight', '#ZeitEditPageContent', window.em.handleZeitEditContentSwiperight)
    // Pagination Pfeil voriger initialisieren
    .on('vclick', '.ui-pagination-prev', function (event) {
      event.preventDefault()
      window.em.nächsteVorigeZeit('vorige')
    })
    // Pagination Pfeil nächster initialisieren
    .on('vclick', '.ui-pagination-next', function (event) {
      event.preventDefault()
      window.em.nächsteVorigeZeit('nächste')
    })
    // Pagination Pfeiltasten initialisieren
    .on('keyup', function (event) {
      // nur reagieren, wenn hProjektEdit sichtbar und Fokus nicht in einem Feld
      if (!$(event.target).is('input, textarea, select, button') && $('#hZeitEdit').is(':visible')) {
        if (event.keyCode === $.mobile.keyCode.LEFT) {
          // Left arrow
          window.em.nächsteVorigeZeit('vorige')
          event.preventDefault()
        } else if (event.keyCode === $.mobile.keyCode.RIGHT) {
          // Right arrow
          window.em.nächsteVorigeZeit('nächste')
          event.preventDefault()
        }
      }
    })

  $('#ZeitEditPageFooter')
    // Neue Zeit erstellen
    .on('click', '#NeueZeitZeitEdit', function (event) {
      event.preventDefault()
      window.em.handleZeitEditNeuClick()
    })
    // sichtbare Felder wählen
    .on('click', '#waehleFelderZeitEdit', function (event) {
      event.preventDefault()
      window.em.handleZeitEditWähleFelderClick()
    })
    // Code für den Zeit-Löschen-Dialog
    .on('click', '#LoescheZeitZeitEdit', function (event) {
      event.preventDefault()
      window.em.handleZeitEditLöscheClick()
    })

  $('#hze_löschen_meldung')
    .on('click', '#hze_löschen_meldung_ja_loeschen', window.em.handleZeitEditLöschenMeldungJaClick)

  $('#MenuZeitEdit')
    .on('click', '.menu_einfacher_modus', window.em.handleZeitEditMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleZeitEditMenuFelderVerwaltenClick)
    .on('click', '.menu_zeiten_exportieren', window.em.handleZeitEditMenuExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleZeitEditMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

window.em.handleZeitEditÖffneOrtClick = function () {
  'use strict'
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  $.mobile.navigate('hOrtEdit.html')
}

window.em.handleZeitEditÖffneRaumClick = function () {
  'use strict'
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  $.mobile.navigate('hRaumEdit.html')
}

window.em.handleZeitEditÖffneProjektClick = function () {
  'use strict'
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

window.em.handleZeitEditSpeichernAnhangChange = function () {
  'use strict'
  var _attachments = $('#_attachmentshZE').val()
  if (_attachments && _attachments.length > 0) {
    window.em.speichereAnhänge(window.localStorage.ZeitId, window.em.hZeit, 'hZE')
  }
}

window.em.handleZeitEditNeuClick = function () {
  'use strict'
  // Globale Variablen für ZeitListe zurücksetzen, damit die Liste neu aufgebaut wird
  window.em.leereStorageZeitListe()
  window.em.erstelleNeueZeit()
}

window.em.handleZeitEditWähleFelderClick = function () {
  'use strict'
  window.localStorage.AufrufendeSeiteFW = 'hZeitEdit'
  $.mobile.navigate('FelderWaehlen.html')
}

window.em.handleZeitEditLöscheClick = function () {
  'use strict'
  // Anzahl Zeiten von Ort zählen
  var $db = $.couch.db('evab')
  $db.view('evab/hArtIdVonZeit?startkey=["' + window.localStorage.ZeitId + '"]&endkey=["' + window.localStorage.ZeitId + '",{},{}]', {
    success: function (Arten) {
      var anzArten = Arten.rows.length,
        $hze_löschen_meldung = $('#hze_löschen_meldung'),
        arten_text = (anzArten === 1 ? ' Art' : ' Arten'),
        meldung = 'Zeit inklusive ' + anzArten + arten_text + ' löschen?'
      $('#hze_löschen_meldung_meldung').html(meldung)
      // Listen anhängen, damit ohne DB-Abfrage gelöscht werden kann
      $hze_löschen_meldung.data('Arten', Arten)
      // popup öffnen
      $hze_löschen_meldung.popup('open')
    }
  })
}

window.em.handleZeitEditLöschenMeldungJaClick = function () {
  'use strict'
  var $hze_löschen_meldung = $('#hze_löschen_meldung')[0]
  window.em.löscheZeit($.data($hze_löschen_meldung, 'Arten'))
}

window.em.handleZeitEditContentSwipeleft = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsteVorigeZeit('nächste')
  }
}

window.em.handleZeitEditContentSwiperight = function () {
  'use strict'
  if (!$('*:focus').attr('aria-valuenow')) {
    // kein slider
    window.em.nächsteVorigeZeit('vorige')
  }
}

window.em.handleZeitEditMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageZeitEdit()
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  $.mobile.navigate('BeobListe.html')
}

window.em.handleZeitEditMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hZeitEdit.html'
  $.mobile.navigate('FeldListe.html')
}

window.em.handleZeitEditMenuExportierenClick = function () {
  'use strict'
  window.open('_list/ExportZeit/ExportZeit?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuZeitEdit')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

window.em.handleZeitEditMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hZeitEdit.html'
  window.em.öffneMeineEinstellungen()
}

window.em.löscheZeit = function (Arten) {
  'use strict'
  // nur löschen, wo Datensätze vorkommen
  if (Arten.rows.length > 0) {
    window.em.loescheIdIdRevListe(Arten)
  }
  // dann die Zeit
  if (window.em.hZeit) {
    // Objekt nutzen
    window.em.löscheZeit_2()
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.ZeitId, {
      success: function (data) {
        window.em.hZeit = data
        window.em.löscheZeit_2()
      },
      error: function () {
        window.em.melde('Fehler: Zeit nicht gelöscht')
      }
    })
  }
}

window.em.löscheZeit_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.hZeit, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.ZeitListe) {
        window.em.ZeitListe.rows = _.reject(window.em.ZeitListe.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine ZeitListe mehr. Storage löschen
        window.em.leereStorageZeitListe()
      }
      window.em.leereStorageZeitEdit()
      $.mobile.navigate('hZeitListe.html')
    },
    error: function () {
      window.em.melde('Fehler: Zeit nicht gelöscht')
    }
  })
}

window.em.validierehZeitEdit = function () {
  'use strict'
  if (!$("[name='zDatum']").val()) {
    window.em.melde('Bitte Datum erfassen')
    setTimeout(function () {
      $("[name='zDatum']").focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  if (!$("[name='zUhrzeit']").val()) {
    window.em.melde('Bitte Zeit erfassen')
    setTimeout(function () {
      $("[name='zUhrzeit']").focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  return true
}

// speichert nach jedem change event in einem Feld mit Class speichern
// den Wert in die DB
// erwartet das Feld als Objekt
window.em.speichereHZeitEdit = function () {
  'use strict'
  var that = this
  // prüfen, ob die Zeit als Objekt vorliegt
  if (window.em.hZeit) {
    // dieses verwenden
    window.em.speichereHZeitEdit_2(that)
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.ZeitId, {
      success: function (data) {
        window.em.hZeit = data
        window.em.speichereHZeitEdit_2(that)
      },
      error: function () {
        console.log('Fehler in function speichereHZeitEdit(that)')
      // window.em.melde("Fehler: Änderung in " + Feldname + " nicht gespeichert")
      }
    })
  }

}

window.em.speichereHZeitEdit_2 = function (that) {
  'use strict'
  var FeldnameDb,
    Feldwert,
    feldinfos
  // Feldname und -wert ermitteln
  feldinfos = window.em.holeFeldInfosVonElement(that)
  FeldnameDb = feldinfos.feldname_db
  Feldwert = feldinfos.feldwert
  if (window.em.validierehZeitEdit()) {
    if (FeldnameDb === 'zDatum' || FeldnameDb === 'zUhrzeit') {
      // Variablen für ZeitListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
      window.em.leereStorageZeitListe()
    }
    // Werte aus dem Formular aktualisieren
    if (Feldwert) {
      if (window.em.myTypeOf(Feldwert) === 'float') {
        window.em.hZeit[FeldnameDb] = parseFloat(Feldwert)
      } else if (window.em.myTypeOf(Feldwert) === 'integer') {
        window.em.hZeit[FeldnameDb] = parseInt(Feldwert, 10)
      } else {
        window.em.hZeit[FeldnameDb] = Feldwert
      }
    } else if (window.em.hZeit[FeldnameDb]) {
      delete window.em.hZeit[FeldnameDb]
    }
    // alles speichern
    var $db = $.couch.db('evab')
    $db.saveDoc(window.em.hZeit, {
      success: function (data) {
        window.em.hZeit._rev = data.rev
        // window.ZuletztGespeicherteZeitId wird benutzt, damit auch nach einem
        // Datensatzwechsel die Listen nicht (immer) aus der DB geholt werden müssen
        // Zuletzt gespeicherte ZeitId NACH dem speichern setzen
        // sicherstellen, dass bis dahin nicht schon eine nächste vewendet wird
        // darum zwischenspeichern
        window.em.ZeitIdZwischenspeicher = window.localStorage.ZeitId
        // setTimeout("window.ZuletztGespeicherteZeitId = window.em.ZeitIdZwischenspeicher", 1000)  AUSGESCHALTET, DA ZuletztGespeicherteZeitId NIRGENDS BENUTZT
        setTimeout('delete window.em.ZeitIdZwischenspeicher', 1500)
        // nicht aktualisierte hierarchisch tiefere Listen löschen
        delete window.em.ArtenVonProjekt
        delete window.em.ArtenVonRaum
        delete window.em.ArtenVonOrt
      },
      error: function () {
        console.log('Fehler in function speichereHZeitEdit_2(that)')
      // window.em.melde("Fehler: Änderung in " + FeldnameDb + " nicht gespeichert")
      }
    })
  }
}

// Öffnet die vorige oder nächste Zeit
// vorige der ersten => ZeitListe
// nächste der letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
window.em.nächsteVorigeZeit = function (NächsteOderVorige) {
  'use strict'
  // prüfen, ob ZeitListe schon existiert
  // nur abfragen, wenn sie noch nicht existiert
  if (window.em.ZeitListe) {
    window.em.nächsteVorigeZeit_2(NächsteOderVorige)
  } else {
    var $db = $.couch.db('evab')
    $db.view('evab/hZeitListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.OrtId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.OrtId + '" ,{}]&include_docs=true', {
      success: function (data) {
        window.em.ZeitListe = data
        window.em.nächsteVorigeZeit_2(NächsteOderVorige)
      }
    })
  }
}

window.em.nächsteVorigeZeit_2 = function (NächsteOderVorige) {
  'use strict'
  var i,
    ZeitIdAktuell,
    AnzZeit
  for (i = 0; window.em.ZeitListe.rows.length; i++) {
    ZeitIdAktuell = window.em.ZeitListe.rows[i].doc._id
    AnzZeit = window.em.ZeitListe.rows.length - 1  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (ZeitIdAktuell === window.localStorage.ZeitId) {
      switch (NächsteOderVorige) {
        case 'nächste':
          if (i < AnzZeit) {
            window.localStorage.ZeitId = window.em.ZeitListe.rows[i + 1].doc._id
            window.em.leereStorageZeitEdit('ohneId')
            window.em.initiiereZeitEdit()
            return
          } else {
            window.em.melde('Das ist die letzte Zeit')
            return
          }
          break
        case 'vorige':
          if (i > 0) {
            window.localStorage.ZeitId = window.em.ZeitListe.rows[i - 1].doc._id
            window.em.leereStorageZeitEdit('ohneId')
            window.em.initiiereZeitEdit()
            return
          } else {
            window.em.leereStorageZeitEdit()
            $.mobile.navigate('hZeitListe.html')
            return
          }
          break
      }
    }
  }
}

window.em.handleZeitListePageshow = function () {
  'use strict'
  // Sollte keine id vorliegen, zu hProjektListe.html wechseln
  // das kommt im Normalfall nur vor, wenn der Cache des Browsers geleert wurde
  // oder in der Zwischenzeit auf einem anderen Browser dieser Datensatz gelöscht wurde
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.OrtId || window.localStorage.OrtId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }
  window.em.initiiereZeitListe()
}

window.em.handleZeitListePageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
    return
  } else if (!window.localStorage.OrtId || window.localStorage.OrtId === 'undefined') {
    window.em.leereAlleVariabeln('ohneClear')
    $.mobile.navigate('hProjektListe.html')
    return
  }

  $(document)
    // inaktive tabs inaktivieren
    // BEZUG AUF DOCUMENT, WEIL ES MIT BEZUG AUF hZeitListePageHeader NICHT FUNKTIONIERTE!!!???
    .on('click', '.tab_inaktiv', function (event) {
      event.preventDefault()
      event.stopPropagation()
    })

  $('#hZeitListePageHeader')
    // Link zu Raum in Navbar und Titelleiste
    .on('click', "[name='OeffneOrtZeitListe']", function (event) {
      event.preventDefault()
      window.em.handleZeitListeÖffneOrtClick()
    })
    .on('click', '#OeffneRaumZeitListe', function (event) {
      event.preventDefault()
      window.em.handleZeitListeÖffneRaumClick()
    })
    .on('click', '#OeffneProjektZeitListe', function (event) {
      event.preventDefault()
      window.em.handleZeitListeÖffneProjektClick()
    })

  $('#hZeitListe')
    // Neue Zeit erstellen, erste Zeit und fixer button
    .on('click', '.NeueZeitZeitListe', function (event) {
      event.preventDefault()
      window.em.erstelleNeueZeit()
    })
    .on('swiperight', window.em.handleZeitListeSwiperight)

  $('#ZeitlistehZL')
    .on('swipeleft', '.Zeit', window.em.handleZeitListeSwipeleftZeit)
    .on('click', '.Zeit', function (event) {
      event.preventDefault()
      window.em.handleZeitListeZeitClick(this)
    })
    .on('swipeleft', '.erste', window.em.erstelleNeueZeit)

  $('#MenuZeitListe')
    .on('click', '.menu_einfacher_modus', window.em.handleZeitListeMenuEinfacherModusClick)
    .on('click', '.menu_felder_verwalten', window.em.handleZeitListeMenuFelderVerwaltenClick)
    .on('click', '.menu_zeiten_exportieren', window.em.handleZeitListeMenuZeitenExportierenClick)
    .on('click', '.menu_einstellungen', window.em.handleZeitListeMenuEinstellungenClick)
    .on('click', '.menu_neu_anmelden', window.em.meldeNeuAn)
    .on('click', '.menu_artengruppen_importieren', window.em.öffneArtengruppenImportieren)
    .on('click', '.menu_admin', window.em.öffneAdmin)
}

window.em.handleZeitListeÖffneOrtClick = function () {
  'use strict'
  window.em.leereStorageZeitListe()
  $.mobile.navigate('hOrtEdit.html')
}

window.em.handleZeitListeÖffneRaumClick = function () {
  'use strict'
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  $.mobile.navigate('hRaumEdit.html')
}

window.em.handleZeitListeÖffneProjektClick = function () {
  'use strict'
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  $.mobile.navigate('hProjektEdit.html')
}

window.em.handleZeitListeSwipeleftZeit = function () {
  'use strict'
  window.localStorage.ZeitId = $(this).attr('ZeitId')
  $.mobile.navigate('hArtListe.html')
}

window.em.handleZeitListeZeitClick = function (that) {
  'use strict'
  window.localStorage.ZeitId = $(that).attr('ZeitId')
  $.mobile.navigate('hZeitEdit.html')
}

window.em.handleZeitListeSwiperight = function () {
  'use strict'
  $.mobile.navigate('hOrtListe.html')
}

window.em.handleZeitListeMenuEinfacherModusClick = function () {
  'use strict'
  window.em.leereStorageZeitListe()
  window.em.leereStorageOrtEdit()
  window.em.leereStorageOrtListe()
  window.em.leereStorageRaumEdit()
  window.em.leereStorageRaumListe()
  window.em.leereStorageProjektEdit()
  window.em.leereStorageOrtListe()
  $.mobile.navigate('BeobListe.html')
}

window.em.handleZeitListeMenuFelderVerwaltenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hZeitListe.html'
  $.mobile.navigate('FeldListe.html')
}

window.em.handleZeitListeMenuZeitenExportierenClick = function () {
  'use strict'
  window.open('_list/ExportZeit/ExportZeit?startkey=["' + window.localStorage.Email + '"]&endkey=["' + window.localStorage.Email + '",{},{}]&include_docs=true')
  $('#MenuZeitListe')
    // völlig unlogisch: das bereits offene popup muss zuerst initialisiert werden...
    .popup()
    // ...bevor es geschlossen werden muss, weil es sonst offen bleibt
    .popup('close')
}

window.em.handleZeitListeMenuEinstellungenClick = function () {
  'use strict'
  window.localStorage.zurueck = 'hZeitListe.html'
  window.em.öffneMeineEinstellungen()
}

window.em.handleIndexPageshow = function () {
  'use strict'
  // Wenn möglich window.localStorage.Email für die Anmeldung verwenden
  // ausser User hat via Menü bewusst neu anmelden wollen
  // window.localStorage muss bei Neuanmeldung geleert werden, sonst werden die Beobachtungen des alten Users gezeigt
  if (window.localStorage.length > 0) {
    if (window.localStorage.Email) {
      if (window.localStorage.UserStatus !== 'neu') {
        if (window.localStorage.Email && window.localStorage.Autor) {
          window.em.öffneZuletztBenutzteSeite()
          return
        } else {
          // Userdaten bereitstellen und danach die zuletzt benutzte Seite öffnen
          window.em.stelleUserDatenBereit()
          return
        }
      }
    }
  }
  // Wenn window.localStorage.UserStatus neu ist, müssen alle Variabeln entfernt werden, inkl. Username
  window.em.leereAlleVariabeln()

  if (!('autofocus' in document.createElement('input'))) {
    $('#Email').focus()
  }
}

window.em.handleIndexPageinit = function () {
  'use strict'
  $('#indexForm')
    // Reaktion auf Enter-Taste
    .on('keydown', '#Passwort', function (event) {
      if (event.keyCode === 13) {
        window.em.meldeUserAn()
        event.preventDefault()
      }
    })

  $('#indexFooter')
    .on('click', '#index_submit_button', function (event) {
      event.preventDefault()
      window.em.meldeUserAn()
    })
    .on('click', '#index_signup_button', function (event) {
      'use strict'
      var email = $('#Email').val(),
        passwort = $('#Passwort').val()
      if (email) {
        window.sessionStorage.prov_email = email
      }
      if (passwort) {
        window.sessionStorage.prov_passwort = passwort
      }
      event.preventDefault()
      $.mobile.navigate('Signup.html')
    })
}

window.em.validiereUserIndex = function () {
  'use strict'
  var Email = $('input[name=Email]').val(),
    Passwort = $('input[name=Passwort]').val()
  if (!Email) {
    setTimeout(function () {
      $('#Email').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    window.em.melde('Bitte Benutzernamen eingeben')
    return false
  } else if (!Passwort) {
    setTimeout(function () {
      $('#Passwort').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    window.em.melde('Bitte Passwort eingeben')
    return false
  }
  return true
}

window.em.meldeUserAn = function () {
  'use strict'
  var Email = $('input[name=Email]').val(),
    Passwort = $('input[name=Passwort]').val()
  // sicherstellen, dass die window.localStorage leer ist
  window.em.leereAlleVariabeln()
  if (window.em.validiereUserIndex) {
    $.couch.login({
      name: Email,
      password: Passwort,
      success: function (r) {
        window.localStorage.Email = Email
        if (r.roles.indexOf('_admin') !== -1) {
          // das ist ein admin
          console.log('hallo admin')
          window.localStorage.admin = true
        } else {
          delete window.localStorage.admin
        }
        window.em.blendeMenus()
        // Userdaten bereitstellen und an die zuletzt benutzte Seite weiterleiten
        window.em.stelleUserDatenBereit()
        delete window.localStorage.UserStatus
      },
      error: function () {
        window.em.melde('Anmeldung gescheitert.<br>Sie müssen ev. ein Konto erstellen?')
      }
    })
  }
}

window.em.blendeMenus = function () {
  'use strict'
  if (window.localStorage.admin) {
    $('.popup')
      .find('.admin')
      .show()
  } else {
    $('.popup')
      .find('.admin')
      .hide()
  }
}

window.em.handleKartePageshow = function () {
  'use strict'
  // Karten müssen in pageshow erstellt werden, weil sie sonst in Chrome nicht erscheinen
  var viewname
  // In diesem Array werden alle Marker gespeichert, damit sie gelöscht werden können
  // wird benutzt von: hOrtEdit.html, BeobEdit.html
  window.em.markersArray = []
  window.em.InfoWindowArray = []

  // sicherstellen, dass window.localStorage.zurueck existiert (gibt sonst später Fehler)
  if (!window.localStorage.zurueck) {
    $.mobile.navigate('BeobListe.html')
  }

  // Je nachdem, welche Seite die Karte aufruft, muss unterschiedlich vorgegangen werden
  switch (window.localStorage.zurueck) {
    case 'hProjektListe':
      viewname = 'evab/hProjektlisteOrteFuerKarte?key="' + window.localStorage.Email + '"&include_docs=true'
      window.em.KeinOrtMeldung = 'Es gibt keine Orte mit Koordinaten'
      window.em.erstelleKarteH(viewname)
      break
    case 'hProjektEdit':  // gleich wie hRaumListe
    case 'hRaumListe':
      viewname = 'evab/hProjektOrteFuerKarte?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.ProjektId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.ProjektId + '" ,{}]&include_docs=true'
      window.em.KeinOrtMeldung = 'Es gibt keine Orte mit Koordinaten'
      window.em.erstelleKarteH(viewname)
      break
    case 'hRaumEdit': // gleich wie hOrtListe
    case 'hOrtListe':
      viewname = 'evab/hRaumOrteFuerKarte?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.RaumId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.RaumId + '" ,{}]&include_docs=true'
      window.em.KeinOrtMeldung = 'Es gibt keine Orte mit Koordinaten'
      window.em.erstelleKarteH(viewname)
      break
    case 'hOrtEdit':
      window.localStorage.OrtOderBeob = 'Ort'
      window.em.erstelleKartehOrtEdit()
      break
    case 'BeobListe':
      window.em.erstelleKarteBeobListe()
      break
    case 'BeobEdit':
      window.em.erstelleKarteBeobEdit()
      break
  }
}

window.em.handleKartePageinit = function () {
  'use strict'
  $('#KarteHeader')
    // zurück-Button steuern
    .on('click', '#ZurueckKarte', function (event) {
      event.preventDefault()
      window.em.handleKarteZurückClick()
    })
}

window.em.handleKartePagehide = function () {
  'use strict'
  // leeren, damit bei erneuten Öffnen die Karte nicht zweimal aufgebaut wird
  $('#MapCanvas').html('')
}

window.em.handleKarteZurückClick = function () {
  'use strict'
  var zurueck
  if (window.localStorage.zurueck) {
    zurueck = window.localStorage.zurueck + '.html'
  } else {
    zurueck = 'BeobListe.html'
  }
  $.mobile.navigate(zurueck)
  delete window.localStorage.zurueck
}

// erstellt Karten für hProjektListe bis hOrtListe
// im ersten Teil wird die Liste aller Orte erstellt und an den zweiten Teil übergeben
window.em.erstelleKarteH = function (viewname) {
  'use strict'

  // Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
  var contentHeight = $(window).height() - 44,
    hOrtLatLngListe

  $('#MapCanvas').css('height', contentHeight + 'px')
  // zuständige hOrtLatLngListe ermitteln
  switch (window.localStorage.zurueck) {
    case 'hProjektListe':
      hOrtLatLngListe = 'hOrteLatLngProjektliste'
      break
    case 'hProjektEdit':
    case 'hRaumListe':
      hOrtLatLngListe = 'hOrteLatLngProjekt'
      break
    case 'hRaumEdit':
    case 'hOrtListe':
      hOrtLatLngListe = 'hOrteLatLngRaum'
      break
  }

  // Liste der Orte holen. Prüfen, ob sie noch als Variable vorliegt
  if (window.em[hOrtLatLngListe]) {
    window.em.erstelleKarteH_2(window.em[hOrtLatLngListe])
  } else {
    var $db = $.couch.db('evab')
    $db.view(viewname, {
      success: function (data) {
        window.em[hOrtLatLngListe] = data
        window.em.erstelleKarteH_2(data)
      }
    })
  }
}

// alle benötigten Projekte holen
window.em.erstelleKarteH_2 = function (hOrteLatLng) {
  'use strict'
  if (!window.em.hProjekt && !window.em.hProjektListe) {
    var $db = $.couch.db('evab')
    $db.view('evab/hProjListe?include_docs=true', {
      success: function (data) {
        window.em.hProjektListe = data
        window.em.erstelleKarteH_3(hOrteLatLng, data)
      }
    })
  } else {
    window.em.erstelleKarteH_3(hOrteLatLng, window.em.hProjektListe)
  }
}

// alle benötigten Räume holen
window.em.erstelleKarteH_3 = function (hOrteLatLng, hProjektListe) {
  'use strict'
  if (!window.em.hRaum && !window.em.hRaumListe) {
    var $db = $.couch.db('evab')
    $db.view('evab/hRaumListe?include_docs=true', {
      success: function (data) {
        // window.em.hRaumListe nicht aktualisieren
        window.em.erstelleKarteH_4(hOrteLatLng, hProjektListe, data)
      }
    })
  } else {
    window.em.erstelleKarteH_4(hOrteLatLng, hProjektListe, window.em.hRaumListe)
  }
}

window.em.erstelleKarteH_4 = function (hOrteLatLng, hProjektListe, hRaumListe) {
  'use strict'
  var anzOrt = 0,
    Ort,
    lat,
    lng,
    latlng_mapcenter,
    options,
    map,
    projekt_row,
    pName,
    raum_row,
    rName,
    bounds,
    markers,
    hOrtId,
    latlng_ort,
    marker,
    contentString,
    mcOptions,
    markerCluster

  // Orte zählen
  if (hOrteLatLng.rows) {
    anzOrt = hOrteLatLng.rows.length
  }

  if (anzOrt === 0) {
    // Keine Orte: Hinweis
    window.em.melde(window.em.KeinOrtMeldung)
  } else {
    // Orte vorhanden: Karte aufbauen
    // mal auf Zürich zentrieren, falls in den hOrteLatLng.rows keine Koordinaten kommen
    // auf die die Karte ausgerichtet werden kann
    lat = 47.383333
    lng = 8.533333
    latlng_mapcenter = new window.google.maps.LatLng(lat, lng)
    options = {
      zoom: 15,
      center: latlng_mapcenter,
      streetViewControl: false,
      mapTypeId: window.google.maps.MapTypeId.HYBRID
    }
    map = new window.google.maps.Map(document.getElementById('MapCanvas'), options)
    // google.maps.event.trigger(map,'resize')
    bounds = new window.google.maps.LatLngBounds()
    // für alle Orte Marker erstellen
    markers = []

    _.each(hOrteLatLng.rows, function (row) {
      Ort = row.doc
      hOrtId = Ort._id

      // Infos für Infowindow holen
      pName = ''
      rName = ''
      if (window.em.hProjekt && window.em.hProjekt.pName) {
        pName = window.em.hProjekt.pName
      } else {
        // pName aus hProjektListe holen
        projekt_row = _.find(hProjektListe.rows, function (row) {
          return row.doc._id === Ort.hProjektId
        })
        pName = projekt_row.doc.pName
      }
      if (window.em.hRaum && window.em.hRaum.rName) {
        rName = window.em.hRaum.rName
      } else {
        // rName aus hRaumListe holen
        raum_row = _.find(hRaumListe.rows, function (row) {
          return row.doc._id === Ort.hRaumId
        })
        rName = raum_row.doc.rName
      }
      latlng_ort = new window.google.maps.LatLng(Ort.oLatitudeDecDeg, Ort.oLongitudeDecDeg)
      if (anzOrt === 1) {
        // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
        latlng_mapcenter = latlng_ort
      } else {
        // Kartenausschnitt um diese Koordinate erweitern
        bounds.extend(latlng_ort)
      }
      marker = new window.MarkerWithLabel({
        map: map,
        position: latlng_ort,
        // title muss String sein
        title: Ort.oName.toString() || '',
        labelContent: Ort.oName,
        labelAnchor: new window.google.maps.Point(75, -5),
        labelClass: 'MapLabel' // the CSS class for the label
      })
      markers.push(marker)
      contentString = '<table class="kartenlegende_tabelle">'
      contentString += '<tr><td>Projekt:</td><td>' + pName + '</td></tr>'
      contentString += '<tr><td>Raum:</td><td>' + rName + '</td></tr>'
      contentString += '<tr><td>Ort:</td><td>' + Ort.oName + '</td></tr>'
      contentString += '<tr><td>Koordinaten:</td><td>' + Ort.oXKoord + '/' + Ort.oYKoord + '</td></tr>'
      contentString += "<tr><td><a href='#' onclick='window.em.öffneOrt('" + hOrtId + "')'>bearbeiten<\/a></td><td></td></tr>"
      contentString += '</table>'
      window.em.makeMapListener(map, marker, contentString)
    })
    mcOptions = {maxZoom: 17}
    markerCluster = new window.MarkerClusterer(map, markers, mcOptions)
    if (anzOrt === 1) {
      // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
      map.setCenter(latlng_mapcenter)
      map.setZoom(18)
    } else {
      // Karte auf Ausschnitt anpassen
      map.fitBounds(bounds)
    }
  }
}

window.em.makeMapListener = function (map, marker, contentString) {
  'use strict'
  var infowindow = new window.google.maps.InfoWindow()
  window.google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(contentString)
    infowindow.open(map, marker)
  })
}

// wenn nötig Ort holen
window.em.erstelleKartehOrtEdit = function () {
  'use strict'
  if (!window.em.hOrt) {
    if (window.localStorage.OrtId) {
      var $db = $.couch.db('evab')
      $db.openDoc(window.localStorage.OrtId, {
        success: function (doc) {
          window.em.hOrt = doc
          window.em.erstelleKartehOrtEdit_2(doc)
        }
      })
    } else {
      window.em.melde('Fehler: Kein Ort verfügbar')
    // return ist hier nicht nötig
    }
  } else {
    window.em.erstelleKartehOrtEdit_2(window.em.hOrt)
  }
}

// alle benötigten Projekte holen
window.em.erstelleKartehOrtEdit_2 = function (ort) {
  'use strict'
  if (!window.em.hProjekt && !window.em.hProjektListe) {
    var $db = $.couch.db('evab')
    $db.view('evab/hProjListe?include_docs=true', {
      success: function (data) {
        window.em.hProjektListe = data
        window.em.erstelleKartehOrtEdit_3(ort, data)
      }
    })
  } else {
    window.em.erstelleKartehOrtEdit_3(ort, window.em.hProjektListe)
  }
}

// alle benötigten Räume holen
window.em.erstelleKartehOrtEdit_3 = function (ort, hProjektListe) {
  'use strict'
  if (!window.em.hRaum && !window.em.hRaumListe) {
    var $db = $.couch.db('evab')
    $db.view('evab/hRaumListe?include_docs=true', {
      success: function (data) {
        // window.em.hRaumListe nicht aktualisieren
        window.em.erstelleKartehOrtEdit_4(ort, hProjektListe, data)
      }
    })
  } else {
    window.em.erstelleKartehOrtEdit_4(ort, hProjektListe, window.em.hRaumListe)
  }
}

// wird benutzt in hOrtEdit.html
window.em.erstelleKartehOrtEdit_4 = function (ort, hProjektListe, hRaumListe) {
  'use strict'
  var map,
    verorted,
    lat,
    lng,
    ZoomLevel,
    latlng_mapcenter,
    options,
    // title muss String sein
    title = '',
    projekt_row,
    pName = '',
    raum_row,
    rName = '',
    oName = '',
    marker,
    contentString,
    infowindow,
    // Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
    contentHeight = $(window).height() - 44
  // Fehlermeldung verhindern, falls kein window.em.hOrt existiert
  if (window.em.hOrt) {
    if (window.em.hOrt.oName) {
      title = window.em.hOrt.oName.toString()
      oName = window.em.hOrt.oName
    }
  }
  if (window.em.hProjekt && window.em.hProjekt.pName) {
    pName = window.em.hProjekt.pName
  } else if (window.localStorage.ProjektId) {
    // pName aus hProjektListe holen
    projekt_row = _.find(hProjektListe.rows, function (row) {
      return row.doc._id === window.localStorage.ProjektId
    })
    pName = projekt_row.doc.pName
  }
  if (window.em.hRaum && window.em.hRaum.rName) {
    rName = window.em.hRaum.rName
  } else if (window.localStorage.RaumId) {
    // rName aus hRaumListe holen
    raum_row = _.find(hRaumListe.rows, function (row) {
      return row.doc._id === window.localStorage.RaumId
    })
    rName = raum_row.doc.rName
  }
  $('#MapCanvas').css('height', contentHeight + 'px')
  if (window.localStorage.oLatitudeDecDeg && window.localStorage.oLongitudeDecDeg) {
    lat = window.localStorage.oLatitudeDecDeg
    lng = window.localStorage.oLongitudeDecDeg
    ZoomLevel = 15
    verorted = true
  } else {
    lat = 47.360566
    lng = 8.542829
    ZoomLevel = 12
    verorted = false
  }
  latlng_mapcenter = new window.google.maps.LatLng(lat, lng)
  options = {
    zoom: ZoomLevel,
    center: latlng_mapcenter,
    streetViewControl: false,
    mapTypeId: window.google.maps.MapTypeId.HYBRID
  }
  map = new window.google.maps.Map(document.getElementById('MapCanvas'), options)
  if (verorted === true) {
    marker = new window.google.maps.Marker({
      position: latlng_mapcenter,
      map: map,
      title: title,
      draggable: true
    })
    // Marker in Array speichern, damit er gelöscht werden kann
    window.em.markersArray.push(marker)
    contentString = '<table class="kartenlegende_tabelle">'
    contentString += '<tr><td>Projekt:</td><td>' + pName + '</td></tr>'
    contentString += '<tr><td>Raum:</td><td>' + rName + '</td></tr>'
    contentString += '<tr><td>Ort:</td><td>' + oName + '</td></tr>'
    contentString += '<tr><td>Koordinaten:</td><td>' + window.localStorage.oXKoord + '/' + window.localStorage.oYKoord + '</td></tr>'
    contentString += '</table>'
    infowindow = new window.google.maps.InfoWindow({
      content: contentString
    })
    window.em.InfoWindowArray.push(infowindow)
    window.google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(map, marker)
    })
    window.google.maps.event.addListener(marker, 'dragend', function (event) {
      window.em.SetLocationhOrtEdit(event.latLng, map, marker)
    })
  }
  window.google.maps.event.addListener(map, 'click', function (event) {
    window.em.placeMarkerhOrtEdit(event.latLng, map, marker)
  })
}

// wird benutzt in BeobListe.html
window.em.erstelleKarteBeobListe = function () {
  'use strict'
  // Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
  var contentHeight = $(window).height() - 44
  $('#MapCanvas').css('height', contentHeight + 'px')
  // Beobachtungen holen. Prüfen, ob die Liste noch da ist
  if (window.em.BeobListeLatLng) {
    window.em.erstelleKarteBeobListe_2()
  } else {
    var $db = $.couch.db('evab')
    $db.view('evab/BeobListeLatLng?key="' + window.localStorage.Email + '"&include_docs=true', {
      success: function (data) {
        window.em.BeobListeLatLng = data
        window.em.erstelleKarteBeobListe_2()
      }
    })
  }
}

window.em.erstelleKarteBeobListe_2 = function () {
  'use strict'
  var anzBeob = window.em.BeobListeLatLng.rows.length,
    beob,
    // image,
    lat,
    lng,
    latlng_mapcenter,
    latlng_beob,
    options,
    map,
    bounds,
    marker,
    markers,
    contentString,
    mcOptions,
    markerCluster /*,
    artgruppenname*/
  if (anzBeob === 0) {
    // Keine Beobachtungen: Hinweis und zurück
    window.em.melde('Es wurden noch keine Beobachtungen mit Koordinaten erfasst')
    $.mobile.navigate('BeobListe.html')
  } else {
    // Beobachtungen vorhanden: Karte aufbauen
    lat = 47.383333
    lng = 8.533333
    latlng_mapcenter = new window.google.maps.LatLng(lat, lng)
    options = {
      zoom: 15,
      center: latlng_mapcenter,
      streetViewControl: false,
      mapTypeId: window.google.maps.MapTypeId.HYBRID
    }
    map = new window.google.maps.Map(document.getElementById('MapCanvas'), options)
    // google.maps.event.trigger(map,'resize')
    bounds = new window.google.maps.LatLngBounds()
    // für alle Beobachtungen Marker erstellen
    markers = []
    _.each(window.em.BeobListeLatLng.rows, function (row) {
      beob = row.doc
      /*artgruppenname = encodeURIComponent(beob.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + '.png'
      if (beob.aArtGruppe === 'DiverseInsekten') {
        artgruppenname = 'unbenannt.png'
      }
      image = 'Artgruppenbilder/' + artgruppenname*/
      latlng_beob = new window.google.maps.LatLng(beob.oLatitudeDecDeg, beob.oLongitudeDecDeg)
      if (anzBeob === 1) {
        // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
        latlng_mapcenter = latlng_beob
      } else {
        // Kartenausschnitt um diese Koordinate erweitern
        bounds.extend(latlng_beob)
      }
      marker = new window.MarkerWithLabel({
        map: map,
        position: latlng_beob,
        // title muss String sein
        title: beob.aArtName.toString() || '',
        // icon: image,
        labelContent: beob.aArtName,
        labelAnchor: new window.google.maps.Point(75, -5),
        labelClass: 'MapLabel' // the CSS class for the label
      })
      markers.push(marker)
      contentString = '<h4 class="map_infowindow_title">' + beob.aArtName + '</h4>'
      contentString += '<table class="kartenlegende_tabelle">'
      contentString += '<tr><td>Art-Gruppe:</td><td>' + beob.aArtGruppe + '</td></tr>'
      if (beob.aAutor) {
        contentString += '<tr><td>Autor:</td><td>' + beob.aAutor + '</td></tr>'
      }
      contentString += '<tr><td>Datum:</td><td>' + beob.zDatum + '</td></tr>'
      contentString += '<tr><td>Zeit:</td><td>' + beob.zUhrzeit + '</td></tr>'
      contentString += '<tr><td>Koordinaten:</td><td>' + beob.oXKoord + '/' + beob.oYKoord + '</td></tr>'
      contentString += '</table>'
      window.em.makeMapListener(map, marker, contentString)
    })
    mcOptions = {maxZoom: 17}
    markerCluster = new window.MarkerClusterer(map, markers, mcOptions)
    if (anzBeob === 1) {
      // map.fitbounds setzt zu hohen zoom, wenn nur eine Beobachtung erfasst wurde > verhindern
      map.setCenter(latlng_mapcenter)
      map.setZoom(18)
    } else {
      // Karte auf Ausschnitt anpassen
      map.fitBounds(bounds)
    }
  }
}

// sicherstellen, dass window.em.Beobachtung existiert
window.em.erstelleKarteBeobEdit = function () {
  'use strict'
  if (!window.em.Beobachtung) {
    if (window.localStorage.BeobId) {
      var $db = $.couch.db('evab')
      $db.openDoc(window.localStorage.BeobId, {
        success: function (doc) {
          window.em.Beobachtung = doc
          window.em.erstelleKarteBeobEdit_2(doc)
        }
      })
    } else {
      window.em.melde('Fehler: Keine Beobachtung verfügbar')
    // return ist hier nicht nötig
    }
  } else {
    window.em.erstelleKarteBeobEdit_2(window.em.Beobachtung)
  }
}

window.em.erstelleKarteBeobEdit_2 = function (beob) {
  'use strict'
  var map,
    verorted,
    lat,
    lng,
    ZoomLevel,
    latlng_mapcenter,
    options,
    mapcanvas,
    image,
    marker,
    contentString,
    infowindow,
    // Seitenhöhe korrigieren, weil sonst GoogleMap weiss bleibt
    contentHeight = $(window).height() - 44,
    artgruppenname
  $('#MapCanvas').css('height', contentHeight + 'px')
  if (window.localStorage.oLatitudeDecDeg && window.localStorage.oLongitudeDecDeg) {
    lat = window.localStorage.oLatitudeDecDeg
    lng = window.localStorage.oLongitudeDecDeg
    ZoomLevel = 15
    verorted = true
  } else {
    lat = 47.360566
    lng = 8.542829
    ZoomLevel = 12
    verorted = false
  }
  latlng_mapcenter = new window.google.maps.LatLng(lat, lng)
  options = {
    zoom: ZoomLevel,
    center: latlng_mapcenter,
    streetViewControl: false,
    mapTypeId: window.google.maps.MapTypeId.HYBRID
  }
  mapcanvas = $('#MapCanvas')
  map = new window.google.maps.Map(mapcanvas[0], options)
  // google.maps.event.trigger(map,'resize')
  artgruppenname = encodeURIComponent(window.localStorage.aArtGruppe.replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')) + '.png'
  if (window.localStorage.aArtGruppe === 'DiverseInsekten') {
    artgruppenname = 'unbenannt.png'
  }
  image = 'Artgruppenbilder/' + artgruppenname
  if (verorted === true) {
    marker = new window.google.maps.Marker({
      position: latlng_mapcenter,
      map: map,
      // title muss String sein
      title: window.localStorage.aArtName.toString() || '',
      // icon: image,
      draggable: true
    })
    // Marker in Array speichern, damit er gelöscht werden kann
    window.em.markersArray.push(marker)
    contentString = '<h4 class="map_infowindow_title">' + window.localStorage.aArtName + '</h4>'
    contentString += '<table class="kartenlegende_tabelle">'
    contentString += '<tr><td>Art-Gruppe:</td><td>' + window.localStorage.aArtGruppe + '</td></tr>'
    if (beob.aAutor) {
      contentString += '<tr><td>Autor:</td><td>' + beob.aAutor + '</td></tr>'
    }
    contentString += '<tr><td>Datum:</td><td>' + beob.zDatum + '</td></tr>'
    contentString += '<tr><td>Zeit:</td><td>' + beob.zUhrzeit + '</td></tr>'
    contentString += '<tr><td>Koordinaten:</td><td>' + window.localStorage.oXKoord + '/' + window.localStorage.oYKoord + '</td></tr>'
    contentString += '</table>'
    infowindow = new window.google.maps.InfoWindow({
      content: contentString
    })
    window.em.InfoWindowArray.push(infowindow)
    window.google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(map, marker)
    })
    window.google.maps.event.addListener(marker, 'dragend', function (event) {
      window.em.SetLocationBeobEdit(event.latLng, map, marker)
    })
  }
  window.google.maps.event.addListener(map, 'click', function (event) {
    window.em.placeMarkerBeobEdit(event.latLng, map, marker, image)
  })
}

// wird benutzt in hOrtEdit.html
window.em.placeMarkerhOrtEdit = function (location, map, marker) {
  'use strict'
  // zuerst bisherige Marker löschen
  // window.em.clearMarkers()
  marker = new window.google.maps.Marker({
    position: location,
    map: map,
    // title muss String sein
    title: window.em.hOrt.oName.toString() || '',
    draggable: true
  })
  // Marker in Array speichern, damit er gelöscht werden kann
  // zuerst bisherige löschen, sonst gibt es pro Klick einen Marker...
  window.em.clearMarkers()
  window.em.markersArray.push(marker)
  window.google.maps.event.addListener(marker, 'dragend', function (event) {
    window.em.SetLocationhOrtEdit(event.latLng, map, marker)
  })
  window.em.SetLocationhOrtEdit(location, map, marker)
}

window.em.placeMarkerBeobEdit = function (location, map, marker, image) {
  'use strict'
  // zuerst bisherigen Marker löschen
  // window.em.clearMarkers()
  marker = new window.google.maps.Marker({
    position: location,
    map: map,
    // title muss String sein
    title: window.localStorage.aArtName.toString() || '',
    // icon: image,
    draggable: true
  })
  // Marker in Array speichern, damit er gelöscht werden kann
  // zuerst bisherige löschen, sonst gibt es pro Klick einen Marker...
  window.em.clearMarkers()
  window.em.markersArray.push(marker)
  window.google.maps.event.addListener(marker, 'dragend', function (event) {
    window.em.SetLocationBeobEdit(event.latLng, map, marker)
  })
  window.em.SetLocationBeobEdit(location, map, marker)
}

// GoogleMap: alle Marker löschen
// benutzt wo in GoogleMaps Marker gesetzt und verschoben werden
window.em.clearMarkers = function () {
  'use strict'
  _.each(window.em.markersArray, function (marker) {
    marker.setMap(null)
  })
  window.em.markersArray = []
}

// wird benutzt in hOrtEdit.html
window.em.SetLocationhOrtEdit = function (LatLng, map, marker) {
  'use strict'
  var lat = LatLng.lat(),
    lng = LatLng.lng(),
    contentString,
    infowindow,
    DdInChX = require('./util/ddInChX'),
    DdInChY = require('./util/ddInChY')
  window.localStorage.oLatitudeDecDeg = lat
  window.localStorage.oLongitudeDecDeg = lng
  window.localStorage.oXKoord = DdInChX(lat, lng)
  window.localStorage.oYKoord = DdInChY(lat, lng)
  window.localStorage.oLagegenauigkeit = 'Auf Luftbild markiert'
  window.em.clearInfoWindows()
  contentString = '<table class="kartenlegende_tabelle">'
  contentString += '<tr><td>Projekt:</td><td>' + window.em.hOrt.pName + '</td></tr>'
  contentString += '<tr><td>Raum:</td><td>' + window.em.hOrt.rName + '</td></tr>'
  contentString += '<tr><td>Ort:</td><td>' + window.em.hOrt.oName + '</td></tr>'
  contentString += '<tr><td>Koordinaten:</td><td>' + window.localStorage.oXKoord + '/' + window.localStorage.oYKoord + '</td></tr>'
  contentString += '</table>'
  infowindow = new window.google.maps.InfoWindow({
    content: contentString
  })
  window.em.InfoWindowArray.push(infowindow)
  window.google.maps.event.addListener(marker, 'click', function () {
    infowindow.open(map, marker)
  })
  window.em.speichereKoordinaten(window.localStorage.OrtId, 'hOrt')
}

// wird benutzt in BeobEdit.html
window.em.SetLocationBeobEdit = function (LatLng, map, marker) {
  'use strict'
  var lat = LatLng.lat(),
    lng = LatLng.lng(),
    contentString,
    infowindow,
    DdInChX = require('./util/ddInChX'),
    DdInChY = require('./util/ddInChY')
  window.localStorage.oLatitudeDecDeg = lat
  window.localStorage.oLongitudeDecDeg = lng
  window.localStorage.oXKoord = DdInChX(lat, lng)
  window.localStorage.oYKoord = DdInChY(lat, lng)
  window.localStorage.oLagegenauigkeit = 'Auf Luftbild markiert'
  window.em.clearInfoWindows()
  contentString = '<h4 class="map_infowindow_title">' + window.localStorage.aArtName + '</h4>'
  contentString += '<table class="kartenlegende_tabelle">'
  contentString += '<tr><td>Art-Gruppe:</td><td>' + window.localStorage.aArtGruppe + '</td></tr>'
  if (window.em.Beobachtung.aAutor) {
    contentString += '<tr><td>Autor:</td><td>' + window.em.Beobachtung.aAutor + '</td></tr>'
  }
  if (window.em.Beobachtung.zDatum) {
    contentString += '<tr><td>Datum:</td><td>' + window.em.Beobachtung.zDatum + '</td></tr>'
  }
  if (window.em.Beobachtung.zUhrzeit) {
    contentString += '<tr><td>Zeit:</td><td>' + window.em.Beobachtung.zUhrzeit + '</td></tr>'
  }
  contentString += '<tr><td>Koordinaten:</td><td>' + window.localStorage.oXKoord + '/' + window.localStorage.oYKoord + '</td></tr>'
  contentString += '</table>'
  infowindow = new window.google.maps.InfoWindow({
    content: contentString
  })
  window.em.InfoWindowArray.push(infowindow)
  window.google.maps.event.addListener(marker, 'click', function () {
    infowindow.open(map, marker)
  })
  window.em.speichereKoordinaten(window.localStorage.BeobId, 'Beobachtung')
}

// GoogleMap: alle InfoWindows löschen
// benutzt wo in GoogleMaps Infowindows neu gesetzt werden müssen, weil die Daten verändert wurden
window.em.clearInfoWindows = function () {
  'use strict'
  _.each(window.em.InfoWindowArray, function (infowindow) {
    infowindow.setMap(null)
  })
  window.em.InfoWindowArray = []
}

window.em.handleSignupPageshow = function () {
  'use strict'
  // sicherstellen, dass nichts vom letzten User übrig bleibt
  window.em.leereAlleVariabeln()
  // Datenverwendung managen: Wenn der User nichts angibt, jaAber setzen
  window.localStorage.Datenverwendung = 'JaAber'
  // wenn der Benutzer vom Login her kommt und bereits Benutzername und Passwort erfasst hat: übernehmen
  if (window.sessionStorage.prov_email) {
    $('#su_Email').val(window.sessionStorage.prov_email)
    delete window.sessionStorage.prov_email
    if (window.sessionStorage.prov_passwort) {
      $('#su_Passwort').val(window.sessionStorage.prov_passwort)
      delete window.sessionStorage.prov_passwort
      $('#su_Passwort2').focus()
    } else {
      $('#su_Passwort').focus()
    }
  }
}

window.em.handleSignupPageinit = function () {
  'use strict'
  $('#SignupForm')
    .on('change', "[name='Datenverwendung']", function () {
      window.localStorage.Datenverwendung = $(this).attr('id')
    })

  $('#SignupFooter')
    .on('click', '#SubmitButton', function (event) {
      event.preventDefault()
      window.em.handleSignupSubmitButtonClick()
    })
}

window.em.handleSignupSubmitButtonClick = function () {
  'use strict'
  if (window.em.validiereUserSignup()) {
    window.em.erstelleKonto()
  }
}

// kontrollierren, ob die erforderlichen Felder etwas enthalten
// wenn ja wird true retourniert, sonst false
window.em.validiereUserSignup = function () {
  'use strict'
  var Email = $('#su_Email').val(),
    Passwort = $('#su_Passwort').val(),
    su_Passwort2 = $('#su_Passwort2').val(),
    Autor = $('#Autor').val()
  if (!Email) {
    window.em.melde('Bitte Email eingeben')
    setTimeout(function () {
      $('#su_Email').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  } else if (!window.em.validateEmail(Email)) {
    window.em.melde('Bitte gültige Email-Adresse eingeben')
    setTimeout(function () {
      $('#su_Email').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  } else if (!Passwort) {
    window.em.melde('Bitte Passwort eingeben')
    setTimeout(function () {
      $('#su_Passwort').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  } else if (!su_Passwort2) {
    window.em.melde('Bitte Passwort bestätigen')
    setTimeout(function () {
      $('#su_Passwort2').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  } else if (Passwort !== su_Passwort2) {
    window.em.melde('Passwort ist falsch bestätigt')
    setTimeout(function () {
      $('#su_Passwort2').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  } else if (!Autor) {
    window.em.melde('Bitte Autor eingeben')
    setTimeout(function () {
      $('#Autor').focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  return true
}

window.em.erstelleKonto = function () {
  'use strict'
  // User in _user eintragen
  $.couch.signup({
    name: $('#su_Email').val(),
    Datenverwendung: window.localStorage.Datenverwendung || 'JaAber'
  }, $('#su_Passwort').val(), {
    success: function () {
      window.localStorage.Email = $('#su_Email').val()
      window.localStorage.Autor = $('#Autor').val()
      window.em.speichereAutorAlsStandardwert()
    },
    error: function () {
      window.em.melde('Fehler: Das Konto wurde nicht erstellt')
    }
  })
}

window.em.handleUserEditPageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }
  window.em.initiiereUserEdit()
}

window.em.handleUserEditPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }

  $('#UserEditHeader')
    // zurück-Button steuern
    .on('click', '#zurückUserEdit', function (event) {
      event.preventDefault()
      window.em.handleUserEditZurückClick()
    })

  $('#UserEditForm')
    // jedes Feld bei Änderung speichern
    .on('change', '.Feld', window.em.handleUserEditFeldChange)
    .on('change', "[name='Datenverwendung']", function () {
      window.localStorage.Datenverwendung = $(this).attr('id')
    })
    // Autor bei Änderung speichern
    .on('change', '#Autor', window.em.handleUserEditAutorChange)
}

window.em.handleUserEditZurückClick = function () {
  'use strict'
  // sicherstellen, dass er immer ein zurück kennt
  if (!window.localStorage.zurueck) {
    window.localStorage.zurueck = 'BeobListe.html'
  }
  if (window.localStorage.hArtSicht === 'liste' && window.localStorage.zurueck === 'hArtEdit.html') {
    $.mobile.navigate('hArtEditListe.html')
  } else {
    $.mobile.navigate(window.localStorage.zurueck)
  }
  delete window.localStorage.zurueck
}

window.em.handleUserEditFeldChange = function () {
  'use strict'
  var Feldname = this.name,
    // nötig, damit Arrays richtig kommen
    Feldjson = $("[name='" + Feldname + "']").serializeObject(),
    Feldwert = Feldjson[Feldname]
  if (window.em.validiereUserUserEdit()) {
    window.em.speichereUser(Feldname, Feldwert)
  }
}

window.em.handleUserEditAutorChange = function () {
  'use strict'
  var $Autor = $('#Autor'),
    $db = $.couch.db('evab')
  $db.openDoc('f19cd49bd7b7a150c895041a5d02acb0', {
    success: function (doc) {
      if ($Autor.val()) {
        // Wenn Autor erfasst ist, speichern
        // Falls Standardwert noch nicht existiert,
        // uss zuerst das Objekt geschaffen werden
        if (!doc.Standardwert) {
          doc.Standardwert = {}
        }
        doc.Standardwert[window.localStorage.Email] = $Autor.val()
      } else {
        // Wenn kein Autor erfasst ist, einen allfälligen löschen
        if (doc.Standardwert) {
          delete doc.Standardwert[window.localStorage.Email]
        }
      }
      $db.saveDoc(doc, {
        success: function () {
          // Feldliste soll neu aufgebaut werden
          window.em.leereStorageFeldListe()
          window.localStorage.Autor = $Autor.val()
        },
        error: function () {
          window.em.melde('Fehler: Änderung am Autor nicht gespeichert')
        }
      })
    },
    error: function () {
      window.em.melde('Fehler: Änderung am Autor nicht gespeichert')
    }
  })
}

// kontrollierren, ob die erforderlichen Felder etwas enthalten
// wenn ja wird true retourniert, sonst false
window.em.validiereUserUserEdit = function () {
  'use strict'
  var $Autor = $('#Autor')
  if (!$Autor.val()) {
    window.em.melde('Bitte Autor eingeben')
    setTimeout(function () {
      $Autor.focus()
    }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
    return false
  }
  return true
}

window.em.speichereUser = function (Feldname, Feldwert) {
  'use strict'
  if (window.localStorage.Datenverwendung) {
    $.couch.userDb(function (db) {
      db.openDoc('org.couchdb.user:' + window.localStorage.Email, {
        success: function (doc) {
          if (Feldwert) {
            doc[Feldname] = Feldwert
          } else if (doc[Feldname]) {
            delete doc[Feldname]
          }
          db.saveDoc(doc, {
            error: function () {
              console.log('Fehler in function window.em.speichereUser: Datenverwendung nicht gespeichert");')
            }
          })
        },
        error: function () {
          console.log('Fehler in function window.em.speichereUser: Datenverwendung nicht gespeichert");')
        }
      })
    })
  } else {
    // es gibt noch keine User-Doc
    // vielleicht hatte der User ein Konto bei ArtenDb erstellt und ist das erste mal in Evab
    console.log('Fehler: Datenverwendung nicht gespeichert')
  }
}

// wird in hArtEdit.html verwendet
window.em.zuArtgruppenliste = function () {
  'use strict'
  // Globale Variablen für hArtListe zurücksetzen, damit die Liste beim nächsten Aufruf neu aufgebaut wird
  // window.em.leereStoragehArtListe()
  window.localStorage.Von = 'hArtEdit'
  if (window.em.gruppe_merken) {
    // Artgruppenliste auslassen
    // window.localStorage.aArtGruppe ist schon gesetzt
    $.mobile.navigate('Artenliste.html')
  } else {
    $.mobile.navigate('Artgruppenliste.html')
  }
}

// wird in hArtEdit.html verwendet
window.em.zuArtliste = function () {
  'use strict'
  window.localStorage.Von = 'hArtEdit'
  $.mobile.navigate('Artenliste.html')
}

// Speichert alle Daten
// wird in hArtEdit.html verwendet
window.em.speichereHArt = function () {
  'use strict'
  var that = this,
    hartid
  // Achtung: in hArtEditListe kann es sein, dass window.em.hArt erst gerade aktualisiert wird und momentan nicht aktuell ist!
  // Lösung: hartid aus höher liegender tr holen und vergleichen, ob window.em.hArt dieselbe id hat
  if ($('body').pagecontainer('getActivePage').attr('id') === 'hArtEditListe') {
    hartid = $(that).closest('tr').attr('hartid')
    window.localStorage.hArtId = hartid
  }
  // prüfen, ob hArt als Objekt vorliegt
  if ((window.em.hArt && !hartid) || (window.em.hArt && hartid === window.em.hArt._id)) {
    // dieses verwenden
    window.em.speichereHArt_2(that)
  } else {
    // Objekt aud DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.hArtId, {
      success: function (data) {
        window.em.hArt = data
        window.em.speichereHArt_2(that)
        window.localStorage.aArtId = window.em.hArt.aArtId
        window.localStorage.aArtName = window.em.hArt.aArtName
        window.localStorage.aArtGruppe = window.em.hArt.aArtGruppe
      },
      error: function () {
        console.log('Fehler in function speichereHArt')
      }
    })
  }
}

window.em.speichereHArt_2 = function (that) {
  'use strict'
  var FeldnameDb,
    Feldwert,
    feldinfos
  // Feldname und -wert ermitteln
  feldinfos = window.em.holeFeldInfosVonElement(that)
  FeldnameDb = feldinfos.feldname_db
  Feldwert = feldinfos.feldwert
  // window.em.hArt aktualisieren
  if (Feldwert) {
    if (window.em.myTypeOf(Feldwert) === 'float') {
      window.em.hArt[FeldnameDb] = parseFloat(Feldwert)
    } else if (window.em.myTypeOf(Feldwert) === 'integer') {
      window.em.hArt[FeldnameDb] = parseInt(Feldwert, 10)
    } else {
      window.em.hArt[FeldnameDb] = Feldwert
    }
  } else if (window.em.hArt[FeldnameDb]) {
    delete window.em.hArt[FeldnameDb]
  }
  // Werte aktualisieren, die nicht durch .speichern erfasst werden
  window.em.hArt.aArtId = window.localStorage.aArtId
  window.em.hArt.aArtName = window.localStorage.aArtName
  window.em.hArt.aArtGruppe = window.localStorage.aArtGruppe
  // Datenbank aktualisieren
  var $db = $.couch.db('evab')
  $db.saveDoc(window.em.hArt, {
    success: function (data) {
      window.em.hArt._rev = data.rev
      window.localStorage.hArtId = data.id
    },
    error: function () {
      console.log('Fehler in function speichereHArt_2')
    }
  })
}

window.em.holeFeldInfosVonElement = function (that) {
  'use strict'
  var feldinfos = {},
    feldjson
  // Feldname und -wert ermitteln
  if (window.em.myTypeOf($(that).attr('aria-valuenow')) !== 'string') {
    // slider
    feldinfos.feldname_dom = feldinfos.feldname_db = $(that).attr('aria-labelledby').slice(0, ($(that).attr('aria-labelledby').length - 6))
    feldinfos.feldwert = $(that).attr('aria-valuenow')
  } else {
    // alle anderen Feldtypen
    if (that.type === 'radio') {
      // in hArtEditListe zeigen radios ihre Werte nur an, wenn die radios desselben Felds unterschiedliche Namen haben
      // darum wird _ und eine id hintangestellt
      feldinfos.feldname_dom = that.name
      feldinfos.feldname_db = that.name.substring(0, that.name.lastIndexOf('_'))
    } else {
      feldinfos.feldname_db = feldinfos.feldname_dom = that.name
    }
    // nötig, damit Arrays richtig kommen
    // if ($("body").pagecontainer("getActivePage").attr("id") === "hArtEditListe") { // Funktioniert nicht, weil z.B. ein select ein eigenes Fenster öffnet!
    if (window.localStorage.hArtId && window.localStorage.hArtSicht === 'liste') {
      // hier gibt es pro Tabellenzeile ein Feld mit diesem Namen!
      if (['checkbox'].indexOf(that.type) >= 0) {
        feldjson = $(that).parents('fieldset').serializeObject()
      } else {
        feldjson = $(that).serializeObject()
      }
    } else {
      feldjson = $("[name='" + feldinfos.feldname_dom + "']").serializeObject()
    }
    feldinfos.feldwert = feldjson[feldinfos.feldname_dom]
  }
  return feldinfos
}

// Öffnet die vorige oder nächste Art
// vorige der ersten => ArtListe
// nächste der letzten => melden
// erwartet die ID des aktuellen Datensatzes und ob nächster oder voriger gesucht wird
// wird in hArtEdit.html verwendet
window.em.nächsteVorigeArt = function (NächsteOderVorige) {
  'use strict'
  // prüfen, ob hArtListe schon existiert
  // nur abfragen, wenn sie noch nicht existiert
  if (window.em.hArtListe) {
    // hArtListe liegt als Variable vor
    window.em.nächsteVorigeArt_2(NächsteOderVorige)
  } else {
    // keine Ortliste vorhanden, neu aus DB erstellen
    var $db = $.couch.db('evab')
    $db.view('evab/hArtListe?startkey=["' + window.localStorage.Email + '", "' + window.localStorage.ZeitId + '"]&endkey=["' + window.localStorage.Email + '", "' + window.localStorage.ZeitId + '" ,{}]&include_docs=true', {
      success: function (data) {
        // Liste bereitstellen, um Datenbankzugriffe zu reduzieren
        window.em.hArtListe = data
        window.em.nächsteVorigeArt_2(NächsteOderVorige)
      }
    })
  }
}

window.em.nächsteVorigeArt_2 = function (NächsteOderVorige) {
  'use strict'
  var i,
    ArtIdAktuell,
    AnzArt
  for (i = 0; window.em.hArtListe.rows.length; i++) {
    ArtIdAktuell = window.em.hArtListe.rows[i].doc._id
    AnzArt = window.em.hArtListe.rows.length - 1  // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (ArtIdAktuell === window.localStorage.hArtId) {
      switch (NächsteOderVorige) {
        case 'nächste':
          if (i < AnzArt) {
            window.localStorage.hArtId = window.em.hArtListe.rows[i + 1].doc._id
            window.em.leereStoragehArtEdit('ohneId')
            window.em.initiierehArtEdit()
            return
          } else {
            window.em.melde('Das ist die letzte Art')
            return
          }
          break
        case 'vorige':
          if (i > 0) {
            window.localStorage.hArtId = window.em.hArtListe.rows[i - 1].doc._id
            window.em.leereStoragehArtEdit('ohneId')
            window.em.initiierehArtEdit()
            return
          } else {
            window.em.leereStoragehArtEdit()
            $.mobile.navigate('hArtListe.html')
            return
          }
          break
      }
    }
  }
}

// wird in hArtEdit.html benutzt
// löscht eine Beobachtung
window.em.löscheHArt = function () {
  'use strict'
  if (window.em.hArt) {
    // vorhandenes Objekt nutzen
    window.em.löscheHArt_2()
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.hArtId, {
      success: function (data) {
        window.em.hArt = data
        window.em.löscheHArt_2()
      },
      error: function () {
        window.em.melde('Fehler: Art nicht gelöscht')
      }
    })
  }
}

window.em.löscheHArt_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.hArt, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.hArtListe) {
        window.em.hArtListe.rows = _.reject(window.em.hArtListe.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine Beobliste mehr. Storage löschen
        window.em.leereStoragehArtListe()
      }
      window.em.leereStoragehArtEdit()
      $.mobile.navigate('hArtListe.html')
    },
    error: function () {
      window.em.melde('Fehler: Art nicht gelöscht')
    }
  })
}

// prüft neue oder umbenannte Feldnamen
// prüft, ob der neue Feldname schon existiert
// wenn ja: melden, zurückstellen
// wenn nein: speichern
// wird in FeldEdit.html verwendet
window.em.prüfeFeldNamen = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.view('evab/FeldNamen?key="' + window.localStorage.FeldWert + '"&include_docs=true', {
    success: function (data) {
      var tempFeld,
        AnzEigeneOderOffizielleFelderMitSelbemNamen = 0
      // durch alle Felder mit demselben Artnamen laufen
      // prüfen, ob sie eigene oder offielle sind
      if (data.rows) {
        _.each(data.rows, function (row) {
          if (row.doc) {
            tempFeld = row.doc
            // ist es ein eigenes oder ein offizielles?
            if (tempFeld.User === window.localStorage.Email || tempFeld.User === 'ZentrenBdKt') {
              // ja > dieser Name ist nicht zulässig
              AnzEigeneOderOffizielleFelderMitSelbemNamen++
            }
          }
        })
      }
      if (AnzEigeneOderOffizielleFelderMitSelbemNamen === 0) {
        // Feldname ist neu, somit zulässig > speichern
        // und alten FeldNamen aus der Liste der anzuzeigenden Felder entfernen
        $('#SichtbarImModusHierarchisch')
          .val('ja')
          .parent().addClass('ui-flipswitch-active')
        window.em.speichereFeldeigenschaften()
      } else {
        // Feldname kommt bei diesem User schon vor
        // Wert im Feld zurücksetzen
        if (window.localStorage.AlterFeldWert && window.localStorage.AlterFeldWert !== undefined) {
          $('#FeldName').val(window.localStorage.AlterFeldWert)
        } else {
          $('#FeldName').val('')
        }
        setTimeout(function () {
          $('#FeldName').focus()
        }, 50)  // need to use a timer so that .blur() can finish before you do .focus()
        window.em.melde('Feldname ' + window.localStorage.FeldWert + ' existiert schon<br>Wählen Sie einen anderen')
        delete window.localStorage.FeldName
        delete window.localStorage.FeldWert
        delete window.localStorage.AlterFeldWert
      }
    },
    error: function () {
      // Wert im Feld zurücksetzen
      if (window.localStorage.AlterFeldWert) {
        $('#FeldName').val(window.localStorage.AlterFeldWert)
      } else {
        $('#FeldName').val('')
      }
      window.em.melde('Fehler: Änderung in ' + window.localStorage.FeldName + ' nicht gespeichert')
      delete window.localStorage.FeldName
      delete window.localStorage.FeldWert
      delete window.localStorage.AlterFeldWert
    }
  })
}

// löscht Felder
// wird in FeldEdit.html verwendet
window.em.löscheFeld = function () {
  'use strict'
  if (window.em.Feld) {
    // Objekt nutzen
    window.em.löscheFeld_2()
  } else {
    // Feld aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.em.Feld._id, {
      success: function (data) {
        window.em.Feld = data
        window.em.löscheFeld_2()
      },
      error: function () {
        window.em.melde('Fehler: nicht gelöscht')
      }
    })
  }
}

window.em.löscheFeld_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.Feld, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.Feldliste) {
        window.em.Feldliste.rows = _.reject(window.em.Feldliste.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine Feldliste mehr. Storage löschen
        window.em.leereStorageFeldListe()
      }
      window.em.leereStorageFeldEdit()
      $.mobile.navigate('FeldListe.html')
    },
    error: function () {
      window.em.melde('Fehler: nicht gelöscht')
    }
  })
}

// Öffnet das nächste Feld
// nächstes des letzten => melden
// erwartet die ID des aktuellen Datensatzes
// wird in FeldEdit.html verwendet
window.em.geheZumNächstenFeld = function () {
  'use strict'
  if (window.em.Feldliste) {
    // Feldliste aus globaler Variable verwenden - muss nicht geparst werden
    window.em.geheZumNächstenFeld_2()
  } else {
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListe?include_docs=true', {
      success: function (data) {
        window.em.Feldliste = data
        window.em.geheZumNächstenFeld_2()
      }
    })
  }
}

window.em.geheZumNächstenFeld_2 = function () {
  'use strict'
  var i,
    y,
    FeldIdAktuell,
    AnzFelder = window.em.Feldliste.rows.length - 1,
    AktFeld_i,
    AktFeld_y
  for (i = 0; window.em.Feldliste.rows.length; i++) {
    // alle Felder durchlaufen, aktuelles eigenes oder offizielles suchen
    AktFeld_i = window.em.Feldliste.rows[i].doc
    // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (AktFeld_i.User === window.localStorage.Email || AktFeld_i.User === 'ZentrenBdKt') {
      // Nur eigene und offizielle Felder berücksichtigen
      FeldIdAktuell = window.em.Feldliste.rows[i].doc._id
      if (FeldIdAktuell === window.localStorage.FeldId) {
        // das ist das aktuelle Feld
        // von hier aus vorwärts das nächste eigene oder offizielle suchen
        if (i < AnzFelder) {
          // das aktuelle Feld ist nicht das letzte
          for (y = i + 1; y <= AnzFelder; y++) {
            // alle verbleibenden Felder durchlaufen, eigenes suchen
            AktFeld_y = window.em.Feldliste.rows[y].doc
            // Nur eigene Felder und offizielle berücksichtigen
            if (AktFeld_y.User === window.localStorage.Email || AktFeld_y.User === 'ZentrenBdKt') {
              // das ist das nächste eigene Feld > öffnen
              window.localStorage.FeldId = window.em.Feldliste.rows[i + 1].doc._id
              window.em.leereStorageFeldEdit('ohneId')
              window.em.initiiereFeldEdit()
              return
            } else {
              if (y === AnzFelder) {
                // am letzten Feld angelangt und es ist kein eigenes
                window.em.melde('Das ist das letzte Feld')
                return
              }
            }
          }
        } else {
          // das aktuelle Feld ist das letzte
          window.em.melde('Das ist das letzte Feld')
          return
        }
      }
    }
  }
}

// Öffnet das vorige Feld
// voriges des ersten => FeldListe
// erwartet die ID des aktuellen Datensatzes
// wird in FeldEdit.html verwendet
window.em.geheZumVorigenFeld = function () {
  'use strict'
  if (window.em.Feldliste) {
    // Feldliste aus globaler Variable verwenden - muss nicht geparst werden
    window.em.geheZumVorigenFeld_2()
  } else {
    var $db = $.couch.db('evab')
    $db.view('evab/FeldListe?include_docs=true', {
      success: function (data) {
        window.em.Feldliste = data
        window.em.geheZumVorigenFeld_2()
      }
    })
  }
}

window.em.geheZumVorigenFeld_2 = function () {
  'use strict'
  var i,
    y,
    FeldIdAktuell,
    FeldIdVoriges,
    AktFeld_i,
    AktFeld_y
  for (i = 0; window.em.Feldliste.rows.length; i++) {
    // alle Felder durchlaufen, aktuelles eigenes oder offizielles suchen
    AktFeld_i = window.em.Feldliste.rows[i].doc
    // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (AktFeld_i.User === window.localStorage.Email || AktFeld_i.User === 'ZentrenBdKt') {
      // Nur eigene und offizielle Felder berücksichtigen
      FeldIdAktuell = window.em.Feldliste.rows[i].doc._id
      if (FeldIdAktuell === window.localStorage.FeldId) {
        // das ist das aktuelle Feld
        // von hier aus rückwärts das nächste eigene oder offizielle suchen
        if (i > 0) {
          // das aktuelle Feld ist nicht das erste
          for (y = i - 1; y >= 0; y--) {
            // alle vorhergehenden Felder durchlaufen, eigenes suchen
            AktFeld_y = window.em.Feldliste.rows[y].doc
            // Nur eigene Felder und offizielle berücksichtigen
            if (AktFeld_y.User === window.localStorage.Email || AktFeld_y.User === 'ZentrenBdKt') {
              // das ist das nächstvorherige eigene Feld > öffnen
              FeldIdVoriges = window.em.Feldliste.rows[i - 1].doc._id
              window.localStorage.FeldId = FeldIdVoriges
              window.em.leereStorageFeldEdit('ohneId')
              window.em.initiiereFeldEdit()
              return
            } else {
              if (y === 1) {
                // am ersten Feld angelangt und es ist kein eigenes
                // wir gehen zur Feldliste
                window.em.geheZurueckFE()
                return
              }
            }
          }
        } else {
          // das aktuelle Feld ist das erste
          // wir gehen zur Feldliste
          window.em.geheZurueckFE()
          return
        }
      }
    }
  }
}

// empfängt den Feldnamen des gewählten Vorgängers
// ermittelt dessen Reihenfolge
// sucht das nächste eigene Feld und setzt als Reihenfolge den Mittelwert der zwei Reihenfolgen
// Wenn kein weiteres eigenes Feld kommt, wird als Reihenfolge der nächste um mindestens 1 höhere ganzzahlige Wert gesetzt
// wird in FeldEdit.html verwendet
window.em.setzeReihenfolgeMitVorgänger = function (FeldNameVorgänger) {
  'use strict'
  var viewname = 'evab/FeldListeFeldName?key="' + FeldNameVorgänger + '"&include_docs=true',
    $db = $.couch.db('evab')
  $db.view(viewname, {
    success: function (data) {
      var ReihenfolgeVorgaenger = data.rows[0].doc.Reihenfolge
      $('#Reihenfolge').val(Math.floor(ReihenfolgeVorgaenger + 1))
      window.em.speichereFeldeigenschaften()
    }
  })
}

// speichert, dass ein Wert als Standardwert verwendet werden soll
// wird in FeldEdit.html verwendet
window.em.speichereStandardwert = function () {
  'use strict'
  // Prüfen, ob Feld als Objekt vorliegt
  if (window.em.Feld) {
    // dieses verwenden
    window.em.speichereStandardwert_2()
  } else {
    // aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.FeldId, {
      success: function (doc) {
        window.em.Feld = doc
        window.em.speichereStandardwert_2()
      },
      error: function () {
        window.em.melde('Fehler: Feld nicht gespeichert')
      }
    })
  }

}

window.em.speichereStandardwert_2 = function () {
  'use strict'
  var Feldwert = $('#Standardwert').val()
  // Standardwert managen
  // Standardwert ist Objekt, in dem die Werte für jeden User gespeichert werden
  // darum manuell für diesen User updaten
  if (window.em.Feld.Standardwert) {
    // Standardwert existierte
    if (Feldwert) {
      // neuen Standardwert setzen
      window.em.Feld.Standardwert[window.localStorage.Email] = Feldwert
    } else {
      // Standardwert ist leer
      if (window.em.Feld.Standardwert[window.localStorage.Email]) {
        // bisherigen Standardwert löschen
        delete window.em.Feld.Standardwert[window.localStorage.Email]
      }
    }
  } else {
    // Bisher gab es noch keinen Standardwert
    if (Feldwert) {
      // Objekt für Standardwert schaffen und neuen Wert setzen
      window.em.Feld.Standardwert = {}
      window.em.Feld.Standardwert[window.localStorage.Email] = Feldwert
    }
  }
  var $db = $.couch.db('evab')
  $db.saveDoc(window.em.Feld, {
    success: function (data) {
      window.em.Feld._rev = data.rev
      window.localStorage.FeldId = data.id
      // Feldlisten leeren, damit Standardwert sofort verwendet werden kann!
      window.em.leereStorageFeldListe()
    },
    error: function () {
      window.em.melde('Fehler: Feld nicht gespeichert')
    }
  })
}

// speichert Feldeigenschaften
// wird in FeldEdit.html verwendet
window.em.speichereFeldeigenschaften = function () {
  'use strict'
  // prüfen, ob das Feld als Objekt vorliegt
  if (window.em.Feld) {
    // bestehendes Objekt verwenden
    window.em.speichereFeldeigenschaften_2()
  } else {
    // Objekt aus der DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.FeldId, {
      success: function (data) {
        window.em.Feld = data
        window.em.speichereFeldeigenschaften_2()
      },
      error: function () {
        window.em.melde('Fehler: Die letzte Änderung wurde nicht gespeichert')
      }
    })
  }
}

window.em.speichereFeldeigenschaften_2 = function () {
  'use strict'
  var Formularfelder = $('#FeldEditForm').serializeObjectNull()
  // Felder mit Arrays: Kommagetrennte Werte in Arrays verwandeln
  if (Formularfelder.Optionen) {
    Formularfelder.Optionen = Formularfelder.Optionen.split(',')
  }
  // Wenn Beschriftung fehlt und Name existiert: Beschriftung = Name
  if (!Formularfelder.FeldBeschriftung && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
    Formularfelder.FeldBeschriftung = Formularfelder.FeldName
    // Feldliste soll neu aufgebaut werden
    window.em.leereStorageFeldListe()
  }
  // Es braucht eine Reihenfolge
  if (!Formularfelder.Reihenfolge && Formularfelder.Hierarchiestufe && Formularfelder.FeldName) {
    Formularfelder.Reihenfolge = 1
    // Feldliste soll neu aufgebaut werden
    window.em.leereStorageFeldListe()
  }
  // Wenn Feldtyp von textinput weg geändert wurde, sollte InputTyp entfernt werden
  if (Formularfelder.Formularelement !== 'textinput' && Formularfelder.InputTyp) {
    delete Formularfelder.InputTyp
    $('#' + window.em.Feld.InputTyp).prop('checked', false).checkboxradio('refresh')
  }
  // Wenn Feldtyp textinput gesetzt wurde, muss ein InputTyp existieren. Wenn er nicht gesetzt wurde, text setzen
  if (Formularfelder.Formularelement === 'textinput' && !Formularfelder.InputTyp) {
    Formularfelder.InputTyp = 'text'
    $('#' + window.em.Feld.InputTyp).prop('checked', true).checkboxradio('refresh')
  }
  // Formularfelder in Dokument schreiben
  // setzt Vorhandensein von Feldnamen voraus!
  _.each(Formularfelder, function (feldwert, feldname) {
    if (feldwert) {
      if (feldname === 'Reihenfolge' || feldname === 'SliderMinimum' || feldname === 'SliderMaximum') {
        // Zahl wird sonst in Text verwandelt und falsch sortiert
        window.em.Feld[feldname] = parseInt(feldwert, 10)
      } else {
        window.em.Feld[feldname] = feldwert
      }
    } else {
      // leere Felder entfernen, damit werden auch soeben gelöschte Felder entfernt
      delete window.em.Feld[feldname]
    }
  })
  var $db = $.couch.db('evab')
  $db.saveDoc(window.em.Feld, {
    success: function (data) {
      // rev aktualisieren
      window.em.Feld._rev = data.rev
      window.localStorage.FeldId = data.id
      // Feldliste soll neu aufbauen
      window.em.leereStorageFeldListe()
    },
    error: function () {
      window.em.melde('Fehler: Die letzte Änderung wurde nicht gespeichert')
    }
  })
  delete window.localStorage.FeldName
  delete window.localStorage.FeldWert
  delete window.localStorage.AlterFeldWert
}

// wird in BeobListe.html verwendet
// eigene Funktion, weil auch die Beobliste darauf verweist, wenn noch keine Art erfasst wurde
window.em.erstelleNeueBeob_1_Artgruppenliste = function () {
  'use strict'
  // Globale Variablen für BeobListe zurücksetzen, damit die Liste neu aufgebaut wird
  window.em.leereStorageBeobListe()
  window.localStorage.Status = 'neu'
  window.localStorage.Von = 'BeobListe'
  delete window.localStorage.aArtGruppe // verhindern, dass eine Artgruppe übergeben wird
  $.mobile.navigate('Artgruppenliste.html')
}

// wird in BeobEdit.html benutzt
// Öffnet die vorige oder nächste Beobachtung
// vorige der ersten => BeobListe
// nächste der letzten => melden
// erwartet ob nächster oder voriger gesucht wird
window.em.nächsteVorigeBeob = function (NächsteOderVorige) {
  'use strict'
  // prüfen, ob BeobListe schon existiert
  // nur abfragen, wenn sie noch nicht existiert
  if (window.em.BeobListe) {
    // globale Variable BeobListe existiert noch
    window.em.nächsteVorigeBeob_2(NächsteOderVorige)
  } else {
    // keine Projektliste übergeben
    // neu aus DB erstellen
    var $db = $.couch.db('evab')
    $db.view('evab/BeobListe?startkey=["' + window.localStorage.Email + '",{}]&endkey=["' + window.localStorage.Email + '"]&descending=true&include_docs=true', {
      success: function (data) {
        // Globale Variable erstellen, damit Abfrage ab dem zweiten Mal nicht mehr nötig ist
        // bei neuen/Löschen von Beobachtungen wird BeobListe wieder auf undefined gesetzt
        window.em.BeobListe = data
        window.em.nächsteVorigeBeob_2(NächsteOderVorige)
      }
    })
  }
}

window.em.nächsteVorigeBeob_2 = function (NächsteOderVorige) {
  'use strict'
  var i,
    BeobIdAktuell,
    AnzBeob
  for (i = 0; window.em.BeobListe.rows.length; i++) {
    BeobIdAktuell = window.em.BeobListe.rows[i].doc._id
    AnzBeob = window.em.BeobListe.rows.length - 1   // vorsicht: Objekte zählen Elemente ab 1, Arrays ab 0!
    if (BeobIdAktuell === window.localStorage.BeobId) {
      switch (NächsteOderVorige) {
        case 'nächste':
          if (i < AnzBeob) {
            window.localStorage.BeobId = window.em.BeobListe.rows[i + 1].doc._id
            window.em.leereStorageBeobEdit('ohneId')
            window.em.initiiereBeobEdit()
            return
          } else {
            window.em.melde('Das ist die letzte Beobachtung')
            return
          }
          break
        case 'vorige':
          if (i > 0) {
            window.localStorage.BeobId = window.em.BeobListe.rows[i - 1].doc._id
            window.em.leereStorageBeobEdit('ohneId')
            window.em.initiiereBeobEdit()
            return
          } else {
            window.em.leereStorageBeobEdit()
            $.mobile.navigate('BeobListe.html')
            return
          }
          break
      }
    }
  }
}

// wird in BeobEdit.html benutzt
// löscht eine Beobachtung
window.em.löscheBeob = function () {
  'use strict'
  if (window.em.Beobachtung) {
    // vorhandenes Objekt nutzen
    window.em.löscheBeob_2()
  } else {
    // Objekt aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.BeobId, {
      success: function (data) {
        window.em.Beobachtung = data
        window.em.löscheBeob_2()
      },
      error: function () {
        window.em.melde('Fehler: Beobachtung nicht gelöscht')
      }
    })
  }
}

window.em.löscheBeob_2 = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.removeDoc(window.em.Beobachtung, {
    success: function (data) {
      // Liste anpassen. Vorsicht: Bei refresh kann sie fehlen
      if (window.em.BeobListe) {
        window.em.BeobListe.rows = _.reject(window.em.BeobListe.rows, function (row) {
          return row.doc._id === data.id
        })
      } else {
        // Keine BeobListe mehr. Storage löschen
        window.em.leereStorageBeobListe()
      }
      window.em.leereStorageBeobEdit()
      $.mobile.navigate('BeobListe.html')
    },
    error: function () {
      window.em.melde('Fehler: Beobachtung nicht gelöscht')
    }
  })
}

// Speichert alle Daten in BeobEdit.html
window.em.speichereBeob = function (that) {
  'use strict'
  // eventhandler übergeben this nicht in der Klammer
  var _this = that || this
  // prüfen, ob Beob als Objekt vorliegt
  if (window.em.Beobachtung) {
    // ja: dieses Objekt verwenden
    window.em.speichereBeob_2(_this)
  } else {
    // nein: Beob aus DB holen
    var $db = $.couch.db('evab')
    $db.openDoc(window.localStorage.BeobId, {
      success: function (data) {
        window.em.Beobachtung = data
        window.em.speichereBeob_2(_this)
      },
      error: function () {
        console.log('Fehler in function speichereBeob_2(_this)')
      }
    })
  }
}

window.em.speichereBeob_2 = function (that) {
  'use strict'
  var FeldnameDb,
    Feldwert,
    feldinfos
  // Feldname und -wert ermitteln
  feldinfos = window.em.holeFeldInfosVonElement(that)
  FeldnameDb = feldinfos.feldname_db
  Feldwert = feldinfos.feldwert
  // Werte aus dem Formular aktualisieren
  if (Feldwert) {
    if (window.em.myTypeOf(Feldwert) === 'float') {
      window.em.Beobachtung[FeldnameDb] = parseFloat(Feldwert)
    } else if (window.em.myTypeOf(Feldwert) === 'integer') {
      window.em.Beobachtung[FeldnameDb] = parseInt(Feldwert, 10)
    } else {
      window.em.Beobachtung[FeldnameDb] = Feldwert
    }
  } else if (window.em.Beobachtung[FeldnameDb]) {
    delete window.em.Beobachtung[FeldnameDb]
  }
  window.em.Beobachtung.aArtGruppe = window.localStorage.aArtGruppe
  window.em.Beobachtung.aArtName = window.localStorage.aArtName
  window.em.Beobachtung.aArtId = window.localStorage.aArtId
  // alles speichern
  var $db = $.couch.db('evab')
  $db.saveDoc(window.em.Beobachtung, {
    success: function (data) {
      window.em.Beobachtung._rev = data.rev
    },
    error: function () {
      console.log('Fehler in function speichereBeob_2(that)')
    }
  })
}

window.em.meldeNeuAn = function () {
  'use strict'
  window.localStorage.UserStatus = 'neu'
  $.mobile.changePage('index.html')
  // Felder zurücksetzen, sonst ist hier noch die alte Anmeldung drin
  $('#Email').val('')
  $('#Passwort').val('')
}

window.em.handleArtenImportierenPageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }
  window.em.initiiereArtenImportieren()
}

window.em.handleArtenImportierenPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }

  $('#ArtenImportierenHeader')
    // zurück-Button steuern
    .on('click', '#zurückArtenImportieren', function (event) {
      event.preventDefault()
      window.em.handleArtenImportierenZurückClick()
    })

  $('#ArtenImportierenContent')
    .on('click', '#ai_arten_ohne_artgruppe_entfernen', window.em.entferneArtenOhneArtgruppe)
    .on('click', '#ai_gemeinsam_anzarten_aktualisieren', window.em.aktualisiereAnzahlArtenVonArten)
    .on('click', '#ai_fehlen_in_evab_importieren', window.em.importiereFehlendeArten)
    .on('click', '#ai_fehlen_in_artendb_exportieren', window.em.exportiereBeobVonInArtendbFehlendenArten)
}

window.em.importiereFehlendeArten = function () {
  'use strict'
  if (window.em.arten_fehlen_in_evab.length === 0) {
    window.em.melde('Aktion abgebrochen: Es gibt in arteigenschaften.ch keine Arten, die in artbeobachtungen.ch fehlen')
    return
  }
  var $db = $.couch.db('evab')
  _.each(window.em.arten_fehlen_in_evab, function (art) {
    $db.saveDoc(art, {
      success: function () {
        // window.em.initiiereArtenImportieren()
      },
      error: function () {
        window.em.melde('Fehler: Art ' + art.Artname + ' nicht importiert')
      }
    })
  })
}

window.em.aktualisiereAnzahlArtenVonArten = function () {
  'use strict'
  window.em.melde('Diese Funktion ist noch nicht implementiert')
}

window.em.exportiereBeobVonInArtendbFehlendenArten = function () {
  'use strict'
  window.em.melde('Diese Funktion ist noch nicht implementiert')
}

// PROVISORISCH, NACH BENUTZUNG ENTFERNEN
window.em.entferneArtenOhneArtgruppe = function () {
  'use strict'
  var $db = $.couch.db('evab')
  $db.view('evab/ArtenOhneArtgruppe?include_docs=true', {
    success: function (data) {
      if (data.rows.length === 0) {
        window.em.melde('Es gibt keine Arten ohne Artgruppe')
        return
      }
      var arten_ohne_artgruppe = _.map(data.rows, function (objekt) {
        return objekt.doc
      })
      _.each(arten_ohne_artgruppe, function (art) {
        $db.removeDoc(art, {
          error: function () {
            console.log('Fehler: ' + art.Artname + ' nicht gelöscht')
          }
        })
      })
    }
  })
}

window.em.handleArtenImportierenZurückClick = function () {
  'use strict'
  // sicherstellen, dass er immer ein zurück kennt
  if (!window.localStorage.zurueck) {
    window.localStorage.zurueck = 'BeobListe'
  }
  $.mobile.navigate(window.localStorage.zurueck + '.html')
  delete window.localStorage.zurueck
}

window.em.initiiereArtenImportieren = function () {
  'use strict'
  // aktuelle aus evm holen
  $.ajax({
    type: 'GET',
    url: 'http://arteigenschaften.ch/_list/export_evm_arten/evab_arten?include_docs=true',
    contentType: 'application/json'
  })
    .done(function (data) {
      data = JSON.parse(data)
      window.em.arten_artendb = data.docs
      var arten_artendb_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_artendb)
      // Tabelle aufbauen
      $('#ai_artendb').html(window.em.erstelleTabelle(arten_artendb_reduziert, 'reflow', 'ai_artendb_tabelle'))
      // initialisieren
      $('#ai_artendb_tabelle').table()
      // Anzahl anzeigen
      $('#ai_artendb_titel').html('Erste 50 von ' + window.em.arten_artendb.length + ' Arten aus arteigenschaften.ch:')

      // eigene Arten holen
      console.log('hole Arten aus evab')
      var $db = $.couch.db('evab')
      $db.view('evab/Artliste?include_docs=true', {
        success: function (data) {
          // Arten in evab ermitteln
          console.log('verarbeite Arten aus evab')
          window.em.arten_evab = _.map(data.rows, function (objekt) {
            return objekt.doc
          })
          var arten_evab_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_evab)
          // Tabelle aufbauen
          $('#ai_evab').html(window.em.erstelleTabelle(arten_evab_reduziert, 'reflow', 'ai_evab_tabelle'))
          // initialisieren
          $('#ai_evab_tabelle').table()
          // Anzahl anzeigen
          $('#ai_evab_titel').html('Erste 50 von ' + window.em.arten_evab.length + ' Arten aus artbeobachtungen.ch:')

          // gemeinsame Arten mit unterschiedlichem Namen oder Artgruppe ermitteln
          console.log('suche Arten mit Unterschieden')
          window.em.arten_gemeinsam_unterschiedlich = _.filter(window.em.arten_artendb, function (art_artendb) {
            for (var i in window.em.arten_evab) {
              var art_evab = window.em.arten_evab[i]
              if (art_evab._id === art_artendb._id && (art_evab.ArtGruppe !== art_artendb.ArtGruppe || art_evab.Artname !== art_artendb.Artname)) {
                return true
              }
            }
          })
          if (window.em.arten_gemeinsam_unterschiedlich.length > 0) {
            var arten_gemeinsam_unterschiedlich_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_gemeinsam_unterschiedlich)
            // Tabelle aufbauen
            $('#ai_arten_gemeinsam_unterschiedlich').html(window.em.erstelleTabelle(arten_gemeinsam_unterschiedlich_reduziert, 'reflow', 'ai_arten_gemeinsam_unterschiedlich_tabelle'))
            // initialisieren
            $('#ai_arten_gemeinsam_unterschiedlich_tabelle').table()
            // Schaltfläche einschalten
            $('#ai_arten_gemeinsam_unterschiedlich_aktualisieren').button('enable')
          } else {
            // p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
            $('#ai_arten_gemeinsam_unterschiedlich').html('<p>Erfolg:<br>Alle gemeinsamen Arten haben denselben Namen und dieselbe Artgruppe!</p>')
            $('#ai_arten_gemeinsam_unterschiedlich_aktualisieren').button('disable')
          }
          // Anzahl anzeigen
          $('#ai_arten_gemeinsam_unterschiedlich_titel').html('Erste 50 von ' + window.em.arten_gemeinsam_unterschiedlich.length + ' gemeinsamen Arten<br>mit unterschiedlicher Artgruppe oder Artname:')

          // Arten aus artendb, die in evab fehlen
          console.log('suche Arten, die in evab fehlen')
          window.em.arten_fehlen_in_evab = _.reject(window.em.arten_artendb, function (art_artendb) {
            for (var i in window.em.arten_evab) {
              if (window.em.arten_evab[i]._id === art_artendb._id) {
                return true
              }
            }
          })
          if (window.em.arten_fehlen_in_evab.length > 0) {
            var arten_fehlen_in_evab_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_fehlen_in_evab)
            // Tabelle aufbauen
            $('#ai_fehlen_in_evab').html(window.em.erstelleTabelle(arten_fehlen_in_evab_reduziert, 'reflow', 'ai_fehlen_in_evab_tabelle'))
            // initialisieren
            $('#ai_fehlen_in_evab_tabelle').table()
            // Schaltfläche einschalten
            $('#ai_fehlen_in_evab_importieren').button('enable')
          } else {
            // p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
            $('#ai_fehlen_in_evab').html('<p>Erfolg:<br>artbeobachtungen.ch enthält schon alle Arten aus arteigenschaften.ch!</p>')
            $('#ai_fehlen_in_evab_importieren').button('disable')
          }
          // Anzahl anzeigen
          $('#ai_fehlen_in_evab_titel').html('Erste 50 von ' + window.em.arten_fehlen_in_evab.length + ' Arten aus arteigenschaften.ch, die in artbeobachtungen.ch fehlen:')

          // Arten aus evab, die in artendb fehlen
          console.log('suche Arten, die in artendb fehlen')
          window.em.arten_fehlen_in_artendb = _.reject(window.em.arten_evab, function (art_evab) {
            // eigene und unbekannte Arten ignorieren
            if (art_evab.Artname.substring(0, 6) === 'Eigene' || art_evab.Artname.substring(0, 9) === 'Unbekannt') {
              return true
            }
            for (var i in window.em.arten_artendb) {
              if (window.em.arten_artendb[i]._id === art_evab._id) {
                return true
              }
            }
          })
          if (window.em.arten_fehlen_in_artendb.length > 0) {
            var arten_fehlen_in_artendb_reduziert = window.em.reduziereArtenfelderAufArtgruppeUndName(window.em.arten_fehlen_in_artendb)
            // Tabelle aufbauen
            $('#ai_fehlen_in_artendb').html(window.em.erstelleTabelle(arten_fehlen_in_artendb_reduziert, 'reflow', 'ai_fehlen_in_artendb_tabelle'))
            // initialisieren
            $('#ai_fehlen_in_artendb_tabelle').table()
            // Schaltfläche einschalten
            $('#ai_fehlen_in_artendb_exportieren').button('enable')
            $('#ai_fehlen_in_artendb_exportieren_hinweis').show()
          } else {
            // p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
            $('#ai_fehlen_in_artendb').html('<p>Erfolg:<br>artbeobachtungen.ch enthält keine Arten, die in arteigenschaften.ch nicht vorkommen!</p>')
            $('#ai_fehlen_in_artendb_exportieren').button('disable')
            $('#ai_fehlen_in_artendb_exportieren_hinweis').hide()
          }
          // Anzahl anzeigen
          $('#ai_fehlen_in_artendb_titel').html('Erste 50 von ' + window.em.arten_fehlen_in_artendb.length + ' Arten aus artbeobachtungen.ch, die in arteigenschaften.ch fehlen:')
        }
      })
    })
    .fail(function () {
      console.log('Fehler: keine Arten erhalten')
    })
}

window.em.reduziereArtenfelderAufArtgruppeUndName = function (arten) {
  'use strict'
  // da es soviele Arten gibt, nur die ersten 50 verarbeiten und anzeigen
  var erste_fünfzig_arten = _.first(arten, 50)
  return _.map(erste_fünfzig_arten, function (art) {
    var art_return = {}
    art_return.Artgruppe = art.ArtGruppe
    art_return.Artname = art.Artname
    return art_return
  })
}

window.em.handleArtengruppenImportierenPageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }
  window.em.initiiereArtengruppenImportieren()
}

window.em.handleArtengruppenImportierenPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }

  $('#ArtengruppenImportierenHeader')
    // zurück-Button steuern
    .on('click', '#zurückArtengruppenImportieren', function (event) {
      event.preventDefault()
      window.em.handleArtengruppenImportierenZurückClick()
    })

  $(document)
    .on('click', '#agi_gemeinsam_anzarten_aktualisieren', window.em.aktualisiereAnzahlArtenVonArtengruppen)

  $('#ArtengruppenImportierenContent')
    .on('click', '#agi_fehlen_in_evab_importieren', window.em.importiereFehlendeArtengruppen)
    .on('click', '#agi_fehlen_in_artendb_exportieren', window.em.exportiereBeobVonInArtendbFehlendenArtengruppen)
}

window.em.exportiereBeobVonInArtendbFehlendenArtengruppen = function () {
  'use strict'
  console.log('window.em.exportiereBeobVonInArtendbFehlendenArtengruppen')
}

window.em.importiereFehlendeArtengruppen = function () {
  'use strict'
  if (window.em.artgruppen_fehlen_in_evab.length === 0) {
    window.em.melde('Aktion abgebrochen: Es gibt in arteigenschaften.ch keine Artengruppen, die in artbeobachtungen.ch fehlen')
    return
  }
  var $db = $.couch.db('evab')
  _.each(window.em.artgruppen_fehlen_in_evab, function (artgruppe) {
    $db.saveDoc(artgruppe, {
      success: function () {
        window.em.initiiereArtengruppenImportieren()
      },
      error: function () {
        window.em.melde('Fehler: Artgruppe nicht aktualisiert')
      }
    })
  })
}

window.em.aktualisiereAnzahlArtenVonArtengruppen = function () {
  'use strict'
  if (window.em.artgruppen_gemeinsam_anzarten.length === 0) {
    window.em.melde('Aktion abgebrochen: Es gibt keine gemeinsamen Artengruppen mit unterschiedlicher Anzahl Arten')
    return
  }
  var $db = $.couch.db('evab')
  _.each(window.em.artgruppen_gemeinsam_anzarten, function (artgruppe_artendb) {
    $db.openDoc(artgruppe_artendb._id, {
      success: function (artgruppe_evab) {
        artgruppe_evab.AnzArten = artgruppe_artendb.AnzArten
        $db.saveDoc(artgruppe_evab, {
          success: function () {
            window.em.initiiereArtengruppenImportieren()
          },
          error: function () {
            window.em.melde('Fehler: Artgruppe ' + artgruppe_artendb.ArtGruppe + ' nicht aktualisiert')
          }
        })
      },
      error: function () {
        window.em.melde('Fehler: Artgruppe ' + artgruppe_artendb.ArtGruppe + ' nicht aktualisiert')
      }
    })

  })
}

window.em.handleArtengruppenImportierenZurückClick = function () {
  'use strict'
  // sicherstellen, dass er immer ein zurück kennt
  if (!window.localStorage.zurueck) {
    window.localStorage.zurueck = 'BeobListe'
  }
  $.mobile.navigate(window.localStorage.zurueck + '.html')
  delete window.localStorage.zurueck
}

window.em.öffneArtengruppenImportieren = function () {
  'use strict'
  window.localStorage.zurueck = $('body').pagecontainer('getActivePage').attr('id')
  $.mobile.navigate('ArtengruppenImportieren.html')
}

window.em.öffneAdmin = function () {
  'use strict'
  window.localStorage.zurueck = $('body').pagecontainer('getActivePage').attr('id')
  $.mobile.navigate('admin.html')
}

window.em.handleAdminPageshow = function () {
  'use strict'
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }
// window.em.initiiereAdmin()
}

window.em.handleAdminPageinit = function () {
  'use strict'
  // Wird diese Seite direkt aufgerufen und es gibt keinen window.localStorage,
  // muss auf index.html umgeleitet werden
  if (window.localStorage.length === 0 || !window.localStorage.Email) {
    window.em.leereAlleVariabeln()
    $.mobile.navigate('index.html')
  }

  $('#AdminHeader')
    // zurück-Button steuern
    .on('click', '#zurückAdmin', function (event) {
      event.preventDefault()
      window.em.handleAdminZurückClick()
    })

  $('#AdminContent')
    .on('click', '#admin_beob_eines_users_entfernen', window.em.entferneDokumenteEinesUsers)
    .on('click', '#admin_user_entfernen', window.em.entferneUser)
}

window.em.handleAdminZurückClick = function () {
  'use strict'
  // sicherstellen, dass er immer ein zurück kennt
  if (!window.localStorage.zurueck) {
    window.localStorage.zurueck = 'BeobListe'
  }
  $.mobile.navigate(window.localStorage.zurueck + '.html')
  delete window.localStorage.zurueck
}

window.em.entferneDokumenteEinesUsers = function () {
  'use strict'
  var user = $('#admin_beob_eines_users_entfernen_user').val()
  if (!user) {
    window.em.melde('Bitte User eingeben')
    return
  }
  var $db = $.couch.db('evab')
  $db.view('evab/UserDocs?key="' + user + '"&descending=true&include_docs=true&reduce=false', {
    success: function (data) {
      var dokumenten = data.rows,
        fehler = 0,
        gelöscht = 0
      $('#admin_user_entfernen_rückmeldung').html('Dokumente: Gelöscht: ' + gelöscht + ', Fehler: ' + fehler + ' von ' + dokumenten.length)
      _.each(dokumenten, function (doc) {
        $db.removeDoc(doc.doc, {
          success: function () {
            gelöscht++
            $('#admin_user_entfernen_rückmeldung').html('Dokumente: Gelöscht: ' + gelöscht + ', Fehler: ' + fehler + ' von ' + dokumenten.length)
          },
          error: function () {
            fehler++
            $('#admin_user_entfernen_rückmeldung').html('Dokumente: Gelöscht: ' + gelöscht + ', Fehler: ' + fehler + ' von ' + dokumenten.length)

          }
        })
      })

      // Bezug zu Usern aus Feldern entfernen (username in Arrays)
      $db.view('evab/UserFelderMitDaten?key="' + user + '"&descending=true&include_docs=true&reduce=false', {
        success: function (data) {
          var felder = data.rows,
            fehler = 0,
            gelöscht = 0

          $('#admin_user_entfernen_rückmeldung2').html('Einstellungen in Feldern: Gelöscht: ' + gelöscht + ', Fehler: ' + fehler + ' von ' + felder.length)

          _.each(felder, function (feld) {
            feld = feld.doc

            // User aus SichtbarImModusEinfach entfernen
            if (feld.SichtbarImModusEinfach && feld.SichtbarImModusEinfach.length > 0) {
              feld.SichtbarImModusEinfach = _.without(feld.SichtbarImModusEinfach, user)
            }

            // User aus SichtbarImModusHierarchisch entfernen
            if (feld.SichtbarImModusHierarchisch && feld.SichtbarImModusHierarchisch.length > 0) {
              feld.SichtbarImModusHierarchisch = _.without(feld.SichtbarImModusHierarchisch, user)
            }

            // User aus SichtbarInHArtEditListe entfernen
            if (feld.SichtbarInHArtEditListe && feld.SichtbarInHArtEditListe.length > 0) {
              feld.SichtbarInHArtEditListe = _.without(feld.SichtbarInHArtEditListe, user)
            }

            // User aus Standardwert entfernen
            if (feld.Standardwert && feld.Standardwert[user]) {
              delete feld.Standardwert[user]
            }

            $db.saveDoc(feld, {
              success: function () {
                gelöscht++
                $('#admin_user_entfernen_rückmeldung2').html('Einstellungen in Feldern: Gelöscht: ' + gelöscht + ', Fehler: ' + fehler + ' von ' + felder.length)
              },
              error: function () {
                fehler++
                $('#admin_user_entfernen_rückmeldung2').html('Einstellungen in Feldern: Gelöscht: ' + gelöscht + ', Fehler: ' + fehler + ' von ' + felder.length)
              }
            })
          })
        },
        error: function () {
          window.em.melde('Die Felder konnten nicht abgerufen werden')
        }
      })

    },
    error: function () {
      window.em.melde('Die Dokumente des Benutzers konnten nicht abgerufen werden')
    }
  })
}

window.em.entferneUser = function () {
  'use strict'
  var user = $('#admin_user_entfernen_user').val()
  if (!user) {
    window.em.melde('Bitte User eingeben')
    return
  }
  // Kontrollieren, ob der User noch Dokumente hat
  var $db = $.couch.db('evab')
  $db.view('evab/UserDocs?key="' + user + '"&descending=true&include_docs=true&reduce=false', {
    success: function (data) {
      if (data.rows.length > 0) {
        window.em.melde('Dieser User hat noch Dokumente. Bitte diese zuerst entfernen')
        return
      }
      // kontrollieren, ob der User noch Feldeinstellungen hat
      $db.view('evab/UserFelderMitDaten?key="' + user + '"&descending=true&include_docs=true&reduce=false', {
        success: function (data) {
          if (data.rows.length > 0) {
            window.em.melde('Dieser User hat noch Einstellungen in Feldern. Bitte diese zuerst entfernen')
            return
          }
          // der Benutzer hat keine Daten mehr. Benutzer entfernen
          $.couch.userDb(function (db) {
            db.openDoc('org.couchdb.user:' + user, {
              success: function (doc) {
                db.removeDoc(doc, {
                  success: function () {
                    window.em.melde('Benutzer ' + user + ' wurde entfernt')
                  },
                  error: function () {
                    window.em.melde('Fehler: Benutzer ' + user + ' wurde nicht entfernt')
                  }
                })
              },
              error: function () {
                window.em.melde('Fehler: User wurde nicht gefunden')
              }
            })
          })
        },
        error: function () {
          window.em.melde('Die Felder konnten nicht abgerufen werden')
        }
      })
    },
    error: function () {
      window.em.melde('Fehler: Es konnte nicht kontrolliert werden, ob der Benutzer noch Beobachtungen hat')
    }
  })
}

window.em.initiiereArtengruppenImportieren = function () {
  'use strict'
  // aktuelle aus evm holen
  $.ajax({
    type: 'GET',
    url: 'http://arteigenschaften.ch/_list/export_evm_artgruppen/artgruppen?group_level=1',
    contentType: 'application/json'
  })
    .done(function (data) {
      data = JSON.parse(data)
      window.em.artgruppen_artendb = data.docs
      var artgruppen_artendb_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_artendb)
      // Tabelle aufbauen
      $('#agi_artendb').html(window.em.erstelleTabelle(artgruppen_artendb_reduziert, 'reflow', 'agi_artendb_tabelle'))
      // initialisieren
      $('#agi_artendb_tabelle').table()
      // Anzahl anzeigen
      $('#agi_artendb_titel').html('In arteigenschaften.ch<br>vorhandene Artengruppen (' + artgruppen_artendb_reduziert.length + '):')
      // eigene Artgruppen holen
      var $db = $.couch.db('evab')
      $db.view('evab/Artgruppen?include_docs=true', {
        success: function (data) {
          // Artgruppen in evab ermitteln
          window.em.artgruppen_evab = _.map(data.rows, function (objekt) {
            return objekt.doc
          })
          var artgruppen_evab_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_evab)
          // Tabelle aufbauen
          $('#agi_evab').html(window.em.erstelleTabelle(artgruppen_evab_reduziert, 'reflow', 'agi_evab_tabelle'))
          // initialisieren
          $('#agi_evab_tabelle').table()
          // Anzahl anzeigen
          $('#agi_evab_titel').html('In artbeobachtungen.ch<br>vorhandene Artengruppen (' + artgruppen_evab_reduziert.length + '):')

          // gemeinsame Artgruppen ermitteln
          window.em.artgruppen_gemeinsam = _.filter(window.em.artgruppen_evab, function (artgruppe_evab) {
            return _.filter(window.em.artgruppen_artendb, _.matches(artgruppe_evab))
          })
          if (window.em.artgruppen_gemeinsam.length > 0) {
            var artgruppen_gemeinsam_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_gemeinsam)
            // Tabelle aufbauen
            $('#agi_gemeinsam').html(window.em.erstelleTabelle(artgruppen_gemeinsam_reduziert, 'reflow', 'agi_gemeinsam_tabelle'))
            // initialisieren
            $('#agi_gemeinsam_tabelle').table()
          } else {
            $('#agi_gemeinsam').html('<p>Oops: Es gibt keine gemeinsamen Artgruppen!</p>')
          }
          // Anzahl anzeigen
          $('#agi_gemeinsam_titel').html('Gemeinsame<br>Artengruppen (' + window.em.artgruppen_gemeinsam.length + '):')

          // gemeinsame Artengruppen mit unterschiedlicher Anzahl Arten ermitteln
          window.em.artgruppen_gemeinsam_anzarten = _.filter(window.em.artgruppen_artendb, function (artgruppe_artendb) {
            for (var i in window.em.artgruppen_evab) {
              if (window.em.artgruppen_evab[i].ArtGruppe === artgruppe_artendb.ArtGruppe && window.em.artgruppen_evab[i].AnzArten !== artgruppe_artendb.AnzArten) {
                return true
              }
            }
          })
          var artgruppen_gemeinsam_anzarten_reduziert = _.map(window.em.artgruppen_gemeinsam_anzarten, function (artgruppe) {
            var artgruppe_return = {}
            artgruppe_return.Artgruppe = artgruppe.ArtGruppe
            return artgruppe_return
          })
          if (window.em.artgruppen_gemeinsam_anzarten.length > 0) {
            // Tabelle aufbauen
            $('#agi_gemeinsam_anzarten').html(window.em.erstelleTabelle(artgruppen_gemeinsam_anzarten_reduziert, 'reflow', 'agi_gemeinsam_anzarten_tabelle'))
            // initialisieren
            $('#agi_gemeinsam_anzarten_tabelle').table()
            // Schaltfläche einschalten
            $('#agi_gemeinsam_anzarten_aktualisieren').button('enable')
          } else {
            // p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
            $('#agi_gemeinsam_anzarten').html('<p>Erfolg:<br>Alle gemeinsamen Artengruppen weisen dieselbe Anzahl Arten aus!</p>')
            $('#agi_gemeinsam_anzarten_aktualisieren').button('disable')
          }
          // Anzahl anzeigen
          $('#agi_gemeinsam_anzarten_titel').html('Gemeinsame Artengruppen<br>mit unterschiedlicher Anz. Arten (' + window.em.artgruppen_gemeinsam_anzarten.length + '):')

          // Artengruppen aus artendb, die in evab fehlen
          window.em.artgruppen_fehlen_in_evab = _.reject(window.em.artgruppen_artendb, function (artgruppe_artendb) {
            for (var i in window.em.artgruppen_evab) {
              if (window.em.artgruppen_evab[i].ArtGruppe === artgruppe_artendb.ArtGruppe) {
                return true
              }
            }
          })
          if (window.em.artgruppen_fehlen_in_evab.length > 0) {
            var artgruppen_fehlen_in_evab_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_fehlen_in_evab)
            // Tabelle aufbauen
            $('#agi_fehlen_in_evab').html(window.em.erstelleTabelle(artgruppen_fehlen_in_evab_reduziert, 'reflow', 'agi_fehlen_in_evab_tabelle'))
            // initialisieren
            $('#agi_fehlen_in_evab_tabelle').table()
            // Schaltfläche einschalten
            $('#agi_fehlen_in_evab_importieren').button('enable')
          } else {
            // p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
            $('#agi_fehlen_in_evab').html('<p>Erfolg:<br>artbeobachtungen.ch enthält schon alle Artgruppen aus arteigenschaften.ch!</p>')
            $('#agi_fehlen_in_evab_importieren').button('disable')
          }
          // Anzahl anzeigen
          $('#agi_fehlen_in_evab_titel').html('Artengruppen aus arteigenschaften.ch,<br>die in artbeobachtungen.ch fehlen (' + window.em.artgruppen_fehlen_in_evab.length + '):')

          // Artengruppen aus evab, die in artendb fehlen
          window.em.artgruppen_fehlen_in_artendb = _.reject(window.em.artgruppen_evab, function (artgruppe_evab) {
            for (var i in window.em.artgruppen_artendb) {
              if (window.em.artgruppen_artendb[i].ArtGruppe === artgruppe_evab.ArtGruppe) {
                return true
              }
            }
          })
          if (window.em.artgruppen_fehlen_in_artendb.length > 0) {
            var artgruppen_fehlen_in_artendb_reduziert = window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl(window.em.artgruppen_fehlen_in_artendb)
            // Tabelle aufbauen
            $('#agi_fehlen_in_artendb').html(window.em.erstelleTabelle(artgruppen_fehlen_in_artendb_reduziert, 'reflow', 'agi_fehlen_in_artendb_tabelle'))
            // initialisieren
            $('#agi_fehlen_in_artendb_tabelle').table()
            // Schaltfläche einschalten
            $('#agi_fehlen_in_artendb_exportieren').button('enable')
            $('#agi_fehlen_in_artendb_exportieren_hinweis').show()
          } else {
            // p mitliefern, damit der Text gleich eingerückt wird, wie der Titel darüber
            $('#agi_fehlen_in_artendb').html('<p>Erfolg:<br>artbeobachtungen.ch enthält keine Artgruppen, die in arteigenschaften.ch nicht vorkommen!</p>')
            $('#agi_fehlen_in_artendb_exportieren').button('disable')
            $('#agi_fehlen_in_artendb_exportieren_hinweis').hide()
          }
          // Anzahl anzeigen
          $('#agi_fehlen_in_artendb_titel').html('Artengruppen aus artbeobachtungen.ch,<br>die in arteigenschaften.ch fehlen (' + window.em.artgruppen_fehlen_in_artendb.length + '):')
        }
      })
    })
    .fail(function () {
      console.log('Fehler: keine Artgruppen erhalten')
    })
}

window.em.reduziereArtgruppenfelderAufArtgruppeUndAnzahl = function (artgruppen) {
  'use strict'
  return _.map(artgruppen, function (artgruppe) {
    var artgruppe_return = {}
    artgruppe_return.Artgruppe = artgruppe.ArtGruppe
    artgruppe_return['Anz. Arten'] = artgruppe.AnzArten
    return artgruppe_return
  })
}

// baut Tabellen auf
// objekte: Array von Objekten, welche die darzustellenden Felder enthalten
// datamode: gemäss jqm, standard = reflow
// table_id: die ID wird benötigt, damit die Tabelle nach ihrer Erstellung initiiert werden kann
// class: Klasse, welche die Darstellung bestimmt. Standard ist: tabelle_gestreift
window.em.erstelleTabelle = function (objekte, datamode, table_id, css_class) {
  'use strict'
  var html

  datamode = datamode || 'reflow'
  css_class = css_class || 'tabelle_gestreift'
  // html für Tabellen-div
  html = '<table data-role="table"'
  if (table_id) {
    html += ' id="' + table_id + '"'
  }
  html += ' data-mode="' + datamode + '" class="ui-responsive ' + css_class + '">'
  // html für die erste Zeile beginnen
  html += '<thead><tr>'
  // html für die Spalten, Biespiel: <th>Artgruppe</th><th>Anzahl Arten</th>
  _.each(_.first(objekte), function (value, key) {
    html += '<th>' + key + '</th>'
  })
  // html für die erste Zeile abschliessen
  html += '</tr></thead>'
  // Tabellenbody beginnen
  html += '<tbody>'
  // jede Zeile
  _.each(objekte, function (objekt) {
    html += '<tr>'
    // alle Spalten
    _.each(objekt, function (value) {
      html += '<td>' + value + '</td>'
    })
    html += '</tr>'
  })
  // Tabellen-body und div abschliessen
  html += '</tbody></table>'
  return html
}

window.em.öffneArtenImportieren = function () {
  'use strict'
  window.localStorage.zurueck = $('body').pagecontainer('getActivePage').attr('id')
  $.mobile.navigate('ArtenImportieren.html')
}

/*!
* jQuery Mobile Framework : drag pagination plugin
* Copyright (c) Filament Group, Inc
* Authored by Scott Jehl, scott@filamentgroup.com
* Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function ($, undefined) {
  // auto-init on pagecreate
  $(document).bind('pagecreate', function (e) {
    $(":jqmData(role='pagination')", e.target).pagination()
  })

  var pageTitle = ''

  // create widget
  $.widget('mobile.pagination', $.mobile.widget, {
    _create: function () {
      var $el = this.element,
        $page = $el.closest('.ui-page'),
        $links = $el.find('a'),
        $origin = $.mobile.pageContainer,
        classNS = 'ui-pagination',
        prevLIClass = classNS + '-prev',
        nextLIClass = classNS + '-next',
        prevPClass = 'ui-page-prev',
        nextPClass = 'ui-page-next',
        snapClass = classNS + '-snapping',
        dragClass = classNS + '-dragging',
        dragClassOn = false,
        $nextPage,
        $prevPage

      $el.addClass(classNS)

      // set up next and prev buttons

      $links.each(function () {
        var reverse = $(this).closest('.' + prevLIClass).length

        $(this)
          .buttonMarkup({
            'role': 'button',
            'theme': 'd',
            'iconpos': 'notext',
            'icon': 'arrow-' + (reverse ? 'l' : 'r')
          })
      })
    }
  })

}($))

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0 /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad = '=' /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz = 8 /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_sha1 (s) {return binb2hex(core_sha1(str2binb(s), s.length * chrsz))}
function b64_sha1 (s) {return binb2b64(core_sha1(str2binb(s), s.length * chrsz))}
function str_sha1 (s) {return binb2str(core_sha1(str2binb(s), s.length * chrsz))}
function hex_hmac_sha1 (key, data) { return binb2hex(core_hmac_sha1(key, data))}
function b64_hmac_sha1 (key, data) { return binb2b64(core_hmac_sha1(key, data))}
function str_hmac_sha1 (key, data) { return binb2str(core_hmac_sha1(key, data))}

/*
 * Perform a simple self-test to see if the VM is working
 */
function sha1_vm_test () {
  return hex_sha1('abc') == 'a9993e364706816aba3e25717850c26c9cd0d89d'
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function core_sha1 (x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << (24 - len % 32)
  x[((len + 64 >> 9) << 4) + 15] = len

  var w = Array(80)
  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878
  var e = -1009589776

  for (var i = 0; i < x.length; i += 16) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d
    var olde = e

    for (var j = 0; j < 80; j++) {
      if (j < 16) w[j] = x[i + j]
      else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
        safe_add(safe_add(e, w[j]), sha1_kt(j)))
      e = d
      d = c
      c = rol(b, 30)
      b = a
      a = t
    }

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
    e = safe_add(e, olde)
  }
  return Array(a, b, c, d, e)

}

/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */
function sha1_ft (t, b, c, d) {
  if (t < 20) return (b & c) | ((~b) & d)
  if (t < 40) return b ^ c ^ d
  if (t < 60) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function sha1_kt (t) {
  return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
    (t < 60) ? -1894007588 : -899497514
}

/*
 * Calculate the HMAC-SHA1 of a key and some data
 */
function core_hmac_sha1 (key, data) {
  var bkey = str2binb(key)
  if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz)

  var ipad = Array(16), opad = Array(16)
  for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636
    opad[i] = bkey[i] ^ 0x5C5C5C5C
  }

  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz)
  return core_sha1(opad.concat(hash), 512 + 160)
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add (x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function rol (num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

/*
 * Convert an 8-bit or 16-bit string to an array of big-endian words
 * In 8-bit function, characters >255 have their hi-byte silently ignored.
 */
function str2binb (str) {
  var bin = Array()
  var mask = (1 << chrsz) - 1
  for (var i = 0; i < str.length * chrsz; i += chrsz) {
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32)
  }
  return bin
}

/*
 * Convert an array of big-endian words to a string
 */
function binb2str (bin) {
  var str = ''
  var mask = (1 << chrsz) - 1
  for (var i = 0; i < bin.length * 32; i += chrsz) {
    str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask)
  }
  return str
}

/*
 * Convert an array of big-endian words to a hex string.
 */
function binb2hex (binarray) {
  var hex_tab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef'
  var str = ''
  for (var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
      hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
  }
  return str
}

/*
 * Convert an array of big-endian words to a base-64 string
 */
function binb2b64 (binarray) {
  var tab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var str = ''
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16)
      | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8)
      | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF)
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad
      else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F)
    }
  }
  return str
}

/*
 * jQuery Mobile Framework : plugin to provide a date and time picker.
 * Copyright (c) JTSage
 * CC 3.0 Attribution.  May be relicensed without permission/notifcation.
 * https://github.com/jtsage/jquery-mobile-datebox
 *
 * Translation by: Chris P. Vigelius <me@cv.gd>, Pascal Hofmann <crowdin>
 *
 */

$.extend($.mobile.datebox.prototype.options.lang, {
  'de': {
    setDateButtonLabel: 'speichern',
    setTimeButtonLabel: 'speichern',
    setDurationButtonLabel: 'speichern',
    calTodayButtonLabel: 'heute',
    titleDateDialogLabel: 'Datum wählen',
    titleTimeDialogLabel: 'Zeit wählen',
    daysOfWeek: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    daysOfWeekShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    monthsOfYear: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthsOfYearShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dez'],
    durationLabel: ['Tage', 'Stunden', 'Minuten', 'Sekunden'],
    durationDays: ['Tag', 'Tage'],
    tooltip: 'Kalender öffnen',
    nextMonth: 'Nächster Monat',
    prevMonth: 'Vorheriger Monat',
    timeFormat: 24,
    // headerFormat: '%A, %B %-d, %Y',
    headerFormat: '%Y-%m-%d',
    dateFieldOrder: ['d', 'm', 'y'],
    timeFieldOrder: ['h', 'i', 'a'],
    slideFieldOrder: ['y', 'm', 'd'],
    dateFormat: '%Y-%m-%d',
    useArabicIndic: false,
    isRTL: false,
    calStartDay: 1,
    clearButton: 'löschen',
    durationOrder: ['d', 'h', 'i', 's'],
    meridiem: ['AM', 'PM'],
    timeOutput: '%k:%M',
    durationFormat: '%Dd %DA, %Dl:%DM:%DS',
    calDateListLabel: 'Weitere Termine'
  }
})
$.extend($.mobile.datebox.prototype.options, {
  useLang: 'de'
})

},{"./util/chToWgsLat":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\chToWgsLat.js","./util/chToWgsLng":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\chToWgsLng.js","./util/ddInChX":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInChX.js","./util/ddInChY":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInChY.js","./util/erstelleNeueUhrzeit":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\erstelleNeueUhrzeit.js","./util/erstelleNeuesDatum":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\erstelleNeuesDatum.js","jquery":"C:\\Users\\alex\\EvabMobile\\node_modules\\jquery\\dist\\jquery.js","underscore":"C:\\Users\\alex\\EvabMobile\\node_modules\\underscore\\underscore.js"}],"C:\\Users\\alex\\EvabMobile\\node_modules\\jquery\\dist\\jquery.js":[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-05-01T17:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper window is present,
		// execute the factory and get jQuery
		// For environments that do not inherently posses a window with a document
		// (such as Node.js), expose a jQuery-making factory as module.exports
		// This accentuates the need for the creation of a real window
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		return !jQuery.isArray( obj ) && obj - parseFloat( obj ) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android < 4.0, iOS < 6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v1.10.19
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-04-18
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== strundefined && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare,
		doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", function() {
				setDocument();
			}, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", function() {
				setDocument();
			});
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName ) && assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowclip^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	// Support: Windows Web Apps (WWA)
	// `name` and `type` need .setAttribute for WWA
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Make sure textarea (and checkbox) defaultValue is properly cloned
	// Support: IE9-IE11+
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android < 4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optmization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') in IE9, see #12537
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due to missing dependency),
				// remove it.
				// Since there are no other hooks for marginRight, remove the whole object.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.

			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {
				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {
				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set. See: #7116
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// Work around by temporarily setting element display to inline-block
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// getComputedStyle returns percent when specified for top/left/bottom/right
// rather than make the css module depend on the offset module, we just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// if curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in
// AMD (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],"C:\\Users\\alex\\EvabMobile\\node_modules\\underscore\\underscore.js":[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\chToWgsLat.js":[function(require,module,exports){
/**
 * Convert CH y/x to WGS lat
 * @return {number}
 */

'use strict'

module.exports = function (y, x) {
  // Converts militar to civil and to unit = 1000km
  var lat,
    y_aux,
    x_aux

  // Axiliary values (% Bern)
  y_aux = (y - 600000) / 1000000
  x_aux = (x - 200000) / 1000000

  // Process lat
  lat = 16.9023892
    + 3.238272 * x_aux
    - 0.270978 * Math.pow(y_aux, 2)
    - 0.002528 * Math.pow(x_aux, 2)
    - 0.0447 * Math.pow(y_aux, 2) * x_aux
    - 0.0140 * Math.pow(x_aux, 3)

  // Unit 10000" to 1 " and converts seconds to degrees (dec)
  lat = lat * 100 / 36

  return lat
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\chToWgsLng.js":[function(require,module,exports){
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

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInChX.js":[function(require,module,exports){
/**
 * wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict'

module.exports = function (breite, länge) {
  var DdInWgs84BreiteGrad = require('./ddInWgs84BreiteGrad'),
    breiteGrad = DdInWgs84BreiteGrad(breite),
    DdInWgs84BreiteMin = require('./ddInWgs84BreiteMin'),
    breiteMin = DdInWgs84BreiteMin(breite),
    DdInWgs84BreiteSec = require('./ddInWgs84BreiteSec'),
    breiteSec = DdInWgs84BreiteSec(breite),
    DdInWgs84LängeGrad = require('./ddInWgs84LaengeGrad'),
    längeGrad = DdInWgs84LängeGrad(länge),
    DdInWgs84LängeMin = require('./ddInWgs84LaengeMin'),
    längeMin = DdInWgs84LängeMin(länge),
    DdInWgs84LängeSec = require('./ddInWgs84LaengeSec'),
    längeSec = DdInWgs84LängeSec(länge),
    Wgs84InChX = require('./wgs84InChX')
  return Math.floor(Wgs84InChX(breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, längeSec))
}

},{"./ddInWgs84BreiteGrad":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteGrad.js","./ddInWgs84BreiteMin":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteMin.js","./ddInWgs84BreiteSec":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteSec.js","./ddInWgs84LaengeGrad":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeGrad.js","./ddInWgs84LaengeMin":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeMin.js","./ddInWgs84LaengeSec":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeSec.js","./wgs84InChX":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\wgs84InChX.js"}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInChY.js":[function(require,module,exports){
/**
 * wandelt decimal degrees (vom GPS) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict'

module.exports = function (breite, länge) {
  var DdInWgs84BreiteGrad = require('./ddInWgs84BreiteGrad'),
    breiteGrad = DdInWgs84BreiteGrad(breite),
    DdInWgs84BreiteMin = require('./ddInWgs84BreiteMin'),
    breiteMin = DdInWgs84BreiteMin(breite),
    DdInWgs84BreiteSec = require('./ddInWgs84BreiteSec'),
    breiteSec = DdInWgs84BreiteSec(breite),
    DdInWgs84LängeGrad = require('./ddInWgs84LaengeGrad'),
    längeGrad = DdInWgs84LängeGrad(länge),
    DdInWgs84LängeMin = require('./ddInWgs84LaengeMin'),
    längeMin = DdInWgs84LängeMin(länge),
    DdInWgs84LängeSec = require('./ddInWgs84LaengeSec'),
    längeSec = DdInWgs84LängeSec(länge),
    Wgs84InChY = require('./wgs84InChY')
  return Math.floor(Wgs84InChY(breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, längeSec))
}

},{"./ddInWgs84BreiteGrad":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteGrad.js","./ddInWgs84BreiteMin":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteMin.js","./ddInWgs84BreiteSec":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteSec.js","./ddInWgs84LaengeGrad":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeGrad.js","./ddInWgs84LaengeMin":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeMin.js","./ddInWgs84LaengeSec":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeSec.js","./wgs84InChY":"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\wgs84InChY.js"}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteGrad.js":[function(require,module,exports){
/**
 * wandelt decimal degrees (vom GPS) in WGS84 um
 * @return {number}
 */

'use strict'

module.exports = function (Breite) {
  return Math.floor(Breite)
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteMin.js":[function(require,module,exports){
/**
 * wandelt Projektionen um
 * @return {number}
 */

'use strict'

module.exports = function (Breite) {
  var BreiteGrad = Math.floor(Breite)
  return Math.floor((Breite - BreiteGrad) * 60)
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84BreiteSec.js":[function(require,module,exports){
/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (Breite) {
  var BreiteGrad = Math.floor(Breite),
    BreiteMin = Math.floor((Breite - BreiteGrad) * 60)
  return Math.round((((Breite - BreiteGrad) - (BreiteMin / 60)) * 60 * 60) * 100) / 100
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeGrad.js":[function(require,module,exports){
/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (Laenge) {
  return Math.floor(Laenge)
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeMin.js":[function(require,module,exports){
/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (Laenge) {
  var LaengeGrad = Math.floor(Laenge)
  return Math.floor((Laenge - LaengeGrad) * 60)
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\ddInWgs84LaengeSec.js":[function(require,module,exports){
/**
 * Konvertiert Projektionen
 * @return {number}
 */

'use strict'

module.exports = function (Laenge) {
  var LaengeGrad = Math.floor(Laenge),
    LaengeMin = Math.floor((Laenge - LaengeGrad) * 60)
  return Math.round((((Laenge - LaengeGrad) - (LaengeMin / 60)) * 60 * 60) * 100) / 100
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\erstelleNeueUhrzeit.js":[function(require,module,exports){
'use strict'

module.exports = function () {
  var jetzt = new Date(),
    Std = jetzt.getHours(),
    StdAusgabe = ((Std < 10) ? '0' + Std : Std),
    Min = jetzt.getMinutes(),
    MinAusgabe = ((Min < 10) ? '0' + Min : Min),
    Sek = jetzt.getSeconds(),
    SekAusgabe = ((Sek < 10) ? '0' + Sek : Sek)
  return StdAusgabe + ':' + MinAusgabe + ':' + SekAusgabe
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\erstelleNeuesDatum.js":[function(require,module,exports){
'use strict'

module.exports = function () {
  var jetzt = new Date(),
    Jahr = jetzt.getFullYear(),
    Mnt = jetzt.getMonth() + 1,
    MntAusgabe = ((Mnt < 10) ? '0' + Mnt : Mnt),
    Tag = jetzt.getDate(),
    TagAusgabe = ((Tag < 10) ? '0' + Tag : Tag)
  return Jahr + '-' + MntAusgabe + '-' + TagAusgabe
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\wgs84InChX.js":[function(require,module,exports){
/**
 * Wandelt WGS84 lat/long (° dec) in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict'

module.exports = function (breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, längeSec) {
  var lat,
    lng,
    lat_aux,
    lng_aux,
    x

  // Converts degrees dec to sex
  lat = breiteSec + breiteMin * 60 + breiteGrad * 3600
  lng = längeSec + längeMin * 60 + längeGrad * 3600

  // Axiliary values (% Bern)
  lat_aux = (lat - 169028.66) / 10000
  lng_aux = (lng - 26782.5) / 10000

  x = 200147.07
    + 308807.95 * lat_aux
    + 3745.25 * Math.pow(lng_aux, 2)
    + 76.63 * Math.pow(lat_aux, 2)
    - 194.56 * Math.pow(lng_aux, 2) * lat_aux
    + 119.79 * Math.pow(lat_aux, 3)

  return x
}

},{}],"C:\\Users\\alex\\EvabMobile\\vendor\\couchapp\\_attachments\\util\\wgs84InChY.js":[function(require,module,exports){
/**
 * Wandelt WGS84 in CH-Landeskoordinaten um
 * @return {number}
 */

'use strict'

module.exports = function (breiteGrad, breiteMin, breiteSec, längeGrad, längeMin, läengeSec) {
  var lat,
    lng,
    lat_aux,
    lng_aux,
    y

  // Converts degrees dec to sex
  lat = breiteSec + breiteMin * 60 + breiteGrad * 3600
  lng = läengeSec + längeMin * 60 + längeGrad * 3600

  // Axiliary values (% Bern)
  lat_aux = (lat - 169028.66) / 10000
  lng_aux = (lng - 26782.5) / 10000

  // Process Y
  y = 600072.37
    + 211455.93 * lng_aux
    - 10938.51 * lng_aux * lat_aux
    - 0.36 * lng_aux * Math.pow(lat_aux, 2)
    - 44.54 * Math.pow(lng_aux, 3)

  return y
}

},{}]},{},["./vendor/couchapp/_attachments/evab.js"])
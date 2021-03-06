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

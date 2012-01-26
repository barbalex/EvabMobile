#Ausgangslage
Im Naturschutz sind anspruchsvolle Auswertungen und Erfolgskontrollen nur möglich, wenn Artbeobachtungsdaten digital vorliegen. Werden diese den nationalen Artdaten-Zentren der Schweiz geliefert (info flora, info fauna etc.), können sie über das ursprüngliche Projekt hinaus weiteren Nutzen bringen.

Meist werden Artbeobachtungen im Feld auf Papier notiert. Im besten Fall auf vorbereiteten Formularen. 
Gängige Fehlerquellen:  

- Arten sind nicht eindeutig bezeichnet
- Daten sind unvollständig oder nicht gemäss den Vorgaben des Projekts erfasst
- Der Ort ist nicht eindeutig, ungenau oder gar falsch (Koordinaten falsch ausgelesen)

Die Digitalisierung erfolgt - wenn überhaupt - später im Büro. Im besten Fall nach wenigen Stunden durch dieselbe Person. Im schlechtesten Fall durch eine andere Person ohne direkten Kontakt zur FeldbeobachterIn. 
Gängige Fehlerquellen:  

- Falsche Interpretation nicht oder nicht eindeutig erfasster Informationen (besonders: Artnamen). 
  Im besten Fall werden unklare Beobachtungen nicht digitalisiert. 
- Artbeobachtungen digitalisieren ist mühsame, monotone Fleissarbeit. 
  Es ist allzu menschlich, sie 
  1. an eine andere Person auszulagern und 
  2. nach dem 80/20-Prinzip zu machen: Oft wird der Geschwindigkeit mehr Beachtung geschenkt als der Fehlervermeidung.

#Motivation
Mit der beschriebenen Ausgangslage sind wir in der [Fachstelle Naturschutz des Kantons Zürich](http://naturschutz.zh.ch) regelmässig konfrontiert. Als Artdatenverantwortlicher habe ich diese Probleme zu lösen. Gleichzeitig habe ich schon immer gerne mit Software "Rätsel gelöst". Das Abenteuer mit den diversen unbekannten Technologien reizt (siehe unten, "Hilfe erwünscht"). Erfahrungsgemäss haben Biologen Mühe, ein hinreichendes Pflichtenheft zu schreiben mit dem Programmierer eine gute App erstellen können. 

**Darum soll dieses Projekt in erster Linie Ideen und Möglichkeiten aufzeigen.**

Vielleicht wird es in einer Übergangszeit auch ein nützliches Werkzeug. Aber gute Software programmieren können Profi-Programmierer nun wirklich besser.

#Projektidee
- Eine Mobil-App (Android und iOS) ermöglicht die Erfassung von Artbeobachtungen direkt im Feld, unabhängig vom Mobilfunknetz
- Zur Programmierung werden [HTML5](http://de.wikipedia.org/wiki/HTML5), [JavaScript](http://de.wikipedia.org/wiki/JavaScript), [jQuery mobile](http://jquerymobile.com) und [Phonegap](http://phonegap.com) verwendet. Damit sollte die App prinzipiell auf jedes Betriebssystem portiert werden können
- Die App steht auch als [Webseite](http://barbalex.iriscouch.com/evab/_design/evab/index.html) zur Verfügung
- Als Datenbank wird [CouchDb](http://couchdb.apache.org/) verwendet, in Form einer [CouchApp](http://couchapp.org). Die Datenbank ist somit ihr eigener Webserver, die App kann auf PC's lokal installiert werden und synchronisiert automatisch im Hintergrund. Sogar die App selbst wird laufend synchronisiert, d.h. updates erfolgen automatisch (ausser auf iOS, weil Apple das nicht zulässt)
- Da schemafrei, können mit CouchDb zusätzliche projekteigene Attribute definiert sowie Dateien (z.B. Bilder) angehängt werden


#Ziele für Naturschutzfachstellen
1. Artbeobachtungen liegen vermehrt digital vor
2. Sie stehen schneller zur Verfügung
3. Ihre Datenqualität ist höher, da bedeutende Fehlerquellen ausgeschaltet wurden
4. Der Gesamtaufwand für Felderfassung und Digitalisierung sinkt
5. Die Vorteile motivieren FeldbeobachterInnen, Artbeobachtungen direkt digital zu erfassen


#Ziele für Naturschutzprofis
1. Mühsame Nachbearbeitung reduzieren
2. Projekte schneller abschliessen
3. Anforderungen der Naturschutzfachstellen besser erfüllen


#Ziele für Hobby-ArtbeobachterInnen
1. Beobachtungen übersichtlich dokumentieren 
2. Mit den Daten zum Schutz seltener Arten beitragen


#Was kann die App momentan?
**Generell:**

- Sie ist erst eine Webseite. Moderne Browser werden vorausgesetzt. Zusätzlich kann sie auf iOS und Windows installiert werden (kaum getestet)
- Jede Änderung wird automatisch gespeichert
- Automatisch durch Gerät lokalisieren: Koordinaten werden ab einer Genauigkeit von 100 m gespeichert. Bis zu einer Genauigkeit von 30 m wird auf die Ungenauikeit hingewiesen und auf die nächste Möglichkeit hingewiesen:
- Manuell auf Luftbildern / Karten von Google lokalisieren. Das Luftbild wird auf die aktuelle Position zentriert
- Alle Beobachtungen auf Luftbild / Karte darstellen. Pro Benutzer, Projekt oder Raum. Der Kartenausschnitt passt sich an die Beobachtungen an
- Durch Listen und Formulare "swipen"
- Die App öffnet nach Neuanmeldung wieder die zuletzt benutzte Seite
- Beobachtungen und Datenfelder exportieren
- Andere Apps (z.B. das GIS eines Ökobüros) können auf die Daten zugreifen, schon während der Feldarbeit! Voraussetzungen: Erfolgreiche Authentifizierung und die Fähigkeit, über http [JSON-Daten](http://en.wikipedia.org/wiki/JSON) zu lesen (ist noch nicht verbreitet aber im Kommen)

**Im einfachen Modus:**

- Beobachtungen schnell und unkompliziert erfassen. Nur die grundlegenden Attribute

**Im hierarchischen Modus:**

- Umfassende Aufnahmen effizient erheben: Informationen zu Projekt, Raum, Ort und Zeit müssen nur ein mal erfasst werden
- Jede Artgruppe hat auf der Hierarchiestufe "Art" ihre eigenen Attribute (Datenfelder)
- Wählen, welche Felder sichtbar sind
- Eigene Datenfelder erstellen, frei konfigurierbar, inklusive eigener Auwahllisten
- Datenfelder, welche öffentliche Datenzentren verwenden, sind geschützt
- Eigene Datenfelder können (erst) gelöscht oder umbenannt werden, wenn sie in keinem Datensatz (mehr) verwendet werden
- Unbekannte Arten beschreiben, z.B. um sie später genauer zu bestimmen
- Eigene Arten erfassen, welche nicht im offiziellen Index enthalten sind (Spezialfälle für Artspezialisten und frische Neobiota)

#Wie geht es weiter? (roadmap)
- Macken reduzieren
- Daten schützen
- Android- und iOS-App
- Funktionalität erweitern, z.B.:
  - Standardwerte bestimmen
  - Bilder und Tonaufnahmen anhängen
  - spezifisch Neobiota erfassen
  - Datenbanken teilen (gemeinsam an Projekten arbeiten!)
  - Anzahl Meldungen derselben Art im 10*10km-Quadranten, Jahr der jüngsten Meldung
  - Eigene Darstellung für grosse Bildschirme
  - Beobachtungen in Listenform bearbeiten (Beispiel Flora: zuerst Artenliste erheben, dann in Listenform die Deckungen)
  - Artgruppe vorwählen (z.B. für Flora-Aufnahmen)
  - Eventuell Hierarchiestufen selber definieren? So könnte man für ein Projekt z.B. Zeit über Ort setzen!
- Tempo erhöhen

Wünschbar aber wohl mindestens teilweise ausserhalb meiner Fähigkeiten wären erweiterte Kartenfunktionen:

- Karten der Swisstopo verwenden
- Nützliche Layer anbieten (Schutzgebiete, Parzellen...)
- Linien und Flächen digitalisieren
- Umriss zeichnen > darin liegende Beobachtungen auflisten

Es gibt keinen Zeitplan. Die Weiterentwicklung hängt von meiner Motivation, Lernfähigkeit und Freizeit ab.

#Hilfe erwünscht
Ich bin Biologe. HTML5, CSS, JavaScript, jQuery, jQuery mobile, Phonegap, CouchDb, CouchApp, Java/Android SDK und Cocoa/Objective-C waren soeben noch Fremdwörter. Wäre toll, wenn sich noch jemand für dieses Projekt engagieren würde!

#Gibt's das nicht schon?
Die App existiert eigentlich schon. Sie heisst EvAB (<span style="text-decoration: underline;"><strong>E</strong></span>rfassung <span style="text-decoration: underline;"><strong>v</strong></span>on <span style="text-decoration: underline;"><strong>A</strong></span>rt-<span style="text-decoration: underline;"><strong>B</strong></span>eobachtungen) und kann <a target="_blank" href="http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html">hier</a>&nbsp;heruntergeladen werden. Bloss trägt bisher niemand einen Windows-PC im Feld herum. Ausserdem sollte die App für den Feldgebrauch noch benutzerfreundlicher werden. 

Ein eigentliches Mobil-App habe ich erst eines gefunden: Der&nbsp;<a target="_blank" href="http://itunes.apple.com/us/app/artenfinder/id411688829?mt=8">Artenfinder</a>&nbsp;ist schon ziemlich gut. Unsere Deutschen Kollegen legen sich da ins Zeug. Und sie kümmern sich um ihre freiwilligen ArtbeobachterInnen. Toll!

#Das will ich ausprobieren
Die Webversion des Apps ist <a target="_blank" href="http://barbalex.iriscouch.com/evab/_design/evab/index.html">hier</a> sichtbar.

Achtung: Funktioniert mit Internet Explorer erst ab Version 9. Getestet in: Firefox ab Version 4, Internet Explorer 9, Chrome. Auf Mobilgeräten funktionieren momentan am besten: Firefox mobile, Opera mobile, Android-Browser auf ICS (Android Version 4). 

Die App überrascht immer wieder, wenn jQuery mobile oder ein Browser aktualisiert wurde - meist mit Fehlern, hin und wieder mit Verbesserungen...
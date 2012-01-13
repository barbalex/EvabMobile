#Ausgangslage
Im Naturschutz sind anspruchsvolle Auswertungen und Erfolgskontrollen nur möglich, wenn Artbeobachtungsdaten digital vorliegen. Werden diese den nationalen Artdaten-Zentren der Schweiz geliefert (info flora, info fauna etc.), können sie über das ursprüngliche Projekt hinaus weiteren Nutzen bringen.

Meist werden Artbeobachtungen im Feld auf Papier notiert. Im besten Fall auf vorbereiteten Formularen. 
Gängige Fehlerquellen:  

- Nicht eindeutige Bezeichnung von Arten
- Erfassung unvollständig oder nicht gemäss den Vorgaben des Projekts
- Nicht eindeutige Ortsbeschreibung oder ungenaues/fehlerhaftes Auslesen von Koordinaten

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

**Darum soll dieses Projekt in erster Linie Ideenträger sein und Möglichkeiten aufzeigen.**

Vielleicht wird es in einer Übergangszeit auch ein nützliches Werkzeug. Aber gute Software programmieren können Profi-Programmierer nun wirklich besser.

#Projektidee
- Eine Mobil-App (Android und iOS) ermöglicht die Erfassung von Artbeobachtungen direkt im Feld, unabhängig vom Mobilfunknetz
- Zur Programmierung werden HTML5, [jQuery mobile](http://jquerymobile.com/) und [Phonegap](http://phonegap.com/) verwendet. Damit sollte das App prinzipiell auf jedes Betriebssystem portiert werden können
- Die App steht auch als Webseite zur Verfügung. Momentan [hier](http://barbalex.iriscouch.com/evab/_design/evab/index.html)
- Als Datenbank wird [CouchDb](http://couchdb.apache.org/) verwendet. Die App kann damit auf PC's lokal installiert werden und laufend synchronisieren
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
- Alle Beobachtungen auf Luftbild / Karte darstellen. Das Luftbild wird auf die aktuelle Position zentriert
- Durch Listen und Formulare "swipen"
- App öffnet nach Neuanmeldung wieder die zuletzt benutzte Seite
- Beobachtungen und Datenfelder exportieren

**Im einfachen Modus:**

- Beobachtungen schnell und unkompliziert erfassen. Nur die grundlegenden Attribute

**Im hierarchischen Modus:**

- Umfassende Aufnahmen effizient erheben: Informationen zu Projekt, Raum, Ort und Zeit müssen nur ein mal erfasst werden
- Jede Artgruppe hat auf der Hierarchiestufe "Art" ihre eigenen Attribute (Datenfelder)
- Wählen, welche Felder sichtbar sind
- Eigene Datenfelder erstellen, frei konfigurierbar, inklusive eigener Auwahllisten
- Datenfelder, welche die nationalen Datenzentren verwenden, sind geschützt
- Unbekannte Arten beschreiben, z.B. um sie später genauer zu bestimmen
- Eigene Arten erfassen, welche nicht im offiziellen Index enthalten sind (Spezialfälle für Artspezialisten und frische Neobiota)

#Wie geht es weiter? (roadmap)
- Macken reduzieren
- Datenschutz gewährleisten
- Android- und iOS-App
- Funktionalität erweitern, z.B.:
  - Bilder und Tonaufnahmen anhängen
  - spezifisch Neobiota erfassen
  - Datenbanken teilen
  - Anzahl Meldungen derselben Art im 10*10km-Quadranten, Jahr der jüngsten Meldung
  - Eigene Darstellung für grosse Bildschirme
  - Beobachtungen in Listenform bearbeiten (Beispiel Flora: zuerst Artenliste erheben, dann in Listenform die Deckungen)
  - Artgruppe vorwählen (z.B. für Flora-Aufnahmen)
- Tempo erhöhen

Es gibt keinen Zeitplan. Die Weiterentwicklung hängt von meiner Motivation und Freizeit ab.

#Hilfe erwünscht
Ich bin Biologe. Mit Access-Datenbanken und deren Steuerung mit Visual Basic habe ich einige Erfahrung. Was JavaScript, jQuery, jQuery mobile, Phonegap und CouchDb anbelangt, war ich aber ein blutiger Anfänger und befinde mich in einer steilen - und schlüpfrigen - Lernkurve. Noch schlimmer: Java/Android SDK für Android-Apps und Cocoa/Objective-C für iOS-Apps. Es hilft auch nicht, dass HTML5, CouchDb, jQuery mobile und Phonegap am Beginn bzw. mitten in einer rasanten Entwicklung stehen. Wäre toll, wenn sich noch jemand für dieses Projekt engagieren würde!

#Gibt's das nicht schon?
Das App existiert eigentlich schon. Es heisst EVAB (<span style="text-decoration: underline;"><strong>E</strong></span>rfassung <span style="text-decoration: underline;"><strong>v</strong></span>on <span style="text-decoration: underline;"><strong>A</strong></span>rt-<span style="text-decoration: underline;"><strong>B</strong></span>eobachtungen) und kann <a target="_blank" href="http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html">hier</a>&nbsp;heruntergeladen werden. Bloss trägt bisher niemand einen Windows-PC im Feld herum. Ausserdem sollte das App für den Feldgebrauch noch benutzerfreundlicher werden. Ein eigentliches Mobil-App habe ich erst eines gefunden: Der&nbsp;<a target="_blank" href="http://itunes.apple.com/us/app/artenfinder/id411688829?mt=8">Artenfinder</a>&nbsp;ist schon ziemlich gut. Unsere Deutschen Kollegen legen sich da ins Zeug.

#Das will ich ausprobieren
Die Webversion des Apps ist <a target="_blank" href="http://barbalex.iriscouch.com/evab/_design/evab/index.html">hier</a> sichtbar.
Achtung: Funktioniert mit Internet Explorer erst ab Version 9 (Versionen bis 8 unterstützen HTML5 nicht). Getestet in: Firefox ab Version 4, Internet Explorer 9, Chrome.
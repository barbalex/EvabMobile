#Ausgangslage
Für viele biologische Projekte ist die Verfügbarkeit von digitalen Art-Beobachtungsdaten wichtig. Anspruchsvolle Auswertungen und Erfolgskontrollen sind nur mit digitalen Daten möglich. Fliessen diese in den nationalen Kreislauf der Schweiz (info flora, info fauna etc.), können sie über das ursprüngliche Projekt hinaus weiteren Nutzen bringen.

Meist werden Artbeobachtungen im Feld auf Papier notiert. Im besten Fall auf vorbereiteten Formularen. 
Gängige Fehlerquellen:  

- Nicht eindeutige Bezeichnung von Arten
- Erfassung unvollständig oder nicht gemäss den Vorgaben des Projekts
- Nicht eindeutige Ortsbeschreibung oder ungenaues/fehlerhaftes Auslesen von Koordinaten

Die Digitalisierung erfolgt - wenn überhaupt - später im Büro. Im besten Fall nach wenigen Stunden durch dieselbe Person. Im schlechtesten Fall durch eine andere Person ohne direkten Kontakt zur FeldbeobachterIn. 
Gängige Fehlerquellen:  

- Falsche Interpretation nicht oder nicht eindeutig erfasster Informationen. 
  Im besten Fall werden unklare Beobachtungen nicht digitalisiert. 
- Die Digitalisierung von Artbeobachtungen ist mühsame, monotone Fleissarbeit. 
  Es ist allzu menschlich, sie 
  1. an eine andere Person auszulagern und 
  2. nach dem 80/20-Prinzip zu machen: 
     Oft wird der Geschwindigkeit mehr Beachtung geschenkt als der Fehlervermeidung.


#Meine Motivation
Mit der beschriebenen Ausgangslage sind wir in der Fachstelle Naturschutz des Kantons Zürich regelmässig konfrontiert. Als Artdatenverantwortlicher habe ich diese Probleme zu lösen. Gleichzeitig habe ich schon immer gerne mit Software "Rätsel gelöst". Das Abenteuer mit den diversen unbekannten Technologien reizt (siehe unten, "Hilfe erwünscht"). Meine Erfahrung lehrt mich, dass Biologen es in der Regel nicht schaffen, ein hinreichendes Pflichtenheft zu schreiben mit dem Programmierer eine neue, gute App erstellen können. 

*Darum soll dieses Projekt in erster Linie Ideenträger sein und Möglichkeiten aufzeigen*

Vielleicht wird es in einer Übergangszeit auch ein nützliches Werkzeug. Aber gute Software programmieren können Profi-Programmierer nun wirklich besser.


#Projektidee
- Eine Mobil-App (Android und iOS) ermöglicht die Erfassung von Art-Beobachtungen direkt im Feld, 
  unabhängig vom Mobilfunknetz
- Für die Mobil-App wird jQuery mobile und Phonegap verwendet
  Damit sollte es für möglichst viele Geräte entwickelt werden können
- Die App steht auch als Webseite zur Verfügung
- Als Datenbank wird CouchDb verwendet
  Die App kann damit auch lokal auf PC installiert und jederzeit synchronisiert werden
- Da schemafrei, können mit CouchDb zusätzliche projekteigene Attribute definiert 
  sowie Dateien (z.B. Bilder) zugeordnet werden


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
##Generell:
- Sie ist erst eine Webseite. Moderne Browser werden vorausgesetzt
  Zusätzlich kann sie auf iOS und Windows installiert werden (kaum getestet)
- Jede Änderung wird automatisch gespeichert
- Automatisch durch Gerät lokalisieren:
  Koordinaten werden ab einer Genauigkeit von 100 m gespeichert
  Bis zu einer Genauigkeit von 30 m wird auf die Ungenauikeit hingewiesen
  und auf die nächste Möglichkeit hingewiesen:
- Manuell auf Luftbildern / Karten von Google lokalisieren
  Das Luftbild wird auf die aktuelle Position zentriert
- Alle Beobachtungen auf Luftbild / Karte darstellen
  Das Luftbild wird auf die aktuelle Position zentriert
- Durch Listen und Formulare "swipen"
- App öffnet nach Neuanmeldung wieder die zuletzt benutzte Seite
- Beobachtungen und Datenfelder exportieren

##Im einfachen Modus:
- Beobachtungen schnell und unkompliziert erfassen. Nur die grundlegenden Attribute

##Im hierarchischen Modus:
- Umfassende Aufnahmen effizient erheben: 
  Informationen zu Projekt, Raum, Ort und Zeit müssen nur ein mal erfasst werden
- Jede Artgruppe hat auf der Hierarchiestufe "Art" ihre eigenen Attribute (Datenfelder)
- Wählen, welche Felder sichtbar sind
- Eigene Datenfelder erstellen, frei konfigurierbar, inklusive eigener Auwahllisten
- Unbekannte Arten beschreiben, z.B. um sie später genauer zu bestimmen
- Eigene Arten erfassen, welche nicht im offiziellen Index enthalten sind
  (Spezialfälle für Artspezialisten und frische Neobiota)


#Wie geht es weiter? (roadmap)
- Macken reduzieren
- Tempo erhöhen
- Datenschutz gewährleisten (wird wohl die grösste Knacknuss!)
- Android- und iOS-App
- Funktionalität erweitern, z.B.:
  - Bilder und Tonaufnahmen anhängen
  - spezifisch Neobiota erfassen
  - Datenbanken teilen
  - Anzahl Meldungen derselben Art im 10*10km-Quadranten, Jahr der jüngsten Meldung
  - andere Darstellung auf grossen Bildschirmen  
  - Beobachtungen in Listenform bearbeiten 
    (Beispiel Flora: zuerst Artenliste erheben, dann in Listenform die Deckungen)
  - Artgruppe vorwählen (z.B. für Flora-Aufnahmen)
Es gibt keinen Zeitplan. Die Weiterentwicklung hängt von meiner Motivation und Freizeit ab.


#Hilfe erwünscht
Ich bin Biologe. Mit Access-Datenbanken und deren Steuerung mit Visual Basic habe ich einige Erfahrung. Was JavaScript, jQuery, jQuery mobile, Phonegap und CouchDb anbelangt, war ich aber ein blutiger Anfänger und befinde mich in einer steilen - und schlüpfrigen - Lernkurve. Noch schlimmer: Java/Android SDK für Android-Apps und Cocoa/Objective-C für iOS-Apps. Es hilft auch nicht, dass HTML5, CouchDb, jQuery mobile und Phonegap am Beginn bzw. mitten in einer rasanten Entwicklung stehen. Wäre toll, wenn sich noch jemand für dieses Projekt engagieren würde!
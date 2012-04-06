#Ausgangslage
Im Naturschutz sind anspruchsvolle Auswertungen und Erfolgskontrollen nur möglich, wenn Artbeobachtungsdaten digital vorliegen. Werden diese den [nationalen Artdaten-Zentren der Schweiz](http://www.natportal.ch/) geliefert, können sie über das ursprüngliche Projekt hinaus weiteren Nutzen bringen.

Meist werden Artbeobachtungen im Feld auf Papier notiert. Im besten Fall auf vorbereiteten Formularen. 
Gängige Fehlerquellen:  

- Arten sind nicht eindeutig bezeichnet
- Daten sind unvollständig oder nicht gemäss den Vorgaben des Projekts erfasst
- Der Ort ist nicht eindeutig, ungenau oder gar falsch (Koordinaten falsch ausgelesen)
- Die Schrift ist unleserlich

Die Digitalisierung erfolgt - wenn überhaupt - später im Büro. Im besten Fall nach wenigen Stunden durch dieselbe Person. Im schlechtesten Fall durch eine andere Person ohne direkten Kontakt zur FeldbeobachterIn. 
Gängige Probleme:  

- Die Daten werden gar nie digitalisiert
- Nicht oder nicht eindeutig erfasste Informationen werden falsch interpretiert (besonders Artnamen).<br>Im besten Fall werden unklare Beobachtungen nicht digitalisiert. 
- Artbeobachtungen digitalisieren ist mühsam und monoton. 
  Es ist allzu menschlich, die Arbeit 
  1. an eine andere Person auszulagern und 
  2. nach dem 80/20-Prinzip zu machen: Oft wird der Geschwindigkeit mehr Beachtung geschenkt als der Fehlervermeidung.

#Motivation
Mit der beschriebenen Ausgangslage sind wir in der [Fachstelle Naturschutz des Kantons Zürich](http://naturschutz.zh.ch) regelmässig konfrontiert. Als Artdatenverantwortlicher habe ich diese Probleme zu lösen. Gleichzeitig knoble ich schon immer gerne mit Software. Das Abenteuer mit den diversen unbekannten Technologien reizt (siehe unten, "Hilfe erwünscht"). Erfahrungsgemäss haben Biologen Mühe, ein Pflichtenheft zu schreiben mit dem Programmierer eine gute App erstellen können. Meist lohnt es sich, mit einer bescheidenen Lösung zu beginnen, damit die Bedürfnisse zu kitzeln und die Anwendung entsprechend weiter zu entwickeln. Wenn sie alle inhaltlichen Bedürfnisse abdeckt aber technisch besser umgesetzt werden sollte, ist der ideale Zeitpunkt gekommen, die Programmier-Profis ranzulassen.

**Darum soll dieses Projekt in erster Linie Ideen und Möglichkeiten aufzeigen und Anwenderwünsche abholen.**

#Projektidee
- Eine Mobil-App ermöglicht die Erfassung von Artbeobachtungen direkt im Feld, unabhängig vom Mobilfunknetz
- Zur Programmierung werden [HTML5](http://de.wikipedia.org/wiki/HTML5), [JavaScript](http://de.wikipedia.org/wiki/JavaScript), [jQuery mobile](http://jquerymobile.com) und [Phonegap](http://phonegap.com) verwendet.<br>Damit kann die App prinzipiell auf jedes Betriebssystem portiert werden
- Die App steht auch als [Webseite](http://barbalex.iriscouch.com/evab/_design/evab/index.html) zur Verfügung
- Als Datenbank wird [CouchDb](http://couchdb.apache.org/) verwendet, in Form einer [CouchApp](http://couchapp.org). Die Datenbank ist somit ihr eigener Webserver, die App kann auf PC's lokal installiert werden und synchronisiert Daten und Anwendung automatisch im Hintergrund
- Da schemafrei und dokumentorientiert, können mit CouchDb projekteigene Datenfelder definiert sowie Bilder, Tonaufnahmen oder Projektberichte angehängt werden


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
2. und zwar sofort und ohne nachträgliche Büroarbeit
3. Mit den Daten zum Schutz seltener Arten beitragen


#Was kann man momentan mit der App machen? 

**Installieren:**

- Direkt auf der [Webseite](http://barbalex.iriscouch.com/evab/_design/evab/index.html) arbeiten
- [Auf dem PC installieren](http://barbalex.iriscouch.com/evab/_design/evab/Installieren.html) und lokal arbeiten (Windows, Mac OsX - wenig getestet). Vorteil: Viel schneller

**Beobachtungen erfassen...**

- ...von Arten aus diesen Gruppen: Flora, Fauna, Moose, Pilze. Die Artlisten stammen von den nationalen Artdatenzentren
- ...von offiziellen Arten. Bei Artengruppen mit entsprechenden Informationen (Flora, Moose) sind Synonyme und nicht anerkannte Unterarten als solche erkenntlich und es wird auf die offizielle Art hingewiesen (ohne die Verwendung der offiziellen Art zu erzwingen)
- ...von unbekannten Arten, z.B. um sie später zu bestimmen
- ...von "eigenen" Arten, die nicht im offiziellen Index enthalten sind (Spezialfälle für Artspezialisten und frische Neobiota)
- ...wahlweise mit Lateinischen (Standard) oder Deutschen Namen
- ...mit artgruppenspezifischen Feldern (in der Hierarchiestufe "Art", in der Feldverwaltung konfigurierbar)

**Datenfelder verwalten:**

- 162 Felder der öffentlichen Artdatenzentren benutzen. Sie sind geschützt und können nicht verändert werden
- Eigene Felder erstellen. Dafür aus verschiedenen Feldtypen wählen und eigene Auswahllisten definieren
- Standardwerte bestimmen, die bei neuen Beobachtungen automatisch gesetzt werden.<br>Bei Auswahllisten werden nur deren Elemente akzeptiert
- Bestimmen, welche Felder sichtbar sind
- Eigene Felder sind geschützt, sobald sie verwendet wurden. Sie können (erst) gelöscht oder umbenannt werden, wenn sie in keinem Datensatz (mehr) vorkommen

**Lokalisieren...**

- ...dem Gerät überlassen. Das Gerät lokalisiert mit allen verfügbaren Methoden. Koordinaten werden ab einer Genauigkeit von 100 m gespeichert und in Schweizer Landeskoordinaten umgerechnet. Bis 30 m wird auf die Ungenauigkeit hingewiesen und auf die nächste Möglichkeit hingewiesen:
- ...manuell auf Luftbildern von Google. Das Luftbild wird auf die aktuelle Position zentriert
- ...manuell durch Eingabe von Schweizer Landeskoordinaten. Sie werden - vom Benutzer unbemerkt - in decimal degrees umgewandelt, damit sie vom Gerät für die Darstellung auf Luftbilden ausgelesen werden können
- Alle Beobachtungen auf Luftbild darstellen. Pro Benutzer, Projekt, Raum oder Ort bzw. Beobachtung. Der Ausschnitt passt sich an die Beobachtungen an

**Dokumentieren**

Auf allen hierarchischen Stufen der Beobachtungen können Anhänge gespeichert werden. Denkbar sind z.B.:

- Bestimmungen mit Fotos oder Tonaufnahmen belegen
- Orte mit Fotos oder (fotografierten) Skizzen beschreiben
- Das Projekt mit einen Projektbericht versehen
- Dem Projekt eine GIS-Datei anfügen, in der die Orte als Linien oder Flächen digitalisiert wurden

**Effizient arbeiten:**

- Im **einfachen Modus** Beobachtungen in einer simplen (aber konfigurierbaren) Liste erfassen
- Im **hierarchischen Modus** umfassende Aufnahmen effizient erheben:<br>Informationen zu Projekt, Raum, Ort und Zeit müssen für alle zugehörigen Beobachtungen nur ein mal erfasst werden
- Eingaben werden automatisch gespeichert
- Durch Listen und Formulare "swipen"
- Nach Neuanmeldung wieder an derselben Stelle weiterarbeiten
- Die Anmeldung entfällt, wenn das alte Cookie noch existiert (dessen Lebensdauer wird bald verbessert)

**Über Daten und App verfügen:**

- Beobachtungen und Datenfelder exportieren
- Von einem anderen Programm (z.B. das GIS eines Ökobüros) auf die Daten zugreifen, schon während der Feldarbeit! Voraussetzungen: Erfolgreiche Authentifizierung und die Fähigkeit, über [http](http://de.wikipedia.org/wiki/Hypertext_Transfer_Protocol) [JSON-Daten](http://en.wikipedia.org/wiki/JSON) zu lesen (ist noch nicht verbreitet aber im Kommen)
- Installieren Sie die App auf PC oder Mobilgerät, verfügen Sie über eine lokale Version der Datenbank, welche laufend mit derjenigen im Internet synchronisiert. Sie sind dem Webservice und mir nicht ausgeliefert. Anders gesagt: Verschwindet der Webservice, sind die Daten noch vorhanden und die App funktioniert weiter. Die Daten werden einfach nicht mehr mit Apps auf anderen Geräten synchronisiert. Eine solche Synchronisation selber einzurichten kostet einen Profi aber bloss 20 Minuten
- [Die verwendete Open Source Lizenz](https://github.com/barbalex/EvabMobile/blob/master/License.md) erlaubt es Ihnen oder einem von Ihnen beauftragten Profi, den Code zu prüfen und für Ihre Bedürfnisse weiter zu entwickeln - sogar für kommerzielle Zwecke

#Wie geht es weiter? (roadmap)
- Macken reduzieren
- Daten besser vor unauthorisiertem Zugriff schützen
- Android- und iOS-App entwickeln
- Funktionalität erweitern, z.B.:
  - spezifisch Neobiota erfassen
  - Datenbanken teilen (gemeinsam an Projekten arbeiten!)
  - Anzahl Meldungen derselben Art im aktuellen 10*10km-Quadranten, Jahr der jüngsten Meldung<br>(wie wahrscheinlich bzw. sensationell ist meine Beobachtung?)
  - Eigene Darstellung für grosse Bildschirme
  - Beobachtungen in Listenform bearbeiten (Beispiel Flora: zuerst Artenliste erheben, dann in Listenform die Deckungen)
  - Artgruppe vorwählen (z.B. für Flora-Aufnahmen, beschleunigt die Arbeit)
- Tempo erhöhen

Wünschbar aber wohl mindestens teilweise ausserhalb meiner Fähigkeiten wären erweiterte Kartenfunktionen:

- Karten der Swisstopo verwenden
- Nützliche Layer überlagern (z.B. Schutzgebiete)
- Mit Linien und Flächen verorten
- Umriss zeichnen, um darin enthaltene Beobachtungen aufzulisten
- Zusätzliche Hierarchie, wo Ort und Zeit getauscht sind. Wäre ideal um Lebensräume zu kartieren. Dazu müssten auf Luftbild/Karte Flächen digitalisiert weden können (träum weiter...)

Es gibt keinen Zeitplan. Die Weiterentwicklung hängt von meiner Motivation, Lernfähigkeit und Freizeit ab.

#Hilfe erwünscht
Ich bin Biologe. HTML5, CSS, JavaScript, jQuery, jQuery mobile, Phonegap, CouchDb, CouchApp, Java/Android SDK und Cocoa/Objective-C waren soeben noch Fremdwörter. Wäre toll, wenn sich noch jemand für dieses Projekt engagieren würde!

#Gibt's das nicht schon?
Die App existiert eigentlich schon. Sie heisst EvAB (<span style="text-decoration: underline;"><strong>E</strong></span>rfassung <span style="text-decoration: underline;"><strong>v</strong></span>on <span style="text-decoration: underline;"><strong>A</strong></span>rt-<span style="text-decoration: underline;"><strong>B</strong></span>eobachtungen) und kann <a target="_blank" href="http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html">hier</a>&nbsp;heruntergeladen werden. Bloss trägt bisher niemand einen Windows-PC im Feld herum. Ausserdem sollte die App für den Feldgebrauch noch benutzerfreundlicher werden. 

Ein eigentliches Mobil-App habe ich erst eines gefunden: Der&nbsp;<a target="_blank" href="http://itunes.apple.com/us/app/artenfinder/id411688829?mt=8">Artenfinder</a>&nbsp;ist schon ziemlich gut. Unsere Deutschen Kollegen legen sich da ins Zeug. Und sie kümmern sich um ihre freiwilligen ArtbeobachterInnen. Toll!

#Das will ich ausprobieren
Die Webversion des Apps finden Sie <a target="_blank" href="http://barbalex.iriscouch.com/evab/_design/evab/index.html">hier</a>.

Das App ist in Entwicklung. Fehler sind sicht- und spürbar und können zeitweise das Arbeiten verhindern. Die Datenbank wird regelmässig neu aufgesetzt, womit sich die erfassten Beobachtungen in Luft auflösen!

Achtung: Funktioniert mit Internet Explorer erst ab Version 9. Getestet in: Firefox ab Version 4, Internet Explorer 9, Chrome. Auf Mobilgeräten funktionieren momentan am besten: Firefox mobile, Opera mobile, Android-Browser auf ICS (Android Version 4), Android Chrome (beta).
Auf Mobilgeräten ist die Verwendung der Webseite bisher langsam und daher unpraktisch.
Mit _evab mobile_ können Naturschutzprofis und ambitionierte Amateure Artbeobachtungen direkt im Feld in einer projektspezifischen Datenstruktur auf Mobilgeräten erfassen. Die Stärke von _evab mobile_ ist, dass die NutzerInnen flexibel eigene Datenstrukturen erstellen können.

<a name="top"></a>
## Inhalt ##
* <a href="#Ausgangslage">Ausgangslage</a>
* <a href="#Motivation">Motivation</a>
* <a href="#Projektidee">Projektidee</a>
* <a href="#ZieleNsf">Ziele</a>
* <a href="#machen">Was kann man momentan mit der App machen?</a>
* <a href="#roadmap">Wie geht es weiter?</a>
* <a href="#GibtsSchon">Gibt's das nicht schon?</a>
* <a href="#ausprobieren">Kann ich's jetzt endlich ausprobieren?</a>


#_E - was?_
evab ist eine Abkürzung und steht für: (<span style="text-decoration: underline;"><strong>E</strong></span>rfassung <span style="text-decoration: underline;"><strong>v</strong></span>on <span style="text-decoration: underline;"><strong>A</strong></span>rt-<span style="text-decoration: underline;"><strong>B</strong></span>eobachtungen). 

<a name="Ausgangslage"></a>
#Ausgangslage
Im Naturschutz sind anspruchsvolle Auswertungen und Erfolgskontrollen nur möglich, wenn Artbeobachtungsdaten digital vorliegen. Werden diese den [nationalen Artdaten-Zentren der Schweiz](http://www.natportal.ch/) geliefert, können sie über das ursprüngliche Projekt hinaus weiteren Nutzen bringen.

Meist werden Artbeobachtungen im Feld auf Papier notiert. Im besten Fall auf vorbereiteten Formularen. 
Gängige Fehlerquellen:  

- Arten sind nicht eindeutig bezeichnet
- Daten sind unvollständig oder nicht gemäss den Vorgaben des Projekts erfasst
- Der Ort ist nicht eindeutig, ungenau oder gar falsch (Koordinaten falsch ausgelesen)
- Die Schrift ist unleserlich

Digitalisiert wird - wenn überhaupt - später im Büro. Im besten Fall nach wenigen Stunden durch dieselbe Person. Im schlechtesten Fall durch eine andere Person ohne direkten Kontakt zur FeldbeobachterIn. 
Gängige Probleme:  

- Die Daten werden gar nie digitalisiert
- Nicht oder nicht eindeutig erfasste Informationen werden falsch interpretiert (besonders die laufend ändernden Artnamen von Pflanzen)
- Artbeobachtungen digitalisieren ist mühsam und monoton. 
  Es ist allzu menschlich, die Arbeit 
  1. an eine andere Person auszulagern und 
  2. nach dem 80/20-Prinzip zu machen: Oft wird der Geschwindigkeit mehr Beachtung geschenkt als der Fehlervermeidung

Daher ist die Qualität von Beobachtungsdaten oft unbefriedigend, selbst wenn sie von Profis erfasst wurde. Und das schlimmste: Die erwähnten Fehlerquellen können - im Gegensatz zur fachlichen Eignung der Autoren - schlecht beurteilt werden. Manchmal werden sie aber allzu klar, wenn man selber analog vorliegende Daten digitalisieren muss. Wenn das bloss anders ginge!

<a href="#top">&#8593; top</a>


<a name="Motivation"></a>
#Motivation
Mit dieser Ausgangslage sind wir in der [Fachstelle Naturschutz des Kantons Zürich](http://naturschutz.zh.ch) regelmässig konfrontiert, da hier immer wieder analoge Daten digitalisiert werden. Gleichzeitig knoble ich schon immer gerne mit Software. Erfahrungsgemäss haben Biologen Mühe, ein Pflichtenheft zu schreiben, mit dem Programmierer eine gute App erstellen können. Meist lohnt es sich, mit einer bescheidenen Lösung zu beginnen, damit die Bedürfnisse zu kitzeln und die Anwendung entsprechend weiter zu entwickeln. Wenn sich herausstellt, dass eine echte Nachfrage besteht und die App alle inhaltlichen Bedürfnisse abdeckt aber technisch besser umgesetzt werden sollte, ist der ideale Zeitpunkt gekommen, um die Programmier-Profis ranzulassen.

**Darum soll _evab mobile_ in erster Linie Ideen und Möglichkeiten aufzeigen und Anwenderwünsche abholen.**

Um so besser, wenn (falls) es bereits praktischen Nutzen bringt.

<a href="#top">&#8593; top</a>


<a name="Projektidee"></a>
#Projektidee
- Eine Mobil-App ermöglicht die Erfassung von Artbeobachtungen direkt im Feld, unabhängig vom Mobilfunknetz
- Zur Programmierung werden [HTML5](http://de.wikipedia.org/wiki/HTML5), [JavaScript](http://de.wikipedia.org/wiki/JavaScript), [jQuery mobile](http://jquerymobile.com) und [Phonegap](http://phonegap.com) verwendet.<br>Damit kann die App prinzipiell auf jedes Betriebssystem portiert werden
- Die App steht als [Web-Applikation](https://barbalex.cloudant.com/evab/_design/evab/index.html) zur Verfügung
- Als Datenbank wird [CouchDb](http://couchdb.apache.org/) verwendet, in Form einer [CouchApp](http://couchapp.org). Die Datenbank ist somit ihr eigener Webserver, die App kann auf PC's lokal installiert werden und synchronisiert die Daten automatisch im Hintergrund
- Da schemafrei und dokumentorientiert, können mit CouchDb projekteigene Datenfelder definiert sowie Bilder, Tonaufnahmen oder Projektberichte angehängt werden

<a href="#top">&#8593; top</a>


<a name="ZieleNsf"></a>
#Ziele für Naturschutzfachstellen
1. Artbeobachtungen liegen vermehrt digital vor
2. Sie stehen schneller zur Verfügung
3. Ihre Datenqualität ist höher, da bedeutende Fehlerquellen ausgeschaltet wurden
4. Der Gesamtaufwand für Felderfassung und Digitalisierung sinkt
5. Die Vorteile motivieren FeldbeobachterInnen, Artbeobachtungen direkt digital zu erfassen

<a href="#top">&#8593; top</a>


<a name="ZieleProfis"></a>
#Ziele für Naturschutzprofis
1. Mühsame Nachbearbeitung reduzieren
2. Projekte schneller abschliessen
3. Anforderungen der Naturschutzfachstellen besser erfüllen

<a href="#top">&#8593; top</a>


<a name="ZieleHobby"></a>
#Ziele für Hobby-ArtbeobachterInnen
1. Beobachtungen übersichtlich dokumentieren
2. und zwar sofort und ohne nachträgliche Büroarbeit
3. Mit den Daten zum Schutz seltener Arten beitragen

_evab mobile_ richtet sich aber primär an Naturschutzprofis und ambitionierte Amateure. Es ist besonders geeignet, um die Erfassung der Daten für aufwändige Projekte zu optimieren. Um Amateure zum Melden ihrer Beobachtungen zu motivieren, muss ein App einfacher aufgebaut werden und wohl auch Bestimmungshilfen enthalten.

<a href="#top">&#8593; top</a>


<a name="machen"></a>
#Was kann man momentan mit der App machen? 

**Installieren:**

- Direkt auf der [Web-Applikation](https://barbalex.cloudant.com/evab/_design/evab/index.html) arbeiten
- [Auf dem PC installieren](https://barbalex.cloudant.com/evab/_design/evab/Installieren.html) und lokal arbeiten (Windows, Mac OsX - wenig getestet). Vorteil: Viel schneller

**Beobachtungen erfassen...**

- ...von rund 40'000 Arten aus den Gruppen Flora, Fauna, Moose und Pilze. Die Artlisten stammen von den nationalen Artdatenzentren
- ...von offiziellen Arten. Bei Artengruppen mit entsprechenden Informationen (Flora, Moose) sind Synonyme und nicht anerkannte Unterarten als solche erkenntlich und es wird auf die offizielle Art hingewiesen (ohne die Verwendung der offiziellen Art zu erzwingen)
- ...von unbekannten Arten, z.B. um sie später zu bestimmen
- ...von "eigenen" Arten, die nicht im offiziellen Index enthalten sind (Spezialfälle für Artspezialisten und frische Neobiota)
- ...nach Lateinischen oder Deutschen Namen
- ...mit artgruppenspezifischen Feldern
- Artgruppe vorwählen, um die Artauswahl zu beschleunigen

**Datenfelder verwalten**

- 162 Felder der öffentlichen Artdatenzentren benutzen
- Eigene Felder erstellen. Dafür aus verschiedenen Feldtypen wählen und eigene Auswahllisten definieren
- Standardwerte bestimmen, die bei neuen Beobachtungen automatisch gesetzt werden
- Bestimmen, welche Felder sichtbar sind

**Lokalisieren...**

- ...dem Gerät überlassen. Das Gerät lokalisiert mit allen verfügbaren Methoden. Koordinaten werden ab einer Genauigkeit von 100 m gespeichert und in Schweizer Landeskoordinaten umgerechnet. Bis 30 m wird auf die Ungenauigkeit hingewiesen und auf die nächste Möglichkeit hingewiesen:
- ...manuell auf Luftbildern von Google
- ...manuell durch Eingabe von Schweizer Landeskoordinaten
- Alle Beobachtungen auf Luftbild darstellen. Pro Benutzer, Projekt, Raum oder Ort bzw. Beobachtung

**Dokumentieren**

Auf allen hierarchischen Stufen der Beobachtungen können Anhänge gespeichert werden. Denkbar sind z.B.:

- Die Artbestimmung mit Fotos oder Tonaufnahmen belegen
- Orte mit Fotos oder (fotografierten) Skizzen beschreiben
- Das Projekt mit einen Projektbericht versehen
- Dem Projekt eine GIS-Datei anfügen, in der die Orte als Linien oder Flächen digitalisiert wurden

**Effizient arbeiten**

- Im **einfachen Modus** Beobachtungen in einer simplen (aber konfigurierbaren) Liste erfassen
- Im **hierarchischen Modus** umfassende Aufnahmen effizient erheben:<br>Informationen zu Projekt, Raum, Ort und Zeit müssen für alle zugehörigen Beobachtungen nur ein mal erfasst werden
- Eingaben werden automatisch gespeichert
- Durch Listen und Formulare "swipen"
- Nach dem ersten mal wird man auf demselben Browser automatisch angemeldet...
- ...und man kann an derselben Stelle weiterarbeiten

**Sich informieren**
- Arteigenschaften in [ArtenDb](https://github.com/barbalex/artendb) nachschauen

**Über Daten und App verfügen**

- Beobachtungen und Datenfelder exportieren
- Von einem anderen Programm (z.B. das GIS eines Ökobüros) auf die Daten zugreifen, schon während der Feldarbeit! Vorausgesetzt wird die Fähigkeit, über [http](http://de.wikipedia.org/wiki/Hypertext_Transfer_Protocol) [JSON-Daten](http://en.wikipedia.org/wiki/JSON) zu lesen (ist noch nicht verbreitet aber im Kommen)
- Installieren Sie die App auf PC oder Mobilgerät, verfügen Sie über eine lokale Version der Datenbank, welche laufend mit derjenigen im Internet synchronisiert. Sie sind dem Webservice und mir nicht ausgeliefert. Anders gesagt: Verschwindet die Web-Applikation, sind die Daten noch vorhanden und die App funktioniert weiter. Die Daten werden einfach nicht mehr mit Apps auf anderen Geräten synchronisiert. Eine solche Synchronisation kann ein Profi aber rasch wieder herstellen
- [Die verwendete Open Source Lizenz](https://github.com/barbalex/EvabMobile/blob/master/License.md) erlaubt es Ihnen oder einem von Ihnen beauftragten Profi, den Code zu prüfen und für Ihre Bedürfnisse weiter zu entwickeln - sogar für kommerzielle Zwecke

<a href="#top">&#8593; top</a>


<a name="roadmap"></a>
#Wie geht es weiter? (roadmap)
- Macken reduzieren
- Stammdatenaktualisierung ausgehend von [ArtenDb](https://github.com/barbalex/artendb) implementieren (bisher erfolgte das ausgehend von der alten ArtenDb)
- Android- und iOS-App entwickeln
- Sobald allfällige Einflüsse der Android- und iOS-Apps bzw. ihrer Synchronisation auf die Datenstruktur geklärt sind: Die Web-Applikation öffentlich machen

danach:

- Funktionalität erweitern, z.B.:
  - spezifisch Neobiota erfassen
  - Datenbanken teilen (gemeinsam an Projekten arbeiten!)
  - Benutzeroberfläche präsentiert sich bei grossen Bildschirmen zweispaltig: links die Listen, rechts die Detailformulare
  - Beobachtungen in Listenform bearbeiten (Beispiel Flora: zuerst Artenliste erheben, dann in Listenform die Deckungen)
  - Felder projektspezifisch konfigurieren
  - Schnittstellen für externe Anwendungen bedürfnisgerecht anbieten und dokumentieren
- Tempo erhöhen

Wünschbar aber wohl teilweise ausserhalb meiner Fähigkeiten wären erweiterte Kartenfunktionen:

- Karten der Swisstopo verwenden
- Nützliche Layer überlagern (z.B. Schutzgebiete)
- Mit Linien und Flächen verorten
- Umriss zeichnen, um darin enthaltene Beobachtungen aufzulisten
- Zusätzliche Hierarchie, wo Ort und Zeit getauscht sind. Wäre ideal um Lebensräume zu kartieren. Dazu müssten auf Luftbild/Karte Flächen digitalisiert weden können (träum weiter...)

Es gibt keinen Zeitplan. Die Weiterentwicklung hängt von meiner Motivation, Lernfähigkeit und Freizeit ab.

<a href="#top">&#8593; top</a>


<a name="Hilfe"></a>
#Darf ich helfen?
Ja gerne! Ich bin Biologe. HTML5, CSS, JavaScript, jQuery, jQuery mobile, Phonegap, CouchDb, CouchApp, Java/Android SDK und Cocoa/Objective-C waren soeben noch Fremdwörter. Wäre toll, wenn sich noch jemand für [dieses Projekt](https://github.com/barbalex/EvabMobile) engagieren würde!

Um zu helfen, muss man nicht unbedingt Programmieren können. Nützlich sind auch: 

- Gute Ideen für die Weiterentwicklung
- Fehler melden
- Tipps und Tricks dokumentieren

<a href="#top">&#8593; top</a>


<a name="GibtsSchon"></a>
#Gibt's das nicht schon?
Die App existiert eigentlich schon. Sie heisst EvAB (<span style="text-decoration: underline;"><strong>E</strong></span>rfassung <span style="text-decoration: underline;"><strong>v</strong></span>on <span style="text-decoration: underline;"><strong>A</strong></span>rt-<span style="text-decoration: underline;"><strong>B</strong></span>eobachtungen) und kann <a target="_blank" href="http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html">hier</a>&nbsp;heruntergeladen werden. Bloss trägt bisher niemand einen Windows-PC im Feld herum. Ausserdem sollte die App für den Feldgebrauch noch benutzerfreundlicher werden. 

Ein eigentliches Mobil-App habe ich erst eines gefunden: Der&nbsp;<a target="_blank" href="http://itunes.apple.com/us/app/artenfinder/id411688829?mt=8">Artenfinder</a>&nbsp;ist schon ziemlich gut. Unsere Deutschen Kollegen legen sich da ins Zeug. Und sie kümmern sich um ihre freiwilligen ArtbeobachterInnen. Toll!

<a href="#top">&#8593; top</a>


<a name="ausprobieren"></a>
#Kann ich's jetzt endlich ausprobieren?
Die Webversion des Apps finden Sie <a target="_blank" href="https://barbalex.cloudant.com/evab/_design/evab/index.html">hier</a>.

Sie ist in Entwicklung. Fehler sind sicht- und spürbar und können zeitweise das Arbeiten verhindern. Die Datenbank wird regelmässig neu aufgesetzt, womit sich die erfassten Beobachtungen in Luft auflösen!

Am schönsten und schnellsten funktioniert die App in Google Chrome. Sehr gut auch in Firefox (getestet in den aktuellsten Versionen). Im Internet Explorer funktioniert sie erst ab Version 9 und das bloss leidlich. Internet Explorer 10 scheint i.O.

Auf Mobilgeräten funktioniert momentan am besten Safari auf iOS oder Google Chrome bzw. Firefox auf Android. Der Standardbrowser von Android hat überraschende Schwächen, welche die Leistung der Anwendung schmälern.

Auf Mobilgeräten ist die Web-Applikation etwas langsam und daher nur auf aktuellen Geräten brauchbar. Auf dem PC scheint sie mir mittlerweile - nach diversen Optimierungen - brauchbar schnell zu sein. Wenn die Datenbank lokal liegt, ist sie richtig schnell.

<a href="#top">&#8593; top</a>
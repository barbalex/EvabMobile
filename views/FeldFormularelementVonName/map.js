function(doc) {
	var Typ = doc.Typ;
	var Tabelle = doc.Tabelle;
	var Reihenfolge = doc.Reihenfolge;
	var FeldName = doc.FeldName;
	var Formularelement = doc.Formularelement;
	if(Typ && Typ == 'Feld' && Tabelle && Reihenfolge && FeldName && Formularelement){
		emit ([Tabelle, Reihenfolge, FeldName, Formularelement], null);
	}
}
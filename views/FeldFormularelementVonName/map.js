function(doc) {
	var Typ = doc.Typ;
	var Hierarchiestufe = doc.Hierarchiestufe;
	var Reihenfolge = doc.Reihenfolge;
	var FeldName = doc.FeldName;
	var Formularelement = doc.Formularelement;
	if(Typ && Typ == 'Feld' && Hierarchiestufe && Reihenfolge && FeldName && Formularelement){
		emit ([Hierarchiestufe, Reihenfolge, FeldName, Formularelement], null);
	}
}
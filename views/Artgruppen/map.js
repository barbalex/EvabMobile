function(doc) {
  if((doc.Typ && doc.Typ == 'ArtGruppe' && doc.ArtGruppe)||(doc.id == '1AB6BBB1-979A-4232-A5D8-62Eunbekannt')){
		emit (doc.ArtGruppe, doc);
	}
}
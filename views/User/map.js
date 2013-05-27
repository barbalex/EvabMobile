function(doc) {
	if (doc.Typ === 'User') {
		emit (doc._id, null);
	}
}
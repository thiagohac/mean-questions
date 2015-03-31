exports.render = function(req, res) {
	res.render('index.server.view.ejs', {
		user: JSON.stringify(req.user)
	});
};

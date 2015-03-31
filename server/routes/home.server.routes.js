module.exports = function(app) {
	var index = require('../controllers/home.server.controller');
	app.route('/').get(index.render);
	app.route('/index').get(index.render);
	app.route('/home').get(index.render);
};
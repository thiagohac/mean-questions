var usersController = require('../../server/controllers/users.server.controller');

module.exports = function(app) {
	// Setting up the local authentication
	app.route('/users/signup').post(usersController.signup);
	app.route('/users/signin').post(usersController.signin);
	app.route('/users/signout').get(usersController.signout);

    app.route('/users/:userId').get(usersController.requiresLogin, usersController.get);

    //app.route('/users').put(users.update);

    app.param('userId', usersController.userByID);
};
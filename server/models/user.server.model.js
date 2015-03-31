var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: {
        type: String,
        required: 'Nome é obrigatório'
    },
	lastName: {
        type: String,
        required: 'Sobrenome é obrigatório'
    },
    displayName: {
        type: String,
        trim: true
    },
    email: {
		type: String,
		match: [/.+\@.+\..+/, "Endereço de email inválido"],
        required: 'Email é obrigatório',
        trim: true
	},
    username: {
        type: String,
        unique: true,
        required: 'Usuário é obrigatório',
		trim: true,
        validate: [
            function(username) {
                return username && username.length > 4;
            }, 'Usuário deve ter mais caracteres'
        ]
	},
	password: {
		type: String,
		validate: [
			function(password) {
				return password && password.length > 4;
			}, 'Senha deve ter mais caracteres'
		]
	},
	salt: {
        // usado para o hash do password
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
    questions: [{
        type: Schema.ObjectId,
        ref: 'Question'
    }],
    favorites: [{
        type: Schema.ObjectId,
        ref: 'Question'
    }]
});



// Antes de salvar para fazer o hash
UserSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

// Hash do password
UserSchema.methods.hashPassword = function(password) {
	if(password && this.salt) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	}
};

UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
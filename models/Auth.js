const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	lastName: {
		type: String,
		required: [true, 'Entrez votre nom !'],
	},
	firstName: {
		type: String,
		required: [true, 'Entrez votre prénom !'],
	},
	email: {
		type: String,
		required: [true, 'Entrez votre email !'],
		unique: true,
		validate: [isEmail, 'Entrez un email valide !'],
	},
	password: {
		type: String,
		required: [true, 'Entrez votre mot de passe !'],
		minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères !'],
	},
	confpassword: {
		type: String,
		required: [true, 'Confirmez votre mot de passe !'],
		minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères !'],
	},
});

userSchema.pre('save', async function (next) {
	try {
		if (this.isNew) {
			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(this.password, salt);
			this.password = hashedPassword;
		}
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (candidatePassword, next) {
	try {
		const isMatch = await bcrypt.compare(candidatePassword, this.password);
		return isMatch;
	} catch (error) {
		next(error);
	}
};

userSchema.methods.matchPasswords = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

module.exports = mongoose.model('user', userSchema);

const mongoose = require('mongoose');
//model user avec mongoose
//mongoose unique validator pour être sur que l'user ne peut utiliser qu'une seul adresse mail.s
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
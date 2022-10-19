const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
//reception post du mot de pass, création et vérification.
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
//exportation du router
module.exports = router;
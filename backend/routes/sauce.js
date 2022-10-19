//utilisation d'express et router pour créer les routes
const express = require('express');
const router = express.Router();
//utilisation de auth pour le contrôle des routes
const auth = require('../middleware/auth');
//utilisation de multer pour les photos
const multer = require('../middleware/multer-config');
//utilisation de controllers, avec sauceCtrl
const sauceCtrl = require('../controllers/sauce');
//les routes
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
//exporation des routes
module.exports = router;

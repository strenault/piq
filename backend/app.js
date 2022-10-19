const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

require('dotenv').config();



//construction sauceRoutes et userRoutes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
//connection mongodb
mongoose
    .connect(process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
//construction app
const app = express();

//app.use pour définir comment fonctionne les routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//bodyParser pour parser le body
app.use(bodyParser.json());

// Sécurise les headers
app.use(helmet.xssFilter());

//les routes utilisées
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//exportation app
module.exports = app;
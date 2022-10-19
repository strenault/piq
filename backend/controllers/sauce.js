const Sauce = require('../models/sauce');
const fs = require('fs');
// création Sauce
exports.createSauce = (req, res, next) => {
    const newSauce = JSON.parse(req.body.sauce);
    delete newSauce._id;
    delete newSauce._userId;
    const sauce = new Sauce({
        ...newSauce,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }))
};



// LIKE OR DISLIKE Sauce
exports.likeSauce = (req, res, next) => {
    // User aime la sauce
    // push user dans usersliked
    if (req.body.like === 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { likes: req.body.like++ },
                $push: { usersLiked: req.body.userId },
            }
        )
            .then((sauce) => res.status(200).json({ message: "Un like de plus !" }))
            .catch((error) => res.status(400).json({ error }));
    }

    // si il n'aime pas
    // on push son userdisike 
    else if (req.body.like === -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: req.body.like++ * -1 },
                $push: { usersDisliked: req.body.userId },
            }
        )
            .then((sauce) =>
                res.status(200).json({ message: "Un dislike de plus !" })
            )
            .catch((error) => res.status(400).json({ error }));
    }

    // Si l'utilisateur a effacé son avis
    // Selon si l'useur aime ou n'aime pas la sauce avant d'annuler son avis :
    // Recherche et effacement de l'identifiant de l'utilisateur dans le tableau usersLikes ou userDislikes
    else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
                    )
                        .then((sauce) => res.status(200).json({ message: "Un like de moins !" }))
                        .catch((error) => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 },
                        }
                    )
                        .then((sauce) => res.status(200).json({ message: "Un dislike de moins !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};
//modification Sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        heat: req.body.heat,
        userId: req.body.userId,
    };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//supprimer la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};
//donner toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error: error }));
};
//donner la sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error: error }));
};
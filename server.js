const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 3000;
const SECRET_KEY = "votre_cle_secrete"; // Remplacez par une clé secrète unique.

app.use(bodyParser.json());
app.use(cors());
// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Remplacez par votre utilisateur MySQL
    password: 'root', // Remplacez par votre mot de passe MySQL
    database: 'Users', // Base de données
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connecté à la base de données MySQL.");
});

// Inscription
app.post('/register', async (req, res) => {
    console.log("Demande d'inscription reçue", req.body);
    const { identifiant, passwd } = req.body;

    // Vérification des données reçues
    if (!identifiant || !passwd) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Vérification si l'identifiant existe déjà
        const checkQuery = "SELECT * FROM Users WHERE identifiant = ?";
        db.query(checkQuery, [identifiant], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'Cet identifiant est déjà utilisé.' });
            }

            // Hashage du mot de passe
            const hashedPassword = await bcrypt.hash(passwd, 10);

            // Générer un token
            const token = jwt.sign({ identifiant }, SECRET_KEY, { expiresIn: '1h' });

            // Obtenir la date actuelle pour created_at
            const createdAt = new Date();

            // Enregistrer dans la base de données
            const insertQuery = "INSERT INTO Users (identifiant, mot_de_passe, token, created_at) VALUES (?, ?, ?, ?)";
            db.query(insertQuery, [identifiant, hashedPassword, token, createdAt], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement.' });
                }

                // Répondre avec un JSON de succès
                res.status(201).json({ message: 'Inscription réussie.', token });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Connexion
app.post('/login', (req, res) => {
    const { identifiant, passwd } = req.body;

    if (!identifiant || !passwd) {
        return res.status(400).json({ message: 'Veuillez fournir un identifiant et un mot de passe.' });
    }

    const query = "SELECT * FROM Users WHERE identifiant = ?";
    db.query(query, [identifiant], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la connexion.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
        }

        const user = results[0];
        const isValidPassword = await bcrypt.compare(passwd, user.mot_de_passe);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
        }

        // Générer un token
        const token = jwt.sign({ id: user.id, identifiant: user.identifiant }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Connexion réussie.', token });
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

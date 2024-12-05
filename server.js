const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = "votre_cle_secrete"; // Remplacez par une clé secrète unique.

app.use(bodyParser.json());

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
    const { identifiant, passwd } = req.body;

    // Vérification des données reçues
    if (!identifiant || !passwd) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Hash du mot de passe (par exemple, avec bcrypt)
        const hashedPassword = await bcrypt.hash(passwd, 10);

        // Enregistrer dans la base de données
        const query = "INSERT INTO Users (identifiant, mot_de_passe) VALUES (?, ?)";
        db.query(query, [identifiant, hashedPassword], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Erreur serveur.' });
            }

            // Répondre avec un JSON de succès
            res.json({ message: 'Inscription réussie!' });
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

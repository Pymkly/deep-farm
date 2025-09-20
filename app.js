const express = require('express');
const ejs = require('ejs');
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Simuler des données avec 5 valeurs possibles par paramètre
function generateRandomValue(values) {
    return values[Math.floor(Math.random() * 5)];
}

// Générer des données historiques pour une parcelle (7 jours)
function generateWeeklyData() {
    const values = {
        temperature: [24, 25, 26, 27, 25.5],
        humidity: [47.50, 48.00, 50.20, 49.90, 50.80],
        N: [64, 65, 29, 30.20, 30.10],
        P: [90, 91, 33, 82, 74],
        K: [180, 164, 161, 148, 66],
        level: [11, 12.2, 11.5, 11.7, 12.1]
    };
    const days = [];
    for (let day = 0; day < 5; day++) {
        days.push({
            date: `Semaine ${day + 1}`,
            temperature: generateRandomValue(values.temperature),
            humidity: generateRandomValue(values.humidity),
            N: generateRandomValue(values.N),
            P: generateRandomValue(values.P),
            K: generateRandomValue(values.K),
            level: generateRandomValue(values.level)
        });
    }
    console.log(days)
    return days;
}

// Générer 18 parcelles pour la démo
function generateParcelsData() {
    const parcelsData = [];

    const alphabet = "abcdef"
    for (let i = 0; i < 18; i++) {
        const mac = `48:3f:da:${Math.floor(Math.random() * 9).toString()+alphabet[(i+27)%5]}:${Math.floor(Math.random() * 9).toString()+alphabet[(i+45)%5]}:${Math.floor(Math.random() * 9).toString()+alphabet[(i+45)%5]}`;
        const parcelName = `Parcelle ${String.fromCharCode(65 + i)}`; // A à R
        const weeklyData = generateWeeklyData();
        // Utilise la dernière valeur de weeklyData comme données actuelles
        const lastDay = weeklyData[weeklyData.length - 1];
        parcelsData.push({
            mac,
            parcels: [parcelName],
            temperature: lastDay.temperature,
            humidity: lastDay.humidity,
            N: lastDay.N,
            P: lastDay.P,
            K: lastDay.K,
            level: lastDay.level,
            timestamp: new Date().toLocaleTimeString(),
            weeklyData
        });
    }
    return parcelsData;
}

// Page pour liste des parcelles (mise à jour aléatoire à chaque chargement)
app.get('/parcels', (req, res) => {
    const data = generateParcelsData();
    console.log(data)
    res.render('parcels', { data });
});

// Page admin pour graphiques d'évolution hebdomadaire par parcelle
app.get('/admin', (req, res) => {
    const data = generateParcelsData();
    res.render('admin', { data });
});

// Lancement du serveur
app.listen(port, () => console.log(`Serveur lancé sur port ${port}`));
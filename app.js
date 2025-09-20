const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

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
        temperature: [20, 25, 28, 30, 32],
        humidity: [50, 60, 70, 80, 90],
        N: [100, 150, 200, 250, 300],
        P: [50, 75, 100, 125, 150],
        K: [80, 120, 160, 200, 240],
        level: [30, 50, 70, 90, 100]
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
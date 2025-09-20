const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public')); // Pour les assets statiques
app.set('view engine', 'ejs');

// Simuler des données avec 5 valeurs possibles par paramètre
function generateRandomData(mac, parcels) {
    const values = {
        temperature: [24, 25, 26, 27, 25.5],
        humidity: [47.50, 48.00, 50.20, 49.90, 50.80],
        N: [64, 65, 29, 30.20, 30.10],
        P: [90, 91, 33, 82, 74],
        K: [180, 164, 161, 148, 66],
        level: [11, 12.2, 11.5, 11.7, 12.1]
    };
    return {
        mac,
        temperature: values.temperature[Math.floor(Math.random() * 5)],
        humidity: values.humidity[Math.floor(Math.random() * 5)],
        N: values.N[Math.floor(Math.random() * 5)],
        P: values.P[Math.floor(Math.random() * 5)],
        K: values.K[Math.floor(Math.random() * 5)],
        level: values.level[Math.floor(Math.random() * 5)],
        parcels,
        timestamp: new Date().toLocaleTimeString()
    };
}

// Simulation des agents IA (placeholders)
function simulateRAGAgent(data) {
    return "Conseil RAG : Irriguez si humidité < 60% (basé sur " + data.mac + ").";
}

function simulateImageAgent() {
    return "Analyse image : Pas d'anomalies (simulé).";
}

function simulateTimeSeriesAgent(data) {
    return "Prévision : Température +2°C dans 24h (simulé).";
}

function simulateMultiAgent(data) {
    return { rag: simulateRAGAgent(data), image: simulateImageAgent(), timeSeries: simulateTimeSeriesAgent(data) };
}

// Générer 18 parcelles pour la démo
function generateParcelsData() {
    const parcelsData = [];
    const alphabet = "abcdef"
    for (let i = 0; i < 18; i++) {
        const mac = `48:3f:da:${alphabet[(i+13)%6]+alphabet[(i+27)%6]}:${alphabet[i]+alphabet[(i+45)%6]}:${alphabet[(i+11)%6]+alphabet[(i+45)%6]}`;
        const parcelName = `Parcelle ${String.fromCharCode(65 + i)}`; // A à R
        parcelsData.push(generateRandomData(mac, [parcelName]));
    }
    return parcelsData;
}

function generateRandomValue(values) {
    return values[Math.floor(Math.random() * 5)];
}

function generateWeeklyData() {
    const values = {
        temperature: [24, 25, 26, 27, 25.5],
        humidity: [47.50, 48.00, 50.20, 49.90, 50.80],
        N: [64, 65, 29, 30.20, 30.10],
        P: [90, 91, 33, 82, 74],
        K: [180, 164, 161, 148, 66],
        level: [6, 8, 8.5, 11.7, 12.1]
    };
    const days = [];
    for (let day = 0; day < 7; day++) {
        days.push({
            date: `Jour ${day + 1}`,
            temperature: generateRandomValue(values.temperature),
            humidity: generateRandomValue(values.humidity),
            N: generateRandomValue(values.N),
            P: generateRandomValue(values.P),
            K: generateRandomValue(values.K),
            level: generateRandomValue(values.level)
        });
    }
    return days;
}

// Page pour liste des parcelles (mise à jour aléatoire à chaque chargement)
app.get('/parcels', (req, res) => {
    const data = generateParcelsData();
    res.render('parcels', { data });
});

// Page admin pour graphiques statiques (18 parcelles)
app.get('/admin', (req, res) => {
    const data = generateParcelsData();
    res.render('admin', { data });
});

// Lancement du serveur
app.listen(port, () => console.log(`Serveur lancé sur port ${port}`));
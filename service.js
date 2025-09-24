const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Включаем CORS и JSON парсер
app.use(cors());
app.use(express.json());

// Раздача статических файлов (твой сайт)
app.use(express.static(path.join(__dirname, 'public')));

// Логирование всех заходов
app.use(async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const time = new Date().toISOString();

    let geo = {};
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        geo = await response.json();
    } catch (e) {
        console.error('Ошибка geo:', e.message);
    }

    const log = `${time} | IP: ${ip} | ${geo.city || 'Unknown'}, ${geo.country_name || 'Unknown'} | UA: ${ua}\n`;
    fs.appendFileSync(path.join(__dirname, 'logs', 'visits.log'), log);
    console.log(log.trim());

    next();
});

// Маршрут для аналитики (fetch из index.html)
app.post('/track', (req, res) => {
    const data = req.body;
    const time = new Date().toISOString();
    const log = `[TRACK] ${time} | ${JSON.stringify(data)}\n`;

    fs.appendFileSync(path.join(__dirname, 'logs', 'analytics.log'), log);
    console.log(log.trim());

    res.json({ status: 'ok' });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Визитка запущена: http://localhost:${PORT}`);
});
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Подготовка директорий
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Включаем CORS и JSON парсер
app.use(cors());
app.use(express.json());

// Раздача статики
app.use(express.static(path.join(__dirname, 'public')));

// Логирование посещений
app.use(async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    const time = new Date().toISOString();
    let geo = {};

    if (!['127.0.0.1', '::1'].includes(ip)) {
        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            geo = await response.json();
        } catch (e) {
            console.error('Ошибка geo:', e.message);
        }
    }

    const log = `${time} | IP: ${ip} | ${geo.city || 'Unknown'}, ${geo.country_name || 'Unknown'} | UA: ${ua}\n`;

    // Ротация логов при >5 МБ
    const visitLog = path.join(logsDir, 'visits.log');
    if (fs.existsSync(visitLog) && fs.statSync(visitLog).size > 5 * 1024 * 1024) {
        fs.renameSync(visitLog, visitLog.replace('.log', `-${Date.now()}.log`));
    }

    fs.promises.appendFile(visitLog, log).catch(console.error);
    console.log(log.trim());
    next();
});

// Аналитика
app.post('/track', (req, res) => {
    const data = req.body;
    const time = new Date().toISOString();
    const log = `[TRACK] ${time} | ${JSON.stringify(data)}\n`;
    fs.promises.appendFile(path.join(logsDir, 'analytics.log'), log).catch(console.error);
    console.log(log.trim());
    res.json({ status: 'ok' });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Визитка запущена: http://localhost:${PORT}`);
});
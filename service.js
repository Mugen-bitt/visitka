const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Статическая раздача
app.use(express.static(path.join(__dirname, 'public')));

// Middleware логирования
app.use(async (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];
  const time = new Date().toISOString();

  let geo = {};
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    geo = await response.json();
  } catch (e) {
    console.error('Ошибка гео:', e.message);
  }

  const log = `${time} | IP: ${ip} | ${geo.city || 'Unknown'}, ${geo.country_name || 'Unknown'} | UA: ${ua}\n`;
  fs.appendFileSync(path.join(__dirname, 'logs', 'visits.log'), log);
  console.log(log);

  next();
});

// Отдаём HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Визитка запущена: http://localhost:${PORT}`);
});
# Визитка — Pavel Evstigneev

Персональная визитка QA Automation Engineer с неоновым дизайном.

## Архитектура

```
visitka/
├── index.html    — Главная страница (контент, SEO-мета, ссылки на соцсети)
├── style.css     — Стили: неоновые эффекты, анимации, адаптив под мобилки
├── service.js    — Express-сервер: раздача статики, логирование посещений с геолокацией
└── 404.html      — Кастомная 404 с автопереходом на главную через 10 сек
```

## Что за что отвечает

| Файл | Назначение |
|------|-----------|
| `index.html` | Контент визитки: заголовок, описание, иконки Telegram/LinkedIn/Email |
| `style.css` | Визуал: шрифт Space Mono, неоновое свечение (#ffeb99), fade-in анимации, респонсив |
| `service.js` | Бэкенд (опционально): Express на порту 3000, логирует IP + геолокацию + User-Agent |
| `404.html` | Страница ошибки в стиле визитки с таймером редиректа |

## Запуск

**Статика (без сервера):**
```bash
python3 -m http.server 8080
# или просто открыть index.html в браузере
```

**С Express-сервером (логирование):**
```bash
npm install express node-fetch cors
node service.js
# http://localhost:3000
```

## Деплой

Хостится на GitHub Pages: https://github.com/Mugen-bitt/visitka

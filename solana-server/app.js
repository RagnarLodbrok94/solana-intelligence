const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRouter = require('./apiRouter'); // Підключаємо API роутер

// Ініціалізація змінних середовища
require('dotenv').config(); // Завантажуємо конфігурацію з .env

const app = express();
// const port = process.env.PORT || 8080; // Порт для вашого сервера

// CORS налаштування
const corsOrigins = process.env.CORS_ORIGINS.split(',');
app.use(cors({
	origin: corsOrigins, // Дозволяємо клієнтські запити
	methods: ['GET', 'POST'],
}));

// Middleware для роботи з JSON
app.use(express.json());

// Підключення API роутера
app.use('/api', apiRouter);

// Додаємо обробку статичних файлів React
app.use(express.static(path.join(__dirname, '../')));

// Заборона доступу до папки uploads
app.use('/uploads', (req, res) => {
	res.status(403).send('Access Forbidden');
});

// Заборона доступу до .env
app.get('/.env', (req, res) => {
	res.status(403).send('Access Forbidden');
});

// Всі маршрути, які не належать до API, перенаправляємо на React
app.get('*', (req, res) => {
	if (req.path.startsWith('/api')) {
		return res.status(404).send('API route not found');
	}
	res.sendFile(path.join(__dirname, '../index.html'));
});

// Експортуємо додаток Express
module.exports = app;

// Запуск сервера
// app.listen(port, () => {
// 	console.log(`Server running at http://localhost:${port}`);
// });
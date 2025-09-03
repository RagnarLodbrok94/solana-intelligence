const http = require('http'); // Підключення стандартного модуля http
const app = require('./app'); // Імпорт вашого Express-додатка
const port = process.env.PORT || 8080; // Порт для сервера

// Створюємо сервер
const server = http.createServer(app);

// Запускаємо сервер
server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

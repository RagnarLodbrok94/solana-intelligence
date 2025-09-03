const express = require('express');
const multer = require('multer');

// Імпорт допоміжних функцій із utils.js
const { processFiles, callChatGPTAPI, checkTokenBalance } = require('./utils');

const apiRouter = express.Router();

// Ініціалізація змінних середовища
require('dotenv').config(); // Завантажуємо конфігурацію з .env

const MAX_INPUT_CHARS = parseInt(process.env.MAX_INPUT_CHARS, 10);
const MAX_REQUESTS_PER_DAY = parseInt(process.env.MAX_REQUESTS_PER_DAY, 10);
const userRequests = {}; // Об'єкт для зберігання кількості запитів

const resetDailyLimits = () => {
	const currentDate = new Date().toISOString().split('T')[0];

	for (const walletAddress in userRequests) {
		if (userRequests[walletAddress].date !== currentDate) {
			delete userRequests[walletAddress]; // Видаляємо записи з іншої дати
		}
	}
};

// Скидання лімітів щодня опівночі
setInterval(resetDailyLimits, 24 * 60 * 60 * 1000); // 24 години

// Обмеження на завантаження файлів
const upload = multer({
	dest: 'uploads/',
	limits: {
		fileSize: 5 * 1024 * 1024, // Обмеження на 5 МБ
		files: 10, // Обмеження на 10 файлів
	},
});

// Ендпоінт для перевірки балансу Meme токена
apiRouter.get('/check-token-balance/:publicKey', async (req, res) => {
	const {publicKey} = req.params;

	try {
		const { sufficient, balance, requiredTokens } = await checkTokenBalance(publicKey);

		res.json({
			sufficient,
			balance,
			requiredTokens,
		});
	} catch (error) {
		console.error('Error fetching Meme Token balance:', error);
		res.status(500).json({error: 'Failed to fetch balance'});
	}
});

// Ендпоінт для чату з обробкою файлів
apiRouter.post('/chat', upload.array('files', 10), async (req, res) => {
	const {walletAddress, message} = req.body;
	const files = req.files;

	if (message.length > MAX_INPUT_CHARS) {
		return res.status(400).json({ error: `Input too long. Max ${MAX_INPUT_CHARS} characters allowed.` });
	}

	if (!walletAddress) {
		return res.status(400).json({ error: 'Wallet address is required' });
	}

	const currentDate = new Date().toISOString().split('T')[0];

	// Ініціалізуємо запис для гаманця, якщо його немає
	if (!userRequests[walletAddress]) {
		userRequests[walletAddress] = {date: currentDate, requestsToday: 0};
	}

	const userData = userRequests[walletAddress];

	// Скидаємо лічильник, якщо дата змінилася
	if (userData.date !== currentDate) {
		userData.date = currentDate;
		userData.requestsToday = 0;
	}

	// Перевірка ліміту
	if (userData.requestsToday >= MAX_REQUESTS_PER_DAY) {
		return res.status(429).json({ error: 'Daily request limit exceeded. Try again tomorrow.' });
	}

	// Збільшуємо лічильник запитів
	userData.requestsToday += 1;

	try {
		const { sufficient, balance, requiredTokens } = await checkTokenBalance(walletAddress);

		if (!sufficient) {
			return res.status(403).json({
				error: `Insufficient balance. Minimum required: ${requiredTokens}, your balance: ${balance}`,
			});
		}

		let combinedText = '';
		if (files && files.length > 0) {
			combinedText = await processFiles(files);
		}

		const input = `${message || ''}\n\n${combinedText}`;
		const chatGPTResponse = await callChatGPTAPI(input);

		res.json({reply: chatGPTResponse});
	} catch (error) {
		console.error('Error calling ChatGPT API:', error);
		res.status(500).json({error: 'Failed to get response from ChatGPT'});
	} finally {
		// Видаляємо тимчасові файли
		if (files && files.length > 0) {
			files.forEach((file) => {
				try {
					fs.unlinkSync(file.path);
				} catch (err) {
					console.error(`Error deleting file ${file.path}:`, err);
				}
			});
		}
	}
});

module.exports = apiRouter;

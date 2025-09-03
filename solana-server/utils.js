const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

const {Connection, PublicKey} = require('@solana/web3.js');
const {TOKEN_PROGRAM_ID, getAccount, getMint} = require('@solana/spl-token');

// Ініціалізація змінних середовища
require('dotenv').config(); // Завантажуємо конфігурацію з .env

// Підключення до Solana через URL з .env
const connection = new Connection(process.env.SOLANA_RPC_URL);
const MEME_TOKEN_MINT_ADDRESS = process.env.MEME_TOKEN_MINT_ADDRESS;
const REQUIRED_TOKENS = parseInt(process.env.REQUIRED_TOKENS, 10);
const MAX_OUTPUT_TOKENS = parseInt(process.env.MAX_OUTPUT_TOKENS, 10);

// Перевіряємо, чи визначено MEME_TOKEN_MINT_ADDRESS
if (!MEME_TOKEN_MINT_ADDRESS) {
	throw new Error('MEME_TOKEN_MINT_ADDRESS is not defined in .env');
}

const checkTokenBalance = async (publicKey) => {
	const ownerPublicKey = new PublicKey(publicKey);
	const tokenAccounts = await connection.getTokenAccountsByOwner(ownerPublicKey, {
		programId: TOKEN_PROGRAM_ID,
	});

	let tokenBalance = 0;

	for (const {pubkey} of tokenAccounts.value) {
		const tokenInfo = await getAccount(connection, pubkey);
		if (tokenInfo.mint.toBase58() === MEME_TOKEN_MINT_ADDRESS) {
			const mintInfo = await getMint(connection, tokenInfo.mint);
			const decimals = mintInfo.decimals;

			const rawBalance = BigInt(tokenInfo.amount.toString());
			tokenBalance = Number(rawBalance) / Math.pow(10, decimals);

			break;
		}
	}

	return {
		sufficient: tokenBalance >= REQUIRED_TOKENS,
		balance: tokenBalance,
		requiredTokens: REQUIRED_TOKENS,
	};
}

// ChatGPT API call function
const callChatGPTAPI = async (input) => {
	try {
		const response = await axios.post(
			'https://api.openai.com/v1/chat/completions',
			{
				model: 'gpt-4',
				messages: [{role: 'user', content: input}],
				max_tokens: MAX_OUTPUT_TOKENS,
			},
			{
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
		);

		return response.data.choices[0].message.content;
	} catch (error) {
		console.error('Error in callChatGPTAPI:', error.message);
		if (error.response) {
			console.error('OpenAI API error:', error.response.status, error.response.data);
		}
		throw new Error('Failed to get response from ChatGPT');
	}
};

// Обробка тексту з PDF
const extractTextFromPDF = async (filePath) => {
	const dataBuffer = fs.readFileSync(filePath);
	const pdfData = await pdf(dataBuffer);
	return pdfData.text;
};

// Обробка тексту з DOCX
const extractTextFromDOCX = async (filePath) => {
	const dataBuffer = fs.readFileSync(filePath);
	const {value} = await mammoth.extractRawText({buffer: dataBuffer});
	return value;
};

// Обробка файлів
const processFiles = async (files) => {
	let combinedText = '';
	const textTypes = ['text/plain', 'text/php', 'text/javascript', 'text/html', 'text/css', 'text/xml'];

	for (const file of files) {
		try {
			if (file.mimetype === 'application/pdf') {
				combinedText += await extractTextFromPDF(file.path);
			} else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
				combinedText += await extractTextFromDOCX(file.path);
			} else if (file.mimetype === 'application/json') {
				const jsonContent = JSON.parse(fs.readFileSync(file.path, 'utf-8'));
				combinedText += `JSON Content (${file.originalname}):\n${JSON.stringify(jsonContent, null, 2)}`;
			} else if (textTypes.includes(file.mimetype)) {
				const textContent = fs.readFileSync(file.path, 'utf-8');
				combinedText += `File Content (${file.originalname}):\n${textContent}`;
			} else {
				combinedText += `Unsupported file type: ${file.originalname} (${file.mimetype})\n`;
			}
		} catch (error) {
			combinedText += `Error processing file: ${file.originalname}\n`;
			console.error(`Error processing file: ${file.path}`, error);
		}
		combinedText += '\n---\n';
	}
	return combinedText;
};

module.exports = { checkTokenBalance, callChatGPTAPI, processFiles };
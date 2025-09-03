import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import { useNotifications } from '@toolpad/core';
import axios from "axios";

// Створення контексту для гаманця
const WalletContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

const WALLET_LIST = [
	{ name: 'Phantom', installed: false },
	{ name: 'Solflare', installed: false },
	{ name: 'Backpack', installed: false },
];

// Провайдер контексту, який надає доступ до даних про гаманець
export const WalletProvider = ({children}) => {
	const [walletName, setWalletName] = useState(null);
	const [walletAddress, setWalletAddress] = useState(null);
	const [isConnected, setIsConnected] = useState(false);
	const [canChat, setCanChat] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [wallets, setWallets] = useState(WALLET_LIST); // Масив гаманців з початковими значеннями

	const notifications = useNotifications();

	// Функція для перевірки доступності гаманців
	const detectWallets = useCallback(() => {
		const checkWallets = () => {
			const updatedWallets = WALLET_LIST.map((wallet) => {
				if (wallet.name === 'Phantom' && window.phantom?.solana?.isPhantom) {
					return { ...wallet, installed: true };
				}
				if (wallet.name === 'Solflare' && window.solflareWalletStandardInitialized) {
					return { ...wallet, installed: true };
				}
				if (wallet.name === 'Backpack' && window.backpack) {
					return { ...wallet, installed: true };
				}
				return wallet; // Якщо гаманець не встановлений, залишаємо його без змін
			});
			setWallets(updatedWallets);
		}

		setTimeout(checkWallets, 500); // Перевірка через 1000 мс після виклику
	}, []);

	// Функція для підключення до Phantom гаманця
	const connectWallet = async (wallet) => {
		try {
			let publicKey = '';
			if (wallet === 'Phantom' && window.solana?.isPhantom) {
				let response = await window.solana.connect();
				publicKey = response.publicKey.toString();
			} else if (wallet === 'Solflare' && window.solflare) {
				const isConnected = await window.solflare.connect();
				if ( isConnected ) {
					publicKey = window.solflare.publicKey?.toString();
				} else {
					// Якщо користувач натиснув Reject у Solflare
					showMessage('connection-rejected');
					return;
				}
			} else if (wallet === 'Backpack' && window.backpack) {
				let response = await window.backpack.connect();
				publicKey = response.publicKey.toString();
			} else {
				showMessage('not-available', wallet);
				return;
			}

			setWalletName(wallet);
			setWalletAddress(publicKey);
			setIsConnected(true); // змінюємо стан на підключений
			localStorage.setItem('walletAddress', publicKey); // Збереження в localStorage
			localStorage.setItem('walletName', wallet); // Збереження в localStorage
			showMessage('connected');
			closeWalletPopup(); // Закриваємо попап після успішного конекту
			isTokenBalanceSufficient(publicKey);
		} catch (error) {
			console.error("Wallet connection failed:", error);

			// Обробка натискання Reject
			if (isUserRejectedError(error)) {
				// Код 4001 зазвичай означає, що користувач відхилив запит
				showMessage('connection-rejected');
			} else {
				// Інші помилки
				showMessage('connection-failed');
			}
		}
	};

	// Відключення гаманця
	const disconnectWallet = () => {
		setWalletAddress(null);  // Очищаємо адресу гаманця
		setIsConnected(false);    // Оновлюємо статус підключення
		localStorage.removeItem('walletAddress'); // Очищаємо збережену адресу в localStorage
		localStorage.removeItem('walletName'); // Очищаємо збережену адресу в localStorage
		setCanChat(false);
		showMessage('disconnected');
		// Якщо потрібно, можете викликати функцію disconnect в самому гаманці, якщо така є.
		// Наприклад, для Phantom (якщо Phantom надає API disconnect):
		// window.solana.disconnect();  // Не всі гаманці мають цей метод
	};

	// declare the async data fetching function
	const isTokenBalanceSufficient = useCallback(async (publicKey, isPeriodicCheck = false) => {
		try {
			const response = await axios.get(`${API_URL}/check-token-balance/${publicKey}`);
			const { sufficient } = response.data; // Очікуємо, що бек поверне { sufficient: true/false }

			if ( isPeriodicCheck ) {
				if ( sufficient !== canChat ) {
					showMessage(sufficient ? 'tokens-sufficient' : 'tokens-insufficient');
				}
			} else {
				showMessage(sufficient ? 'tokens-sufficient' : 'tokens-insufficient');
			}

			setCanChat(sufficient);

		} catch (error) {
			console.error('Error fetching Meme Token balance:', error);
		}
	}, [canChat])

	useEffect(() => {
		const savedWalletAddress = localStorage.getItem('walletAddress');
		const savedWalletName = localStorage.getItem('walletName');

		if (savedWalletAddress && savedWalletName && !isConnected) {
			setWalletName(savedWalletName);
			setWalletAddress(savedWalletAddress);
			setIsConnected(true); // Встановлюємо статус підключеного гаманця

			// Перевірка балансу токенів після відновлення підключення
			isTokenBalanceSufficient(savedWalletAddress);
		}

		detectWallets();
	}, [isConnected, isTokenBalanceSufficient, detectWallets]);

	// Періодична перевірка балансу
	useEffect(() => {
		let interval;

		if (isConnected && walletAddress) {
			interval = setInterval(() => {
				isTokenBalanceSufficient(walletAddress, true);
			}, 600000); // Перевірка кожні 10 хв // 600000
		}

		return () => {
			if (interval) {
				clearInterval(interval);
			}
		};
	}, [isConnected, walletAddress, isTokenBalanceSufficient]);

	const openWalletPopup = () => {
		setIsPopupOpen(true);
	};

	const closeWalletPopup = () => {
		setIsPopupOpen(false);
	};

	const showMessage = (type, wallet = 'Wallet') => {
		const position = { vertical: 'bottom', horizontal: 'right' }; // Позиція для правого нижнього кута

		if (type === "connected") {
			notifications.show("Wallet successfully connected!", {
				severity: "success", // success, warning, error
				autoHideDuration: 3000, // тривалість відображення повідомлення
				anchorOrigin: position,
			});
		} else if (type === "disconnected") {
			notifications.show("Wallet disconnected successfully.", {
				severity: "success", // warning, success, error
				autoHideDuration: 3000,
				anchorOrigin: position,
			});
		} else if (type === "tokens-sufficient") {
			notifications.show("You have sufficient tokens! The chat is now active.", {
				severity: "success",
				autoHideDuration: 6000,
				anchorOrigin: position,
			});
		} else if (type === "tokens-insufficient") {
			notifications.show("Oops! You need more tokens to activate the AI chat.", {
				severity: "warning",
				anchorOrigin: position,
			});
		} else if (type === "not-available") {
			notifications.show(`${wallet} is not available!`, {
				severity: "warning",
				autoHideDuration: 5000,
				anchorOrigin: position,
			});
		} else if (type === "connection-rejected") {
			notifications.show("Wallet connection was rejected by the user.", {
				severity: "error",
				autoHideDuration: 5000,
				anchorOrigin: position,
			});
		} else if (type === "connection-failed") {
			notifications.show("Failed to connect to the wallet. Please try again.", {
				severity: "error",
				autoHideDuration: 5000,
				anchorOrigin: position,
			});
		}
	};

	// Функція для перевірки, чи відхилив користувач підключення
	const isUserRejectedError = (error) => {
		const rejectionMessages = [
			'User rejected', // Phantom, Solflare
			'Approval Denied', // Backpack
			'User cancellation', // Інші можливі повідомлення
		];

		// Перевірка на код помилки або повідомлення
		return (
			error?.code === 4001 || // Phantom стандартний код
			rejectionMessages.some(msg => error?.message?.includes(msg))
		);
	};

	return (
		<WalletContext.Provider
			value={{
				walletName,
				walletAddress,
				isConnected,
				canChat,
				setCanChat,
				isPopupOpen,
				wallets,
				connectWallet,
				openWalletPopup,
				closeWalletPopup,
				disconnectWallet,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

// Хук для використання контексту
export const useWallet = () => useContext(WalletContext);

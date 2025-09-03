import React from 'react';

import { Button } from '@mui/material';

import { useWallet } from '../../contexts';
import WalletDetails from "../WalletDetails";

const ConnectWalletButton = () => {
	const { isConnected, openWalletPopup } = useWallet();  // Використовуємо контекст для доступу до підключення

	const handleConnect = () => {
		// Викликаємо функцію connectWallet з контексту
		openWalletPopup();  // Можна також передавати тип гаманця, якщо це необхідно
	};

	return (
		<>
			{
				! isConnected ? (
					<Button
						variant="contained"
						size="large"
						onClick={handleConnect}
						sx={{
							borderRadius: '21px',
						}}
					>
						Connect Wallet
					</Button>
				) : (
					<WalletDetails />
				)
			}
		</>
	);
};

export default ConnectWalletButton;

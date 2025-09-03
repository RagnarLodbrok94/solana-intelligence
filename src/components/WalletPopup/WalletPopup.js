import React from 'react';

import {Modal, Box, Typography, List, ListItem, ListItemButton, ListItemIcon, Button, Chip} from '@mui/material';

import {useWallet} from '../../contexts'; // Використовуємо контекст
import {PhantomIcon, SolflareIcon, BackpackIcon} from '../WalletIcons';  // Припускаємо, що у вас є ці іконки

import './WalletPopup.css';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	borderRadius: '24px',
	boxShadow: 24,
	p: 4,
};

const WalletPopup = () => {
	const {isPopupOpen, wallets, connectWallet, closeWalletPopup} = useWallet();  // Отримуємо значення з контексту

	if (!isPopupOpen) return null;

	// Функція для відображення іконок гаманців
	const getWalletIcon = (wallet) => {
		switch (wallet) {
			case 'Phantom':
				return <PhantomIcon width={32} height={32}/>;
			case 'Solflare':
				return <SolflareIcon width={32} height={32}/>;
			case 'Backpack':
				return <BackpackIcon width={32} height={32}/>;
			default:
				return null;
		}
	};

	return (
		<Modal open={isPopupOpen} onClose={closeWalletPopup}>
			<Box sx={style}>
				<Typography variant="h6" component="h2">
					Select Wallet
				</Typography>
				<Typography variant="body2" color="textSecondary">You need to connect a Solana wallet.</Typography>
				<List>
					{wallets.length > 0 ? (
						wallets.map(({ name: wallet, installed }) => (
							<ListItem key={wallet} disableGutters>
								<ListItemButton
									onClick={() => connectWallet(wallet)}
									sx={{
										backgroundColor: 'rgba(255, 255, 255, 0.03)', // Легкий фон для виділення
										borderRadius: 2,
									}}
								>
									<ListItemIcon>
										{getWalletIcon(wallet)} {/* Відображаємо іконку для кожного гаманця */}
									</ListItemIcon>
									<Typography variant="body1" mr={1}>{wallet}</Typography>
									{installed && (<Chip label='Installed' size="small" />)}
								</ListItemButton>
							</ListItem>
						))
					) : (
						<Typography variant="body2">No wallets available</Typography>
					)}
				</List>
				<Box display="flex" justifyContent="flex-end">
					<Button onClick={closeWalletPopup} variant="outlined">
						Cancel
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default WalletPopup;

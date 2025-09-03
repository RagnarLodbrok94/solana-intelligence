import React from 'react';
import {Box, Typography, IconButton, Link, Container, Tooltip} from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import {DexScreener, Twitter} from "../../assets/icons";

function Footer() {
	return (
		<Box
			component='footer'
			width='100%'
			left={0}
			bottom={0}
			zIndex={1}
			textAlign='center'
			padding={1}
			sx={{
				position: {
					xs: 'static', // Позиція на маленьких екранах
					md: 'fixed',  // Позиція на екранах від 960px (md)
				},
				bgcolor: {
					xs: undefined, // Прозорий на маленьких екранах
					md: 'background.paper',     // Звичайний на великих екранах
				},
			}}
		>
			<Container maxWidth="md">
				{/* Іконки соціальних мереж справа */}
				<Box mb={1}>
					<IconButton
						component={Link}
						href="https://x.com/S0LIntelligence"
						target="_blank"
						rel="noopener"
						aria-label="X"
					>
						<Twitter width={24} height={24}/>
					</IconButton>
					<IconButton
						component={Link}
						href="https://t.me/S0LIntelligence"
						target="_blank"
						rel="noopener"
						aria-label="Telegram"
					>
						<TelegramIcon/>
					</IconButton>
					<Tooltip title='Comming soon' placement="top">
						<span>
							<IconButton
								component={Link}
								href="#"
								target="_blank"
								rel="noopener"
								aria-label="Dex Screener"
							>
						<DexScreener width={24} height={24}/>
					</IconButton>
						</span>
					</Tooltip>
				</Box>
				<Typography variant="body2" color="textSecondary">
					Solana Intelligence © 2024. All rights reserved.
				</Typography>
			</Container>
		</Box>
	);
}

export default Footer;

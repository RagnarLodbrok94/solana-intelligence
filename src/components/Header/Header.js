import React from 'react';

import {AppBar, Box, Container, Toolbar} from "@mui/material";

import ConnectWalletButton from "../ConnectWalletButton";

import logo from "../../assets/images/logo-solana.svg";

const Header = () => {
	return (
		<AppBar
			sx={{
				position: {
					xs: 'static', // Позиція на маленьких екранах
					md: 'fixed',  // Позиція на екранах від 960px (md)
				},
				color: {
					xs: 'transparent', // Прозорий на маленьких екранах
					md: 'inherit',     // Звичайний на великих екранах
				},
				backgroundImage: {
					xs: 'none', // Без фону на маленьких екранах
					md: undefined,
				},
				boxShadow: 'none', // Загальні стилі для всіх breakpoints
			}}
		>
			<Container maxWidth='xl'>
				<Toolbar disableGutters={true}>
					<Box
						component="img"
						src={logo}
						alt="Logo"
						sx={{ width: 40, height: 40, mr: 2 }}
					/>
					<Box sx={{ flexGrow: 1 }} />
					<ConnectWalletButton />
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Header;
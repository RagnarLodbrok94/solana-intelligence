import React, {useEffect} from "react";

import {ThemeProvider} from "@emotion/react";

import {NotificationsProvider} from '@toolpad/core/useNotifications';

import {
	createTheme,
	CssBaseline,
} from "@mui/material";

import {WalletProvider} from "./contexts";
import SectionWelcome from "./components/SectionWelcome";
import SectionWithChat from "./components/SectionWithChat/SectionWithChat";
import WalletPopup from "./components/WalletPopup";
import FullPageScroll from "./components/FullPageScroll";
import Header from "./components/Header";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import './App.scss';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#c766ef', // Основний колір для Primary
		},
		secondary: {
			main: '#1de9b6', // Основний колір для Secondary
		},
	},
	typography: {
		fontFamily: '"Antic", sans-serif', // Вказуємо шрифт
	},
	components: {
		// Налаштовуємо шрифт для кнопок
		MuiButton: {
			styleOverrides: {
				root: {
					fontFamily: '"Roboto", sans-serif',  // Встановлюємо інший шрифт для кнопок
					textTransform: 'none',
				},
			},
		},
	},
});

function App() {
	useEffect(() => {
		const dots = document.querySelectorAll('.dot');

		dots.forEach((dot) => {
			dot.addEventListener('click', (event) => {
				event.preventDefault();
				const targetId = dot.getAttribute('href').substring(1);
				const targetSection = document.getElementById(targetId);

				if (targetSection) {
					targetSection.scrollIntoView({
						behavior: 'smooth',
						block: 'start',
					});
				}
			});
		});

		return () => {
			dots.forEach((dot) => dot.removeEventListener('click', () => {}));
		};
	}, []);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline/>
			<NotificationsProvider>
				<WalletProvider>
					<Header/>
					<WalletPopup/>
					<FullPageScroll>
						<SectionWelcome/>
						<SectionWithChat/>
						<Faq/>
					</FullPageScroll>
					<Footer/>
				</WalletProvider>
			</NotificationsProvider>
		</ThemeProvider>
	);
}

export default App;

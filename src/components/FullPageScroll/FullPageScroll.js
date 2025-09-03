import React, { useEffect, Children } from 'react';
import './FullPageScroll.scss';
import { useMediaQuery, useTheme } from '@mui/material';

const FullPageScroll = ({ children }) => {
	const theme = useTheme(); // Отримуємо тему MUI
	const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md = 900px за замовчуванням

	useEffect(() => {
		if (!isDesktop) return; // Якщо не десктоп — FullPage логіка не виконується

		const container = document.querySelector('.fullpage-container');
		const sectionElements = document.querySelectorAll('.fullpage-section');
		const dots = document.querySelectorAll('.fullpage-dot');

		const updateActiveDot = (index) => {
			dots.forEach((dot) => dot.classList.remove('fullpage-active'));
			if (dots[index]) {
				dots[index].classList.add('fullpage-active');
			}
		};

		const handleScroll = () => {
			const viewportCenter = window.innerHeight / 2;

			sectionElements.forEach((section, index) => {
				const rect = section.getBoundingClientRect();
				const sectionCenter = rect.top + rect.height / 2;

				if (Math.abs(viewportCenter - sectionCenter) < rect.height / 2) {
					updateActiveDot(index);
				}
			});
		};

		const handleDotClick = (event, targetId) => {
			event.preventDefault();
			const targetSection = document.getElementById(targetId);
			if (targetSection) {
				targetSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		};

		dots.forEach((dot, index) => {
			dot.addEventListener('click', (e) =>
				handleDotClick(e, sectionElements[index].id)
			);
		});

		container.addEventListener('scroll', handleScroll);

		return () => {
			container.removeEventListener('scroll', handleScroll);
			dots.forEach((dot) => dot.removeEventListener('click', () => {}));
		};
	}, [isDesktop]);

	if (!isDesktop) {
		// Простий скрол для мобільних пристроїв
		return (
			<div className="regular-scroll-container">
				{Children.map(children, (child, index) => (
					<div className="regular-scroll-section" key={`section${index + 1}`}>
						{child}
					</div>
				))}
			</div>
		);
	}

	// FullPage функціонал для десктопів
	return (
		<div className="fullpage-container">
			{Children.map(children, (child, index) => (
				<div
					className="fullpage-section"
					id={`section${index + 1}`}
					key={`section${index + 1}`}
				>
					{child}
				</div>
			))}

			<div className="fullpage-pagination">
				{Children.map(children, (_, index) => (
					<a
						key={index}
						href={`#section${index + 1}`}
						className={`fullpage-dot ${index === 0 ? 'fullpage-active' : ''}`}
						aria-label={`Go to the section ${index + 1}`}
					></a>
				))}
			</div>
		</div>
	);
};

export default FullPageScroll;

import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		const setCanvasSize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		setCanvasSize(); // Встановити початковий розмір
		window.addEventListener('resize', setCanvasSize); // Оновлювати при зміні розміру вікна

		const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const fontSize = 16;
		const columns = Math.floor(canvas.width / fontSize);
		const drops = Array(columns).fill(0);

		// Функція для малювання анімації
		const draw = () => {
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#0F0'; // Зелений колір для символів
			ctx.font = `${fontSize}px monospace`;

			drops.forEach((y, x) => {
				const text = characters[Math.floor(Math.random() * characters.length)];
				ctx.fillText(text, x * fontSize, y * fontSize);

				if (y * fontSize > canvas.height && Math.random() > 0.975) {
					drops[x] = 0; // Обнулення стовпчика після досягнення нижньої межі
				}
				drops[x]++;
			});
		};

		const intervalId = setInterval(draw, 50);

		return () => {
			clearInterval(intervalId);
			window.removeEventListener('resize', setCanvasSize);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				zIndex: -1,
				pointerEvents: 'none', // Блокує взаємодію з канвасом
			}}
		/>
	);
};

export default MatrixRain;

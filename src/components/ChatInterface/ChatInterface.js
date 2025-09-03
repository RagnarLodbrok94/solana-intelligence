import React, {useEffect, useRef, useState} from 'react';

import axios from 'axios';

import { styled } from '@mui/material/styles';
import {Box, Typography, IconButton, Tooltip, TextareaAutosize, Stack, Chip, Skeleton} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import './ChatInterface.scss';
import {useWallet} from "../../contexts";
import {useNotifications} from "@toolpad/core";

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

const API_URL = process.env.REACT_APP_API_URL;

const MAX_INPUT_CHARS = 500; // Максимальна кількість символів

function ChatInterface() {
	const { walletAddress, canChat, setCanChat } = useWallet();

	const [message, setMessage] = useState('');
	const [chatHistory, setChatHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [showResults, setShowResults] = useState(false); // Показувати результати після відправлення
	const [isActive, setIsActive] = useState(false);
	const [attachedFiles, setAttachedFiles] = useState([]);

	const fileInputRef = useRef(null); // Додано

	const notifications = useNotifications();

	useEffect(() => {
		if (!canChat) {
			setMessage('');
		}
	}, [canChat]);

	const handleSendMessage = async () => {
		if (!canChat || (!message.trim() && attachedFiles.length === 0)) {
			// Якщо ні тексту, ні файлів, не відправляємо нічого
			return;
		}

		const formData = new FormData();

		// Додаємо текст повідомлення, якщо він є
		if (message.trim()) {
			formData.append('message', message);
		}

		// Додаємо файли, якщо вони є
		attachedFiles.forEach((file) => {
			formData.append('files', file);
		});

		// Додаємо адресу гаманця
		formData.append('walletAddress', walletAddress);

		// Display user's message in chat history
		const userMessage = {
			sender: "User",
			text: `${message.trim()}${attachedFiles.length > 0 ? ` (${attachedFiles.length} file(s) attached)` : ''}`,
		};

		setChatHistory([...chatHistory, userMessage]);
		setIsLoading(true);

		try {
			// Send message to the server, which will forward it to ChatGPT API
			const response = await axios.post(`${API_URL}/chat`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			const botMessage = {
				sender: "ChatGPT",
				text: response.data.reply
			};

			// Update chat history with the bot's response
			setChatHistory((prevHistory) => [...prevHistory, botMessage]);
			setShowResults(true);
		} catch (error) {
			// Перевіряємо, чи це помилка недостатнього балансу
			if (error.response && error.response.status === 403) {
				setCanChat(false);

				// Відображаємо повідомлення користувачу
				const position = {vertical: 'bottom', horizontal: 'right'}; // Позиція для правого нижнього кута
				notifications.show("Insufficient balance detected!", {
					severity: "warning",
					anchorOrigin: position,
				});
			} else {
				console.error("Error sending message:", error);
				setChatHistory((prevHistory) => [
					...prevHistory,
					{sender: "System", text: "Error: Could not fetch response from ChatGPT."},
				]);
			}
		} finally {
			setIsLoading(false);
			setMessage(''); // Clear input after sending
			setAttachedFiles([]); // Clear attached files
		}
	};

	const handleInputChange = (event) => {
		const inputValue = event.target.value;

		// Перевірка: не дозволяти вводити більше, ніж MAX_INPUT_CHARS
		if (inputValue.length > MAX_INPUT_CHARS) {
			setMessage(inputValue.slice(0, MAX_INPUT_CHARS));
		} else {
			setMessage(inputValue);
		}
	};

	const handleClick = () => {
		setIsActive((prev) => !prev);
	};

	const handleFileChange = (event) => {
		const files = Array.from(event.target.files);
		setAttachedFiles(files);

		// Скидання значення інпуту після вибору файлів
		if (fileInputRef.current) {
			fileInputRef.current.value = ''; // Додано
		}
	};

	return (
		<Box component="div">
			{!showResults ? (
				<>
					<Typography variant="h4" component="h2" mb={2}>The Intelligence of Tomorrow</Typography>
					<Typography variant="body1" mb={4}>The future belongs to those who see opportunities before others: your tokens are the key to partnering with AI and an investment in tomorrow’s world. Give your potential and assets a chance to become part of the new technological success!</Typography>
				</>
			) : null}

			{showResults && (
				<Box
					className='ChatWrap-response-window'
					px={3}
					onWheel={(e) => e.stopPropagation()}
				>
					{chatHistory.map((msg, index) => (
						msg.sender === "User" ? (
							<Typography key={index} variant="body1" textAlign="right" mb={2}>
								<Box
									component="span"
									sx={{
										display: 'inline-block', // Подібно до Chip
										backgroundColor: 'rgba(255, 255, 255, 0.1)',
										color: 'primary.contrastText',
										padding: '8px 16px',
										borderRadius: '16px', // Закруглені кути
										maxWidth: '50%', // Задає ширину, щоб текст переносився
									}}
								>
									{msg.text}
								</Box>
							</Typography>
						) : (
							<Typography key={index} variant="body1" textAlign="left" mb={2}>
								{msg.text}
							</Typography>
						)
					))}
				</Box>
			)}
			{/* Loading */}
			{isLoading && (
				<Box px={3} mb={3}>
					<Skeleton variant="text" animation="wave" width='60%' height='20px' />
					<Skeleton variant="text" animation="wave" width='80%' height='20px' />
					<Skeleton variant="text" animation="wave" width='70%' height='20px' />
				</Box>
			)}
			{/* Message input and send button */}
			<Box className='ChatWrap active'>
				{!canChat && <span className='ChatWrap-shimmer' />}
				{/* Textarea with transparent background */}
				<TextareaAutosize
					minRows={1}
					maxRows={4}
					placeholder="Type a message"
					value={message}
					onChange={handleInputChange}
					disabled={!canChat || isLoading}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							handleSendMessage();
						}
					}}
					style={{
						width: '100%',
						color: 'inherit',
						backgroundColor: 'transparent',
						border: '1px solid transparent',
						padding: '8px',
						resize: 'none',
						outline: 'none',
						fontSize: '16px',
					}}
				/>
				{attachedFiles.length > 0 && (
					<Stack direction="row" alignItems='center' spacing={1} mt={1}>
						<Typography variant="body2">Attached Files:</Typography>
						{attachedFiles.map((file, index) => (
							<Chip key={index} label={file.name} size="small" />
						))}
					</Stack>
				)}
				{/* Container with buttons */}
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginTop: 1,
					}}
				>
					{/* Left-side buttons */}
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Tooltip title="Attach file" placement="left">
							<span>
								<IconButton
									component="label"
									size="large"
									disabled={!canChat || isLoading}
								>
								<AttachFileIcon />
								<VisuallyHiddenInput
									ref={fileInputRef} // Додано
									type="file"
									onChange={handleFileChange}
									multiple
								/>
							</IconButton>
							</span>
						</Tooltip>
						<Tooltip title="Search the web" placement="right">
							<span>
								<IconButton
									size="large"
									onClick={handleClick}
									disabled={!canChat || isLoading}
									sx={{
										backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
									}}
								>
									<LanguageIcon/>
								</IconButton>
							</span>
						</Tooltip>
					</Box>

					{/* Right-side send button */}
					<Tooltip title={!message.trim() ? 'Message is empty' : ''} placement="top">
						<span>
							<IconButton
								onClick={handleSendMessage}
								disabled={!message.trim()} // Disable the button if the message is empty
							>
								<ArrowCircleRightIcon fontSize="large" sx={{transform: 'rotate(-90deg)'}}/>
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			</Box>
		</Box>
	);
}

export default ChatInterface;
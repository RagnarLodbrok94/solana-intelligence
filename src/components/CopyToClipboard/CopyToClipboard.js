import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export default function CopyToClipboardIcon({textToCopy}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000); // Змінює іконку назад через 2 секунди
		} catch (error) {
			console.error("Не вдалося скопіювати текст: ", error);
		}
	};

	return (
		<IconButton size="small" onClick={handleCopy} aria-label="Copy text">
			{copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
		</IconButton>
	);
}

import React from 'react';
import './GlitchButton.scss';

function GlitchButton({ text, size = "md", onClick, disabled }) {
	return (
		<button
			className={`glitch-button glitch-button-${size} ${disabled ? 'disabled' : ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			<span className="glitch-text" data-text={text}>{text}</span>
		</button>
	);
}

export default GlitchButton;
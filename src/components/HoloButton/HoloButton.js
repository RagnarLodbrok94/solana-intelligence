import React from 'react';
import './HoloButton.css';

function HoloButton({ text = "Explore AI" }) {
	return (
		<button className="holo-button">
			{text}
		</button>
	);
}

export default HoloButton;

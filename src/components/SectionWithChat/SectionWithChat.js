import React from "react";

import {Box, Container} from "@mui/material";

import ChatInterface from "../ChatInterface";

function SectionWithChat() {
	return (
		<Box
			component="section"
			textAlign="center"
			overflow='hidden'
			pt={{xs: 6, md: 8}}
			pb={{xs: 6, md: 10}}>
			<Container maxWidth="md">
				<ChatInterface/>
			</Container>
		</Box>
	);
}

export default SectionWithChat;
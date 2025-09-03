import {Box, Button, Container, Grid, Typography} from "@mui/material";
import React from "react";

import step1 from '../../assets/images/step-1.png';
import step2 from '../../assets/images/step-2.png';
import step3 from '../../assets/images/step-3.png';
import CopyToClipboard from "../CopyToClipboard";

// const MEME_TOKEN_MINT_ADDRESS = 'wX6pBoowZtEs6mzf69oeXJgimggqzw7BNtVhMhepump'; // Адреса токена PumpFun
const MEME_TOKEN_MINT_ADDRESS = 'Coming soon...'; // Адреса токена PumpFun

function SectionWelcome() {
	return (
		<Box component="section" py={6} textAlign="center">
			<Container maxWidth="md">
				<Typography variant="h3" component="h1" mb={1}>Solana Intelligence</Typography>
				<Typography variant="body1" mb={{ xs: 2, sm: 3 }}>Unlock the power of ChatGPT with Solana — smart access, limitless possibilities!</Typography>
				<Grid
					container
					alignItems="center"
					justifyContent="center"
					spacing={{ xs: 1, sm: 3 }}
					mb={3}
					sx={{
						flexDirection: {
							xs: 'column', // Вертикально на малих екранах
							sm: 'row',
						},
					}}
				>
					{/* Перша колонка з картинкою */}
					<Grid item xs={7} sm={4}>
						<Box sx={{display: 'flex', justifyContent: 'center'}}>
							<img
								src={step1}
								alt="The first step in gaining access to ChatGPT."
								style={{
									width: '100%',
									height: 'auto',
									borderRadius: '8px',
									objectFit: 'cover', // Це гарантує, що картинка буде заповнювати блок
								}}
							/>
						</Box>
					</Grid>

					{/* Друга колонка з картинкою */}
					<Grid item xs={7} sm={4}>
						<Box sx={{display: 'flex', justifyContent: 'center'}}>
							<img
								src={step2}
								alt="The second step in gaining access to ChatGPT."
								style={{
									width: '100%',
									height: 'auto',
									borderRadius: '8px',
									objectFit: 'cover',
								}}
							/>
						</Box>
					</Grid>

					{/* Третя колонка з картинкою */}
					<Grid item xs={7} sm={4}>
						<Box sx={{display: 'flex', justifyContent: 'center'}}>
							<img
								src={step3}
								alt="The third step in gaining access to ChatGPT."
								style={{
									width: '100%',
									height: 'auto',
									borderRadius: '8px',
									objectFit: 'cover',
								}}
							/>
						</Box>
					</Grid>
				</Grid>
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					gap={2}
					sx={{
						flexDirection: {
							xs: 'column', // Вертикально на малих екранах
							sm: 'row',
						},
					}}
				>
					<Button
						href="#coming-soon"
						variant="contained"
						size="large"
						color='secondary'
						sx={{
							borderRadius: '21px',
						}}
					>Buy SOL(i)</Button>
					<Typography variant="body1">
						CA: <b>{MEME_TOKEN_MINT_ADDRESS}</b> <CopyToClipboard textToCopy={MEME_TOKEN_MINT_ADDRESS}/>
					</Typography>
				</Box>
			</Container>
		</Box>
	)
}

export default SectionWelcome;
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {Box, Container} from "@mui/material";

const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:first-of-type, &:first-of-type .MuiAccordionSummary-root': {
		borderTopRightRadius: '12px',
		borderTopLeftRadius: '12px',
	},
	'&:last-child, &:last-child .MuiAccordionSummary-root': {
		borderBottomRightRadius: '12px',
		borderBottomLeftRadius: '12px',
	},
	'&.Mui-expanded:last-child .MuiAccordionSummary-root': {
		borderBottomRightRadius: '0',
		borderBottomLeftRadius: '0',
	},
	'.MuiAccordionSummary-root': {
		minHeight: '60px',
	},
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&::before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
	...theme.applyStyles('dark', {
		backgroundColor: 'rgba(255, 255, 255, .05)',
	}),
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
	backgroundColor: 'rgba(255, 255, 255, .03)',
}));

export default function Faq() {
	const [expanded, setExpanded] = React.useState('panel1');

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<Box component="section" py={6}>
			<Container maxWidth="md">
				<Box component="div">
					<Typography variant="h4" component="h2" pb={3} textAlign={'center'}>FAQ</Typography>
					<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
						<AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
							<Typography>Why is access to the advanced Plus version of ChatGPT available through Solana-based tokens?</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								We’re combining the best of technology — powerful AI and the Solana cryptocurrency. With our tokens, you gain not only access to intelligence but also an asset with potential value growth.
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
						<AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
							<Typography>What happens if I sell my tokens?</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								Access to the advanced Plus version of ChatGPT depends on the token balance in your wallet. As long as you maintain the required balance, the AI is yours. Sell, and access is closed; restore the balance, and all features are back in your hands. It’s an incentive not only to hold but also to value your tokens.
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
						<AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
							<Typography>How many tokens do I need to get started?</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								200k tokens are enough to unlock access, making entry into the world of AI accessible and convenient. And remember, the token supply is limited!
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
						<AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
							<Typography>Can the token price increase?</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								With a limited issuance of 1 billion tokens and a growing interest in AI, there’s real potential for token value growth. Access to the advanced Plus version of ChatGPT is just the beginning!
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
						<AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
							<Typography>Why connect right now?</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								The AI market is evolving daily, and you can be at the forefront of this movement. Get access, and watch as the value of your assets and opportunities grows with you!
							</Typography>
						</AccordionDetails>
					</Accordion>
				</Box>
			</Container>
		</Box>
	);
}

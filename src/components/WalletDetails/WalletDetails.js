import * as React from 'react';

import {styled, alpha} from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {Logout} from "@mui/icons-material";

import {useWallet} from "../../contexts";
import {BackpackIcon, PhantomIcon, SolflareIcon} from "../WalletIcons";

const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({theme}) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 152,
		color: 'rgb(55, 65, 81)',
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity,
				),
			},
		},
		...theme.applyStyles('dark', {
			color: theme.palette.grey[300],
		}),
	},
}));

export default function WalletDetails() {
	const {walletName, walletAddress, disconnectWallet} = useWallet();  // Використовуємо контекст для доступу до підключення

	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// Функція для відображення іконок гаманців
	const getWalletIcon = (wallet) => {
		switch (wallet) {
			case 'Phantom':
				return <PhantomIcon width={20} height={20}/>;
			case 'Solflare':
				return <SolflareIcon width={20} height={20}/>;
			case 'Backpack':
				return <BackpackIcon width={20} height={20}/>;
			default:
				return null;
		}
	};

	return (
		<div>
			<Button
				id="demo-customized-button"
				aria-controls={open ? 'demo-customized-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				variant="outlined"
				disableElevation
				onClick={handleClick}
				startIcon={getWalletIcon(walletName)}
				endIcon={<KeyboardArrowDownIcon/>}
				sx={{
					borderRadius: '18px',
				}}
			>
				{`${walletAddress.slice(0, 3)}.....${walletAddress.slice(-3)}`}
			</Button>
			<StyledMenu
				id="demo-customized-menu"
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={disconnectWallet} disableRipple>
					<Logout fontSize="small"/>
					Disconnect
				</MenuItem>
			</StyledMenu>
		</div>
	);
}

import React from "react";
import {Box, Typography} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

function LinearProgressWithLabel({value}) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', width: '400px', mr: 'auto', ml: 'auto' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress variant="determinate" value={value} sx={{ height: 10, borderRadius: 5 }} />
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography
					variant="body2"
					sx={{ color: 'text.secondary' }}
				>{`${Math.round(value)}%`}</Typography>
			</Box>
		</Box>
	);
}

export default LinearProgressWithLabel;
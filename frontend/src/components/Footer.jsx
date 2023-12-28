import { Paper, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Paper component="footer" variant="outlined" square={false} sx={{ backgroundColor: "#353535", color: "white", width: 1 }}>
            <Typography align="center">Copyright (&#169;) {new Date().getFullYear()} by the author(s).</Typography>
        </Paper>
    );
}

import { Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, Paper } from '@mui/material';
import ColorModeProvider from '../features/ColorModeProvider';
import Home from '../routes/Home';

export default function Page() {
    return (
        <ColorModeProvider>
            <CssBaseline enableColorScheme />
            <Container maxWidth="md">
                <Paper elevation={1} square={false} sx={{ width: 1, textAlign: 'center' }}>
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                    </Routes>
                </Paper>
            </Container>
        </ColorModeProvider>
    );
}

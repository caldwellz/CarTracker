import { Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, Paper } from '@mui/material';
import ColorModeProvider from '../features/ColorModeProvider';
import NavMenu from './NavMenu';
import Home from '../routes/Home';
import Footer from './Footer';

export default function Page() {
    return (
        <ColorModeProvider>
            <CssBaseline enableColorScheme />
            <Container maxWidth="md">
                <Paper elevation={2} square={false} sx={{ width: 1, textAlign: 'center' }}>
                    <NavMenu />
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                    </Routes>
                    <Footer />
                </Paper>
            </Container>
        </ColorModeProvider>
    );
}

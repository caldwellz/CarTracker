import * as React from 'react';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import MenuIcon from '@mui/icons-material/Menu';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useColorMode } from '../features/ColorModeProvider';
import { NavLink } from 'react-router-dom';
import { MenuLink } from './MenuLink';

const pages = ['Search', 'Update'];
const settings = [];

export default function NavMenu() {
    const theme = useTheme();
    const colorMode = useColorMode();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar component="nav" position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <ElectricCarIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <NavLink
                        to="/"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            CarTracker
                        </Typography>
                    </NavLink>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page, index) => (
                                <MenuLink key={index} name={page} onClick={handleCloseNavMenu} />
                            ))}
                        </Menu>
                    </Box>
                    <ElectricCarIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <NavLink
                        to="/"
                        style={{
                            textDecoration: 'none',
                        }}
                    >
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.1rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                        >
                            CarTracker
                        </Typography>
                    </NavLink>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, pb: 0, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Me" src="" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem key="Theme" onClick={colorMode.toggleColorMode}>
                                <Typography textAlign="center">Theme</Typography>
                                {theme.palette.mode === 'dark' ? (
                                    <Brightness4Icon sx={{ ml: 1 }} />
                                ) : (
                                    <Brightness7Icon sx={{ ml: 1 }} />
                                )}
                            </MenuItem>
                            {settings.map((setting, index) => (
                                <MenuLink key={index} name={setting} onClick={handleCloseUserMenu} />
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

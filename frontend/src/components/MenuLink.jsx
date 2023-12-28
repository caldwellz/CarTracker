import PropTypes from 'prop-types';
import { MenuItem, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

export function MenuLink({ name, onClick, children }) {
    MenuLink.propTypes = {
        name: PropTypes.string,
        onClick: PropTypes.func,
        children: PropTypes.any,
    };

    return (
        <MenuItem onClick={onClick}>
            <NavLink
                to={nameToHref(name)}
                style={{
                    textDecoration: 'none',
                }}
            >
                <Typography textAlign="center" color="text.primary" textDecoration="none">
                    {name}
                    {children}
                </Typography>
            </NavLink>
        </MenuItem>
    );
}

function nameToHref(name) {
    return '/' + String(name).toLowerCase().replaceAll(' ', '-');
}

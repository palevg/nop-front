import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import { AppBar, Box, Avatar, Toolbar, Typography, Menu, Container, Button, Tooltip, MenuItem, Fade, Divider, ListItemIcon, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';

const Header = () => {
  const { isAuth, currentUser, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const pages = [
    <Link className='menu-link' to="/enterprs">Юр.особи</Link>,
    <Link className='menu-link' to="/peoples">Фіз.особи</Link>,
    <Link className='menu-link' to="/about">Про ресурс</Link>
  ];

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const openElAdmin = Boolean(anchorElAdmin);
  const open = Boolean(anchorElUser);

  let userName = "";
  if (isAuth) {
    let pos = currentUser.FullName.indexOf(" ");
    if (pos > -1) {
      userName = currentUser.FullName.slice(pos + 1, currentUser.FullName.length);
      pos = userName.indexOf(" ");
      if (pos > -1) userName = userName.slice(0, pos);
    } else userName = currentUser.FullName;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenAdminMenu = (event) => {
    setAnchorElAdmin(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseAdminMenu = () => {
    setAnchorElAdmin(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onClickLogout = () => {
    setAnchorElUser(null);
    if (window.confirm('Ви впевнені, що хочете завершити роботу?'))
      logout(currentUser);
      navigate('/');
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalPoliceIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link className='menu-link' to="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              SEQURITY
            </Typography>
          </Link>

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
                <MenuItem key={index} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {/* {isAuth && currentUser.acc > 2 && <MenuItem onClick={handleCloseNavMenu}>
                <Typography textAlign="center">
                  <Link className='menu-link' to="/sessions">Сеанси роботи</Link>
                </Typography>
              </MenuItem>
              } */}
            </Menu>
          </Box>
          <LocalPoliceIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Link className='menu-link' to="/">
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              PS
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
            {isAuth && currentUser.acc > 2 && <Button
              id="fade-button"
              aria-controls={openElAdmin ? 'fade-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={openElAdmin ? 'true' : undefined}
              sx={{ my: 2, color: 'white' }}
              onClick={handleOpenAdminMenu}
              endIcon={openElAdmin ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            >
              Адміністрування
            </Button>}
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))'
                }
              }}
              anchorEl={anchorElAdmin}
              open={openElAdmin}
              onClose={handleCloseAdminMenu}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleCloseAdminMenu}>
                <Link className='menu-link' to="/sessions">Сеанси роботи</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseAdminMenu}>Користувачі</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              <Typography sx={{ minWidth: 100 }}>Привіт,&nbsp;
                {isAuth
                  ? userName
                  : "Гість"
                }!
              </Typography>
              <Tooltip title="Меню користувача">
                <IconButton
                  onClick={handleOpenUserMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {isAuth
                      ? userName[0]
                      : '?'
                    }
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorElUser}
              id="account-menu"
              open={open}
              onClose={handleCloseUserMenu}
              onClick={handleCloseUserMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {isAuth
                ? <MenuItem onClick={handleCloseUserMenu}>
                  <Link className='menu-link' to="/profile">
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Профіль користувача</Link>
                </MenuItem>
                : <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <PersonAdd fontSize="small" />
                  </ListItemIcon>
                  <Link className='menu-link' to="/about">Реєстрація</Link>
                </MenuItem>
              }
              <Divider />
              {isAuth
                ? <MenuItem onClick={onClickLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Завершити роботу
                </MenuItem>
                : <MenuItem onClick={handleCloseUserMenu}>
                  <ListItemIcon>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  <Link className='menu-link' to="/login">Авторизуватись</Link>
                </MenuItem>
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
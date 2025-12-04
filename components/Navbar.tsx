'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    router.push('/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  // Mobile drawer
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ height: '100%', bgcolor: '#0a0a0a' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          NovaCart
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      <List sx={{ px: 2, py: 2 }}>
        {pages.map((page) => (
          <ListItem key={page.name} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(page.path)}
              sx={{
                borderRadius: 2,
                color: pathname === page.path ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                bgcolor: pathname === page.path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(102, 126, 234, 0.15)',
                },
              }}
            >
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {mounted && user && (
        <>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <List sx={{ px: 2, py: 2 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation('/account')}
                sx={{
                  borderRadius: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.15)' },
                }}
              >
                <ListItemText primary="Account" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation('/dashboard')}
                sx={{
                  borderRadius: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.15)' },
                }}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.15)' },
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
      {mounted && !user && (
        <>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <List sx={{ px: 2, py: 2 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavigation('/login')}
                sx={{
                  borderRadius: 2,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.15)' },
                }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('/register')}
                sx={{
                  borderRadius: 2,
                  bgcolor: 'rgba(102, 126, 234, 0.2)',
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.3)' },
                }}
              >
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        suppressHydrationWarning
        sx={{
          bgcolor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => router.push('/')}
              sx={{
                mr: 4,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 900,
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                letterSpacing: '-0.5px',
              }}
            >
              NovaCart
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo - Mobile */}
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={() => router.push('/')}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              NovaCart
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavigation(page.path)}
                  sx={{
                    color: pathname === page.path ? '#667eea' : 'white',
                    display: 'block',
                    px: 2,
                    fontWeight: 600,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: pathname === page.path ? '80%' : '0%',
                      height: '2px',
                      bgcolor: '#667eea',
                      transition: 'width 0.3s',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      '&::after': {
                        width: '80%',
                      },
                    },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Right side icons */}
            <Box suppressHydrationWarning sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {mounted && user && (
                <>
                  <Tooltip title="Wishlist">
                    <IconButton
                      onClick={() => router.push('/wishlist')}
                      sx={{
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      <Badge badgeContent={0} color="error">
                        <FavoriteIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Cart">
                    <IconButton
                      onClick={() => router.push('/cart')}
                      sx={{
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      <Badge badgeContent={0} color="error">
                        <ShoppingCartIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Account">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                      <Avatar
                        sx={{
                          bgcolor: '#667eea',
                          width: 36,
                          height: 36,
                        }}
                      >
                        {user.firstName?.[0] || 'U'}
                      </Avatar>
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
                    <MenuItem disabled sx={{ opacity: 1 }}>
                      <Typography textAlign="center" sx={{ fontWeight: 600 }}>
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => { handleCloseUserMenu(); router.push('/account'); }}>
                      <AccountCircleIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Account</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); router.push('/dashboard'); }}>
                      <DashboardIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {mounted && !user && (
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                  <Button
                    onClick={() => router.push('/login')}
                    sx={{
                      color: 'white',
                      px: 3,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => router.push('/register')}
                    sx={{
                      px: 3,
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #66399c 100%)',
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            bgcolor: '#0a0a0a',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

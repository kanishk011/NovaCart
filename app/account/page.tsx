'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  Grid,
  Avatar,
  Tabs,
  Tab,
  TextField,
  Paper,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout, setUser } from '@/store/slices/authSlice';
import gsap from 'gsap';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      phone
      role
      isActive
      createdAt
    }
  }
`;

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    myOrders {
      id
      orderNumber
      status
      paymentStatus
      total
      createdAt
      items {
        id
        quantity
        price
        product {
          id
          name
          thumbnail
        }
      }
    }
  }
`;

const GET_MY_WISHLIST = gql`
  query GetMyWishlist {
    myWishlist {
      id
      items {
        id
        product {
          id
          name
          thumbnail
          price
          salePrice
        }
      }
    }
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: userData, loading: userLoading } = useQuery(GET_ME, {
    skip: !isAuthenticated,
  });

  const { data: ordersData, loading: ordersLoading } = useQuery(GET_MY_ORDERS, {
    skip: !isAuthenticated || tabValue !== 1,
  });

  const { data: wishlistData, loading: wishlistLoading } = useQuery(GET_MY_WISHLIST, {
    skip: !isAuthenticated || tabValue !== 2,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (userData?.me) {
      setFormData({
        firstName: userData.me.firstName || '',
        lastName: userData.me.lastName || '',
        phone: userData.me.phone || '',
      });
    }
  }, [userData]);

  useEffect(() => {
    if (mounted && headerRef.current && profileRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        profileRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.4)' }
      );
    }
  }, [mounted, userData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditing(true);
    setUpdateSuccess(false);
  };

  const handleCancel = () => {
    setEditing(false);
    if (userData?.me) {
      setFormData({
        firstName: userData.me.firstName || '',
        lastName: userData.me.lastName || '',
        phone: userData.me.phone || '',
      });
    }
  };

  const handleSave = () => {
    // TODO: Implement update mutation
    setEditing(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'SHIPPED':
        return <LocalShippingIcon sx={{ color: '#2196f3' }} />;
      case 'CANCELLED':
        return <CancelOutlinedIcon sx={{ color: '#f44336' }} />;
      default:
        return <PendingIcon sx={{ color: '#ff9800' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return '#4caf50';
      case 'SHIPPED':
        return '#2196f3';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) return null;

  if (userLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#667eea' }} size={60} />
      </Box>
    );
  }

  const currentUser = userData?.me || user;
  const initials = `${currentUser?.firstName?.[0] || ''}${currentUser?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box ref={headerRef} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 800,
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Account
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
            Manage your profile, orders, and preferences
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item size={{xs:12,md:4}}>
            <motion.div
              ref={profileRef}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  p: 4,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                {/* Avatar with Gradient Border */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: -4,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.6 },
                      },
                    }}
                  />
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {initials}
                  </Avatar>
                </Box>

                <Typography
                  variant="h5"
                  sx={{ color: 'white', fontWeight: 700, mb: 1 }}
                >
                  {currentUser?.firstName} {currentUser?.lastName}
                </Typography>

                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <EmailIcon fontSize="small" />
                  {currentUser?.email}
                </Typography>

                {currentUser?.phone && (
                  <Typography
                    sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <PhoneIcon fontSize="small" />
                    {currentUser.phone}
                  </Typography>
                )}

                <Chip
                  label={currentUser?.role}
                  sx={{
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                    color: '#667eea',
                    fontWeight: 600,
                    mb: 3,
                  }}
                />

                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

                {/* Quick Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(102, 126, 234, 0.1)',
                      }}
                    >
                      <ShoppingBagIcon sx={{ color: '#667eea', mb: 1 }} />
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
                        {ordersData?.myOrders?.length || 0}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                        Orders
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(244, 67, 54, 0.1)',
                      }}
                    >
                      <FavoriteIcon sx={{ color: '#f44336', mb: 1 }} />
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
                        {wishlistData?.myWishlist?.items?.length || 0}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                        Wishlist
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: 'rgba(255, 107, 107, 0.5)',
                    color: '#ff6b6b',
                    '&:hover': {
                      borderColor: '#ff6b6b',
                      bgcolor: 'rgba(255, 107, 107, 0.1)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Card>
            </motion.div>
          </Grid>

          {/* Main Content */}
          <Grid item size={{xs:12,md:8}}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {/* Tabs */}
              <Box
                sx={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '1rem',
                      py: 2.5,
                    },
                    '& .Mui-selected': {
                      color: '#667eea',
                    },
                    '& .MuiTabs-indicator': {
                      bgcolor: '#667eea',
                      height: 3,
                    },
                  }}
                >
                  <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
                  <Tab icon={<ShoppingBagIcon />} label="Orders" iconPosition="start" />
                  <Tab icon={<FavoriteIcon />} label="Wishlist" iconPosition="start" />
                  <Tab icon={<SecurityIcon />} label="Settings" iconPosition="start" />
                </Tabs>
              </Box>

              <Box sx={{ p: 4 }}>
                {/* Profile Tab */}
                <TabPanel value={tabValue} index={0}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {updateSuccess && (
                        <Alert
                          severity="success"
                          sx={{
                            mb: 3,
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            '& .MuiAlert-icon': { color: '#4caf50' },
                            '& .MuiAlert-message': { color: '#4caf50' },
                          }}
                        >
                          Profile updated successfully!
                        </Alert>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                          Personal Information
                        </Typography>
                        {!editing ? (
                          <Button
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            sx={{
                              color: '#667eea',
                              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' },
                            }}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              startIcon={<SaveIcon />}
                              onClick={handleSave}
                              sx={{
                                bgcolor: 'rgba(102, 126, 234, 0.2)',
                                color: '#667eea',
                                '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.3)' },
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              startIcon={<CancelIcon />}
                              onClick={handleCancel}
                              sx={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                              }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item size={{xs:12,sm:6}}>
                          <TextField
                            fullWidth
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            disabled={!editing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                                '&.Mui-disabled': {
                                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.6)',
                                '&.Mui-focused': { color: '#667eea' },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item size={{xs:12,sm:6}}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            disabled={!editing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                                '&.Mui-disabled': {
                                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.6)',
                                '&.Mui-focused': { color: '#667eea' },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item size={{xs:12}}>
                          <TextField
                            fullWidth
                            label="Email"
                            value={currentUser?.email}
                            disabled
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.6)',
                              },
                            }}
                          />
                        </Grid>
                        <Grid item size={{xs:12}}>
                          <TextField
                            fullWidth
                            label="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!editing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                                '&.Mui-focused fieldset': { borderColor: '#667eea' },
                                '&.Mui-disabled': {
                                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.6)',
                                '&.Mui-focused': { color: '#667eea' },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />

                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 2 }}>
                        Account Information
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Account Status
                          </Typography>
                          <Chip
                            label={currentUser?.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              bgcolor: currentUser?.isActive
                                ? 'rgba(76, 175, 80, 0.2)'
                                : 'rgba(244, 67, 54, 0.2)',
                              color: currentUser?.isActive ? '#4caf50' : '#f44336',
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            Member Since
                          </Typography>
                          <Typography sx={{ color: 'white' }}>
                            {new Date(currentUser?.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  </AnimatePresence>
                </TabPanel>

                {/* Orders Tab */}
                <TabPanel value={tabValue} index={1}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="orders"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                        Order History
                      </Typography>

                      {ordersLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress sx={{ color: '#667eea' }} />
                        </Box>
                      ) : !ordersData?.myOrders || ordersData.myOrders.length === 0 ? (
                        <Paper
                          sx={{
                            p: 6,
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <ShoppingBagIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                            No orders yet
                          </Typography>
                        </Paper>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {ordersData.myOrders.map((order: any, index: number) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card
                                sx={{
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  p: 3,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
                                  },
                                }}
                                onClick={() => router.push(`/orders/${order.id}`)}
                              >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Box>
                                    <Typography sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                                      Order #{order.orderNumber}
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ textAlign: 'right' }}>
                                    <Chip
                                      icon={getStatusIcon(order.status)}
                                      label={order.status}
                                      size="small"
                                      sx={{
                                        bgcolor: `${getStatusColor(order.status)}20`,
                                        color: getStatusColor(order.status),
                                        fontWeight: 600,
                                        mb: 1,
                                      }}
                                    />
                                    <Typography sx={{ color: '#667eea', fontWeight: 700, fontSize: '1.1rem' }}>
                                      ₹{order.total.toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {order.items.slice(0, 3).map((item: any) => (
                                    <Box
                                      key={item.id}
                                      component="img"
                                      src={item.product.thumbnail || '/placeholder.jpg'}
                                      alt={item.product.name}
                                      sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 1,
                                        objectFit: 'cover',
                                      }}
                                    />
                                  ))}
                                  {order.items.length > 3 && (
                                    <Box
                                      sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 1,
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 600,
                                      }}
                                    >
                                      +{order.items.length - 3}
                                    </Box>
                                  )}
                                </Box>
                              </Card>
                            </motion.div>
                          ))}
                        </Box>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabPanel>

                {/* Wishlist Tab */}
                <TabPanel value={tabValue} index={2}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="wishlist"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                        My Wishlist
                      </Typography>

                      {wishlistLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress sx={{ color: '#667eea' }} />
                        </Box>
                      ) : !wishlistData?.myWishlist?.items || wishlistData.myWishlist.items.length === 0 ? (
                        <Paper
                          sx={{
                            p: 6,
                            textAlign: 'center',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <FavoriteIcon sx={{ fontSize: 80, color: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                            Your wishlist is empty
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => router.push('/products')}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              textTransform: 'none',
                            }}
                          >
                            Browse Products
                          </Button>
                        </Paper>
                      ) : (
                        <Grid container spacing={2}>
                          {wishlistData.myWishlist.items.map((item: any, index: number) => (
                            <Grid item size={{xs:12,sm:6}} key={item.id}>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <Card
                                  sx={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    p: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
                                    },
                                  }}
                                  onClick={() => router.push(`/products/${item.product.slug || item.product.id}`)}
                                >
                                  <Box
                                    component="img"
                                    src={item.product.thumbnail || '/placeholder.jpg'}
                                    alt={item.product.name}
                                    sx={{
                                      width: '100%',
                                      height: 150,
                                      borderRadius: 2,
                                      objectFit: 'cover',
                                      mb: 2,
                                    }}
                                  />
                                  <Typography sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                                    {item.product.name}
                                  </Typography>
                                  <Typography sx={{ color: '#667eea', fontWeight: 700 }}>
                                    ₹{(item.product.salePrice || item.product.price).toFixed(2)}
                                  </Typography>
                                </Card>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabPanel>

                {/* Settings Tab */}
                <TabPanel value={tabValue} index={3}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                        Settings & Preferences
                      </Typography>

                      <List>
                        <ListItem
                          sx={{
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            mb: 2,
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                          }}
                        >
                          <ListItemIcon>
                            <NotificationsIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Notifications"
                            secondary="Manage email and push notifications"
                            primaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          />
                        </ListItem>

                        <ListItem
                          sx={{
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            mb: 2,
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                          }}
                        >
                          <ListItemIcon>
                            <SecurityIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Security"
                            secondary="Change password and security settings"
                            primaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          />
                        </ListItem>

                        <ListItem
                          sx={{
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                          }}
                        >
                          <ListItemIcon>
                            <LocalShippingIcon sx={{ color: '#667eea' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary="Addresses"
                            secondary="Manage shipping and billing addresses"
                            primaryTypographyProps={{ color: 'white', fontWeight: 600 }}
                            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          />
                        </ListItem>
                      </List>
                    </motion.div>
                  </AnimatePresence>
                </TabPanel>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

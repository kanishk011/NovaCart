'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAppSelector } from '@/store/hooks';
import gsap from 'gsap';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

// GraphQL Queries and Mutations
const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      total
      itemCount
      items {
        id
        quantity
        subtotal
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

const CREATE_ORDER = gql`
  mutation CreateOrder($addressId: ID!, $paymentMethod: String!) {
    createOrder(addressId: $addressId, paymentMethod: $paymentMethod) {
      id
      orderNumber
      total
      status
      createdAt
    }
  }
`;

const steps = ['Cart Review', 'Shipping Address', 'Payment', 'Confirmation'];

interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const { data: cartData, loading: cartLoading } = useQuery(GET_MY_CART);
  const [createOrder, { loading: creatingOrder }] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      setActiveStep(3);
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/account?tab=orders`);
      }, 3000);
    },
    onError: (error) => {
      console.error('Order creation failed:', error);
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        '.checkout-animate',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
  }, [activeStep]);

  // Mock addresses (in production, fetch from API)
  useEffect(() => {
    setAddresses([
      {
        id: '1',
        fullName: 'John Doe',
        phone: '+91 9876543210',
        street: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India',
        isDefault: true,
      },
    ]);
    setSelectedAddress('1');
  }, []);

  const handleNext = () => {
    if (activeStep === 0 && (!cartData?.myCart?.items || cartData.myCart.items.length === 0)) {
      return;
    }
    if (activeStep === 1 && !selectedAddress) {
      return;
    }
    if (activeStep === 2) {
      handlePlaceOrder();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;

    try {
      await createOrder({
        variables: {
          addressId: selectedAddress,
          paymentMethod,
        },
      });
    } catch (error) {
      console.error('Failed to place order:', error);
    }
  };

  const handleAddAddress = () => {
    const addressId = `addr_${Date.now()}`;
    const address: Address = {
      id: addressId,
      ...newAddress,
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, address]);
    setSelectedAddress(addressId);
    setIsAddingAddress(false);
    setNewAddress({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const cart = cartData?.myCart;
  const subtotal = cart?.total || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg" ref={containerRef}>
        {/* Header */}
        <MotionBox
          className="checkout-animate"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ mb: 4 }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/cart')}
            sx={{
              color: 'white',
              mb: 2,
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            Back to Cart
          </Button>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Checkout
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Complete your purchase in a few simple steps
          </Typography>
        </MotionBox>

        {/* Stepper */}
        <MotionPaper
          className="checkout-animate"
          sx={{
            p: 3,
            mb: 4,
            background: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.15)',
            borderRadius: 3,
          }}
        >
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 600,
                    },
                    '& .MuiStepLabel-label.Mui-active': {
                      color: '#667eea',
                      fontWeight: 700,
                    },
                    '& .MuiStepLabel-label.Mui-completed': {
                      color: '#4caf50',
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(102, 126, 234, 0.3)',
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                      color: '#667eea',
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                      color: '#4caf50',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </MotionPaper>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <AnimatePresence mode="wait">
              {/* Step 0: Cart Review */}
              {activeStep === 0 && (
                <MotionPaper
                  key="cart-review"
                  className="checkout-animate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  sx={{
                    p: 4,
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.15)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <ShoppingCartIcon sx={{ color: '#667eea', fontSize: 32, mr: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                      Review Your Cart
                    </Typography>
                  </Box>

                  {cartLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress sx={{ color: '#667eea' }} />
                    </Box>
                  ) : !cart || cart.items.length === 0 ? (
                    <Alert
                      severity="info"
                      sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      Your cart is empty. Add some products to continue.
                    </Alert>
                  ) : (
                    <Box>
                      {cart.items.map((item: any) => (
                        <Card
                          key={item.id}
                          sx={{
                            mb: 2,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={3} sm={2}>
                                <Box
                                  component="img"
                                  src={item.product.thumbnail}
                                  alt={item.product.name}
                                  sx={{
                                    width: '100%',
                                    height: 80,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                  }}
                                />
                              </Grid>
                              <Grid item xs={9} sm={6}>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}
                                >
                                  {item.product.name}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                                  Quantity: {item.quantity}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' } }}>
                                <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                                  ₹{item.subtotal.toLocaleString('en-IN')}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </MotionPaper>
              )}

              {/* Step 1: Shipping Address */}
              {activeStep === 1 && (
                <MotionPaper
                  key="shipping"
                  className="checkout-animate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  sx={{
                    p: 4,
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.15)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalShippingIcon sx={{ color: '#667eea', fontSize: 32, mr: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                      Shipping Address
                    </Typography>
                  </Box>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                      {addresses.map((address) => (
                        <Card
                          key={address.id}
                          sx={{
                            mb: 2,
                            background: selectedAddress === address.id
                              ? 'rgba(102, 126, 234, 0.15)'
                              : 'rgba(255, 255, 255, 0.03)',
                            border: selectedAddress === address.id
                              ? '2px solid #667eea'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.1)',
                              borderColor: '#667eea',
                            },
                          }}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <CardContent>
                            <Grid container alignItems="center">
                              <Grid item xs={1}>
                                <FormControlLabel
                                  value={address.id}
                                  control={<Radio sx={{ color: '#667eea' }} />}
                                  label=""
                                  sx={{ m: 0 }}
                                />
                              </Grid>
                              <Grid item xs={10}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ color: 'white', fontWeight: 700, mr: 1 }}
                                  >
                                    {address.fullName}
                                  </Typography>
                                  {address.isDefault && (
                                    <Chip
                                      label="Default"
                                      size="small"
                                      sx={{
                                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                                        color: '#667eea',
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                  {address.street}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
                                  {address.city}, {address.state} - {address.zipCode}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', mt: 0.5 }}>
                                  Phone: {address.phone}
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setIsAddingAddress(true)}
                    sx={{
                      mt: 2,
                      color: '#667eea',
                      borderColor: '#667eea',
                      '&:hover': {
                        borderColor: '#764ba2',
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    Add New Address
                  </Button>
                </MotionPaper>
              )}

              {/* Step 2: Payment */}
              {activeStep === 2 && (
                <MotionPaper
                  key="payment"
                  className="checkout-animate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  sx={{
                    p: 4,
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.15)',
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PaymentIcon sx={{ color: '#667eea', fontSize: 32, mr: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                      Payment Method
                    </Typography>
                  </Box>

                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      {['card', 'upi', 'netbanking', 'cod'].map((method) => (
                        <Card
                          key={method}
                          sx={{
                            mb: 2,
                            background: paymentMethod === method
                              ? 'rgba(102, 126, 234, 0.15)'
                              : 'rgba(255, 255, 255, 0.03)',
                            border: paymentMethod === method
                              ? '2px solid #667eea'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: 'rgba(102, 126, 234, 0.1)',
                              borderColor: '#667eea',
                            },
                          }}
                          onClick={() => setPaymentMethod(method)}
                        >
                          <CardContent>
                            <FormControlLabel
                              value={method}
                              control={<Radio sx={{ color: '#667eea' }} />}
                              label={
                                <Typography sx={{ color: 'white', fontWeight: 600 }}>
                                  {method === 'card' && 'Credit/Debit Card'}
                                  {method === 'upi' && 'UPI Payment'}
                                  {method === 'netbanking' && 'Net Banking'}
                                  {method === 'cod' && 'Cash on Delivery'}
                                </Typography>
                              }
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <Alert
                    icon={<LockIcon />}
                    sx={{
                      mt: 3,
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    Your payment information is secure and encrypted
                  </Alert>
                </MotionPaper>
              )}

              {/* Step 3: Confirmation */}
              {activeStep === 3 && (
                <MotionPaper
                  key="confirmation"
                  className="checkout-animate"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  sx={{
                    p: 6,
                    background: 'rgba(26, 26, 46, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.15)',
                    borderRadius: 3,
                    textAlign: 'center',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                    Order Placed Successfully!
                  </Typography>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
                    Thank you for your purchase. We'll send you a confirmation email shortly.
                  </Typography>
                  <CircularProgress sx={{ color: '#667eea', mb: 2 }} />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
                    Redirecting to your orders...
                  </Typography>
                </MotionPaper>
              )}
            </AnimatePresence>
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid item xs={12} md={4}>
            <MotionPaper
              className="checkout-animate"
              sx={{
                p: 3,
                background: 'rgba(26, 26, 46, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                borderRadius: 3,
                position: { md: 'sticky' },
                top: 20,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Subtotal ({cart?.itemCount || 0} items)
                  </Typography>
                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                    ₹{subtotal.toLocaleString('en-IN')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Shipping</Typography>
                  <Typography sx={{ color: shipping === 0 ? '#4caf50' : 'white', fontWeight: 600 }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Tax (18%)</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 600 }}>
                    ₹{tax.toFixed(2)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                    ₹{total.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>

              {subtotal > 500 && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                  }}
                >
                  You've earned FREE shipping!
                </Alert>
              )}

              {activeStep < 3 && (
                <Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && (!cart || cart.items.length === 0)) ||
                      (activeStep === 1 && !selectedAddress) ||
                      creatingOrder
                    }
                    sx={{
                      py: 1.5,
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                      },
                      '&:disabled': {
                        background: 'rgba(102, 126, 234, 0.3)',
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  >
                    {creatingOrder ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : activeStep === 2 ? (
                      'Place Order'
                    ) : (
                      'Continue'
                    )}
                  </Button>

                  {activeStep > 0 && (
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleBack}
                      sx={{
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          borderColor: '#667eea',
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    >
                      Back
                    </Button>
                  )}
                </Box>
              )}
            </MotionPaper>
          </Grid>
        </Grid>

        {/* Add Address Dialog */}
        <Dialog
          open={isAddingAddress}
          onClose={() => setIsAddingAddress(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(26, 26, 46, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.15)',
            },
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 700 }}>Add New Address</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  multiline
                  rows={2}
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: '#667eea' },
                      '&.Mui-focused fieldset': { borderColor: '#667eea' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => setIsAddingAddress(false)}
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAddress}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                },
              }}
            >
              Add Address
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

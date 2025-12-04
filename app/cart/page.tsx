'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAppSelector } from '@/store/hooks';
import gsap from 'gsap';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

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
          slug
          thumbnail
          price
          salePrice
          stock
          brand
        }
      }
    }
  }
`;

const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ID!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) {
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
          slug
          thumbnail
          price
          salePrice
          stock
          brand
        }
      }
    }
  }
`;

const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!) {
    removeFromCart(productId: $productId) {
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
          slug
          thumbnail
          price
          salePrice
          stock
          brand
        }
      }
    }
  }
`;

const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { data, loading, error, refetch } = useQuery(GET_MY_CART, {
    skip: !isAuthenticated,
  });

  const [updateCartItem, { loading: updating }] = useMutation(UPDATE_CART_ITEM);
  const [removeFromCart, { loading: removing }] = useMutation(REMOVE_FROM_CART);
  const [clearCart, { loading: clearing }] = useMutation(CLEAR_CART);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && data?.myCart?.items && containerRef.current) {
      // Animate header
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      // Animate cart items
      const items = containerRef.current.querySelectorAll('.cart-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [mounted, data]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      await updateCartItem({
        variables: { productId, quantity: newQuantity },
      });
    } catch (err) {
      console.error('Error updating cart item:', err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart({
        variables: { productId },
      });
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        refetch();
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (!mounted) return null;

  if (!isAuthenticated) return null;

  if (loading) {
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

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          pt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mt: 4 }}>
            Error loading cart: {error.message}
          </Alert>
        </Container>
      </Box>
    );
  }

  const cart = data?.myCart;
  const isEmpty = !cart || cart.items.length === 0;

  const subtotal = cart?.total || 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="lg" ref={containerRef}>
        {/* Header */}
        <Box ref={headerRef} sx={{ mb: 6 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/products')}
            sx={{
              color: 'white',
              mb: 3,
              '&:hover': { color: '#667eea' },
            }}
          >
            Continue Shopping
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shopping Cart
            </Typography>

            {!isEmpty && (
              <Chip
                label={`${cart.itemCount} ${cart.itemCount === 1 ? 'Item' : 'Items'}`}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.2)',
                  color: '#667eea',
                  fontWeight: 600,
                  fontSize: '1rem',
                  px: 2,
                  py: 3,
                }}
              />
            )}
          </Box>

          {!isEmpty && (
            <Button
              onClick={handleClearCart}
              disabled={clearing}
              sx={{
                color: '#ff6b6b',
                '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
              }}
            >
              Clear Cart
            </Button>
          )}
        </Box>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 4,
              }}
            >
              <Box
                sx={{
                  fontSize: '120px',
                  mb: 3,
                  opacity: 0.3,
                }}
              >
                🛒
              </Box>
              <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                Your cart is empty
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 4 }}>
                Add some products to get started
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/products')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Browse Products
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} lg={8}>
              <AnimatePresence mode="popLayout">
                {cart.items.map((item: any) => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      sx={{
                        mb: 3,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', p: 2 }}>
                        {/* Product Image */}
                        <CardMedia
                          component="img"
                          sx={{
                            width: 140,
                            height: 140,
                            borderRadius: 2,
                            objectFit: 'cover',
                            cursor: 'pointer',
                          }}
                          image={item.product.thumbnail || '/placeholder.jpg'}
                          alt={item.product.name}
                          onClick={() => router.push(`/products/${item.product.slug}`)}
                        />

                        {/* Product Details */}
                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                fontWeight: 600,
                                mb: 1,
                                cursor: 'pointer',
                                '&:hover': { color: '#667eea' },
                              }}
                              onClick={() => router.push(`/products/${item.product.slug}`)}
                            >
                              {item.product.name}
                            </Typography>

                            {item.product.brand && (
                              <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 2 }}
                              >
                                Brand: {item.product.brand}
                              </Typography>
                            )}

                            {/* Price */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              {item.product.salePrice ? (
                                <>
                                  <Typography
                                    variant="h6"
                                    sx={{ color: '#667eea', fontWeight: 700 }}
                                  >
                                    ₹{item.product.salePrice.toFixed(2)}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      color: 'rgba(255, 255, 255, 0.4)',
                                      textDecoration: 'line-through',
                                    }}
                                  >
                                    ₹{item.product.price.toFixed(2)}
                                  </Typography>
                                  <Chip
                                    icon={<LocalOfferIcon />}
                                    label={`${Math.round(((item.product.price - item.product.salePrice) / item.product.price) * 100)}% OFF`}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(76, 175, 80, 0.2)',
                                      color: '#4caf50',
                                      fontWeight: 600,
                                    }}
                                  />
                                </>
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{ color: '#667eea', fontWeight: 700 }}
                                >
                                  ₹{item.product.price.toFixed(2)}
                                </Typography>
                              )}
                            </Box>

                            {/* Stock Status */}
                            {item.product.stock < 10 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: item.product.stock === 0 ? '#ff6b6b' : '#ffa726',
                                  fontWeight: 600,
                                }}
                              >
                                {item.product.stock === 0
                                  ? 'Out of stock'
                                  : `Only ${item.product.stock} left in stock`}
                              </Typography>
                            )}
                          </Box>

                          {/* Quantity Controls */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mt: 2,
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleUpdateQuantity(item.product.id, item.quantity - 1)
                                  }
                                  disabled={updating || item.quantity <= 1}
                                  sx={{
                                    color: 'white',
                                    borderRadius: 0,
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                                  }}
                                >
                                  <RemoveIcon />
                                </IconButton>

                                <Typography
                                  sx={{
                                    color: 'white',
                                    px: 3,
                                    fontWeight: 600,
                                    minWidth: '40px',
                                    textAlign: 'center',
                                  }}
                                >
                                  {item.quantity}
                                </Typography>

                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleUpdateQuantity(item.product.id, item.quantity + 1)
                                  }
                                  disabled={
                                    updating || item.quantity >= item.product.stock
                                  }
                                  sx={{
                                    color: 'white',
                                    borderRadius: 0,
                                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Box>

                              <IconButton
                                onClick={() => handleRemoveItem(item.product.id)}
                                disabled={removing}
                                sx={{
                                  color: '#ff6b6b',
                                  '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
                                }}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </Box>

                            {/* Subtotal */}
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                fontWeight: 700,
                              }}
                            >
                              ₹{item.subtotal.toFixed(2)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    position: 'sticky',
                    top: 100,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 700, mb: 3 }}
                  >
                    Order Summary
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Subtotal ({cart.itemCount} items)
                      </Typography>
                      <Typography sx={{ color: 'white', fontWeight: 600 }}>
                        ₹{subtotal.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Shipping
                      </Typography>
                      <Typography
                        sx={{
                          color: shipping === 0 ? '#4caf50' : 'white',
                          fontWeight: 600,
                        }}
                      >
                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                      </Typography>
                    </Box>

                    {shipping === 0 && subtotal > 0 && (
                      <Alert
                        severity="success"
                        sx={{
                          mb: 2,
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          '& .MuiAlert-icon': { color: '#4caf50' },
                          '& .MuiAlert-message': { color: '#4caf50' },
                        }}
                      >
                        You've earned free shipping!
                      </Alert>
                    )}

                    {subtotal > 0 && subtotal <= 500 && (
                      <Alert
                        severity="info"
                        sx={{
                          mb: 2,
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                          '& .MuiAlert-icon': { color: '#667eea' },
                          '& .MuiAlert-message': { color: '#667eea' },
                        }}
                      >
                        Add ₹{(500 - subtotal).toFixed(2)} more for free shipping
                      </Alert>
                    )}

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Tax (18%)
                      </Typography>
                      <Typography sx={{ color: 'white', fontWeight: 600 }}>
                        ₹{tax.toFixed(2)}
                      </Typography>
                    </Box>

                    <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: 'white', fontWeight: 700 }}
                      >
                        Total
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: '#667eea',
                          fontWeight: 800,
                        }}
                      >
                        ₹{total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<ShoppingCartCheckoutIcon />}
                    onClick={handleCheckout}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                      mt: 2,
                    }}
                  >
                    Secure checkout powered by NovaCart
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

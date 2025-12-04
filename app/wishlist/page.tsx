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
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  Fade,
  Tooltip,
  Badge,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAppSelector } from '@/store/hooks';
import gsap from 'gsap';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ShareIcon from '@mui/icons-material/Share';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GET_MY_WISHLIST = gql`
  query GetMyWishlist {
    myWishlist {
      id
      items {
        id
        addedAt
        product {
          id
          name
          slug
          thumbnail
          price
          salePrice
          stock
          brand
          rating
          reviewCount
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      id
      items {
        id
        addedAt
        product {
          id
          name
          slug
          thumbnail
          price
          salePrice
          stock
          brand
          rating
          reviewCount
        }
      }
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
      itemCount
    }
  }
`;

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, loading, error, refetch } = useQuery(GET_MY_WISHLIST, {
    skip: !isAuthenticated,
  });

  const [removeFromWishlist, { loading: removing }] = useMutation(REMOVE_FROM_WISHLIST);
  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && data?.myWishlist && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      if (containerRef.current) {
        const cards = containerRef.current.querySelectorAll('.wishlist-card');
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'back.out(1.2)',
          }
        );
      }
    }
  }, [mounted, data]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist({
        variables: { productId },
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart({
        variables: { productId, quantity: 1 },
      });
      setAddedToCart(productId);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleMoveAllToCart = async () => {
    if (!data?.myWishlist?.items) return;

    for (const item of data.myWishlist.items) {
      if (item.product.stock > 0) {
        await handleAddToCart(item.product.id);
      }
    }
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    setSortAnchorEl(null);
  };

  const handleFilter = (category: string) => {
    setFilterCategory(category);
    setFilterAnchorEl(null);
  };

  const getSortedAndFilteredItems = () => {
    if (!data?.myWishlist?.items) return [];

    let items = [...data.myWishlist.items];

    // Filter
    if (filterCategory !== 'all') {
      items = items.filter((item: any) =>
        item.product.category?.name.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        items.sort((a: any, b: any) =>
          new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
        break;
      case 'price-low':
        items.sort((a: any, b: any) =>
          (a.product.salePrice || a.product.price) - (b.product.salePrice || b.product.price)
        );
        break;
      case 'price-high':
        items.sort((a: any, b: any) =>
          (b.product.salePrice || b.product.price) - (a.product.salePrice || a.product.price)
        );
        break;
      case 'rating':
        items.sort((a: any, b: any) => b.product.rating - a.product.rating);
        break;
    }

    return items;
  };

  const getCategories = () => {
    if (!data?.myWishlist?.items) return [];
    const categories = new Set(
      data.myWishlist.items
        .map((item: any) => item.product.category?.name)
        .filter(Boolean)
    );
    return Array.from(categories);
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
            Error loading wishlist: {error.message}
          </Alert>
        </Container>
      </Box>
    );
  }

  const items = getSortedAndFilteredItems();
  const isEmpty = items.length === 0 && filterCategory === 'all';
  const categories = getCategories();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="xl">
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

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
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
                  My Wishlist
                </Typography>
                <Badge
                  badgeContent={data?.myWishlist?.items?.length || 0}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#f44336',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      height: 32,
                      minWidth: 32,
                      borderRadius: 2,
                    },
                  }}
                >
                  <FavoriteIcon sx={{ color: '#f44336', fontSize: 40 }} />
                </Badge>
              </Box>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.1rem' }}>
                {isEmpty ? 'Start adding products you love' : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
              </Typography>
            </Box>

            {!isEmpty && (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': {
                      borderColor: '#667eea',
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  Share Wishlist
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleMoveAllToCart}
                  disabled={addingToCart}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    px: 3,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Add All to Cart
                </Button>
              </Box>
            )}
          </Box>

          {/* Filters and Sort */}
          {!isEmpty && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                startIcon={<FilterListIcon />}
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: '#667eea',
                  },
                }}
              >
                Filter: {filterCategory === 'all' ? 'All' : filterCategory}
              </Button>

              <Button
                startIcon={<SortIcon />}
                onClick={(e) => setSortAnchorEl(e.currentTarget)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: '#667eea',
                  },
                }}
              >
                Sort: {sortBy === 'recent' ? 'Recently Added' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Top Rated'}
              </Button>

              {/* Sort Menu */}
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => setSortAnchorEl(null)}
                TransitionComponent={Fade}
                sx={{
                  '& .MuiPaper-root': {
                    background: 'rgba(26, 26, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                }}
              >
                <MenuItem onClick={() => handleSort('recent')} selected={sortBy === 'recent'}>
                  Recently Added
                </MenuItem>
                <MenuItem onClick={() => handleSort('price-low')} selected={sortBy === 'price-low'}>
                  Price: Low to High
                </MenuItem>
                <MenuItem onClick={() => handleSort('price-high')} selected={sortBy === 'price-high'}>
                  Price: High to Low
                </MenuItem>
                <MenuItem onClick={() => handleSort('rating')} selected={sortBy === 'rating'}>
                  Top Rated
                </MenuItem>
              </Menu>

              {/* Filter Menu */}
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={() => setFilterAnchorEl(null)}
                TransitionComponent={Fade}
                sx={{
                  '& .MuiPaper-root': {
                    background: 'rgba(26, 26, 46, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                }}
              >
                <MenuItem onClick={() => handleFilter('all')} selected={filterCategory === 'all'}>
                  All Categories
                </MenuItem>
                {categories.map((category: any) => (
                  <MenuItem
                    key={category}
                    onClick={() => handleFilter(category)}
                    selected={filterCategory === category}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Box>

        {/* Empty State */}
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
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <FavoriteIcon sx={{ fontSize: 120, color: 'rgba(244, 67, 54, 0.3)', mb: 3 }} />
              </motion.div>
              <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                Your wishlist is empty
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 4, fontSize: '1.1rem' }}>
                Save your favorite items and never lose track of what you love
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
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Explore Products
              </Button>
            </Paper>
          </motion.div>
        ) : items.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
              No items match your filters
            </Typography>
            <Button
              onClick={() => setFilterCategory('all')}
              sx={{ color: '#667eea' }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Box ref={containerRef}>
            <Grid container spacing={3}>
              <AnimatePresence mode="popLayout">
                {items.map((item: any, index: number) => {
                  const product = item.product;
                  const discount = product.salePrice
                    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                    : 0;

                  return (
                    <Grid item size={{xs:12, sm:6, md:4, lg:3}} key={item.id}>
                      <motion.div
                        className="wishlist-card"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card
                          sx={{
                            height: '100%',
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                            overflow: 'hidden',
                            position: 'relative',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-12px)',
                              boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                              borderColor: 'rgba(102, 126, 234, 0.5)',
                              '& .product-image': {
                                transform: 'scale(1.1)',
                              },
                              '& .action-buttons': {
                                opacity: 1,
                                transform: 'translateY(0)',
                              },
                            },
                          }}
                        >
                          {/* Product Image */}
                          <Box
                            sx={{
                              position: 'relative',
                              paddingTop: '100%',
                              overflow: 'hidden',
                              bgcolor: 'rgba(0, 0, 0, 0.2)',
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={product.thumbnail || '/placeholder.jpg'}
                              alt={product.name}
                              className="product-image"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                            />

                            {/* Discount Badge */}
                            {discount > 0 && (
                              <Chip
                                icon={<LocalOfferIcon />}
                                label={`${discount}% OFF`}
                                size="small"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  left: 12,
                                  bgcolor: '#f44336',
                                  color: 'white',
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.4)',
                                }}
                              />
                            )}

                            {/* Stock Status */}
                            {product.stock === 0 && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  inset: 0,
                                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Chip
                                  label="Out of Stock"
                                  sx={{
                                    bgcolor: '#f44336',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    px: 2,
                                    py: 3,
                                  }}
                                />
                              </Box>
                            )}

                            {/* Remove Button */}
                            <Tooltip title="Remove from wishlist" arrow>
                              <IconButton
                                onClick={() => handleRemove(product.id)}
                                disabled={removing}
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  bgcolor: 'rgba(244, 67, 54, 0.9)',
                                  color: 'white',
                                  backdropFilter: 'blur(10px)',
                                  '&:hover': {
                                    bgcolor: '#f44336',
                                    transform: 'scale(1.1)',
                                  },
                                  transition: 'all 0.3s',
                                }}
                              >
                                <FavoriteIcon />
                              </IconButton>
                            </Tooltip>

                            {/* Action Buttons Overlay */}
                            <Box
                              className="action-buttons"
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                display: 'flex',
                                gap: 1,
                                p: 2,
                                opacity: 0,
                                transform: 'translateY(20px)',
                                transition: 'all 0.3s',
                              }}
                            >
                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ShoppingCartIcon />}
                                onClick={() => handleAddToCart(product.id)}
                                disabled={addingToCart || product.stock === 0 || addedToCart === product.id}
                                sx={{
                                  bgcolor: addedToCart === product.id ? '#4caf50' : 'rgba(102, 126, 234, 0.95)',
                                  backdropFilter: 'blur(10px)',
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  '&:hover': {
                                    bgcolor: addedToCart === product.id ? '#4caf50' : '#667eea',
                                  },
                                }}
                              >
                                {addedToCart === product.id ? 'Added!' : 'Add to Cart'}
                              </Button>
                              <IconButton
                                onClick={() => router.push(`/products/${product.slug || product.id}`)}
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                                  backdropFilter: 'blur(10px)',
                                  color: '#667eea',
                                  '&:hover': {
                                    bgcolor: 'white',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Product Details */}
                          <CardContent sx={{ p: 2.5 }}>
                            {/* Category */}
                            {product.category && (
                              <Chip
                                label={product.category.name}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(102, 126, 234, 0.2)',
                                  color: '#667eea',
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  height: 24,
                                  mb: 1,
                                }}
                              />
                            )}

                            {/* Product Name */}
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'white',
                                fontWeight: 600,
                                mb: 1,
                                height: 56,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                cursor: 'pointer',
                                '&:hover': { color: '#667eea' },
                              }}
                              onClick={() => router.push(`/products/${product.slug || product.id}`)}
                            >
                              {product.name}
                            </Typography>

                            {/* Brand */}
                            {product.brand && (
                              <Typography
                                variant="body2"
                                sx={{ color: 'rgba(255, 255, 255, 0.5)', mb: 1.5 }}
                              >
                                {product.brand}
                              </Typography>
                            )}

                            {/* Rating */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarIcon sx={{ color: '#ffd700', fontSize: 18 }} />
                                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                                  {product.rating.toFixed(1)}
                                </Typography>
                              </Box>
                              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                                ({product.reviewCount})
                              </Typography>
                            </Box>

                            {/* Price */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                              <Typography
                                variant="h5"
                                sx={{ color: '#667eea', fontWeight: 800 }}
                              >
                                ₹{(product.salePrice || product.price).toFixed(2)}
                              </Typography>
                              {product.salePrice && (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    textDecoration: 'line-through',
                                  }}
                                >
                                  ₹{product.price.toFixed(2)}
                                </Typography>
                              )}
                            </Box>

                            {/* Stock Info */}
                            {product.stock > 0 && product.stock < 10 && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#ffa726',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                ⚠️ Only {product.stock} left in stock
                              </Typography>
                            )}

                            {/* Added Date */}
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'rgba(255, 255, 255, 0.4)',
                                display: 'block',
                                mt: 1,
                              }}
                            >
                              Added {new Date(item.addedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Typography>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  TextField,
  Avatar,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Skeleton,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  Share as ShareIcon,
  NavigateNext as NavigateNextIcon,
  ZoomIn as ZoomInIcon,
  LocalShipping as ShippingIcon,
  Cached as ReturnIcon,
  Security as SecurityIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const GET_PRODUCT = gql`
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      shortDescription
      price
      salePrice
      stock
      sku
      brand
      images
      thumbnail
      rating
      reviewCount
      isActive
      isFeatured
      weight
      dimensions
      color
      material
      warranty
      hasVariants
      sizes
      colors
      tags
      category {
        id
        name
        slug
      }
      variants {
        id
        sku
        name
        size
        color
        capacity
        price
        salePrice
        stock
        image
        isActive
      }
      reviews {
        id
        rating
        title
        comment
        images
        isVerified
        createdAt
        user {
          firstName
          lastName
        }
      }
    }
  }
`;

const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($categoryId: String!) {
    products(filter: { categoryId: $categoryId }, pageSize: 8) {
      products {
        id
        name
        slug
        price
        salePrice
        thumbnail
        rating
        reviewCount
        stock
      }
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $variantId: ID) {
    addToCart(productId: $productId, quantity: $quantity, variantId: $variantId) {
      id
      items {
        id
        quantity
      }
    }
  }
`;

const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      id
    }
  }
`;

const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      id
    }
  }
`;

const ADD_REVIEW = gql`
  mutation AddReview($productId: ID!, $rating: Int!, $title: String, $comment: String) {
    addReview(productId: $productId, rating: $rating, title: $title, comment: $comment) {
      id
      rating
      title
      comment
      createdAt
      user {
        firstName
        lastName
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
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);
  const imageGalleryRef = useRef<HTMLDivElement>(null);

  const { loading, error, data, refetch } = useQuery(GET_PRODUCT, {
    variables: { slug: params.slug as string },
  });

  const { data: relatedData } = useQuery(GET_RELATED_PRODUCTS, {
    variables: { categoryId: data?.product?.category?.id },
    skip: !data?.product?.category?.id,
  });

  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      // Show success message
    },
  });

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);
  const [addReview, { loading: submittingReview }] = useMutation(ADD_REVIEW, {
    onCompleted: () => {
      setReviewRating(5);
      setReviewTitle('');
      setReviewComment('');
      refetch();
    },
  });

  const product = data?.product;

  useEffect(() => {
    if (!loading && product) {
      // GSAP animations
      gsap.fromTo(
        '.product-image',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.product-info',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.product-tab',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.product-tabs',
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.related-product',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.related-products',
            start: 'top 80%',
          },
        }
      );
    }
  }, [loading, product]);

  // Update selected variant when selections change
  useEffect(() => {
    if (product?.hasVariants && product?.variants) {
      const variant = product.variants.find((v: any) => {
        const sizeMatch = !selectedSize || v.size === selectedSize;
        const colorMatch = !selectedColor || v.color === selectedColor;
        const capacityMatch = !selectedCapacity || v.capacity === selectedCapacity;
        return sizeMatch && colorMatch && capacityMatch && v.isActive;
      });
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, selectedCapacity, product]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (product.hasVariants && !selectedVariant) {
      alert('Please select all product options');
      return;
    }

    const currentStock = selectedVariant?.stock || product.stock;
    if (currentStock === 0) {
      alert('Product is out of stock');
      return;
    }

    if (quantity > currentStock) {
      alert(`Only ${currentStock} items available`);
      return;
    }

    try {
      await addToCart({
        variables: {
          productId: product.id,
          quantity,
          variantId: selectedVariant?.id || null,
        },
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist({ variables: { productId: product.id } });
        setIsInWishlist(false);
      } else {
        await addToWishlist({ variables: { productId: product.id } });
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!reviewComment.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      await addReview({
        variables: {
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        },
      });
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.salePrice || selectedVariant.price || product.salePrice || product.price;
    }
    return product.salePrice || product.price;
  };

  const getOriginalPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price || product.price;
    }
    return product.price;
  };

  const getCurrentStock = () => {
    return selectedVariant?.stock ?? product.stock;
  };

  const getDiscount = () => {
    const currentPrice = getCurrentPrice();
    const originalPrice = getOriginalPrice();
    if (currentPrice < originalPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  const getRatingBreakdown = () => {
    if (!product?.reviews) return [];
    const breakdown = [0, 0, 0, 0, 0];
    product.reviews.forEach((review: any) => {
      breakdown[review.rating - 1]++;
    });
    return breakdown.reverse();
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rectangular" height={500} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Product Not Found</Typography>
        <Button variant="contained" onClick={() => router.push('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const discount = getDiscount();
  const currentStock = getCurrentStock();

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Link href="/" underline="hover" color="inherit">Home</Link>
          <Link href="/products" underline="hover" color="inherit">Products</Link>
          <Link href={`/products?category=${product.category.slug}`} underline="hover" color="inherit">
            {product.category.name}
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Main Product Section */}
        <Grid container spacing={4} ref={productRef}>
          {/* Image Gallery */}
          <Grid size={{ xs: 12, md: 6 }} className="product-image">
            <Paper
              elevation={0}
              sx={{
                p: 2,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: 3,
                position: 'sticky',
                top: 20,
              }}
            >
              {/* Main Image */}
              <Box
                ref={imageGalleryRef}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 500,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  cursor: 'zoom-in',
                  '&:hover .zoom-icon': {
                    opacity: 1,
                  },
                }}
                onClick={() => setShowZoom(true)}
              >
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <Box
                  className="zoom-icon"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '50%',
                    p: 1,
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <ZoomInIcon sx={{ color: 'white' }} />
                </Box>
                {discount > 0 && (
                  <Chip
                    label={`${discount}% OFF`}
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: '#f44336',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </Box>

              {/* Thumbnail Gallery */}
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                {product.images.map((image: string, index: number) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid #667eea' : '1px solid #e0e0e0',
                      flexShrink: 0,
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#667eea',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid size={{ xs: 12, md: 6 }} className="product-info">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: 3,
              }}
            >
              {/* Product Name & Brand */}
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>
              {product.brand && (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Brand: <strong>{product.brand}</strong>
                </Typography>
              )}

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Rating value={product.rating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h3" fontWeight="bold" color="#667eea">
                    ₹{getCurrentPrice().toFixed(2)}
                  </Typography>
                  {discount > 0 && (
                    <>
                      <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{getOriginalPrice().toFixed(2)}
                      </Typography>
                      <Chip label={`${discount}% OFF`} color="error" size="small" />
                    </>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Inclusive of all taxes
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Short Description */}
              {product.shortDescription && (
                <Typography variant="body1" color="text.secondary" paragraph>
                  {product.shortDescription}
                </Typography>
              )}

              {/* Variant Selectors */}
              {product.hasVariants && (
                <Box sx={{ mb: 3 }}>
                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Select Size:
                      </Typography>
                      <ToggleButtonGroup
                        value={selectedSize}
                        exclusive
                        onChange={(e, value) => value && setSelectedSize(value)}
                        sx={{ flexWrap: 'wrap', gap: 1 }}
                      >
                        {product.sizes.map((size: string) => (
                          <ToggleButton
                            key={size}
                            value={size}
                            sx={{
                              px: 3,
                              py: 1,
                              border: '1px solid #e0e0e0',
                              '&.Mui-selected': {
                                bgcolor: '#667eea',
                                color: 'white',
                                '&:hover': { bgcolor: '#5568d3' },
                              },
                            }}
                          >
                            {size}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                  )}

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Select Color:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {product.colors.map((color: string) => (
                          <Box
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: color.toLowerCase(),
                              border: selectedColor === color ? '3px solid #667eea' : '2px solid #e0e0e0',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              '&:hover': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {selectedColor === color && (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: 'white',
                                }}
                              />
                            )}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Capacity Selector */}
                  {product.variants.some((v: any) => v.capacity) && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Select Capacity:
                      </Typography>
                      <ToggleButtonGroup
                        value={selectedCapacity}
                        exclusive
                        onChange={(e, value) => value && setSelectedCapacity(value)}
                        sx={{ flexWrap: 'wrap', gap: 1 }}
                      >
                        {Array.from(new Set(product.variants.map((v: any) => v.capacity).filter(Boolean))).map((capacity: any) => (
                          <ToggleButton
                            key={capacity}
                            value={capacity}
                            sx={{
                              px: 3,
                              py: 1,
                              border: '1px solid #e0e0e0',
                              '&.Mui-selected': {
                                bgcolor: '#667eea',
                                color: 'white',
                                '&:hover': { bgcolor: '#5568d3' },
                              },
                            }}
                          >
                            {capacity}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>
                  )}
                </Box>
              )}

              {/* Stock Status */}
              <Box sx={{ mb: 3 }}>
                {currentStock === 0 ? (
                  <Alert severity="error">Out of Stock</Alert>
                ) : currentStock < 10 ? (
                  <Alert severity="warning">Only {currentStock} left in stock!</Alert>
                ) : (
                  <Alert severity="success">In Stock ({currentStock} available)</Alert>
                )}
              </Box>

              {/* Quantity Selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                  Quantity:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    sx={{
                      border: '1px solid #e0e0e0',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    sx={{
                      border: '1px solid #e0e0e0',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  disabled={currentStock === 0 || addingToCart || (product.hasVariants && !selectedVariant)}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #66399c 100%)',
                    },
                  }}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <IconButton
                  onClick={handleWishlistToggle}
                  sx={{
                    border: '2px solid #667eea',
                    color: isInWishlist ? '#f44336' : '#667eea',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  {isInWishlist ? <FavoriteFilledIcon /> : <FavoriteIcon />}
                </IconButton>
                <IconButton
                  sx={{
                    border: '2px solid #667eea',
                    color: '#667eea',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                    },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>

              {/* Key Features */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                  p: 2,
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShippingIcon color="primary" />
                  <Typography variant="body2">Free Delivery</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ReturnIcon color="primary" />
                  <Typography variant="body2">7 Days Return</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" />
                  <Typography variant="body2">Secure Payment</Typography>
                </Box>
                {product.warranty && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="body2">{product.warranty}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Paper
          elevation={0}
          className="product-tabs"
          sx={{
            mt: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            borderRadius: 3,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, value) => setTabValue(value)}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="Description" className="product-tab" />
            <Tab label="Specifications" className="product-tab" />
            <Tab label={`Reviews (${product.reviewCount})`} className="product-tab" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </Typography>
              {product.tags && product.tags.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.tags.map((tag: string) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              <List>
                <ListItem>
                  <ListItemText primary="SKU" secondary={product.sku} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Brand" secondary={product.brand || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Category" secondary={product.category.name} />
                </ListItem>
                {product.weight && (
                  <ListItem>
                    <ListItemText primary="Weight" secondary={`${product.weight} kg`} />
                  </ListItem>
                )}
                {product.dimensions && (
                  <ListItem>
                    <ListItemText primary="Dimensions" secondary={product.dimensions} />
                  </ListItem>
                )}
                {product.material && (
                  <ListItem>
                    <ListItemText primary="Material" secondary={product.material} />
                  </ListItem>
                )}
                {product.color && (
                  <ListItem>
                    <ListItemText primary="Color" secondary={product.color} />
                  </ListItem>
                )}
                {product.warranty && (
                  <ListItem>
                    <ListItemText primary="Warranty" secondary={product.warranty} />
                  </ListItem>
                )}
              </List>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3 }}>
              {/* Rating Summary */}
              <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight="bold">
                      {product.rating.toFixed(1)}
                    </Typography>
                    <Rating value={product.rating} precision={0.1} readOnly size="large" />
                    <Typography variant="body2" color="text.secondary">
                      Based on {product.reviewCount} reviews
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 8 }}>
                    {getRatingBreakdown().map((count, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 60 }}>
                          {5 - index} <StarIcon sx={{ fontSize: 16, color: '#ffd700' }} />
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={product.reviewCount > 0 ? (count / product.reviewCount) * 100 : 0}
                          sx={{ flex: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 40 }}>
                          {count}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </Box>

              {/* Add Review Form */}
              {user && (
                <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Write a Review
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Rating:
                    </Typography>
                    <Rating
                      value={reviewRating}
                      onChange={(e, value) => value && setReviewRating(value)}
                      size="large"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Review Title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Your Review"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </Box>
              )}

              {/* Reviews List */}
              {product.reviews && product.reviews.length > 0 ? (
                <Box>
                  {product.reviews.map((review: any) => (
                    <Card key={review.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: '#667eea' }}>
                            {review.user.firstName[0]}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {review.user.firstName} {review.user.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          {review.isVerified && (
                            <Chip label="Verified Purchase" size="small" color="success" />
                          )}
                        </Box>
                        <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
                        {review.title && (
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            {review.title}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {review.comment}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                  No reviews yet. Be the first to review this product!
                </Typography>
              )}
            </Box>
          </TabPanel>
        </Paper>

        {/* Related Products */}
        {relatedData?.products?.products && relatedData.products.products.length > 0 && (
          <Box className="related-products" sx={{ mt: 6 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Related Products
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {relatedData.products.products
                .filter((p: any) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct: any) => (
                  <Grid key={relatedProduct.id} size={{ xs: 12, sm: 6, md: 3 }} className="related-product">
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(102, 126, 234, 0.2)',
                        },
                      }}
                      onClick={() => router.push(`/products/${relatedProduct.slug}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={relatedProduct.thumbnail}
                        alt={relatedProduct.name}
                      />
                      <CardContent>
                        <Typography variant="h6" noWrap gutterBottom>
                          {relatedProduct.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={relatedProduct.rating} size="small" readOnly />
                          <Typography variant="caption" color="text.secondary">
                            ({relatedProduct.reviewCount})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ₹{relatedProduct.salePrice || relatedProduct.price}
                          </Typography>
                          {relatedProduct.salePrice && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ textDecoration: 'line-through' }}
                            >
                              ₹{relatedProduct.price}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
            }}
          >
            <motion.img
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.name}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

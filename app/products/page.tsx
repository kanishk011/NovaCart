'use client';

import { useEffect, useState, useRef, memo, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Drawer,
  IconButton,
  Chip,
  CircularProgress,
  Slider,
  Divider,
  TextField,
  InputAdornment,
  Paper,
  Badge,
  Fab,
  Zoom,
  Skeleton,
  alpha,
} from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAppSelector } from '@/store/hooks';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import SortIcon from '@mui/icons-material/Sort';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      image
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetProducts($page: Int, $pageSize: Int, $filter: ProductFilterInput, $sortBy: String) {
    products(page: $page, pageSize: $pageSize, filter: $filter, sortBy: $sortBy) {
      products {
        id
        name
        slug
        shortDescription
        price
        salePrice
        stock
        thumbnail
        brand
        rating
        reviewCount
        hasVariants
        sizes
        colors
        tags
        category {
          id
          name
          slug
        }
      }
      total
      page
      pageSize
      hasMore
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

// Memoized Product Card Component to prevent unnecessary re-renders
const ProductCard = memo(({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  isAdded,
  isAddingToCart,
}: {
  product: any;
  onAddToCart: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
  isAdded: boolean;
  isAddingToCart: boolean;
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const discount = useMemo(() =>
    product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0,
    [product.price, product.salePrice]
  );

  const handleCardClick = useCallback(() => {
    router.push(`/products/${product.slug}`);
  }, [router, product.slug]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.hasVariants) {
      router.push(`/products/${product.slug}`);
    } else {
      onAddToCart(product.id);
    }
  }, [product.hasVariants, product.id, product.slug, router, onAddToCart]);

  const handleWishlistToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  }, [product.id, onToggleWishlist]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        onClick={handleCardClick}
        sx={{
          height: '100%',
          background: 'linear-gradient(145deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.15)',
          borderRadius: 3,
          overflow: 'hidden',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            borderColor: 'rgba(102, 126, 234, 0.5)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          },
        }}
      >
        {/* Image Container */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '100%',
            overflow: 'hidden',
            bgcolor: 'rgba(0, 0, 0, 0.4)',
          }}
        >
          <CardMedia
            component="img"
            image={product.thumbnail || '/placeholder.jpg'}
            alt={product.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          />

          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                bgcolor: '#f44336',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: '20px',
                fontWeight: 800,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.5)',
                zIndex: 2,
              }}
            >
              <LocalOfferIcon sx={{ fontSize: 14 }} />
              {discount}% OFF
            </Box>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <Chip
              label="Out of Stock"
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: 'rgba(0, 0, 0, 0.85)',
                color: 'white',
                fontWeight: 700,
                zIndex: 2,
              }}
            />
          )}
          {product.stock > 0 && product.stock < 10 && (
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: 12 }} />}
              label={`Only ${product.stock} left`}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                bgcolor: 'rgba(255, 152, 0, 0.95)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.7rem',
                zIndex: 2,
              }}
            />
          )}

          {/* Quick Actions */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 12,
              transform: `translate(${isHovered ? '0' : '60px'}, -50%)`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              opacity: isHovered ? 1 : 0,
              transition: 'all 0.3s',
              zIndex: 3,
            }}
          >
            <IconButton
              onClick={handleWishlistToggle}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: isWishlisted ? '#f44336' : 'rgba(0, 0, 0, 0.7)',
                width: 42,
                height: 42,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              {isWishlisted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>

            <IconButton
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                color: 'rgba(0, 0, 0, 0.7)',
                width: 42,
                height: 42,
                '&:hover': {
                  bgcolor: 'white',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Add to Cart Button */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              opacity: isHovered ? 1 : 0,
              transform: `translateY(${isHovered ? '0' : '20px'})`,
              transition: 'all 0.3s',
              zIndex: 2,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              sx={{
                bgcolor: isAdded ? '#4caf50' : 'rgba(102, 126, 234, 0.95)',
                backdropFilter: 'blur(10px)',
                fontWeight: 700,
                textTransform: 'none',
                py: 1,
                '&:hover': {
                  bgcolor: isAdded ? '#45a049' : '#667eea',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {product.stock === 0
                ? 'Out of Stock'
                : isAdded
                ? 'Added!'
                : product.hasVariants
                ? 'Select Options'
                : 'Add to Cart'}
            </Button>
          </Box>
        </Box>

        {/* Product Details */}
        <CardContent sx={{ p: 2.5 }}>
          {/* Category */}
          <Chip
            label={product.category.name}
            size="small"
            sx={{
              bgcolor: 'rgba(102, 126, 234, 0.2)',
              color: '#667eea',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
              mb: 1,
              border: '1px solid rgba(102, 126, 234, 0.3)',
            }}
          />

          {/* Product Name */}
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 0.5,
              height: 48,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: '1rem',
              lineHeight: 1.4,
            }}
          >
            {product.name}
          </Typography>

          {/* Brand */}
          {product.brand && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                mb: 1,
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              {product.brand}
            </Typography>
          )}

          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(255, 215, 0, 0.15)',
                px: 1,
                py: 0.3,
                borderRadius: '12px',
              }}
            >
              <StarIcon sx={{ color: '#ffd700', fontSize: 16 }} />
              <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                {product.rating.toFixed(1)}
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}>
              ({product.reviewCount})
            </Typography>
          </Box>

          {/* Variants */}
          {product.hasVariants && (product.colors?.length > 0 || product.sizes?.length > 0) && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
              {product.colors?.length > 0 && (
                <Chip
                  label={`${product.colors.length} Colors`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              )}
              {product.sizes?.length > 0 && (
                <Chip
                  label={`${product.sizes.length} Sizes`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              )}
            </Box>
          )}

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="h5"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900,
                fontSize: '1.5rem',
              }}
            >
              ₹{(product.salePrice || product.price).toFixed(2)}
            </Typography>
            {product.salePrice && (
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.4)',
                  textDecoration: 'line-through',
                  fontSize: '0.95rem',
                }}
              >
                ₹{product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// Memoized Filter Sidebar
const FilterSidebar = memo(({
  categories,
  selectedCategory,
  onCategorySelect,
  priceRange,
  onPriceChange,
  brands,
  selectedBrands,
  onBrandToggle,
  onClearFilters,
  activeFiltersCount,
  total,
}: any) => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <TuneIcon sx={{ color: '#667eea', fontSize: 28 }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
          Filters
        </Typography>
        {activeFiltersCount > 0 && (
          <Chip
            label={activeFiltersCount}
            size="small"
            sx={{
              bgcolor: '#667eea',
              color: 'white',
              fontWeight: 700,
              height: 22,
              minWidth: 22,
            }}
          />
        )}
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 700,
            mb: 2,
            fontSize: '0.9rem',
            letterSpacing: '0.5px',
          }}
        >
          CATEGORIES
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Chip
            label={`All (${total})`}
            onClick={() => onCategorySelect(null)}
            sx={{
              justifyContent: 'flex-start',
              bgcolor: selectedCategory === null ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === null ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
              fontWeight: selectedCategory === null ? 700 : 500,
              border: selectedCategory === null ? '1px solid #667eea' : 'none',
              '&:hover': {
                bgcolor: selectedCategory === null ? 'rgba(102, 126, 234, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          />
          {categories?.map((category: any) => (
            <Chip
              key={category.id}
              label={category.name}
              onClick={() => onCategorySelect(category.id)}
              sx={{
                justifyContent: 'flex-start',
                bgcolor: selectedCategory === category.id ? 'rgba(102, 126, 234, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === category.id ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: selectedCategory === category.id ? 700 : 500,
                border: selectedCategory === category.id ? '1px solid #667eea' : 'none',
                '&:hover': {
                  bgcolor: selectedCategory === category.id ? 'rgba(102, 126, 234, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 700,
            mb: 2,
            fontSize: '0.9rem',
            letterSpacing: '0.5px',
          }}
        >
          PRICE RANGE
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={priceRange}
            onChange={(_, value) => onPriceChange(value)}
            valueLabelDisplay="auto"
            min={0}
            max={10000}
            step={100}
            sx={{
              color: '#667eea',
              '& .MuiSlider-thumb': {
                bgcolor: '#667eea',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.2)',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Chip
              label={`₹${priceRange[0]}`}
              size="small"
              sx={{
                bgcolor: 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                fontWeight: 700,
              }}
            />
            <Chip
              label={`₹${priceRange[1]}`}
              size="small"
              sx={{
                bgcolor: 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                fontWeight: 700,
              }}
            />
          </Box>
        </Box>
      </Box>

      {brands.length > 0 && (
        <>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

          {/* Brands */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 700,
                mb: 2,
                fontSize: '0.9rem',
                letterSpacing: '0.5px',
              }}
            >
              BRANDS
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {brands.map((brand: string) => (
                <Chip
                  key={brand}
                  label={brand}
                  onClick={() => onBrandToggle(brand)}
                  size="small"
                  sx={{
                    bgcolor: selectedBrands.includes(brand)
                      ? 'rgba(102, 126, 234, 0.3)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: selectedBrands.includes(brand) ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                    border: selectedBrands.includes(brand) ? '1px solid #667eea' : 'none',
                    fontWeight: selectedBrands.includes(brand) ? 700 : 500,
                    '&:hover': {
                      bgcolor: selectedBrands.includes(brand)
                        ? 'rgba(102, 126, 234, 0.4)'
                        : 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button
          fullWidth
          variant="contained"
          startIcon={<ClearIcon />}
          onClick={onClearFilters}
          sx={{
            mt: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 700,
            '&:hover': {
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            },
          }}
        >
          Clear Filters ({activeFiltersCount})
        </Button>
      )}
    </Box>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams?.get('category') || null
  );
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [wishlistedProducts, setWishlistedProducts] = useState<Set<string>>(new Set());
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: categoriesData } = useQuery<{ categories: any[] }>(GET_CATEGORIES);

  const { data: productsData, loading, fetchMore } = useQuery<{
    products: {
      products: any[];
      total: number;
      page: number;
      pageSize: number;
      hasMore: boolean;
    };
  }>(GET_PRODUCTS, {
    variables: {
      page,
      pageSize: 12,
      filter: {
        categoryId: selectedCategory,
        search: searchQuery || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        brand: selectedBrands.length > 0 ? selectedBrands[0] : undefined,
      },
      sortBy,
    },
  });

  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART);
  const [addToWishlist] = useMutation(ADD_TO_WISHLIST);
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST);

  // Memoized values (must be before useEffects that use them)
  const total = useMemo(() => productsData?.products?.total || 0, [productsData]);
  const hasMore = useMemo(() => productsData?.products?.hasMore || false, [productsData]);

  const brands = useMemo(() =>
    Array.from(new Set(allProducts.map((p: any) => p.brand).filter(Boolean))) as string[],
    [allProducts]
  );

  const activeFiltersCount = useMemo(() =>
    (selectedCategory ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    selectedBrands.length +
    (searchQuery ? 1 : 0),
    [selectedCategory, priceRange, selectedBrands, searchQuery]
  );

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, hasMore]);

  // Sync products with query data
  useEffect(() => {
    if (productsData?.products?.products) {
      if (page === 1) {
        // Reset products on first page (filter change or initial load)
        setAllProducts(productsData.products.products);
      } else {
        // Append new products for pagination
        setAllProducts((prev) => {
          const newProducts = productsData.products.products;
          const existingIds = new Set(prev.map((p: any) => p.id));
          const uniqueNewProducts = newProducts.filter((p: any) => !existingIds.has(p.id));
          return [...prev, ...uniqueNewProducts];
        });
      }
    }
  }, [productsData, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery, priceRange, selectedBrands, sortBy]);

  // Callbacks
  const handleAddToCart = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await addToCart({ variables: { productId, quantity: 1 } });
      setAddedToCart(productId);
      setTimeout(() => setAddedToCart(null), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  }, [isAuthenticated, router, addToCart]);

  const handleToggleWishlist = useCallback(async (productId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (wishlistedProducts.has(productId)) {
        await removeFromWishlist({ variables: { productId } });
        setWishlistedProducts((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await addToWishlist({ variables: { productId } });
        setWishlistedProducts((prev) => new Set(prev).add(productId));
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  }, [isAuthenticated, router, wishlistedProducts, addToWishlist, removeFromWishlist]);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSidebarOpen(false);
  }, []);

  const handlePriceChange = useCallback((newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  }, []);

  const handleBrandToggle = useCallback((brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [brand]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory(null);
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setSearchQuery('');
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        position: 'relative',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          pt: 10,
          pb: 5,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.2)',
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Premium Collection
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
                fontWeight: 400,
              }}
            >
              Discover {total} curated luxury products
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Controls */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: 'rgba(26, 26, 46, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.15)',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <TextField
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(102, 126, 234, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea' },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Sort */}
            <TextField
              select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              slotProps={{ select: { native: true } }}
              sx={{
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                },
              }}
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name: A-Z</option>
            </TextField>

            {/* View Toggle */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                onClick={() => setViewMode('grid')}
                sx={{
                  bgcolor: viewMode === 'grid' ? '#667eea' : 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  '&:hover': { bgcolor: viewMode === 'grid' ? '#5568d3' : 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                sx={{
                  bgcolor: viewMode === 'list' ? '#667eea' : 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  '&:hover': { bgcolor: viewMode === 'list' ? '#5568d3' : 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Box>

            {/* Filter Button */}
            <Badge badgeContent={activeFiltersCount} color="error">
              <Button
                onClick={() => setSidebarOpen(true)}
                variant="contained"
                startIcon={<FilterListIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: { xs: 'flex', lg: 'none' },
                }}
              >
                Filters
              </Button>
            </Badge>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Sidebar (Desktop) */}
          <Grid size={{ xs: 12, lg: 3 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Paper
              sx={{
                background: 'rgba(26, 26, 46, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.15)',
                borderRadius: 2,
                position: 'sticky',
                top: 20,
                maxHeight: 'calc(100vh - 40px)',
                overflow: 'auto',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'rgba(102, 126, 234, 0.5)',
                  borderRadius: 3,
                },
              }}
            >
              <FilterSidebar
                categories={categoriesData?.categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                brands={brands}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                total={total}
              />
            </Paper>
          </Grid>

          {/* Products Grid */}
          <Grid size={{ xs: 12, lg: 9 }}>
            {loading && page === 1 ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Card sx={{ background: 'rgba(26, 26, 46, 0.6)', border: '1px solid rgba(102, 126, 234, 0.15)' }}>
                      <Skeleton variant="rectangular" height={300} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                      <CardContent>
                        <Skeleton width="60%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Skeleton width="100%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Skeleton width="40%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : allProducts.length === 0 ? (
              <Paper
                sx={{
                  p: 8,
                  textAlign: 'center',
                  background: 'rgba(26, 26, 46, 0.6)',
                  border: '1px solid rgba(102, 126, 234, 0.15)',
                  borderRadius: 2,
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
                <Typography variant="h5" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>
                  No products found
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
                  Try adjusting your filters or search query
                </Typography>
                <Button
                  variant="contained"
                  onClick={clearFilters}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Clear Filters
                </Button>
              </Paper>
            ) : (
              <>
                <Grid container spacing={3}>
                  {allProducts.map((product: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 12 }} key={product.id}>
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlistedProducts.has(product.id)}
                        isAdded={addedToCart === product.id}
                        isAddingToCart={addingToCart}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Infinite Scroll Trigger */}
                <Box
                  ref={loadMoreRef}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 4,
                    py: 3,
                  }}
                >
                  {loading && page > 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <CircularProgress
                        size={40}
                        sx={{
                          color: '#667eea',
                        }}
                      />
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                        Loading more products...
                      </Typography>
                    </Box>
                  )}
                  {!hasMore && allProducts.length > 0 && (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: 4,
                        px: 3,
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: 3,
                        width: '100%',
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                        You've reached the end!
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        You've seen all {allProducts.length} products in this category
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 300,
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
            borderRight: '1px solid rgba(102, 126, 234, 0.2)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            Filters
          </Typography>
          <IconButton onClick={() => setSidebarOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <FilterSidebar
          categories={categoriesData?.categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          onClearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
          total={total}
        />
      </Drawer>

      {/* Scroll to Top */}
      <Zoom in={showScrollTop}>
        <Fab
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </Box>
  );
}

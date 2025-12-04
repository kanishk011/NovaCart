'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  alpha,
} from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import StarIcon from '@mui/icons-material/Star';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

// Memoized Feature Card Component
const FeatureCard = memo(({ icon, title, description }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -8 }}
  >
    <Card
      sx={{
        p: 4,
        height: '100%',
        background: 'linear-gradient(145deg, rgba(26, 26, 46, 0.6) 0%, rgba(15, 15, 30, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(102, 126, 234, 0.15)',
        borderRadius: 3,
        textAlign: 'center',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'rgba(102, 126, 234, 0.5)',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          borderRadius: '50%',
          bgcolor: 'rgba(102, 126, 234, 0.15)',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
        {description}
      </Typography>
    </Card>
  </motion.div>
));

FeatureCard.displayName = 'FeatureCard';

// Memoized Category Card Component
const CategoryCard = memo(({ category, onClick }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -12 }}
  >
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: 400,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid rgba(102, 126, 234, 0.15)',
        transition: 'all 0.4s',
        '&:hover': {
          borderColor: 'rgba(102, 126, 234, 0.5)',
          '& .category-overlay': {
            opacity: 1,
          },
          '& .category-image': {
            transform: 'scale(1.15)',
          },
        },
      }}
    >
      <CardMedia
        component="img"
        image={category.image}
        alt={category.name}
        className="category-image"
        sx={{
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease',
        }}
      />
      <Box
        className="category-overlay"
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)',
          opacity: 0.7,
          transition: 'opacity 0.4s',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 900,
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {category.name}
        </Typography>
        <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, fontSize: '1.1rem' }}>
          {category.count}
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            alignSelf: 'flex-start',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 700,
            textTransform: 'none',
            px: 3,
            '&:hover': {
              transform: 'translateX(4px)',
            },
          }}
        >
          Explore
        </Button>
      </Box>
    </Card>
  </motion.div>
));

CategoryCard.displayName = 'CategoryCard';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShopNow = useCallback(() => {
    router.push('/products');
  }, [router]);

  const handleCategoryClick = useCallback(() => {
    router.push('/products');
  }, [router]);

  const featuredCategories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      count: '2,500+ Products',
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
      count: '5,000+ Products',
    },
    {
      name: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
      count: '3,200+ Products',
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
      count: '1,800+ Products',
    },
  ];

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over ₹500 with express delivery options',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Secure Shopping',
      description: 'Your payments are 100% protected with advanced encryption',
    },
    {
      icon: <StarIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Premium Quality',
      description: 'Handpicked products with guaranteed authenticity',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#667eea' }} />,
      title: '24/7 Support',
      description: 'Our customer service team is always here to help',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Hero Section - Full Screen with Large Image */}
      <MotionBox
        style={{
          y: heroY,
          opacity: heroOpacity,
        }}
        sx={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.85) 0%, rgba(26, 26, 46, 0.75) 50%, rgba(22, 33, 62, 0.85) 100%)',
            },
          }}
        />

        {/* Floating Shapes */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 8s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-40px)' },
            },
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: '#667eea',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: 3,
                    mb: 2,
                    display: 'block',
                  }}
                >
                  WELCOME TO NOVACART
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' },
                    color: 'white',
                    mb: 3,
                    lineHeight: 1.1,
                    letterSpacing: -2,
                  }}
                >
                  Discover Your
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Perfect Style
                  </span>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    mb: 5,
                    maxWidth: '600px',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                  }}
                >
                  Experience luxury shopping with our curated collection of premium products.
                  Quality meets innovation.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleShopNow}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50px',
                      textTransform: 'none',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        boxShadow: '0 16px 56px rgba(102, 126, 234, 0.6)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Shop Collection
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/about')}
                    sx={{
                      px: 5,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      borderWidth: 2,
                      borderRadius: '50px',
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'white',
                        borderWidth: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </motion.div>
            </Grid>

            {/* Stats Section */}
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 3,
                  }}
                >
                  {[
                    { number: '50K+', label: 'Products' },
                    { number: '1M+', label: 'Customers' },
                    { number: '99.9%', label: 'Satisfaction' },
                    { number: '24/7', label: 'Support' },
                  ].map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 3,
                        background: 'rgba(26, 26, 46, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        borderRadius: 3,
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 900,
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
              '50%': { transform: 'translateX(-50%) translateY(-15px)' },
            },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 52,
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '20px',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 6,
                height: 6,
                bgcolor: 'white',
                borderRadius: '50%',
                top: 10,
                left: '50%',
                transform: 'translateX(-50%)',
              },
            }}
          />
        </Box>
      </MotionBox>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          position: 'relative',
        }}
      >
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#667eea',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 2,
                  display: 'block',
                }}
              >
                WHY CHOOSE US
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 2,
                }}
              >
                Premium Experience
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '1.2rem',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                We provide the best shopping experience with unmatched quality and service
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0a0a0a' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: '#667eea',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 2,
                  display: 'block',
                }}
              >
                EXPLORE OUR COLLECTION
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Shop by Category
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={3}>
            {featuredCategories.map((category, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <CategoryCard category={category} onClick={handleCategoryClick} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 10, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: 'rgba(102, 126, 234, 0.15)',
                px: 3,
                py: 1.5,
                borderRadius: '50px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                mb: 4,
              }}
            >
              <TrendingUpIcon sx={{ color: '#667eea' }} />
              <Typography sx={{ color: 'white', fontWeight: 700 }}>
                Join 1M+ Happy Customers
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                color: 'white',
                fontWeight: 900,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Ready to Start Your
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Shopping Journey?
              </span>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 5,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
              Create your account today and get exclusive access to premium deals, early launches,
              and personalized recommendations.
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!mounted || !isAuthenticated ? (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => router.push('/register')}
                  sx={{
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50px',
                    textTransform: 'none',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                    '&:hover': {
                      boxShadow: '0 16px 56px rgba(102, 126, 234, 0.7)',
                      transform: 'translateY(-2px) scale(1.02)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Create Free Account
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ShoppingBagIcon />}
                  onClick={handleShopNow}
                  sx={{
                    px: 6,
                    py: 2.5,
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50px',
                    textTransform: 'none',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.5)',
                    '&:hover': {
                      boxShadow: '0 16px 56px rgba(102, 126, 234, 0.7)',
                      transform: 'translateY(-2px) scale(1.02)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Continue Shopping
                </Button>
              )}

              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/contact')}
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  borderWidth: 2,
                  borderRadius: '50px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    borderWidth: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Contact Us
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          py: 8,
        }}
      >
        <Container>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  color: 'white',
                }}
              >
                Nova<span style={{ color: '#667eea' }}>Cart</span>
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3, lineHeight: 1.8 }}>
                Your trusted partner for premium e-commerce. Experience luxury shopping with cutting-edge technology.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                  <IconButton
                    key={social}
                    sx={{
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      color: '#667eea',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <FavoriteIcon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                Shop
              </Typography>
              {['Products', 'Categories', 'New Arrivals', 'Best Sellers'].map((link) => (
                <Typography
                  key={link}
                  onClick={handleShopNow}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#667eea' },
                    transition: 'color 0.3s',
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                Company
              </Typography>
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Privacy Policy', path: '/privacy' },
              ].map((link) => (
                <Typography
                  key={link.label}
                  onClick={() => router.push(link.path)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#667eea' },
                    transition: 'color 0.3s',
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
                Newsletter
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 2 }}>
                Subscribe to get special offers and updates.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 700,
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 6,
              pt: 4,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              © 2024 NovaCart. All rights reserved. Crafted with excellence.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

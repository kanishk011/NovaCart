import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets and devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Home decor and furniture',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      },
    }),
  ]);

  console.log('✅ Categories created');

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Bluetooth Headphones',
        slug: 'wireless-bluetooth-headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 2999,
        salePrice: 2499,
        stock: 50,
        sku: 'WH-001',
        brand: 'SoundMax',
        categoryId: categories[0].id,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        rating: 4.5,
        reviewCount: 128,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced fitness tracker with heart rate monitor and GPS',
        price: 5999,
        salePrice: 4999,
        stock: 30,
        sku: 'SW-001',
        brand: 'TechFit',
        categoryId: categories[0].id,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          'https://images.unsplash.com/photo-1434493651326-21fc44c91f13?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        rating: 4.7,
        reviewCount: 256,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Classic White T-Shirt',
        slug: 'classic-white-tshirt',
        description: '100% cotton comfortable everyday wear t-shirt',
        price: 599,
        salePrice: 399,
        stock: 100,
        sku: 'TS-001',
        brand: 'FashionHub',
        categoryId: categories[1].id,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        rating: 4.3,
        reviewCount: 89,
        isFeatured: false,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Modern Table Lamp',
        slug: 'modern-table-lamp',
        description: 'Elegant LED table lamp with adjustable brightness',
        price: 1299,
        salePrice: 999,
        stock: 45,
        sku: 'TL-001',
        brand: 'HomeGlow',
        categoryId: categories[2].id,
        images: [
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
        rating: 4.6,
        reviewCount: 64,
        isFeatured: true,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Laptop Backpack',
        slug: 'laptop-backpack',
        description: 'Durable water-resistant backpack with laptop compartment',
        price: 1899,
        stock: 60,
        sku: 'BP-001',
        brand: 'TravelPro',
        categoryId: categories[0].id,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        ],
        thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        rating: 4.4,
        reviewCount: 145,
        isFeatured: false,
      },
    }),
  ]);

  console.log('✅ Products created');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@novacart.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      phone: '1234567890',
    },
  });

  // Create cart and wishlist for demo user
  await Promise.all([
    prisma.cart.create({
      data: { userId: user.id },
    }),
    prisma.wishlist.create({
      data: { userId: user.id },
    }),
  ]);

  console.log('✅ Demo user created (email: demo@novacart.com, password: demo123)');

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

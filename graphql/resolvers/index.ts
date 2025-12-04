import { Context } from '@/app/api/graphql/route';
import { hashPassword, comparePassword, generateToken } from '@/lib/auth';
import { GraphQLScalarType, Kind } from 'graphql';

const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    return new Date(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const resolvers = {
  DateTime: dateTimeScalar,

  Query: {
    me: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');
      return prisma.user.findUnique({ where: { id: user.userId } });
    },

    products: async (_: any, args: any, { prisma }: Context) => {
      const { page = 1, pageSize = 20, filter = {}, sortBy = 'createdAt' } = args;
      const skip = (page - 1) * pageSize;

      const where: any = { isActive: true };

      if (filter.categoryId) where.categoryId = filter.categoryId;
      if (filter.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ];
      }
      if (filter.brand) where.brand = filter.brand;
      if (filter.minPrice || filter.maxPrice) {
        where.price = {};
        if (filter.minPrice) where.price.gte = filter.minPrice;
        if (filter.maxPrice) where.price.lte = filter.maxPrice;
      }
      if (filter.isFeatured !== undefined) where.isFeatured = filter.isFeatured;

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: pageSize,
          orderBy: { [sortBy]: 'desc' },
          include: { category: true },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        total,
        page,
        pageSize,
        hasMore: skip + products.length < total,
      };
    },

    product: async (_: any, args: any, { prisma }: Context) => {
      const where = args.id ? { id: args.id } : { slug: args.slug };
      return prisma.product.findUnique({
        where,
        include: {
          category: true,
          variants: { where: { isActive: true } },
          reviews: { include: { user: true }, orderBy: { createdAt: 'desc' } },
        },
      });
    },

    featuredProducts: async (_: any, __: any, { prisma }: Context) => {
      return prisma.product.findMany({
        where: { isFeatured: true, isActive: true },
        take: 10,
        include: { category: true },
      });
    },

    categories: async (_: any, __: any, { prisma }: Context) => {
      return prisma.category.findMany({
        where: { isActive: true },
        include: { products: { take: 5 } },
      });
    },

    category: async (_: any, args: any, { prisma }: Context) => {
      const where = args.id ? { id: args.id } : { slug: args.slug };
      return prisma.category.findUnique({
        where,
        include: { products: true },
      });
    },

    myCart: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      const cart = await prisma.cart.findUnique({
        where: { userId: user.userId },
        include: { items: { include: { product: { include: { category: true } }, variant: true } } },
      });

      if (!cart) return null;

      return {
        ...cart,
        total: cart.items.reduce((sum, item) => {
          const price = item.variant
            ? (item.variant.salePrice || item.variant.price || item.product.salePrice || item.product.price)
            : (item.product.salePrice || item.product.price);
          return sum + price * item.quantity;
        }, 0),
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    },

    myWishlist: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      return prisma.wishlist.findUnique({
        where: { userId: user.userId },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    },

    myOrders: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      return prisma.order.findMany({
        where: { userId: user.userId },
        include: { items: { include: { product: { include: { category: true } } } }, shippingAddress: true },
        orderBy: { createdAt: 'desc' },
      });
    },

    order: async (_: any, args: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      return prisma.order.findFirst({
        where: { id: args.id, userId: user.userId },
        include: { items: { include: { product: { include: { category: true } } } }, shippingAddress: true },
      });
    },
  },

  Mutation: {
    register: async (_: any, { input }: any, { prisma }: Context) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error('Email already registered');

      const hashedPassword = await hashPassword(input.password);

      const user = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
      });

      // Create cart and wishlist
      await Promise.all([
        prisma.cart.create({ data: { userId: user.id } }),
        prisma.wishlist.create({ data: { userId: user.id } }),
      ]);

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { token, user };
    },

    login: async (_: any, { email, password }: any, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Invalid credentials');

      const valid = await comparePassword(password, user.password);
      if (!valid) throw new Error('Invalid credentials');

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { token, user };
    },

    addToCart: async (_: any, { productId, quantity, variantId }: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      let cart = await prisma.cart.findUnique({ where: { userId: user.userId } });

      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: user.userId } });
      }

      // Use findFirst for null variantId since findUnique doesn't support null in compound keys
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            variantId: variantId || null,
            quantity
          },
        });
      }

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: { include: { category: true } }, variant: true } } },
      });

      if (!updatedCart) throw new Error('Cart not found');

      return {
        ...updatedCart,
        total: updatedCart.items.reduce((sum, item) => {
          const price = item.variant
            ? (item.variant.salePrice || item.variant.price || item.product.salePrice || item.product.price)
            : (item.product.salePrice || item.product.price);
          return sum + price * item.quantity;
        }, 0),
        itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    },

    updateCartItem: async (_: any, { productId, quantity, variantId }: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
      if (!cart) throw new Error('Cart not found');

      // Use findFirst for null variantId since findUnique doesn't support null in compound keys
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      });

      if (!cartItem) throw new Error('Cart item not found');

      if (quantity <= 0) {
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      } else {
        await prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { quantity },
        });
      }

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: { include: { category: true } }, variant: true } } },
      });

      if (!updatedCart) throw new Error('Cart not found');

      return {
        ...updatedCart,
        total: updatedCart.items.reduce((sum, item) => {
          const price = item.variant
            ? (item.variant.salePrice || item.variant.price || item.product.salePrice || item.product.price)
            : (item.product.salePrice || item.product.price);
          return sum + price * item.quantity;
        }, 0),
        itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    },

    removeFromCart: async (_: any, { productId, variantId }: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
      if (!cart) throw new Error('Cart not found');

      // Use findFirst for null variantId since findUnique doesn't support null in compound keys
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
        },
      });

      if (cartItem) {
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });
      }

      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: { include: { category: true } }, variant: true } } },
      });

      if (!updatedCart) throw new Error('Cart not found');

      return {
        ...updatedCart,
        total: updatedCart.items.reduce((sum, item) => {
          const price = item.variant
            ? (item.variant.salePrice || item.variant.price || item.product.salePrice || item.product.price)
            : (item.product.salePrice || item.product.price);
          return sum + price * item.quantity;
        }, 0),
        itemCount: updatedCart.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    },

    clearCart: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      const cart = await prisma.cart.findUnique({ where: { userId: user.userId } });
      if (!cart) return true;

      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      return true;
    },

    addToWishlist: async (_: any, { productId }: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      let wishlist = await prisma.wishlist.findUnique({
        where: { userId: user.userId },
        include: { items: true }
      });

      if (!wishlist) {
        wishlist = await prisma.wishlist.create({
          data: { userId: user.userId },
          include: { items: true }
        });
      }

      // Check if item already exists in wishlist
      const existingItem = wishlist.items.find(item => item.productId === productId);

      if (!existingItem) {
        await prisma.wishlistItem.create({
          data: { wishlistId: wishlist.id, productId },
        });
      }

      return prisma.wishlist.findUnique({
        where: { id: wishlist.id },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    },

    removeFromWishlist: async (_: any, { productId }: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      const wishlist = await prisma.wishlist.findUnique({ where: { userId: user.userId } });
      if (!wishlist) throw new Error('Wishlist not found');

      await prisma.wishlistItem.delete({
        where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      });

      return prisma.wishlist.findUnique({
        where: { id: wishlist.id },
        include: { items: { include: { product: { include: { category: true } } } } },
      });
    },

    createOrder: async (_: any, { addressId, paymentMethod }: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      const cart = await prisma.cart.findUnique({
        where: { userId: user.userId },
        include: { items: { include: { product: { include: { category: true } } } } },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const subtotal = cart.items.reduce((sum, item) =>
        sum + (item.product.salePrice || item.product.price) * item.quantity, 0
      );
      const shipping = subtotal > 500 ? 0 : 50;
      const tax = subtotal * 0.18;
      const total = subtotal + shipping + tax;

      const orderNumber = `NOV${Date.now()}`;

      const order = await prisma.order.create({
        data: {
          userId: user.userId,
          orderNumber,
          shippingAddressId: addressId,
          paymentMethod,
          subtotal,
          tax,
          shipping,
          total,
          items: {
            create: cart.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.salePrice || item.product.price,
            })),
          },
        },
        include: { items: { include: { product: { include: { category: true } } } }, shippingAddress: true },
      });

      // Clear cart
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    },

    addReview: async (_: any, args: any, { prisma, user }: Context) => {
      if (!user) throw new Error('Not authenticated');

      return prisma.review.create({
        data: {
          userId: user.userId,
          productId: args.productId,
          rating: args.rating,
          title: args.title,
          comment: args.comment,
        },
        include: { user: true, product: true },
      });
    },
  },

  CartItem: {
    subtotal: (parent: any) => {
      const price = parent.variant
        ? (parent.variant.salePrice || parent.variant.price || parent.product.salePrice || parent.product.price)
        : (parent.product.salePrice || parent.product.price);
      return price * parent.quantity;
    },
  },

  WishlistItem: {
    addedAt: (parent: any) => parent.createdAt,
  },
};

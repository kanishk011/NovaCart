export const typeDefs = `#graphql
  scalar DateTime

  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    phone: String
    role: UserRole!
    isActive: Boolean!
    createdAt: DateTime!
    cart: Cart
    wishlist: Wishlist
    orders: [Order!]!
  }

  enum UserRole {
    CUSTOMER
    ADMIN
    SELLER
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    image: String
    products: [Product!]!
  }

  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String!
    shortDescription: String
    price: Float!
    salePrice: Float
    stock: Int!
    sku: String!
    brand: String
    category: Category!
    images: [String!]!
    thumbnail: String!
    rating: Float!
    reviewCount: Int!
    isActive: Boolean!
    isFeatured: Boolean!

    # New product attributes
    weight: Float
    dimensions: String
    color: String
    material: String
    warranty: String

    # Variant support
    hasVariants: Boolean!
    sizes: [String!]!
    colors: [String!]!
    variants: [ProductVariant!]!

    # Additional details
    tags: [String!]!
    metaTitle: String
    metaDescription: String

    reviews: [Review!]!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type ProductVariant {
    id: ID!
    productId: String!
    sku: String!
    name: String!
    size: String
    color: String
    capacity: String
    price: Float
    salePrice: Float
    stock: Int!
    image: String
    isActive: Boolean!
  }

  type Cart {
    id: ID!
    items: [CartItem!]!
    total: Float!
    itemCount: Int!
  }

  type CartItem {
    id: ID!
    product: Product!
    variant: ProductVariant
    quantity: Int!
    subtotal: Float!
  }

  type Wishlist {
    id: ID!
    items: [WishlistItem!]!
  }

  type WishlistItem {
    id: ID!
    product: Product!
    addedAt: DateTime!
  }

  type Order {
    id: ID!
    orderNumber: String!
    status: OrderStatus!
    paymentStatus: PaymentStatus!
    subtotal: Float!
    tax: Float!
    shipping: Float!
    discount: Float!
    total: Float!
    items: [OrderItem!]!
    createdAt: DateTime!
  }

  enum OrderStatus {
    PENDING
    CONFIRMED
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
    REFUNDED
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  type OrderItem {
    id: ID!
    product: Product!
    quantity: Int!
    price: Float!
  }

  type Review {
    id: ID!
    user: User!
    product: Product!
    rating: Int!
    title: String
    comment: String
    images: [String!]!
    isVerified: Boolean!
    createdAt: DateTime!
  }

  type ProductsResponse {
    products: [Product!]!
    total: Int!
    page: Int!
    pageSize: Int!
    hasMore: Boolean!
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    phone: String
  }

  input ProductFilterInput {
    categoryId: String
    minPrice: Float
    maxPrice: Float
    brand: String
    search: String
    isFeatured: Boolean
  }

  type Query {
    # Auth
    me: User

    # Products
    products(
      page: Int
      pageSize: Int
      filter: ProductFilterInput
      sortBy: String
    ): ProductsResponse!
    product(id: ID, slug: String): Product
    featuredProducts: [Product!]!

    # Categories
    categories: [Category!]!
    category(id: ID, slug: String): Category

    # Cart
    myCart: Cart

    # Wishlist
    myWishlist: Wishlist

    # Orders
    myOrders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # Cart
    addToCart(productId: ID!, quantity: Int!, variantId: ID): Cart!
    updateCartItem(productId: ID!, quantity: Int!, variantId: ID): Cart!
    removeFromCart(productId: ID!, variantId: ID): Cart!
    clearCart: Boolean!

    # Wishlist
    addToWishlist(productId: ID!): Wishlist!
    removeFromWishlist(productId: ID!): Wishlist!

    # Orders
    createOrder(addressId: ID!, paymentMethod: String!): Order!

    # Reviews
    addReview(productId: ID!, rating: Int!, title: String, comment: String): Review!
  }
`;

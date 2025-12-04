import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export interface Context {
  prisma: typeof prisma;
  user: { userId: string; email: string; role: string } | null;
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
  context: async (req) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;

    return {
      prisma,
      user,
    };
  },
});

export { handler as GET, handler as POST };

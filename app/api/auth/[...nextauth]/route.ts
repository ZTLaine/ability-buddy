import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // We'll create this Prisma client instance shortly
import bcrypt from "bcryptjs";

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production';

// TEMPORARY: Force JWT sessions for both environments to test
const FORCE_JWT_SESSIONS = true;

console.log('NextAuth Environment Check:', {
  NODE_ENV: process.env.NODE_ENV,
  RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
  isProduction,
  sessionStrategy: FORCE_JWT_SESSIONS ? 'jwt' : (isProduction ? 'database' : 'jwt'),
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
});

export const authOptions: NextAuthOptions = {
    adapter: FORCE_JWT_SESSIONS ? undefined : PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
            if (!credentials?.email || !credentials.password) {
                console.log('Missing credentials:', { email: !!credentials?.email, password: !!credentials?.password });
                return null;
            }

            try {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.hashedPassword) {
                    console.log('User not found or no password:', { 
                        userExists: !!user, 
                        hasPassword: !!user?.hashedPassword 
                    });
                    return null;
                }

                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isValidPassword) {
                    console.log('Invalid password for user:', credentials.email);
                    return null;
                }

                console.log('Authentication successful for:', credentials.email);
                // Return user object without password
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name, 
                    image: user.image, 
                    role: user.role,
                };
            } catch (error) {
                console.error('Database error during authentication:', error?.message || 'Unknown database error');
                return null;
            }
        },
    }),
    ],
    session: {
        strategy: FORCE_JWT_SESSIONS ? "jwt" : (isProduction ? "database" : "jwt"),
    },
    callbacks: {
        // Handle both session types
        async session({ session, token, user }) {
            console.log('Session callback:', {
                strategy: FORCE_JWT_SESSIONS ? 'jwt' : (isProduction ? 'database' : 'jwt'),
                hasUser: !!user,
                hasToken: !!token,
                userId: user?.id || token?.sub
            });

            if (FORCE_JWT_SESSIONS || !isProduction) {
                // JWT sessions - token is available
                if (token?.sub && session.user) {
                    session.user.id = token.sub;
                    session.user.role = token.role as any;
                }
            } else {
                // Database sessions - user is available
                if (user && session.user) {
                    session.user.id = user.id;
                    session.user.role = (user as any).role;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            console.log('JWT callback:', {
                strategy: FORCE_JWT_SESSIONS ? 'jwt' : (isProduction ? 'database' : 'jwt'),
                hasUser: !!user,
                hasToken: !!token,
                userId: user?.id
            });

            // Only needed for JWT sessions
            if (FORCE_JWT_SESSIONS || !isProduction) {
                if (user) {
                    token.sub = user.id;
                    token.role = user.role;
                }
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Enable debug mode
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
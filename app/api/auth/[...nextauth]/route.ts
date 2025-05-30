import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma"; // We'll create this Prisma client instance shortly
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
            if (!credentials?.email || !credentials.password) {
                return null;
            }

            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
            });

            if (!user || !user.hashedPassword) {
                // User not found or doesn't have a password (e.g., signed up with OAuth)
                return null;
            }

            const isValidPassword = await bcrypt.compare(
                credentials.password,
                user.hashedPassword
            );

            if (!isValidPassword) {
                return null;
            }

            // Return user object without password
            return {
                id: user.id,
                email: user.email,
                name: user.name, 
                image: user.image, 
                role: user.role,
            };
        },
    }),
    ],
    session: {
        strategy: "jwt", // Using JWT for session strategy
    },
    callbacks: {
        async session({ session, token }) {
            // Add custom properties to the session
            if (token.sub && session.user) {
                session.user.id = token.sub; // 'sub' (subject) from JWT is the user id
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user, account, profile }) {
            // Persist the OAuth access_token and or the user id and role to the token right after signin
            if (user) { // user is only passed on first call (sign-in)
                token.sub = user.id; // 'sub' will store the user ID
                token.role = user.role; // Add role to JWT
            }
            return token;
        },
    },
    pages: {
        signIn: '/signin', // We will create a custom sign-in page/modal later
        // error: '/auth/error', // Custom error page (optional)
        // newUser: '/auth/new-user' // New users will be created via the credentials provider or OAuth
    },
    secret: process.env.NEXTAUTH_SECRET,
    // debug: process.env.NODE_ENV === 'development', // Enable debug messages in development
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
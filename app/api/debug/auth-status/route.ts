import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    
    // Check environment variables (safely)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET'
    };

    // Test database connection
    let dbStatus;
    try {
      await prisma.$connect();
      // Try to count users
      const userCount = await prisma.user.count();
      const sessionCount = await prisma.session.count();
      dbStatus = {
        connected: true,
        userCount,
        sessionCount,
        error: null
      };
    } catch (error) {
      dbStatus = {
        connected: false,
        userCount: null,
        sessionCount: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      await prisma.$disconnect();
    }

    // Check if we're in production
    const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production';

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        isProduction,
        ...envCheck
      },
      session: {
        hasSession: !!session,
        userId: session?.user?.id || null,
        userEmail: session?.user?.email || null,
        userRole: (session?.user as any)?.role || null
      },
      database: dbStatus,
      authStrategy: isProduction ? 'database' : 'jwt'
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
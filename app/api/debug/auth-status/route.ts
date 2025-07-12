import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // SECURITY: Remove this endpoint after debugging is complete
  // This endpoint should only be used temporarily for debugging auth issues
  
  // Safety check - only allow in development or when explicitly enabled
  const isDebugEnabled = process.env.NODE_ENV === 'development' || process.env.ENABLE_DEBUG_ENDPOINT === 'true';
  
  if (!isDebugEnabled) {
    return NextResponse.json({ 
      error: 'Debug endpoint disabled in production',
      message: 'Set ENABLE_DEBUG_ENDPOINT=true to enable (not recommended for production)' 
    }, { status: 403 });
  }
  
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    
    // Check environment variables (safely - only show if they're set, not values)
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
      // Try to count users (don't expose actual user data)
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
        userEmail: session?.user?.email || null, // Only show email, not sensitive data
        userRole: (session?.user as any)?.role || null
      },
      database: dbStatus,
      authStrategy: isProduction ? 'database' : 'jwt',
      forceJwtSessions: true // Show current override status
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
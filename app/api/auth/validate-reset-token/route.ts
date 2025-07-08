import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const validateTokenSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = validateTokenSchema.parse(body);

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return NextResponse.json(
        { message: 'Reset token has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Validate reset token error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
} 
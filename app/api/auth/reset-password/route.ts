import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// API-specific schema - only needs token and password
const ResetPasswordApiSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one symbol.' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = ResetPasswordApiSchema.parse(body);

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token' },
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
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
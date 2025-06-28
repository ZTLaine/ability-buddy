import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration attacks
    // (Don't reveal whether email exists or not)
    const successResponse = NextResponse.json({
      message: 'If an account with that email exists, we sent you a password reset link.'
    });

    if (!user || !user.hashedPassword) {
      // User doesn't exist or signed up with OAuth only
      return successResponse;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpires,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Generate email content
    const { html, text } = generatePasswordResetEmail(resetUrl, user.name || undefined);

    // Send email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset your Ability Buddy password',
      html,
      text,
    });

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error);
      return NextResponse.json(
        { message: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return successResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
} 
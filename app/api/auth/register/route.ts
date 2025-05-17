import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { RegisterSchema } from '@/lib/schemas/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = RegisterSchema.safeParse(body);

        if (!validation.success) {
            const errorMessages = Object.entries(validation.error.formErrors.fieldErrors)
                .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
                .join('; ');
            return NextResponse.json({ message: `Invalid input: ${errorMessages}`, errors: validation.error.formErrors.fieldErrors }, { status: 400 });
        }

        const { email, password, name } = validation.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                hashedPassword,
                name,
            },
        });

        return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });

    } catch (error) {
        console.error('[AUTH_REGISTER_ERROR]', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ message: 'Email already in use.' }, { status: 409 });
            }
        }
        return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
    }
} 
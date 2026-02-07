import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors[0].message)
    }

    const { email, password, name, phone } = validation.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse('Email already registered')
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'SELLER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    return successResponse(user, 'User registered successfully')
  } catch (error) {
    console.error('Registration error:', error)
    return errorResponse('Failed to register user', 500)
  }
}

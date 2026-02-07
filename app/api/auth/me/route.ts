import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { successResponse, unauthorizedResponse, errorResponse } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  try {
    const authData = await verifyAuth(req)
    
    if (!authData) {
      return unauthorizedResponse()
    }

    const user = await prisma.user.findUnique({
      where: { id: authData.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      return unauthorizedResponse('User not found')
    }

    return successResponse(user)
  } catch (error) {
    console.error('Get user error:', error)
    return errorResponse('Failed to get user data', 500)
  }
}

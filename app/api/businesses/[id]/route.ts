import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { businessSchema } from '@/lib/validations'
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse, 
  notFoundResponse,
  validationErrorResponse 
} from '@/lib/api-response'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: { name: true, email: true, phone: true },
        },
        products: {
          where: { isAvailable: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!business) {
      return notFoundResponse('Business not found')
    }

    await prisma.business.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return successResponse(business)
  } catch (error) {
    console.error('Get business error:', error)
    return errorResponse('Failed to get business', 500)
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authData = await verifyAuth(req)
    if (!authData) {
      return unauthorizedResponse()
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!business) {
      return notFoundResponse('Business not found')
    }

    if (business.ownerId !== authData.userId && authData.role !== 'ADMIN') {
      return unauthorizedResponse('Not authorized to update this business')
    }

    const body = await req.json()
    
    const validation = businessSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors[0].message)
    }

    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    })

    return successResponse(updatedBusiness, 'Business updated successfully')
  } catch (error) {
    console.error('Update business error:', error)
    return errorResponse('Failed to update business', 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authData = await verifyAuth(req)
    if (!authData) {
      return unauthorizedResponse()
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
    })

    if (!business) {
      return notFoundResponse('Business not found')
    }

    if (business.ownerId !== authData.userId && authData.role !== 'ADMIN') {
      return unauthorizedResponse('Not authorized to delete this business')
    }

    await prisma.business.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Business deleted successfully')
  } catch (error) {
    console.error('Delete business error:', error)
    return errorResponse('Failed to delete business', 500)
  }
}

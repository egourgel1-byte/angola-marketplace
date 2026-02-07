import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { productSchema } from '@/lib/validations'
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
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        business: {
          include: {
            owner: {
              select: { name: true, email: true, phone: true },
            },
          },
        },
      },
    })

    if (!product) {
      return notFoundResponse('Product not found')
    }

    await prisma.product.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    })

    return successResponse(product)
  } catch (error) {
    console.error('Get product error:', error)
    return errorResponse('Failed to get product', 500)
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { business: true },
    })

    if (!product) {
      return notFoundResponse('Product not found')
    }

    if (product.business.ownerId !== authData.userId && authData.role !== 'ADMIN') {
      return unauthorizedResponse('Not authorized to update this product')
    }

    const body = await req.json()
    
    const validation = productSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors[0].message)
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return successResponse(updatedProduct, 'Product updated successfully')
  } catch (error) {
    console.error('Update product error:', error)
    return errorResponse('Failed to update product', 500)
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { business: true },
    })

    if (!product) {
      return notFoundResponse('Product not found')
    }

    if (product.business.ownerId !== authData.userId && authData.role !== 'ADMIN') {
      return unauthorizedResponse('Not authorized to delete this product')
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return successResponse(null, 'Product deleted successfully')
  } catch (error) {
    console.error('Delete product error:', error)
    return errorResponse('Failed to delete product', 500)
  }
}

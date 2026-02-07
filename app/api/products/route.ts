import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { productSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { 
  successResponse, 
  errorResponse, 
  unauthorizedResponse, 
  validationErrorResponse 
} from '@/lib/api-response'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const businessId = searchParams.get('businessId')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = { isAvailable: true }
    
    if (businessId) where.businessId = businessId
    if (category) where.category = category
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return errorResponse('Failed to get products', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authData = await verifyAuth(req)
    if (!authData) {
      return unauthorizedResponse()
    }

    const body = await req.json()
    
    const validation = productSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors[0].message)
    }

    const { businessId, ...data } = body

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    })

    if (!business) {
      return errorResponse('Business not found', 404)
    }

    if (business.ownerId !== authData.userId && authData.role !== 'ADMIN') {
      return unauthorizedResponse('Not authorized to add products to this business')
    }

    const slug = generateSlug(data.name)

    const product = await prisma.product.create({
      data: {
        ...data,
        slug,
        businessId,
      },
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

    return successResponse(product, 'Product created successfully')
  } catch (error) {
    console.error('Create product error:', error)
    return errorResponse('Failed to create product', 500)
  }
}

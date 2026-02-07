import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { businessSchema } from '@/lib/validations'
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
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = { isActive: true }
    
    if (category) where.category = category
    if (city) where.city = city
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: { name: true },
          },
          _count: {
            select: { products: true },
          },
        },
      }),
      prisma.business.count({ where }),
    ])

    return successResponse({
      businesses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get businesses error:', error)
    return errorResponse('Failed to get businesses', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const authData = await verifyAuth(req)
    if (!authData) {
      return unauthorizedResponse()
    }

    const body = await req.json()
    
    const validation = businessSchema.safeParse(body)
    if (!validation.success) {
      return validationErrorResponse(validation.error.errors[0].message)
    }

    const data = validation.data
    let slug = generateSlug(data.name)
    
    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    })

    if (existingBusiness) {
      slug = `${slug}-${Date.now()}`
    }

    const business = await prisma.business.create({
      data: {
        ...data,
        slug,
        ownerId: authData.userId,
      },
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
    })

    return successResponse(business, 'Business created successfully')
  } catch (error) {
    console.error('Create business error:', error)
    return errorResponse('Failed to create business', 500)
  }
}

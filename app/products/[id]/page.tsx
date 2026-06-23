import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProductGallery from '@/components/ProductGallery'

interface PageProps {
  params: { id: string }
}

// Generate dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  })

  if (!product) {
    return {
      title: 'Produto não encontrado - Angola Marketplace',
    }
  }

  return {
    title: `${product.name} - Angola Marketplace`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} - Angola Marketplace`,
      description: product.description.substring(0, 160),
      images: product.images && product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

// Fetch helper that also increments views
async function getProductData(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            accountType: true,
            emailVerified: true,
            phoneVerified: true,
            idVerified: true,
            businessVerified: true,
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
        business: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true,
                accountType: true,
                emailVerified: true,
                phoneVerified: true,
                idVerified: true,
                businessVerified: true,
                _count: {
                  select: {
                    products: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!product) return null

    // Increment view count inside the server component load
    await prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return product
  } catch (error) {
    console.error('Failed to fetch product details:', error)
    return null
  }
}

// Fetch related products helper
async function getRelatedProducts(category: string, currentProductId: string) {
  try {
    return await prisma.product.findMany({
      where: {
        category,
        id: { not: currentProductId },
        isAvailable: true,
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        business: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('Failed to fetch related products:', error)
    return []
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductData(params.id)

  if (!product) {
    notFound()
  }

  // Resolve Seller details (could be directly on product or through business)
  const seller = product.owner || product.business?.owner
  
  // Resolve WhatsApp contact number
  const rawContact = product.business?.whatsapp || product.business?.phone || seller?.phone || ''
  const cleanedContact = rawContact.replace(/\D/g, '')
  const messageText = `Olá, tenho interesse no produto "${product.name}" anunciado no Angola Marketplace.`
  const whatsappUrl = cleanedContact 
    ? `https://wa.me/${cleanedContact}?text=${encodeURIComponent(messageText)}`
    : null

  // Fetch Related Products (same category)
  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/products"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar aos Produtos
          </Link>
          {product.business && (
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
              Vendido por: <Link href={`/businesses/${product.business.slug}`} className="font-semibold text-gray-700 hover:underline">{product.business.name}</Link>
            </span>
          )}
        </div>

        {/* Main Columns Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Side: Product Gallery */}
          <div className="lg:col-span-2">
            <Card padding="md" className="overflow-hidden">
              <ProductGallery images={product.images} name={product.name} />
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h2 className="text-xl font-bold text-gray-950 mb-3">Descrição do Produto</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {product.description}
                </p>
              </div>
            </Card>
          </div>

          {/* Right Side: Specs, Prices & Contact */}
          <div className="space-y-6">
            
            {/* Main Product Info Card */}
            <Card padding="md">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-primary-50 text-primary-700">
                  {product.category}
                </span>
                {product.isService ? (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-700">
                    Serviço
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">
                    Artigo
                  </span>
                )}
                {product.isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-green-700 font-semibold ml-auto">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Disponível
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-red-600 font-semibold ml-auto">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Indisponível
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Price & Views */}
              <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl font-black text-primary-600">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: product.currency,
                  }).format(product.price)}
                </span>
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {product.views + 1} visitas
                </span>
              </div>

              {/* Specs Grid */}
              <div className="space-y-3.5 mb-6 text-sm">
                {product.stock !== null && product.stock !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Estoque:</span>
                    <span className="text-gray-950 font-semibold">{product.stock} unidades</span>
                  </div>
                )}
                {product.business && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Empresa:</span>
                    <Link
                      href={`/businesses/${product.business.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      {product.business.name}
                    </Link>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              {whatsappUrl ? (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.966 14.12 .943 11.498.943c-5.43 0-9.852 4.367-9.855 9.8.001 1.75.474 3.457 1.378 4.969l-.952 3.477 3.56-.922c1.474.808 3.037 1.229 4.418 1.229zm11.367-7.643c-.302-.15-1.78-.88-2.057-.98-.277-.1-.478-.15-.678.15-.2.3-.778.98-.95 1.18-.173.2-.347.225-.648.075-.302-.15-1.274-.47-2.428-1.495-.898-.802-1.505-1.793-1.682-2.093-.177-.3-.019-.462.13-.612.135-.135.302-.35.454-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.678-1.635-.93-2.245-.244-.595-.491-.513-.678-.523-.175-.008-.375-.01-.576-.01-.2 0-.527.075-.802.375-.278.3-1.06 1.037-1.06 2.532s1.088 2.943 1.24 3.143c.15.2 2.14 3.268 5.18 4.578.723.311 1.288.498 1.729.638.727.23 1.389.198 1.912.12.583-.087 1.78-.727 2.03-1.427.25-.7.25-1.299.175-1.427-.075-.125-.275-.2-.575-.35z" />
                    </svg>
                    Contactar no WhatsApp
                  </Button>
                </a>
              ) : (
                <Button className="w-full bg-gray-400 cursor-not-allowed text-white font-bold py-3.5 rounded-xl" disabled>
                  Contacto indisponível
                </Button>
              )}
            </Card>

            {/* Seller Trust Card */}
            {seller && (
              <Card padding="md" className="border-t-4 border-t-primary-500">
                <h2 className="text-lg font-bold text-gray-950 mb-4 flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Informação do Vendedor
                </h2>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-lg">
                    {seller.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-950 text-base">{seller.name}</h3>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {seller.accountType === 'BUSINESS' ? 'Empresa / Negócio' : 'Particular / Individual'}
                    </span>
                  </div>
                </div>

                {/* Verification badges */}
                <div className="space-y-2.5 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${seller.emailVerified ? 'bg-green-500' : 'bg-gray-200'}`}>
                      ✓
                    </span>
                    <span className={seller.emailVerified ? 'text-gray-900 font-medium' : 'text-gray-400 font-medium'}>
                      E-mail verificado
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${seller.phoneVerified ? 'bg-green-500' : 'bg-gray-200'}`}>
                      ✓
                    </span>
                    <span className={seller.phoneVerified ? 'text-gray-900 font-medium' : 'text-gray-400 font-medium'}>
                      Telefone verificado
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${seller.idVerified ? 'bg-green-500' : 'bg-gray-200'}`}>
                      ✓
                    </span>
                    <span className={seller.idVerified ? 'text-gray-900 font-medium' : 'text-gray-400 font-medium'}>
                      Identidade verificada
                    </span>
                  </div>
                  {seller.businessVerified && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-green-500">
                        ✓
                      </span>
                      <span className="text-gray-900 font-medium">
                        Negócio verificado
                      </span>
                    </div>
                  )}
                </div>

                {/* Seller Trust Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="block text-xs text-gray-500 font-medium mb-1">Membro desde</span>
                    <span className="font-bold text-gray-900 text-sm">
                      {new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(seller.createdAt))}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="block text-xs text-gray-500 font-medium mb-1">Anúncios ativos</span>
                    <span className="font-extrabold text-gray-900 text-lg">
                      {seller._count?.products || 0}
                    </span>
                  </div>
                </div>
              </Card>
            )}

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-black text-gray-950 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Card key={relProduct.id} hover className="flex flex-col group overflow-hidden">
                  <Link href={`/products/${relProduct.id}`} className="block mb-2">
                    {relProduct.images && relProduct.images[0] ? (
                      <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-3 overflow-hidden">
                        <img
                          src={relProduct.images[0]}
                          alt={relProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <h3 className="font-bold text-gray-950 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {relProduct.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-grow">
                    {relProduct.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span className="text-base font-extrabold text-primary-600">
                      {new Intl.NumberFormat('pt-AO', {
                        style: 'currency',
                        currency: relProduct.currency,
                      }).format(relProduct.price)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600">
                      {relProduct.category}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

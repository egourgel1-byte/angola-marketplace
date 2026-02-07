import { notFound } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

async function getBusinessBySlug(slug: string) {
  try {
    const businesses = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/businesses`, {
      cache: 'no-store',
    }).then(res => res.json())

    const business = businesses.data?.businesses?.find((b: any) => b.slug === slug)
    
    if (!business) return null

    const fullBusiness = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/businesses/${business.id}`,
      { cache: 'no-store' }
    ).then(res => res.json())

    return fullBusiness.data
  } catch (error) {
    return null
  }
}

export default async function BusinessProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const business = await getBusinessBySlug(params.slug)

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {business.coverImage && (
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg mb-8 overflow-hidden">
            <img
              src={business.coverImage}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <div className="flex items-start gap-4 mb-6">
                {business.logo && (
                  <img
                    src={business.logo}
                    alt={business.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                      {business.category}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {business.city}, {business.country}
                    </span>
                    {business.isVerified && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-700 whitespace-pre-line">{business.description}</p>
              </div>
            </Card>

            {business.products && business.products.length > 0 && (
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Products & Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {business.products.map((product: any) => (
                    <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {product.images && product.images[0] && (
                        <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary-600">
                          {new Intl.NumberFormat('pt-AO', {
                            style: 'currency',
                            currency: product.currency,
                          }).format(product.price)}
                        </span>
                        {product.isService && (
                          <span className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                            Service
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900">{business.location}</p>
                  <p className="text-gray-900">{business.city}, {business.country}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a href={`tel:${business.phone}`} className="text-primary-600 hover:text-primary-700">
                    {business.phone}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <a href={`mailto:${business.email}`} className="text-primary-600 hover:text-primary-700">
                    {business.email}
                  </a>
                </div>

                {business.website && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Website</p>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {business.whatsapp && (
                  <a
                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Contact on WhatsApp
                    </Button>
                  </a>
                )}
              </div>

              <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                <p>{business.views || 0} profile views</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

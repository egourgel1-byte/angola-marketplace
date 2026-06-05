const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting data migration to map product owners...')
  
  // Find all products that currently do not have an ownerId but have a businessId
  const products = await prisma.product.findMany({
    include: {
      business: true
    }
  })

  console.log(`Found ${products.length} products to migrate.`)

  let migratedCount = 0

  for (const product of products) {
    if (product.business && product.business.ownerId) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          ownerId: product.business.ownerId
        }
      })
      migratedCount++
    } else {
      console.warn(`Product ${product.id} (${product.name}) has no business or business has no owner. Skipping.`)
    }
  }

  console.log(`Successfully migrated ${migratedCount} products.`)
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

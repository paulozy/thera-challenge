import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const products = [
    {
      barcode: '1234567890123',
      name: 'Laptop Pro 15"',
      category: 'Electronics',
      description: 'High-performance laptop for professionals.',
      price: 1499.99,
      stock: 50,
    },
    {
      barcode: '2345678901234',
      name: 'Wireless Mouse',
      category: 'Accessories',
      description: 'Ergonomic wireless mouse with long battery life.',
      price: 49.99,
      stock: 200,
    },
    {
      barcode: '3456789012345',
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      description: 'RGB mechanical keyboard with customizable switches.',
      price: 129.99,
      stock: 100,
    },
    {
      barcode: '4567890123456',
      name: '4K Monitor 27"',
      category: 'Electronics',
      description: 'Ultra-sharp 4K monitor with vibrant colors.',
      price: 399.99,
      stock: 75,
    },
    {
      barcode: '5678901234567',
      name: 'USB-C Hub',
      category: 'Accessories',
      description:
        '7-in-1 USB-C hub with HDMI, SD card reader, and USB 3.0 ports.',
      price: 59.99,
      stock: 150,
    },
  ];

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

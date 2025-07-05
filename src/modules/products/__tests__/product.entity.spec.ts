import { Product } from '../entities/product.entity';

describe('Product Entity', () => {
  it('should be able to create a product', () => {
    const product = Product.create({
      name: 'Laptop',
      barcode: '123456789',
      category: 'Electronics',
      description: 'Powerful laptop',
      price: 1200.00,
      stock: 50,
    });

    expect(product).toBeInstanceOf(Product);
    expect(product.name).toBe('Laptop');
    expect(product.barcode).toBe('123456789');
    expect(product.category).toBe('Electronics');
    expect(product.description).toBe('Powerful laptop');
    expect(product.price).toBe(1200.00);
    expect(product.stock).toBe(50);
    expect(product.id).toBeDefined();
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it('should be able to update product properties', () => {
    const product = Product.create({
      name: 'Laptop',
      barcode: '123456789',
      category: 'Electronics',
      description: 'Powerful laptop',
      price: 1200.00,
      stock: 50,
    });

    product.name = 'Gaming Laptop';
    product.price = 1500.00;
    product.stock = 45;

    expect(product.name).toBe('Gaming Laptop');
    expect(product.price).toBe(1500.00);
    expect(product.stock).toBe(45);
  });

  it('should return a JSON representation', () => {
    const product = Product.create({
      name: 'Laptop',
      barcode: '123456789',
      category: 'Electronics',
      description: 'Powerful laptop',
      price: 1200.00,
      stock: 50,
    });

    const productJson = product.toJSON();

    expect(productJson).toEqual({
      id: product.id,
      name: 'Laptop',
      barcode: '123456789',
      category: 'Electronics',
      description: 'Powerful laptop',
      price: 1200.00,
      stock: 50,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  });
});

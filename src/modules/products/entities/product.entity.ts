import { BaseEntity } from 'src/@shared/entities/base.entity';

export type ProductProps = {
  id?: string;
  barcode: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Product extends BaseEntity {
  private _name: string;
  private _barcode: string;
  private _category: string;
  private _description: string;
  private _price: number;
  private _stock: number;

  private constructor({
    id,
    barcode,
    name,
    category,
    description,
    price,
    stock,
    createdAt,
    updatedAt,
  }: ProductProps) {
    super({ id, createdAt, updatedAt });

    this._barcode = barcode;
    this._name = name;
    this._category = category;
    this._description = description;
    this._price = price;
    this._stock = stock;
  }

  static create(props: ProductProps): Product {
    return new Product(props);
  }

  get name(): string {
    return this._name;
  }

  get barcode(): string {
    return this._barcode;
  }

  get category(): string {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }

  public decreaseStock(qty: number) {
    this._stock -= qty;
  }

  public toJSON() {
    return {
      id: this.id,
      barcode: this.barcode,
      name: this.name,
      category: this.category,
      description: this.description,
      price: this.price,
      stock: this.stock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

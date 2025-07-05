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

  set name(value: string) {
    this._name = value;
  }

  get barcode(): string {
    return this._barcode;
  }

  set barcode(value: string) {
    this._barcode = value;
  }

  get category(): string {
    return this._category;
  }

  set category(value: string) {
    this._category = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }

  get stock(): number {
    return this._stock;
  }

  set stock(value: number) {
    this._stock = value;
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

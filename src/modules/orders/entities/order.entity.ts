import { BaseEntity } from 'src/@shared/entities/base.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled',
}

export type OrderProps = {
  id?: string;
  userId: string;
  products: OrderItem[];
  total: number;
  status?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
};

export class Order extends BaseEntity {
  private _userId: string;
  private _products: OrderItem[];
  private _total: number;
  private _status: OrderStatus;

  private constructor({
    id,
    userId,
    products,
    status,
    total,
    createdAt,
    updatedAt,
  }: OrderProps) {
    super({ id, createdAt, updatedAt });

    this._userId = userId;
    this._products = products;
    this._status = status ?? OrderStatus.PENDING;
    this._total = total;
  }

  static create(props: OrderProps): Order {
    return new Order(props);
  }

  get userId(): string {
    return this._userId;
  }

  get products(): OrderItem[] {
    return this._products;
  }

  get total(): number {
    return this._total;
  }

  get status(): OrderStatus {
    return this._status;
  }

  set status(status: OrderStatus) {
    this._status = status;
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      products: this.products,
      total: this.total,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

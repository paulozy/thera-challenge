import { BaseEntity } from 'src/@shared/entities/base.entity';

export type UserProps = {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User extends BaseEntity {
  private _name: string;
  private _email: string;
  private _password: string;

  private constructor({
    id,
    name,
    email,
    password,
    createdAt,
    updatedAt,
  }: UserProps) {
    super({ id, createdAt, updatedAt });

    this._name = name;
    this._email = email;
    this._password = password;
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { compare as bcryptCompare, hash } from 'bcrypt';
import { HasherGatewayInterface } from 'src/@shared/infra/gateways/hasher.gateway';

@Injectable()
export class BcryptHasherGateway implements HasherGatewayInterface {
  async hash(value: string): Promise<string> {
    const hashedValue = await hash(value, 12);
    return hashedValue;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    const isMatch = bcryptCompare(value, hashedValue);
    return isMatch;
  }
}

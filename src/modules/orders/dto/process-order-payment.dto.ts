import { IsEnum, IsString } from 'class-validator';

export enum PaymentStatus {
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled',
}

export class ProcessOrderPaymentDto {
  @IsString()
  orderId: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}

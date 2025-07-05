import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { GatewayModule } from './infra/gateways/gateway.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, DatabaseModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

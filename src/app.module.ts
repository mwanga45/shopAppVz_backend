import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stock/stock.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SalesModule } from './sales/sales.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DebtModule } from './debt/debt.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    StockModule,
    DashboardModule,
    SalesModule,
    ProductModule,
    OrderModule,
    DebtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

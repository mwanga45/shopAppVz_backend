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
import { SmsModule } from './sms/sms.module';
import { ProfitDevController } from './profit_dev/profit_dev.controller';
import { ProfitDevService } from './profit_dev/profit_dev.service';
import { ProfitDevModule } from './profit_dev/profit_dev.module';


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
    SmsModule,
    ProfitDevModule,
    ProfitDevModule
  ],
  controllers: [AppController, ProfitDevController],
  providers: [AppService, ProfitDevService],
})
export class AppModule {}

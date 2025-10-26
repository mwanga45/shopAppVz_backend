import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import { ProfitDevService } from './profit_dev.service';
import { ProfitDevController } from './profit_dev.controller';
import { WholeSales } from 'src/sales/entities/wholesale.entity';
import { RetailSales } from 'src/sales/entities/retailsale.entity';
import { Debt_track } from 'src/debt/entities/debt.entity';
import { Debt } from 'src/debt/entities/debt.entity';
import { Stock } from 'src/stock/entities/stock.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([DailyProfitsummary, WholeSales, RetailSales, Debt_track, Debt, Stock])
    ],
    providers:[ProfitDevService],
    controllers:[ProfitDevController]

})
export class ProfitDevModule {}

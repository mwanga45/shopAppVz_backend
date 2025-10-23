import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';
import { ProfitDevService } from './profit_dev.service';
import { ProfitDevController } from './profit_dev.controller';

@Module({
    imports:[
        TypeOrmModule.forFeature([DailyProfitsummary])
    ],
    providers:[ProfitDevService],
    controllers:[ProfitDevController]

})
export class ProfitDevModule {}

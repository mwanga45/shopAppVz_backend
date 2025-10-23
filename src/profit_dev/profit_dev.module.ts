import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyProfitsummary } from 'src/sales/entities/profitsummary.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([DailyProfitsummary])
    ]
})
export class ProfitDevModule {}

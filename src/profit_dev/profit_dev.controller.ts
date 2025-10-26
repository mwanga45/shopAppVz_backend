import { Controller, Get } from '@nestjs/common';
import { ProfitDevService } from './profit_dev.service';

@Controller('profit-dev')
export class ProfitDevController {
  constructor (private readonly ProfitDevservice:ProfitDevService){}  

  @Get('profit')
  Getprofit(){
    return this.ProfitDevservice.AdminAnalysis()
  }
  @Get('dash')
  GetDashinfo(){
    return this.ProfitDevservice.DashboardResult()
  }
  @Get('graph')
  GetghaphData(){
    return this.ProfitDevservice.GraphDataAndPeformanceRate()
  }
}

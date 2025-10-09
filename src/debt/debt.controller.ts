import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post('create_Debt')
  CreateDebt(@Request()  req, @Body()dto:CreateDebtDto){
    const  userId = req.user.userId
    return  this.debtService.CreateDept(dto, userId)
  }
  @Patch(':id')
  UpdateDebt(@Param('id') id:number , @Request() req , @Body() dto:UpdateDebtDto){
    const userId =  req.user.userId
    return this.debtService.UpdateDebt(dto, userId, +id)
  }
  
  
}

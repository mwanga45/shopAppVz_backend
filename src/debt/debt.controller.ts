import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}
   
  @UseGuards(AuthGuard('jwt'))
  @Post('create_Debt')
  CreateDebt(@Request()  req, @Body()dto:CreateDebtDto){
    const  userId = req.user.userId
    return  this.debtService.CreateDept(dto, userId)
  }

  @Get('alldebt')
  ReturnDebt(){
    return this.debtService.returndebt()
  }
  @Get('debtinfo')
  ReturnDebtInfo(){
    return  this .debtService.ReturnDebtInfo()
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  UpdateDebt(@Param('id') id:number , @Request() req , @Body() dto:UpdateDebtDto){
    const userId =  req.user.userId
    return this.debtService.UpdateDebt(dto, userId, +id)
  }
  
  
}

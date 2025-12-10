import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, HttpCode } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSaleDto, SalesResponseDto, Updatesales_Dto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

@UseGuards(AuthGuard('jwt'))
@Post('createsales')
async Addsales(@Request() req,  @Body () dto:CreateSaleDto){
  const userId  = req.user.userId
  return await this.salesService.SaleRecord(dto, userId)
}
@UseGuards(AuthGuard('jwt'))
@Post('updatesales')
async UpdatesalesPending(@Request() req, @Body() dto:Updatesales_Dto){
  const userId  = req.user.userId
  return await this.salesService.UpdateSales(dto,userId)
}

@Post('salesInfo')
@HttpCode(200)
 async SaleInfoResponse(@Body() Dto:SalesResponseDto){
  return await this.salesService.SaleResponse(Dto)
 }

@Post('updatePending')
async PendingUpdate(@Body())
@Get('salesAnalysis')
async SalesAnalys(){
  return await  this.salesService.TodaySaleAnalysis()
}
@Get('salesToday')
async SaleToday(){
  return await this.salesService.SalesRecordToday()
}

@Get(':id')
async Getproduct(@Param('id')productId:string){
  const id = Number(productId)
  return this.salesService.CheckDiscountCalculate(id,20)
}




}

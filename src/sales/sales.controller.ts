import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, HttpCode } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSaleDto, SalesResponseDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

@UseGuards(AuthGuard('jwt'))
@Post('createsales')
async Addsales(@Request() req,  @Body () dto:CreateSaleDto){
  const userId  = req.user.userId
  return await this.salesService.SaleRecord(dto, userId)
}

@Post('salesInfo')
@HttpCode(200)
 async SaleInfoResponse(@Body() Dto:SalesResponseDto){
  return await this.salesService.SaleResponse(Dto)
 }


@Get('salesAnalysis')
async SalesAnalys(){
  return await  this.salesService.TodaySaleAnalysis()
}

@Get(':id')
async Getproduct(@Param('id')productId:string){
  const id = Number(productId)
  
  return this.salesService.CheckDiscountCalculate(id,20)
}




}

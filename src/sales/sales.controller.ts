import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req, HttpCode } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateSaleDto, SalesResponseDto } from './dto/create-sale.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

@Get(':id')
async Getproduct(@Param('id')productId:string){
  const id = Number(productId)
  
  return this.salesService.CheckDiscountCalculate(id,20)
}
@Post('salesInfo')
@HttpCode(200)
 async SaleInfoResponse(@Body() Dto:SalesResponseDto){
  return await this.salesService.SaleResponse(Dto)
 }
 
@Post('createProduct')
async Addsales(@Body () dto:CreateSaleDto){
  return await this.salesService.SaleRecord(dto)
}


}

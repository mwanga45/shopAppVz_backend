import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

@Get(':id')
async Getproduct(@Param('id')productId:string){
  const id = Number(productId)
  const Amunt = 60
  return this.salesService.StockCheck(id, 10)
}


}

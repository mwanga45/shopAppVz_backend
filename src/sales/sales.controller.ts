import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateRetailsalesDto, CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

}

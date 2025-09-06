import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('recwholesale')
  async Wholesales(
    @Request() req,
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<any> {
    const userId = req.user.userId; 
    return this.salesService.Whole_Sales_Record(createSaleDto, userId);
  }
  @Get('wholesales')
  WholesalesInfo(){
    return this.salesService.Wholesale()
  }
  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get('retailsale')
  RetailsalesInfo() {
    return this.salesService.RetailsSales();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

}

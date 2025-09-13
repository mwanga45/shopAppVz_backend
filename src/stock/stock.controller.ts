import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Post("create")
  create(@Request() req, @Body() createStockDto: CreateStockDto) {
    const userId = req.user.userId
    return this.stockService.createStockRec(createStockDto, userId);
  }

  @Get("remain")
  findAll() {
    return this.stockService.findAll();
  }
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Get('prInfo')
  getProductInfo(){
    return this.stockService.findProductInfo()
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockService.remove(+id);
  }
}

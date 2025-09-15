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
  // @UseGuards(AuthGuard('jwt'))
  @Get('stock_result')
  getStockResult(){
    return this.stockService.returnStockInfo()
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.stockService.findOne(+id);
  // }
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Patch()
  update(@Request() req ,@Body() updateStockDto: UpdateStockDto) {
    const  userId  = req.user.UserId
    return this.stockService.updateStock(updateStockDto,userId); // Removed 'id' parameter
  }


}

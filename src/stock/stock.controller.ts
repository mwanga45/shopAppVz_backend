import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
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
  
  @Get('test')
  async Test(){
    return await this.stockService.Test()
  }
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Post("update")
  updateStock(@Request() req ,@Body() updateStockDto: UpdateStockDto) {
    console.log("USER Request", req.user.sub)
    const  userId  = req.user.userId
    return this.stockService.updateStock(updateStockDto,userId); 
  }
}

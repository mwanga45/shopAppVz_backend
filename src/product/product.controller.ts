import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query,Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto,CreateProductDiscDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';
import { useContainer } from 'class-validator';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post("create")
  @HttpCode(201)
  create(@Request() req,@Body() createProductDto: CreateProductDto) {
    const userId = req.user.userId
    return this.productService.create(createProductDto,userId);
  }
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('update')
  Updateproduct(@Request() req ,@Body() dto:UpdateProductDto){
    const userId = req.user.userId
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('getproduct')
  findAll(@Query('category') category?: string, @Query('type') type?: string) {
    return this.productService.findAll({ category, type });
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('discount')
  @HttpCode(200)
  Create_Disc(@Request() req,@Body() DiscDto:CreateProductDiscDto){
    const userId = req.user.userId
    return  this.productService.ProductAsignDisc(DiscDto, userId)
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('Disc_result')
   async ReturnDisc (){
    return await this.productService.ReturnDiscount()
  }
  @Get('salesInfo')
  async ReturnInfoProduct(){
    return await this.productService.SalesProductInfo()
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('spec/:id')
  async SpecRec(@Param('id') id:string){
     return  await this.productService.SpecDiscount(id)
  }
  
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Patch(':id')
  updateProduct(@Param('id')id:number,
  @Body()updateDto:UpdateProductDto){
    return this.productService.updateproduct(+id,updateDto)
  }
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  Removeproduct(@Param('id') id: number) {
    return this.productService.Removeproduct(+id);
  }
}

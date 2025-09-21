import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query,Request } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto,CreateProductDiscDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post("create")
  @HttpCode(201)
  create(@Request() req,@Body() createProductDto: CreateProductDto) {
    const userId = req.user.userId
  return this.productService.create(createProductDto,userId);
    }edit_prod

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('edit_prod')
  Updateproduct(@Request() req , @Body() Dto:UpdateProductDto){
   const user_id = req.user.userId 
   this.productService.updateproduct(user_id, Dto)
  
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('getproduct')
  findAll(@Query('category') category?: string, @Query('type') type?: string) {
    return this.productService.findAll({ category, type });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('discount')
  Create_Disc(@Request () req ,@Body() DiscDto:CreateProductDiscDto){
    const  user_id = req.user.userId
    return  this.productService.ProductAsignDisc(DiscDto, user_id)
  }
  

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
  
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Patch(':id')
  updateProduct(@Param('id')id:number,
  @Body()updateDto:UpdateProductDto){
    this.productService.updateproduct(id,updateDto)
  }
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  Removeproduct(@Param('id') id: number) {
    return this.productService.Removeproduct(+id);
  }
}

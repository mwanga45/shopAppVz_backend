import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/guard/role.guard';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}

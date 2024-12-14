import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/libs/pagination/pagination';
import { Public } from '../auth/strategy/public-strategy';
import { CurrentUser } from '../user/decorator/user.decorator';
import { Customer } from '../customer/entities/customer.entity';

@Public()
@Controller('products/')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create( @CurrentUser() customer: Customer,  @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(customer, createProductDto);
  }

  @Get()
  findAll(@Query() data: PaginationDto) {
    return this.productsService.findAll(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

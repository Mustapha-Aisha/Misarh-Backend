import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderedProductDto } from './dto/create-ordered-product.dto';
import { UpdateOrderedProductDto } from './dto/update-ordered-product.dto';
import { BaseResponse } from 'src/libs/response/base_response';
import { HttpStatus } from '@nestjs/common';
import { OrderedProductEntity } from './entities/ordered-product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class OrderedProductsService {
  constructor(
    @InjectRepository(OrderedProductEntity)
    private readonly orderedProductRepository: Repository<OrderedProductEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(createOrderedProductDto: CreateOrderedProductDto): Promise<BaseResponse<OrderedProductEntity>> {
    try {
      const order = await this.orderedProductRepository.findOne({ where: { id: createOrderedProductDto.order } });
      const product = await this.productRepository.findOne({ where: { id: createOrderedProductDto.product } });

      if (!order || !product) {
        return BaseResponse.error('Order or Product not found', null, HttpStatus.BAD_REQUEST);
      }

      const newOrderedProduct = this.orderedProductRepository.create({
        order: order,
        product: product,
        quantity: createOrderedProductDto.quantity,
      });

      const savedOrderedProduct = await this.orderedProductRepository.save(newOrderedProduct);

      return BaseResponse.success(savedOrderedProduct, 'Ordered product created successfully', HttpStatus.CREATED);
    } catch (error) {
      console.error(error);
      return BaseResponse.error('Error creating ordered product', null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find all OrderedProducts
  async findAll(): Promise<BaseResponse<OrderedProductEntity[]>> {
    try {
      const orderedProducts = await this.orderedProductRepository.find();
      if (!orderedProducts.length) {
        return BaseResponse.error("No ordered products found", [], HttpStatus.NOT_FOUND);
      }
      return BaseResponse.success(orderedProducts, "Ordered products retrieved successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("Error fetching ordered products", [], HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find a single OrderedProduct by ID
  async findOne(id: string): Promise<BaseResponse<OrderedProductEntity>> {
    try {
      const orderedProduct = await this.orderedProductRepository.findOne({ where: { id } });
      if (!orderedProduct) {
        return BaseResponse.error("Ordered product not found", null, HttpStatus.NOT_FOUND);
      }
      return BaseResponse.success(orderedProduct, "Ordered product retrieved successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("Error fetching ordered product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update an OrderedProduct by ID
  async update(id: string, updateOrderedProductDto: UpdateOrderedProductDto): Promise<BaseResponse<OrderedProductEntity>> {
    try {
      let orderedProduct = await this.orderedProductRepository.findOne({ where: { id: id } });
      
      if (!orderedProduct) {
        return BaseResponse.error("Ordered product not found", null, HttpStatus.NOT_FOUND);
      }
  
      let productEntity: ProductEntity = orderedProduct.product; 
      if (updateOrderedProductDto.product) {
        productEntity = await this.productRepository.findOne({ where: { id: updateOrderedProductDto.product } });
        if (!productEntity) {
          return BaseResponse.error("Product not found", null, HttpStatus.NOT_FOUND);
        }
      }
      let orderEntity: OrderEntity = orderedProduct.order; 
      if (updateOrderedProductDto.order) {
        orderedProduct = await this.orderedProductRepository.findOne({ where: { id: updateOrderedProductDto.order } });
        if (!orderEntity) {
          return BaseResponse.error("Order not found", null, HttpStatus.NOT_FOUND);
        }
      }
  
      // Update the ordered product with the fetched entities and save it
      const updatedOrderedProduct = await this.orderedProductRepository.save({
        ...orderedProduct,
        product: productEntity,
        order: orderEntity,
      });
  
      return BaseResponse.success(updatedOrderedProduct, "Ordered product updated successfully", HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error("Error updating ordered product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  // Delete an OrderedProduct by ID
  async remove(id: string): Promise<BaseResponse<void>> {
    try {
      const orderedProduct = await this.orderedProductRepository.findOne({ where: { id } });
      if (!orderedProduct) {
        return BaseResponse.error("Ordered product not found", null, HttpStatus.NOT_FOUND);
      }

      await this.orderedProductRepository.delete(id);
      return BaseResponse.success(null, "Ordered product removed successfully", HttpStatus.OK);
    } catch (error) {
      return BaseResponse.error("Error removing ordered product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

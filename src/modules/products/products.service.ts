import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { BaseResponse } from 'src/libs/response/base_response';
import { PaginationDto } from 'src/libs/pagination/pagination';
import { AIAgent } from 'src/libs/external.api/misarh';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private ai: AIAgent
  ) { }

  // Create a new product
  async create(customer: Customer, data: CreateProductDto): Promise<BaseResponse<ProductEntity>> {
      const queryRunner = this.productRepository.manager.connection.createQueryRunner();
      await queryRunner.startTransaction();
      try {
        const product = this.productRepository.create(data);
        await queryRunner.manager.save(product);

        let aiResponseData = await this.ai.generateScentProfile(product.scentDescription);
        console.log(aiResponseData);

        product.categoryId;
        product.discount;
        product.image_url;
        product.notes = aiResponseData.Notes
        product.mixDetails = aiResponseData['Mix Details'];
        product.resultingScentProfile = aiResponseData["Resulting Scent Profile"];
        product.scentNotes = aiResponseData["Scent Notes"];
        product.name = aiResponseData.Name;
        product.scentType;
        product.price;
        product.variation;
        product.otherCombinations = aiResponseData["Other Combinations"]

        console.log(product)

        await queryRunner.manager.save(product);
        await queryRunner.commitTransaction();
      
        return BaseResponse.success(product, "Product created successfully", HttpStatus.CREATED);
      
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error(error);
        return BaseResponse.error("An error occurred while creating the product", null, HttpStatus.INTERNAL_SERVER_ERROR);
      } finally {
        await queryRunner.release();
      }
  }
  
  

  //TODO: fix pagination and cache
  async findAll(data: PaginationDto): Promise<BaseResponse<ProductEntity[]>> {
    try {
      const pageSize = parseInt(data.limit, 10) || 10;
      const currentPage = parseInt(data.page, 10) || 1;
      const skip = (currentPage - 1) * pageSize;


      // const where = {};
      // if (data.name) where['name'] = data.name;
      // if (data.start_date && data.end_date) {
      //   where['created_at'] = {
      //     $gte: data.start_date,
      //     $lte: data.end_date,
      //   };
      // }
      // if (data.type) where['type'] = data.type;
      // if (data.keywords) where['keywords'] = data.keywords;

      // const [products, total] = await this.productRepository.findAndCount({
      //   where,
      //   skip,
      //   take: pageSize,
      // });

      // if (products.length === 0) {
      //   return BaseResponse.error("No products found", [], HttpStatus.NO_CONTENT);
      // }

      const query = this.productRepository.createQueryBuilder().offset(skip).limit(pageSize);
      console.log(await query.getCount());
      const products = await query.getMany();

      return BaseResponse.success(products, "Products retrieved successfully", HttpStatus.OK);
    } catch (error) {
      console.error("Error fetching products:", error);
      return BaseResponse.error("An error occurred while fetching the products", [], HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find a single product by ID
  async findOne(id: string): Promise<BaseResponse<ProductEntity>> {
    try {
      const product = await this.productRepository.findOne({ where: { id: id } });
      if (!product) {
        return BaseResponse.error("Product not found", null, HttpStatus.NOT_FOUND);
      }
      return BaseResponse.success(product, "Product retrieved successfully", HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error("An error occurred while fetching the product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Update product by ID
  async update(id: string, data: UpdateProductDto): Promise<BaseResponse<ProductEntity>> {
    try {
      const existingProduct = await this.productRepository.findOne({ where: { id: id } });
      if (!existingProduct) {
        return BaseResponse.error("Product not found", null, HttpStatus.NOT_FOUND);
      }
      await this.productRepository.update(id, data);
      const updatedProduct = await this.productRepository.findOne({ where: { id: id } });
      return BaseResponse.success(updatedProduct, "Product updated successfully", HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error("An error occurred while updating the product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Soft delete (mark as deleted) a product by ID
  async remove(id: string): Promise<BaseResponse<void>> {
    try {
      const existingProduct = await this.productRepository.findOne({ where: { id: id } });
      if (!existingProduct) {
        return BaseResponse.error("Product not found", null, HttpStatus.NOT_FOUND);
      }
      await this.productRepository.update(id, { is_deleted: true });
      return BaseResponse.success(null, "Product deleted successfully", HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error("An error occurred while removing the product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Permanently delete a product by ID
  async delete(id: string): Promise<BaseResponse<void>> {
    try {
      const existingProduct = await this.productRepository.findOne({ where: { id: id } });
      if (!existingProduct) {
        return BaseResponse.error("Product not found", null, HttpStatus.NOT_FOUND);
      }
      await this.productRepository.delete(id);
      return BaseResponse.success(null, "Product deleted permanently", HttpStatus.OK);
    } catch (error) {
      console.error(error);
      return BaseResponse.error("An error occurred while deleting the product", null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}

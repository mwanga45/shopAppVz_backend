import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRetailsalesDto, CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { WholeSales } from './entities/wholesale.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { RetailSales } from './entities/retailsale.entity';
import { NotFoundException } from '@nestjs/common';
import { SalesHelper } from 'src/common/helper/sales.helper';
import { ResponseType } from 'src/type/type.interface';


@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Product) private readonly ProductRepository:Repository<Product>,
    @InjectRepository(WholeSales) private readonly WholesalesRepository:Repository<WholeSales>,
    @InjectRepository(RetailSales) private readonly RetailsalesRepository:Repository<RetailSales>,
    private readonly SalesHelper:SalesHelper,
    // private readonly stockupdate:StockUpdateHelper ,
  ){}
  create(createSaleDto: CreateSaleDto) {
    return 'This action adds a new sale';
  }

  findAll() {
    return `This action returns all sales`;
  }


 
  
  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
  async ProfitCalc(Total_litre_kg:string,product_id:string):Promise<any>{
    const AmountperEach = await this.ProductRepository.createQueryBuilder('p')
  }
  timetest():any{
    const date = new Date()
    const yy = String(date.getFullYear())
    const dd = String(date.getDay()).padStart(2 ,'0')
    const mm = String(date.getMonth()+1).padStart(2,'0')
    const fulldate = yy.concat(".",mm,".",dd)
    return fulldate
  }
}
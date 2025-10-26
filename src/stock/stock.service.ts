import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Stock_transaction } from './entities/stock.entity';
import { product_type, category } from 'src/type/type.interface';
import { EntityManager, Repository } from 'typeorm';
import { ResponseType } from 'src/type/type.interface';
import { StockType, ChangeType } from 'src/type/type.interface';
import { Product } from 'src/product/entities/product.entity';
// import { StockUpdateHelper } from 'src/common/helper/stockUpdate,helper';
// import { WebSocketSubjectConfig } from 'rxjs/webSocket';
@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Stock_transaction)
    private readonly recstockRepo: Repository<Stock_transaction>,
    // private readonly stockhelper:StockUpdateHelper,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createStockRec(
    Dto: CreateStockDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    // const checkExistence = await this.stockRepo.exists({
    //   where:{product:{id:Number(Dto.product_id)}, product_category:Dto.product_category}
    // })
    const product = await this.productRepo.findOne({
      where: { id: Number(Dto.product_id) },
    });

    if (!product) {
      return {
        message: 'Cannot  create  stock for the product which is not Exist ',
        success: true,
      };
    }
    //check if  the product_id is already  in stock table
    const stock_product = await this.stockRepo.findOne({
      where: { product: { id: Number(Dto.product_id) } },
    });
    if (stock_product) {
      return {
        message:
          'Please go to the Stock to make update  the product is already been initiated  stock ',
        success: false,
      };
    }

    const stockRec = this.stockRepo.create({
      product: { id: Number(Dto.product_id) },
      Total_stock: Number(Dto.total_stock),
      product_category: Dto.product_category,
      user: { id: userId },
    });
    const reason = 'Register New product';
    this.stockRepo.save(stockRec);
    const QueryStockTrans = this.recstockRepo.create({
      product: { id: Number(Dto.product_id) },
      product_category: Dto.product_category,
      new_stock: Number(Dto.total_stock),
      Quantity: Number(Dto.total_stock),
      user: { id: userId },
      Reasons: reason,
    });
    this.recstockRepo.save(QueryStockTrans);
    return {
      success: true,
      message: 'Successfuly register the product and make follow up',
    };
  }
  async findProductInfo(): Promise<any> {
    const getWholesalesquery = this.productRepo
      .createQueryBuilder('p')
      .select(['p.id', 'p.product_name', 'p.product_category'])
      .where('p.product_category = :category', {
        category: category.wholesales,
      });
    const ForWholesales = await getWholesalesquery
      .orderBy('p.product_name', 'ASC')
      .getMany();

    const getRetailsalesquery = this.productRepo
      .createQueryBuilder('p')
      .select(['p.id', 'p.product_name', 'p.product_category'])
      .where('p.product_category = :category', {
        category: category.retailsales,
      });
    const ForRetailsales = await getRetailsalesquery
      .orderBy('p.product_name', 'ASC')
      .getMany();

    return {
      ForRetailsales,
      ForWholesales,
    };
  }
  async Test(): Promise<any> {
    const findTotal = await this.stockRepo
      .createQueryBuilder('s')
      .leftJoin('s.product', 'product')
      .select('s.Total_stock', 'total')
      .addSelect('p.product_name', 'product_name')
      .getRawMany();

    if (!findTotal) {
      return {
        success: false,
        message: 'Failed to find the targeted product',
      };
    }

    return {
      message: 'test',
      success: true,
      data: findTotal,
    };
  }

  async updateStock(
    updateStockDto: UpdateStockDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    if (updateStockDto.Method === ChangeType.ADD) {
      const findTotal = await this.stockRepo
        .createQueryBuilder('s')
        .select('s.Total_stock', 'total')
        .where('s.product_id = :product_id', {
          product_id: updateStockDto.product_id,
        })
        .getRawOne<{ total: number }>();
      if (!findTotal) {
        return {
          success: false,
          message: 'Failed  to find  the targeted product ',
        };
      }
      const FindSum = Number(findTotal.total) + updateStockDto.total_stock;

      const Updatestk = await this.stockRepo.update(
        { product: { id: updateStockDto.product_id } },
        {
          Total_stock: FindSum,
          user: { id: userId },
        },
      );

      const lastStockTransaction = await this.recstockRepo
        .createQueryBuilder('st')
        .select('st.new_stock', 'newStock')
        .where('st.product.id = :productId', {
          productId: updateStockDto.product_id,
        })
        .orderBy('st.CreatedAt', 'DESC')
        .getRawOne<{ newStock: number }>();

      const prevStockForNewTransaction = lastStockTransaction
        ? lastStockTransaction.newStock
        : 0;

      const updatestocktrans = this.recstockRepo.create({
        product: { id: updateStockDto.product_id },
        product_category: updateStockDto.product_category,
        type_Enum: StockType.IN,
        new_stock: FindSum,
        prev_stock: prevStockForNewTransaction,
        Quantity: updateStockDto.total_stock,
        Change_type: updateStockDto.Method,
        user: { id: userId },
        Reasons: updateStockDto.Reasons,
      });
      await this.recstockRepo.save(updatestocktrans);
      return {
        message: `Succefuly Update Stock ${FindSum}`,
        success: true,
      };
    } else if (updateStockDto.Method === ChangeType.REMOVE) {
      const findTotal = await this.stockRepo
        .createQueryBuilder('s')
        .select('s.Total_stock', 'total')
        .where('s.product_id = :product_id', {
          product_id: updateStockDto.product_id,
        })
        .getRawOne<{ total: number }>();

      if (!findTotal) {
        return {
          message: 'Failed to return total stock',
          success: false,
        };
      }
      const updateTotalstock =
        Number(findTotal.total) - updateStockDto.total_stock;
      if (updateTotalstock < 0) {
        return {
          message: 'can  not remove  stock below 0',
          success: false,
        };
      }
      const updatestock = await this.stockRepo.update(
        { product: { id: updateStockDto.product_id } },
        {
          Total_stock: updateTotalstock,
          user: { id: userId },
        },
      );
      const QueryStockTrans = await this.recstockRepo
        .createQueryBuilder('S')
        .select(['S.new_stock', 'S.prev_stock'])
        .where('S.product_id = :product_id', {
          product_id: updateStockDto.product_id,
        })
        .orderBy('S.CreatedAt', 'DESC')
        .getOne();
      if (!QueryStockTrans) {
        return {
          message: 'No record  of the product in Stock_trans table',
          success: false,
        };
      }
      const findNewstock =
        QueryStockTrans.new_stock - updateStockDto.total_stock;
      const newstocktrancrec = this.recstockRepo.create({
        user: { id: userId },
        Quantity: updateStockDto.total_stock,
        prev_stock: QueryStockTrans.new_stock,
        new_stock: findNewstock,
        product: { id: updateStockDto.product_id },
        type_Enum: StockType.OUT,
        product_category: updateStockDto.product_category,
        Change_type: ChangeType.REMOVE,
        Reasons: updateStockDto.Reasons,
      });
      this.recstockRepo.save(newstocktrancrec);
      return {
        message: 'Succesfuly Updatw Stock (reduce number stock)',
        success: true,
        data: { findNewstock, QueryStockTrans, updateTotalstock, findTotal },
      };
    }
    return {
      message: 'Fail to update Stock please try again',
      success: false,
    };
  }
  async updateStockTransactional(
    manager: EntityManager,
    updateStockDto: UpdateStockDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    // Get repository instances from manager (transaction-bound)
    const stockRepo = manager.getRepository(this.stockRepo.target);
    const recStockRepo = manager.getRepository(this.recstockRepo.target);

    try {
      if (updateStockDto.Method === ChangeType.ADD) {
        const findTotal = await stockRepo
          .createQueryBuilder('s')
          .select('s.Total_stock', 'total')
          .where('s.product_id = :product_id', {
            product_id: updateStockDto.product_id,
          })
          .getRawOne<{ total: number }>();

        if (!findTotal) {
          return {
            success: false,
            message: 'Failed to find the targeted product',
          };
        }

        const newStock = findTotal.total + updateStockDto.total_stock;

        await stockRepo.update(
          { product: { id: updateStockDto.product_id } },
          { Total_stock: newStock, user: { id: userId } },
        );

        const lastStockTransaction = await recStockRepo
          .createQueryBuilder('st')
          .select('st.new_stock', 'newStock')
          .where('st.product.id = :productId', {
            productId: updateStockDto.product_id,
          })
          .orderBy('st.CreatedAt', 'DESC')
          .getRawOne<{ newStock: number }>();

        const prevStockForNewTransaction = lastStockTransaction
          ? lastStockTransaction.newStock
          : 0;

        const updatestocktrans = recStockRepo.create({
          product: { id: updateStockDto.product_id },
          product_category: updateStockDto.product_category,
          type_Enum: StockType.IN,
          new_stock: newStock,
          prev_stock: prevStockForNewTransaction,
          Quantity: updateStockDto.total_stock,
          Change_type: updateStockDto.Method,
          user: { id: userId },
          Reasons: updateStockDto.Reasons,
        });

        await recStockRepo.save(updatestocktrans);

        return {
          message: `Successfully updated stock to ${newStock}`,
          success: true,
        };
      } else if (updateStockDto.Method === ChangeType.REMOVE) {
        const findTotal = await stockRepo
          .createQueryBuilder('s')
          .select('s.Total_stock', 'total')
          .where('s.product_id = :product_id', {
            product_id: updateStockDto.product_id,
          })
          .getRawOne<{ total: number }>();

        if (!findTotal) {
          return { message: 'Failed to return total stock', success: false };
        }

        const updatedStock = findTotal.total - updateStockDto.total_stock;

        await stockRepo.update(
          { product: { id: updateStockDto.product_id } },
          { Total_stock: updatedStock, user: { id: userId } },
        );

        const queryStockTrans = await recStockRepo
          .createQueryBuilder('S')
          .select(['S.new_stock', 'S.prev_stock'])
          .where('S.product_id = :product_id', {
            product_id: updateStockDto.product_id,
          })
          .orderBy('S.CreatedAt', 'DESC')
          .getOne();

        if (!queryStockTrans) {
          return {
            message: 'No record of the product in Stock_trans table',
            success: false,
          };
        }

        const newStockTrans =
          queryStockTrans.new_stock - updateStockDto.total_stock;

        const newStockTranRec = recStockRepo.create({
          user: { id: userId },
          Quantity: updateStockDto.total_stock,
          prev_stock: queryStockTrans.new_stock,
          new_stock: newStockTrans,
          product: { id: updateStockDto.product_id },
          type_Enum: StockType.OUT,
          product_category: updateStockDto.product_category,
          Change_type: ChangeType.REMOVE,
          Reasons: updateStockDto.Reasons,
        });

        await recStockRepo.save(newStockTranRec);

        return {
          message: 'Successfully updated stock (reduced)',
          success: true,
        };
      }

      return {
        message: 'Failed to update stock, please try again',
        success: false,
      };
    } catch (error) {
      return {
        message: `Transaction failed: ${error.message}`,
        success: false,
      };
    }
  }

  async returnStockInfo(): Promise<ResponseType<any>> {
    const getStockInfo = await this.recstockRepo
      .createQueryBuilder('s')
      .leftJoin('s.product', 'p')
      .select('p.id', 'product_id')
      .addSelect('p.product_category', 'product_category')
      .addSelect('p.product_name', 'product_name')
      .addSelect((subQuery) => {
        return subQuery
          .select('st.new_stock')
          .from('Stock_transaction', 'st')
          .where('st.product_id = p.id')
          .andWhere('st.Change_type = :addtype', { addtype: ChangeType.ADD })
          .orderBy('st.UpdateAt', 'DESC')
          .limit(1);
      }, 'last_add_stock')
      .addSelect((subQuery) => {
        return subQuery
          .select('st.new_stock')
          .from('Stock_transaction', 'st')
          .where('st.product_id = p.id')
          .orderBy('st.UpdateAt', 'DESC')
          .limit(1);
      }, 'last_stock')
      .addSelect((subQuery) => {
        return subQuery
          .select('st.UpdateAt')
          .from('Stock_transaction', 'st')
          .where('st.product_id = p.id')
          .orderBy('st.UpdateAt', 'DESC')
          .limit(1);
      }, 'UpdateAt')
      .addSelect((subQuery) => {
        return subQuery
          .select('u.id')
          .from('users', 'u')
          .innerJoin('stock_transaction', 'st', 'st.user_id = u.id')
          .where('st.product_id = p.id')
          .orderBy('st.UpdateAt')
          .limit(1);
      }, 'user_id')
      .addSelect((subQuery) => {
        return subQuery
          .select('u.fullname')
          .from('users', 'u')
          .innerJoin('stock_transaction', 'st', 'u.id = st.user_id')
          .where('st.product_id = p.id')
          .orderBy('st.UpdateAt')
          .limit(1);
      }, 'fullname')
      .groupBy('p.product_category')
      .addGroupBy('p.product_name')
      .addGroupBy('p.id')
      .getRawMany();

    const finalresult = getStockInfo.map((p) => {
      const lastadd = Number(p.last_add_stock) || 0;
      const laststock = Number(p.last_stock) || 0;

      const percentageRemain = lastadd > 0 ? (laststock / lastadd) * 100 : null;
      return {
        ...p,
        percentageRemain,
      };
    });

    return {
      message: 'Successfully obtained data',
      success: true,
      data: finalresult,
    };
  }
}

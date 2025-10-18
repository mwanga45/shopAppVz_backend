import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import {
  ChangeType,
  paymentstatus,
  ResponseType,
  StockStatus,
} from 'src/type/type.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Debt } from './entities/debt.entity';
import { Debt_track } from './entities/debt.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { dialValidate } from 'src/common/helper/phone.helper';
import { Customer } from 'src/entities/customer.entity';
import { StockService } from 'src/stock/stock.service';

@Injectable()
export class DebtService {
  constructor(
    @InjectRepository(Debt) private readonly DebtRepo: Repository<Debt>,
    @InjectRepository(Debt_track)
    private readonly DebtTrackRepo: Repository<Debt_track>,
    @InjectRepository(Product)
    private readonly ProductRepo: Repository<Product>,
    @InjectRepository(Customer)
    private readonly CustomerRepo: Repository<Customer>,
    private readonly dialservecheck: dialValidate,
    private readonly DataSource: DataSource,
    private readonly Stockserve: StockService,
  ) {}

  async CreateDept(
    dto: CreateDebtDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    return await this.DataSource.transaction(async (manager) => {
      try {
        const findproduct = await manager.findOne(Product, {
          where: { id: dto.ProductId },
        });
        if (!findproduct) throw new Error('Product is not Eixts');

        const isValidPh_number = this.dialservecheck.CheckDialformat(
          dto.Phone_number,
        );
        if (!isValidPh_number.success)
          throw new Error(String(isValidPh_number.message));
        const checkUserphone_exist = await manager.findOne(Customer, {
          where: { phone_number: isValidPh_number.data },
        });

        if (!checkUserphone_exist) {
          const addCustomer = manager.create(Customer, {
            customer_name: dto.Debtor_name,
            phone_number: isValidPh_number.data,
            Location: dto.location || 'none',
          });
          await manager.save(addCustomer);
        }
        if (dto.Stock_status === StockStatus.Enough) {
          const AddDebt = manager.create(Debt, {
            product: { id: dto.ProductId },
            paidmoney: dto.paidmoney | 0,
            Debtor_name: dto.Debtor_name,
            Net_profit: dto.Net_profit,
            Expected_profit: dto.Expected_profit,
            Phone_number: dto.Phone_number,
            Revenue: dto.Revenue,
            Percentage_deviation: dto.Percentage_deviation,
            profit_deviation: dto.profit_deviation,
            Total_pc_pkg_litre: dto.Total_pc_pkg_litre,
            Discount_percentage: dto.Discount_percentage,
            paymentstatus: dto.paymentstatus,
            PaymentDateAt: dto.PaymentDateAt,
            location: dto.location,
            user: { id: userId },
          });
          const saveDebt = await manager.save(AddDebt);
          if (!saveDebt || !saveDebt.id)
            throw new Error('Failed to add record please try again');
          const Addtrack = manager.create(Debt_track, {
            paidmoney: dto.paidmoney | 0,
            debt: { id: saveDebt.id },
            user: { id: userId },
          });

          const savedTrack = await manager.save(Addtrack);
          if (!savedTrack || !savedTrack.id)
            throw new Error('failed to add track');

          const UpdateStockDto: any = {
            product_id: dto.ProductId,
            total_stock: dto.Total_pc_pkg_litre,
            Method: ChangeType.REMOVE,
            Reasons: 'Sold',
            product_category: findproduct.product_category,
          };

          const stockupdate = await this.Stockserve.updateStockTransactional(
            manager,
            UpdateStockDto,
            userId,
          );
          if (!stockupdate.success)
            throw new Error(String(stockupdate.message));
          return {
            message: 'successfuly Add and make followup data',
            success: true,
          };
        }
        return {
          message: 'failed to make transaction stock is not Enough',
          success: false,
        };
      } catch (error) {
        return {
          message: `Transaction failed: ${error.message}`,
          success: false,
        };
      }
    });
  }

  async ReturnDebtInfo(): Promise<ResponseType<any>> {
    const ReturnDebtInfo = await this.DebtRepo.createQueryBuilder('d')
      .leftJoin('d.product', 'p')
      .select([
        'd.id AS debt_id',
        'd.Total_pc_pkg_litre AS total_quantity',
        'd.Revenue AS total_revenue',
        'd.paymentstatus AS payment_status',
        'd.paidmoney AS latest_paid_amount',
        'd.Debtor_name AS debtor_name',
        'd.Phone_number AS phone_number',
        'p.product_name AS product_name',
        'd.UpdateAt AS updated_at',
        'd.CreatedAt AS CreatedAt',
      ])
      .where('d.paymentstatus = :status1 OR d.paymentstatus = :status2', {
        status1: 'partialpaid',
        status2: 'debt',
      })

      .orderBy('d.id')
      .getRawMany();
    return {
      message: 'Successfully fetched debt info with payment history',
      success: true,
      data: ReturnDebtInfo,
    };
  }
  async UserDebt(id: number): Promise<ResponseType<any>> {
  // STEP 1: Get the main debt by ID
  const findUserDebtInfo = await this.DebtRepo.createQueryBuilder('d')
    .leftJoin('d.product', 'p')
    .select([
      'd.id AS debt_id',
      'd.Total_pc_pkg_litre AS total_quantity',
      'd.Revenue AS total_revenue',
      'd.paymentstatus AS payment_status',
      'd.paidmoney AS latest_paid_amount',
      'd.Debtor_name AS debtor_name',
      'd.Phone_number AS phone_number',
      'p.product_name AS product_name',
      'd.UpdateAt AS updated_at',
      'd.CreatedAt AS created_at',
      'd.PaymentDateAt AS deadline_date',
    ])
    .where(
      '(d.id = :id) AND (d.paymentstatus = :status1 OR d.paymentstatus = :status2)',
      { id, status1: 'partialpaid', status2: 'debt' },
    )
    .orderBy('d.UpdateAt', 'ASC')
    .getRawMany();

  // STEP 2: Find all payment track rows for that debt
  const findtrack = await this.DebtTrackRepo.createQueryBuilder('t')
    .leftJoin('t.debt', 'd')
    .select(['t.paidmoney AS paidmoney', 't.UpdateAt AS updated_at'])
    .where('d.id = :id', { id })
    .orderBy('t.UpdateAt', 'ASC')
    .getRawMany();

  // STEP 3: Get debtor name
  const customer_name = findUserDebtInfo[0]?.debtor_name;

  // STEP 4: Get all debts for this customer
  const debts = await this.DebtRepo.createQueryBuilder('d')
    .leftJoin('d.product', 'p')
    .select([
      'd.id AS debt_id',
      'd.Total_pc_pkg_litre AS total_quantity',
      'd.Revenue AS total_revenue',
      'd.paymentstatus AS payment_status',
      'd.paidmoney AS latest_paid_amount',
      'd.Debtor_name AS debtor_name',
      'd.Phone_number AS phone_number',
      'p.product_name AS product_name',
      'd.UpdateAt AS updated_at',
      'd.CreatedAt AS created_at',
      'd.PaymentDateAt AS deadlinedate',
    ])
    .where('d.Debtor_name = :customer_name', { customer_name })
    .orderBy('d.UpdateAt', 'ASC')
    .getRawMany();

  // STEP 5: Attach payment tracks for each debt
  const PersonDebt = await Promise.all(
    debts.map(async (debt) => {
      const tracks = await this.DebtTrackRepo.createQueryBuilder('t')
        .leftJoin('t.debt', 'd')
        .select(['t.paidmoney AS paidmoney', 't.UpdateAt AS updated_at'])
        .where('d.id = :id', { id: debt.debt_id })
        .orderBy('t.UpdateAt', 'ASC')
        .getRawMany();

      return {
        ...debt,
        tracks, // nested payments
      };
    }),
  );

  // STEP 6: Return everything
  return {
    message: 'successfully',
    success: true,
    data: { findUserDebtInfo, findtrack, PersonDebt },
  };
}

  async UpdateDebt(
    dto: UpdateDebtDto,
    userId: any,
    id: any,
  ): Promise<ResponseType<any>> {
    return this.DataSource.transaction(async (manager) => {
      try {
        if (dto.paidmoney && dto.paidmoney < 0)
          throw new Error('invalid payment value');
        const findDebt = await manager.findOne(Debt, {
          where: { id: id },
        });
        if (!findDebt) throw new Error('Debt data is not exist');

        if (
          findDebt.paidmoney >= Number(findDebt.Revenue) ||
          findDebt.paymentstatus === paymentstatus.Paid
        ) {
          if (findDebt.paymentstatus !== paymentstatus.Paid) {
            const checkpayementstatus = await manager.update(
              Debt,
              { id: id },
              { paymentstatus: paymentstatus.Paid },
            );
            if (
              !checkpayementstatus.affected ||
              checkpayementstatus.affected === 0
            )
              throw new Error('failed to update  paymentstatus');
          }
          throw new Error('The debt is already  been completed paid');
        }
        const { ProductId, Stock_status, paidmoney, ...restdto } = dto;
        const newpaidsum = findDebt.paidmoney + (Number(dto.paidmoney) ?? 0);
        if (newpaidsum > Number(findDebt.Revenue)) {
          throw new Error('The paid sum  can not be greater than Revenue');
        }
        const updateDto: any = {
          ...restdto,
          product: { id: dto.ProductId },
          paidmoney: newpaidsum,
          paymentstatus:
            newpaidsum === paidmoney
              ? paymentstatus.Paid
              : newpaidsum > 0
                ? paymentstatus.Parctial
                : paymentstatus.Dept,
        };

        const UpdateDebt = await manager.update(Debt, { id: id }, updateDto);

        if (!UpdateDebt.affected || UpdateDebt.affected === 0)
          throw new Error('failed to make update');
        const AddDebtTrack = manager.create(Debt_track, {
          debt: { id: id },
          paidmoney: dto.paidmoney,
          user: { id: userId },
        });
        const savedTrack = await manager.save(AddDebtTrack);
        if (!savedTrack || !savedTrack.id)
          throw new Error('Failed to addtrack');

        return {
          message: 'successfuly  update debt',
          success: true,
          data: findDebt,
        };
      } catch (error) {
        return {
          message: `Transaction failed: ${error.message}`,
          success: false,
        };
      }
    });
  }

  async returndebt(): Promise<ResponseType<any>> {
    const returndebt = await this.DebtRepo.find();
    return {
      message: '',
      success: true,
      data: returndebt,
    };
  }
}

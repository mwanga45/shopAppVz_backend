import { Injectable } from '@nestjs/common';
import {
  CreateManagementDto,
  CreateServiceDto,
  ServiceRequestDto,
} from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { CustomerCretorDto } from './dto/customerReg.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Capital } from 'src/entities/capital.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { Repository } from 'typeorm';
import { ResponseType } from 'src/type/type.interface';
import { DataSource } from 'typeorm';
import { capitalTimes } from 'src/type/type.interface';
import { BusinessService } from 'src/entities/businessService.entity';
import { serviceRecord } from 'src/entities/servicer_record.entity';
import { Timeformat } from 'src/common/helper/timeformat.helper';
import { Customer } from 'src/entities/customer.entity';
import { dialValidate } from 'src/common/helper/phone.helper';
import bcrypt from 'bcrypt';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Capital)
    private readonly Capitalrepo: Repository<Capital>,
    @InjectRepository(CashFlow)
    private readonly CashflowRepo: Repository<CashFlow>,
    @InjectRepository(BusinessService)
    private readonly BusinessServiceRepo: Repository<BusinessService>,
    @InjectRepository(serviceRecord)
    private readonly serviceRecoRepo: Repository<serviceRecord>,
    @InjectRepository(Customer)
    private readonly CustomerRepo: Repository<Customer>,
    private readonly Datasource: DataSource,
    private readonly Dialvalidaor: dialValidate,
  ) {}
  async CapitalRegistration(
    dto: CreateManagementDto,
  ): Promise<ResponseType<any>> {
    return await this.Datasource.transaction(async (manager) => {
      try {
        if (dto.registerTime === capitalTimes.Firsttimes) {
          const hashedcode = await bcrypt.hash(dto.code, 10);
          const registeCapital = manager.create(Capital, {
            Total_Capital: dto.total_capital,
            OnhandCapital: dto.cash_capital,
            BankCapital: dto.Bank_capital,
            code: hashedcode,
          });
          await manager.save(registeCapital);
          const registerCashflow = manager.create(CashFlow, {
            Total_Capital: dto.total_capital,
            Bank_Capital: dto.Bank_capital,
            OnHand_Capital: dto.cash_capital,
            Withdraw: 0,
          });
          await manager.save(registerCashflow);
          return {
            message: 'successuly register capital',
            success: true,
          };
        }
        const findCode = await manager.findOne(Capital, {
          where: { id: 1 },
        });
        if (!findCode) {
          return {
            message: 'no data available',
            success: true,
          };
        }
        const compare_code = await bcrypt.compare(dto.code, findCode.code);
        if (!compare_code) {
          return {
            message: 'failed the code not match',
            success: false,
          };
        }
        const updateCapital = await manager.update(
          Capital,
          { id: 1 },
          {
            Total_Capital: dto.total_capital,
            BankCapital: dto.Bank_capital,
            OnhandCapital: dto.cash_capital,
          },
        );
        const checklastRecord = await manager.findOne(CashFlow, {
          order: { bankDebt: 'DESC' },
        });
        const CreateCashflow = manager.create(CashFlow, {
          Total_Capital: dto.total_capital,
          OnHand_Capital: dto.Bank_capital,
          Bank_Capital: dto.Bank_capital,
          Withdraw: dto.bankdebt
            ? dto.bankdebt
            : checklastRecord?.bankDebt
              ? checklastRecord.bankDebt
              : 0,
        });
        await manager.save(CreateCashflow);
        return {
          message: 'successfuly',
          success: true,
        };
      } catch (err) {
        return {
          message: `failed to Register the Capital`,
          success: false,
        };
      }
    });
  }
  async CheckCapital(): Promise<ResponseType<any>> {
    const checkdataexist = await this.Capitalrepo.find();
    if (checkdataexist.length > 0) {
      return {
        message: 'capital present',
        success: true,
        data: checkdataexist,
      };
    }
    return {
      message: 'Please make sure your fill this details',
      success: false,
    };
  }
  async CreateService(dto: CreateServiceDto): Promise<ResponseType<any>> {
    return this.Datasource.transaction(async (manager) => {
      try {
        const checkserviname = await manager.findOne(BusinessService, {
          where: { service_name: dto.service_name },
        });
        if (checkserviname) {
          return {
            message: `service named ${dto.service_name} is already exist`,
            success: false,
          };
        }
        const create_service = manager.create(BusinessService, {
          service_name: dto.service_name,
          icon_name: dto.icon_name,
        });
        await manager.save(create_service);
        return {
          message: 'successfuly create new service',
          success: true,
        };
      } catch (err) {
        return {
          message: `failed to create data ${err}`,
          success: false,
        };
      }
    });
  }
  create(createManagementDto: CreateManagementDto) {
    return 'This action adds a new management';
  }

  async TransactionInfo(): Promise<ResponseType<any>> {
    const now = new Date();

    // Get Monday of this week
    const thisweek = new Date(now);
    const day = thisweek.getDay() === 0 ? 7 : thisweek.getDay(); // convert Sunday(0) → 7
    thisweek.setDate(thisweek.getDate() - (day - 1));
    thisweek.setHours(0, 0, 0, 0);

    // Get Sunday of this week
    const thisweekend = new Date(thisweek);
    thisweekend.setDate(thisweek.getDate() + 6);
    thisweekend.setHours(23, 59, 59, 999);

    const selectservice = await this.BusinessServiceRepo.createQueryBuilder('s')
      .select('s.service_name', 'service_name')
      .addSelect('s.icon_name', 'icon_name')
      .orderBy('s.CreatedAt')
      .getRawMany();

    const count_service = selectservice.length;
    const thisWeekStart = Timeformat.formatLocal(thisweek);
    const thisWeekEnd = Timeformat.formatLocal(thisweekend);
    const serviceRecord = await this.serviceRecoRepo
      .createQueryBuilder('s')
      .leftJoin('s.service', 'b')
      .select('b.service_name', 'service_name')
      .addSelect('b.icon_name', 'icon_name')
      .addSelect('s.price', 'price')
      .addSelect('s.CreatedAt', 'createdAt')
      .where('s.CreatedAt BETWEEN :start AND :end', {
        start: thisWeekStart,
        end: thisWeekEnd,
      })
      .orderBy('s.CreatedAt', 'DESC')
      .getRawMany();
    return {
      message: 'successfuly ',
      success: true,
      data: {
        count_service,
        selectservice,
        thisWeekStart,
        thisWeekEnd,
        serviceRecord,
      },
    };
  }
  async findAll(): Promise<ResponseType<any>> {
    const find = await this.BusinessServiceRepo.find();
    return {
      message: `This action returns all management`,
      success: true,
      data: find,
    };
  }
  async ServiceRequest(
    dto: ServiceRequestDto,
    userId: any,
  ): Promise<ResponseType<any>> {
    return this.Datasource.transaction(async (manager) => {
      try {
        const CheckservId = await manager.findOne(BusinessService, {
          where: { id: dto.service_id },
        });
        if (!CheckservId) throw new Error('The service is exist');
        if (CheckservId.service_origin === 'original') {
          const CapitaInfo = await manager.findOne(Capital, {
            where: {},
            order: { id: 'DESC' },
          });
          if (!CapitaInfo)
            throw new Error('there is no any data in capital table');

          const lastCashflowInfo = await manager.findOne(CashFlow, {
            where: {},
            order: { id: 'DESC' },
          });

          console.log(lastCashflowInfo);
          if (!lastCashflowInfo)
            throw new Error('There is no any data in cashflow');

          if (CheckservId.service_name === 'withdraw') {
            if (dto.withdrawFrom === 'bank') {
              if (Number(CapitaInfo.BankCapital) < Number(dto.payment_Amount))
                throw new Error('Bankcapital is not enough for this request');

              const CapitalUpdate = await manager.update(
                Capital,
                { id: 1 },
                {
                  Total_Capital:
                    Number(CapitaInfo.Total_Capital) -
                    Number(dto.payment_Amount),
                  BankCapital:
                    Number(CapitaInfo.BankCapital) - Number(dto.payment_Amount),
                  Withdraw:
                    Number(CapitaInfo.Withdraw) + Number(dto.payment_Amount),
                  bankDebt: Number(CapitaInfo.bankDebt),
                },
              );
              const CreateCashflowdata = manager.create(CashFlow, {
                Total_Capital:
                  Number(lastCashflowInfo.Total_Capital) -
                  Number(dto.payment_Amount),
                Bank_Capital:
                  Number(lastCashflowInfo.Bank_Capital) -
                  Number(dto.payment_Amount),
                Withdraw:
                  Number(lastCashflowInfo.Withdraw) +
                  Number(dto.payment_Amount),
                OnHand_Capital: Number(lastCashflowInfo.OnHand_Capital),
                servicename: CheckservId.service_name,
                bankDebt: Number(lastCashflowInfo.bankDebt),
              });
              await manager.save(CreateCashflowdata);

              const CreateService = manager.create(serviceRecord, {
                price: Number(dto.payment_Amount),
                service: { id: CheckservId.id },
                user: { id: userId },
              });
              await manager.save(CreateService);
              return {
                message: `successfuly withdraw the money from bank amount ${Number(dto.payment_Amount).toLocaleString()}`,
                success: true,
              };
            }
            if (Number(CapitaInfo.OnhandCapital) < Number(dto.payment_Amount))
              throw new Error('OnhandCapital is not enough for this request');

            const CapitalUpdate = await manager.update(
              Capital,
              { id: 1 },
              {
                Total_Capital:
                  Number(CapitaInfo.Total_Capital) - Number(dto.payment_Amount),
                BankCapital:
                  Number(CapitaInfo.OnhandCapital) - Number(dto.payment_Amount),
                Withdraw:
                  Number(CapitaInfo.Withdraw) + Number(dto.payment_Amount),
                bankDebt: Number(lastCashflowInfo.bankDebt),
              },
            );
            const CreateCashflowdata = manager.create(CashFlow, {
              Total_Capital:
                Number(lastCashflowInfo.Total_Capital) -
                Number(dto.payment_Amount),
              Bank_Capital: Number(lastCashflowInfo.Bank_Capital),
              OnHand_Capital:
                Number(lastCashflowInfo.OnHand_Capital) -
                Number(dto.payment_Amount),
              Withdraw:
                Number(lastCashflowInfo.Withdraw) + Number(dto.payment_Amount),
              servicename: CheckservId.service_name,
              bankDebt: Number(lastCashflowInfo.bankDebt),
            });
            await manager.save(CreateCashflowdata);

            const CreateService = manager.create(serviceRecord, {
              price: Number(dto.payment_Amount),
              service: { id: CheckservId.id },
              user: { id: userId },
            });
            await manager.save(CreateService);
            return {
              message: `successfuly withdraw the money from cash(On hand) amount ${Number(dto.payment_Amount).toLocaleString()}`,
              success: true,
            };
          }
          if (dto.BankoptionII === 'Bank') {
            if (Number(CapitaInfo.BankCapital) <= Number(dto.payment_Amount))
              throw new Error(
                `Money In bank Account is no Enough, you have only ${CapitaInfo.BankCapital}`,
              );
          }
          if (dto.BankoptionII === 'Cash') {
            if (Number(CapitaInfo.OnhandCapital) <= Number(dto.payment_Amount))
              throw new Error(
                `Cash Money Account is no Enough your have only ${CapitaInfo.OnhandCapital}`,
              );
          }

          if (dto.Bankoption === 'Return') {
            if (Number(CapitaInfo.bankDebt) === 0)
              throw new Error('There no debt exist at all');

            if (Number(CapitaInfo.bankDebt) < Number(dto.payment_Amount))
              throw new Error(
                `There the returned loan  is greater than exist debt : Exist Debt ${Number(CapitaInfo.bankDebt)}, Return Debt ${CapitaInfo.bankDebt}`,
              );

            const updateCapital = await manager.update(
              Capital,
              { id: 1 },
              {
                Total_Capital:
                  Number(CapitaInfo.Total_Capital) - Number(dto.payment_Amount),
                OnhandCapital:
                  dto.BankoptionII === 'Bank'
                    ? Number(CapitaInfo.OnhandCapital)
                    : Number(CapitaInfo.OnhandCapital) -
                      Number(dto.payment_Amount),
                BankCapital:
                  dto.BankoptionII === 'Cash'
                    ? Number(CapitaInfo.BankCapital) -
                      Number(dto.payment_Amount)
                    : Number(CapitaInfo.BankCapital),
                Withdraw: Number(CapitaInfo.Withdraw),
                bankDebt:
                  Number(CapitaInfo.bankDebt) - Number(dto.payment_Amount),
              },
            );

            const CreateCashflow = manager.create(CashFlow, {
              Total_Capital:
                Number(lastCashflowInfo.Total_Capital) -
                Number(dto.payment_Amount),
              Bank_Capital:
                dto.BankoptionII === 'Bank'
                  ? Number(lastCashflowInfo.Bank_Capital) -
                    Number(dto.payment_Amount)
                  : Number(lastCashflowInfo.Bank_Capital),
              OnHand_Capital:
                dto.BankoptionII === 'Cash'
                  ? Number(lastCashflowInfo.OnHand_Capital) -
                    Number(dto.payment_Amount)
                  : Number(lastCashflowInfo.OnHand_Capital),
              Withdraw: Number(lastCashflowInfo.Withdraw),
              servicename: CheckservId.service_name,
              bankDebt:
                Number(lastCashflowInfo.bankDebt) - Number(dto.payment_Amount),
            });
            await manager.save(CreateCashflow);
            const CreateService = manager.create(serviceRecord, {
              price: Number(dto.payment_Amount),
              service: { id: CheckservId.id },
              user: { id: userId },
            });
            await manager.save(CreateService);

            return {
              message: `successfuly  Return an Loan ${Number(dto.payment_Amount).toLocaleString()}`,
              success: true,
            };
          }
          const updateCapital = await manager.update(
            Capital,
            { id: 1 },
            {
              Total_Capital:
                Number(CapitaInfo.Total_Capital) + Number(dto.payment_Amount),
              OnhandCapital:
                dto.BankoptionII === 'Bank'
                  ? Number(CapitaInfo.OnhandCapital)
                  : Number(CapitaInfo.OnhandCapital) +
                    Number(dto.payment_Amount),
              BankCapital:
                dto.BankoptionII === 'Cash'
                  ? Number(CapitaInfo.BankCapital) + Number(dto.payment_Amount)
                  : Number(CapitaInfo.BankCapital),
              Withdraw: Number(CapitaInfo.Withdraw),
              bankDebt:
                Number(CapitaInfo.bankDebt) + Number(dto.payment_Amount),
            },
          );
          const CreateCashflow = manager.create(CashFlow, {
            Total_Capital:
              Number(lastCashflowInfo.Total_Capital) +
              Number(dto.payment_Amount),
            Bank_Capital:
              dto.BankoptionII === 'Bank'
                ? Number(lastCashflowInfo.Bank_Capital) +
                  Number(dto.payment_Amount)
                : Number(lastCashflowInfo.Bank_Capital),
            OnHand_Capital:
              dto.BankoptionII === 'Cash'
                ? Number(lastCashflowInfo.OnHand_Capital) +
                  Number(dto.payment_Amount)
                : Number(lastCashflowInfo.OnHand_Capital),
            Withdraw: Number(lastCashflowInfo.Withdraw),
            servicename: CheckservId.service_name,
            bankDebt:
              Number(lastCashflowInfo.bankDebt) + Number(dto.payment_Amount),
          });
          await manager.save(CreateCashflow);
          const CreateService = manager.create(serviceRecord, {
            price: Number(dto.payment_Amount),
            service: { id: CheckservId.id },
            user: { id: userId },
            Servicestatus: 'Gain',
          });
          await manager.save(CreateService);
          return {
            message: `successfuly Add new Loan to capital ${Number(dto.payment_Amount).toLocaleString()},`,
            success: true,
          };
        }
        const checkWithdrawAmount = await manager.findOne(Capital, {
          where: {},
        });
        console.log(checkWithdrawAmount);
        if (!checkWithdrawAmount)
          throw new Error('there is information on capital table');
        if (checkWithdrawAmount.Withdraw < Number(dto.payment_Amount))
          throw new Error('Withdraw first then make request of the service');
        const CreateService = manager.create(serviceRecord, {
          price: dto.payment_Amount,
          service: { id: dto.service_id },
          user: { id: userId },
        });
        console.log(CreateService);
        await manager.save(CreateService);
        const updateCapital = await manager.update(
          Capital,
          { id: 1 },
          {
            Withdraw:
              Number(checkWithdrawAmount.Withdraw) - Number(dto.payment_Amount),
          },
        );
        console.log(updateCapital);
        if (!updateCapital.affected)
          throw new Error('failed to update capital');
        const lastCashflowInfo = await manager
          .createQueryBuilder(CashFlow, 'c')
          .select('c.CreatedAt', 'CreatedAt')
          .addSelect('c.Total_Capital', 'Total_Capital')
          .addSelect('c.Bank_Capital', 'Bank_Capital')
          .addSelect('c.OnHand_Capital', 'OnHand_Capital')
          .addSelect('c.bankDebt', 'bankDebt')
          .orderBy('c.CreatedAt', 'DESC')
          .limit(1)
          .getRawOne();
        if (!lastCashflowInfo)
          throw new Error(
            'No cashflow is available data please make sure your register the infomation about your business',
          );

        const CreateCashflow = manager.create(CashFlow, {
          Total_Capital: Number(lastCashflowInfo.Total_Capital),
          Bank_Capital: Number(lastCashflowInfo.Bank_Capital),
          OnHand_Capital: Number(lastCashflowInfo.OnHand_Capital),
          bankDebt: Number(lastCashflowInfo.bankDebt),
          Withdraw:
            Number(checkWithdrawAmount.Withdraw) - Number(dto.payment_Amount),
          servicename: CheckservId.service_name,
        });
        console.log(CreateCashflow);
        await manager.save(CreateCashflow);
        return {
          message: 'successfuly made the request',
          success: true,
        };
      } catch (err) {
        return {
          message: `something went wrong ${err}`,
          success: false,
        };
      }
    });
  }

  async CreateNewCustomer(dto: CustomerCretorDto): Promise<ResponseType<any>> {
    const Dial = this.Dialvalidaor.CheckDialformat(dto.PhoneNumber);
    const CheckCustomerName =  await this.CustomerRepo.findOne({where:{customer_name:dto.CustomerName}})
    if(CheckCustomerName){
      return{
        message:"Customer name is Already exist",
        success:false
      }
    }
    if (!Dial.success) {
      return {
        message: Dial.message,
        success: false,
      };
    }
    const CheckPhoneNumber = await this.CustomerRepo.exists({where:{phone_number:Dial.data}})
    if(CheckPhoneNumber){
      return{
        message:"Customer Phone number is Already exist",
        success:false
      }
    }
    const NewCustomer = this.CustomerRepo.create({
      customer_name: dto.CustomerName,
      Location: dto.Location,
      phone_number:Dial.data
    });
    this.CustomerRepo.save(NewCustomer);

    return {
      message: `successfuly registered ${Dial.data}`,
      success: true,
    };
  }
  findOne(id: number) {
    return `This action returns a #${id} management`;
  }

  update(id: number, updateManagementDto: UpdateManagementDto) {
    return `This action updates a #${id} management`;
  }

  remove(id: number) {
    return `This action removes a #${id} management`;
  }
}

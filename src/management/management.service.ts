import { Injectable } from '@nestjs/common';
import { CreateManagementDto } from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Capital } from 'src/entities/capital.entity';
import { CashFlow } from 'src/entities/cashFlow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Capital)
    private readonly Capitalrepo: Repository<Capital>,
    @InjectRepository(CashFlow)
    private readonly CashflowRepo: Repository<CashFlow>,
  ) {}
  create(createManagementDto: CreateManagementDto) {
    return 'This action adds a new management';
  }

  findAll() {
    return `This action returns all management`;
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

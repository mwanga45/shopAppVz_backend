import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import {
  CreateManagementDto,
  CreateServiceDto,
} from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';

@Controller('management')
export class ManagementController {
  constructor(private readonly managementService: ManagementService) {}

  @Post('create&update')
  create(@Body() createManagementDto: CreateManagementDto) {
    return this.managementService.CapitalRegistration(createManagementDto);
  }
  @Post('createservice')
  Createservice(@Body() CreateServiceDto: CreateServiceDto) {
    return this.managementService.CreateService(CreateServiceDto);
  }
  @Get('checkcapitalinfo')
  CheckCapitalInfo() {
    return this.managementService.CheckCapital();
  }
  @Get('transactionInfo')
  TransactionInfo(){
    return this.managementService.TransactionInfo()
  }

  @Get()
  findAll() {
    return this.managementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.managementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManagementDto: UpdateManagementDto,
  ) {
    return this.managementService.update(+id, updateManagementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.managementService.remove(+id);
  }
}

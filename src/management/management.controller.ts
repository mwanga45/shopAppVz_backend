import {
  Controller,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import {
  CreateManagementDto,
  CreateServiceDto,
  ServiceRequestDto,
} from './dto/create-management.dto';
import { UpdateManagementDto } from './dto/update-management.dto';
import { AuthGuard } from '@nestjs/passport';
import { CustomerCretorDto } from './dto/customerReg.dto';

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
  
  @Post('CreateCustomer')
  CreaterCustomer(@Body() Dto:CustomerCretorDto){
    return this.managementService.CreateNewCustomer(Dto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('servieRequest')
  ServiceRequest(@Request() req,  @Body()   ServiceRequestDto:ServiceRequestDto){
    const userId = req.user.userId
    return this.managementService.ServiceRequest(ServiceRequestDto, userId)
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

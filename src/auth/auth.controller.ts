import { Body, Controller, Post, UseGuards, Req, HttpCode, HttpStatus, ConflictException, Get,Request } from "@nestjs/common";
import { LoginDto } from "./dto/create-auth.dto";
import { RegisterDTO } from "./dto/create-auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { RoleGuard } from "src/guard/role.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDTO) {
    const result = await this.authService.register(dto);
    return result;
  }
  @UseGuards(AuthGuard('jwt'),RoleGuard)
  @Get('user-list')
  async UserList (){
   return  await this.authService.Account_list()
  }
  @UseGuards(AuthGuard('jwt'), RoleGuard)
   @Get('acc_info')
   async Account_info(){
    return await this.authService.Account_details()
   }
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('admin-verification')
  @HttpCode(HttpStatus.OK)
  async Validate_admin(@Body() Dto:LoginDto){
    return await this.authService.ValidateAdmin_Account(Dto)
  }
  
}

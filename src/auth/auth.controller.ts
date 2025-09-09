import { Body, Controller, Post, UseGuards, Req, HttpCode, HttpStatus, ConflictException } from "@nestjs/common";
import { LoginDto } from "./dto/create-auth.dto";
import { RegisterDTO } from "./dto/create-auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

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
    if (result && result.exist === true) {
      throw new ConflictException({ field: result.field, message: `${result.field} already exists` });
    }
    return result;
  }
}

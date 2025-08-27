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
  async login(@Req() req) {
    const { id, email, role } = req.user;
    return this.authService.login({ id, email, role });
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

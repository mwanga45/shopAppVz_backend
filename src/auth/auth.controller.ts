import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LoginDto } from "./dto/create-auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const { id, email, role } = user as any;
    return this.authService.login({ id, email, role });
  }
}

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LoginDto } from "./dto/create-auth.dto";;
import { UserLogin } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";

@Controller("auth")
export class AuthLogin {
  constructor (private userlogin:UserLogin) {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() dto:LoginDto){
    const user = await this.userlogin.Validator(dto)
    return this.userlogin.Login(user)
  }

  

}

import {Strategy} from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { LoginDto } from "./dto/create-auth.dto"
import { UserLogin } from "./auth.service"
import { Injectable,UnauthorizedException } from "@nestjs/common"

@Injectable()
export class localstrategy extends PassportStrategy(Strategy){
 constructor(private userlogin:UserLogin){
    super({usernameField:"email"})
 }
 async Validate (email:string, password:string):Promise<any>{
    const dto:LoginDto = {email,password}
    const user = await this.userlogin.Validator(dto)
    if(!user) throw new UnauthorizedException()
        return user
 }
}
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt"
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

export type payload = {
  sub:number,
  email:string,
  role:string
}
@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(
    private readonly config:ConfigService,
    @InjectRepository(User) private readonly userRepo:Repository<User>
  ) {
    super(
      {
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        IgnoreTokeExpire:false,
        secretOrKey:config.get<string>('jwt.secret')

      }
    )
  }
  async Validate(Reqpayload:payload){
    const user = this.userRepo.findOne({where:{id:Reqpayload.sub},select:[
      "id","email","role"
    ]})
    if(!user){
      throw new UnauthorizedException("Token is Invalid")
    }
    return {userId:Reqpayload.sub, user_email:Reqpayload.email, user_role:Reqpayload.role}
  }

}

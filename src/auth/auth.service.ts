import {Injectable,UnauthorizedException} from "@nestjs/common";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {LoginDto} from './dto/create-auth.dto';
import { User } from "src/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { access } from "fs";

@Injectable()
export class UserLogin {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtoken:JwtService,
  ){}

  async Validator(dto:LoginDto):Promise<User>{
    const user = await this.userRepository.findOne({where:{email:dto.email}})
    if (!user) throw new UnauthorizedException("invalid email or password")
    
    const ispassword = await bcrypt.compare(dto.password,user.password) 
    if (!ispassword) throw new UnauthorizedException("Invalid password or Email")
      
    return user
    
    }
    async Login(user:User){
      const payload = {
        sub:user.id,
        email:user.email,
        role:user.role,
      }
      return{
        access_token:this.jwtoken.sign(payload),
        role:user.role

      };
    };

  };
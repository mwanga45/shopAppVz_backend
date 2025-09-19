import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { User } from "src/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NidaValidate } from "src/common/helper/nide.helper";
import { RegisterDTO } from "./dto/create-auth.dto";
import { ResponseType } from "src/type/type.interface";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullname:user.fullname
    };
    const accessToken = this.jwtService.sign(payload);
    console.log('Generated Access Token:', accessToken);
    return {
      access_token: accessToken,
      role: user.role,
    };
  }
      async  register(Dto:RegisterDTO){
      const existing = await this.userRepository.findOne({
        where:{
          email:Dto.email,
          phone_number:Dto.phone_number,
          nida:Dto.nida
        }
      });
      if(existing){
        if((existing as any).email === Dto.email) return {exist: true, field: 'email'};
        if((existing as any).phone_number === Dto.phone_number) return {exist: true, field: 'phone_number'};
        if((existing as any).nida === Dto.nida) return {exist: true, field: 'nida'};
      }

      const isValid = NidaValidate.validateNidaNumber(Dto.nida)
      if(isValid.Isvalid === false){
        throw new UnauthorizedException(isValid.reason)
      }
      const hashedPassword = await bcrypt.hash(Dto.password,10)
      const fullname = Dto.firstname.concat(" ",Dto.lastname)
      const CreateUser = this.userRepository.create({
       email:Dto.email,
       password:hashedPassword,
       fullname:fullname,
       phone_number:Dto.phone_number,
       nida:Dto.nida,
       role:Dto.role
      });
      await this.userRepository.save(CreateUser)
      return {exist: false, proceed: true};
    }

    async  Account_list ():Promise<ResponseType<any>>{
      const user_list = await this.userRepository.find()
      if(!user_list){
       return{
        message:"No Account Available",
        success:true
       }
      }
      return{
        message:"Successfuly",
       success:true,
       data:user_list
      }
    }
}
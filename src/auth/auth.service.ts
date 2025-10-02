import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt';
import { User } from "src/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { NidaValidate } from "src/common/helper/nide.helper";
import { LoginDto, RegisterDTO } from "./dto/create-auth.dto";
import { ResponseType } from "src/type/type.interface";
import { UserType } from "src/entities/user.entity";


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
      async  register(Dto:RegisterDTO):Promise<ResponseType<any>>{
      const existing = await this.userRepository.findOne({
        where:[
          {email:Dto.email},
          {nida:Dto.nida},
          {phone_number:Dto.phone_number}
        ]
      });
      if(existing){
        if((existing as any).email === Dto.email) return {
          message:"email already exist",
          success:false
        };
        if((existing as any).phone_number === Dto.phone_number) return {
          message:"Phone number is already exist",
          success:false
        };
        if((existing as any).nida === Dto.nida) return {
          message:"Nida number is already exist",
          success:false
        };
      }

      const isValid = NidaValidate.validateNidaNumber(Dto.nida)
      if(isValid.Isvalid === false){
        return{
          message:isValid?.reason,
          success:false
        }
      }
      const hashedPassword = await bcrypt.hash(Dto.password,10)
      const fullname = Dto.firstname.concat(" ",Dto.secondname)
      const CreateUser = this.userRepository.create({
       email:Dto.email,
       password:hashedPassword,
       fullname:fullname,
       phone_number:Dto.phone_number,
       nida:Dto.nida,
       role:Dto.role
      });
      await this.userRepository.save(CreateUser)
      return {
        message:"Success register new user",
        success:true
      };
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

    async Account_details ():Promise<ResponseType<any>>{
      const return_user = await this.userRepository.find({
        select:['fullname','isActive','email','nida','phone_number','CreatedAt','role','id',]
      })
      if(return_user.length === 0){
        return{
          message:"No account Available",
          success:false
        }
      }
      const roleAndisActive = await this.userRepository.createQueryBuilder('u')
      .select('u.role', 'role')
      .addSelect('COUNT(u.role)', 'total')
      .addSelect('SUM(CASE WHEN u.isActive = true THEN 1 ELSE 0 END)', 'activeCount')
      .addSelect('SUM(CASE WHEN u.isActive = false THEN 1 ELSE 0 END)', "inActiveCount")
      .groupBy('u.role')
      .getRawMany()

      const ROleObj =  roleAndisActive.reduce((acc, curr)=>{
        acc[curr.role] ={total:Number(curr.total), activeCount:Number(curr.activeCount)}
        return acc
      })
      return{
        message:"Succesfully returned",
        success:true,
  
        data:{
          return_user,
          ROleObj
        }
      }
    }
  async ValidateAdmin_Account (Dto:LoginDto):Promise<ResponseType<any>>{
    const findAdmn = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: Dto.email })
      .andWhere('user.role = :role', { role: UserType.Admin })
      .getOne()
    if(!findAdmn){
      return{
        success:false,
        message:"Admin is not found"
      }
    }
    const compare_pwr = await bcrypt.compare(Dto.password, findAdmn.password)
    if(!compare_pwr){
      return{
        message:"Password or email is incorrect",
        success:false
      }
    }
    return{
      message:"Valid user admin role",
      success:true,
      data:findAdmn.id
    }
  }
}
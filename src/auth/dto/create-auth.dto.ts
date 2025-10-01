import { match } from "assert";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, IsOptional } from "class-validator";
import { UserType } from "src/entities/user.entity";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    role?: UserType
}
export class RegisterDTO{
    @IsString()
    @Length(4,20)
    firstname:string;

    @IsString()
    @IsNotEmpty()
    @Length(4,20)
    lastname:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @IsString()
    @Length(6,20)
    @Matches(/^[A-Z].*[@$!%*?&]/,{
        message:"Password is too week"
    })
    password:string

    @IsString()
    @Length(20)
    nida:string
  
    @IsString()
    @IsNotEmpty()
    @Length(10)
    phone_number:string

    @IsString()
    role:UserType
}

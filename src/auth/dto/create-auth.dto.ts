import { match } from "assert";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, IsOptional, ValidateIf } from "class-validator";
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
    secondname:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @IsString()
    @Length(6,20)
    @Matches(/.*[@$!%*?&]/,{
        message:"Password must contain at least one special character (@$!%*?&)"
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

    @IsOptional()
    @IsString()
    confirm_password?: string
}

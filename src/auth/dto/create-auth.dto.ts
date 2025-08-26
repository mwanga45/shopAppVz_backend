import { IsEmail, isNotEmpty, IsNotEmpty, isString, IsString, Length } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
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
    password
    @IsString()
    @Length(20)
    nida:string
  
    @IsString()
    @IsNotEmpty()
    @Length(10)
    phone_number:string
}

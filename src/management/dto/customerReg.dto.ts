import { IsOptional, IsString, Length } from "class-validator";

export class CustomerCretor{
  @IsString()
  @Length(5, 25)
  CustomerName:string

  @IsString()
  PhoneNumber:number

  @IsOptional()
  @IsString()
  Location:string
}
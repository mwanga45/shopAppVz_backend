import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CustomerCretorDto{
  @IsString()
  @Length(5, 25)
  CustomerName:string

  @IsString()
  PhoneNumber:string

  @IsOptional()
  @IsString()
  Location:string
}
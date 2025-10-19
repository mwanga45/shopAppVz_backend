import { IsNumber } from "class-validator";

export class CreateSmDto {
    @IsNumber()
    phone_number: number
}

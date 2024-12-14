import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateCartDto {
    @IsString()
    @IsNotEmpty()
    productId: string

    @IsNumber()
    quantity: number
}

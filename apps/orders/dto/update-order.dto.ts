import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsBoolean()
  delivered: boolean;
}

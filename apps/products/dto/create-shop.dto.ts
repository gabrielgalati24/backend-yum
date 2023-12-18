import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;


}
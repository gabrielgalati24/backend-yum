// model Order {
//     id        Int      @id @default(autoincrement())
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt

//     product   Product @relation(fields: [productId], references: [id])
//     productId Int
//     user      User    @relation(fields: [userId], references: [id])
//     userId    Int
//     delivered Boolean @default(false)
//   }

import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
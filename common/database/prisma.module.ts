import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Module({
    providers: [PrismaService],
    imports: [PrismaService],
})
export class PrismaModule { }
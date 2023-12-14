import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        for (let i = 0; i < 5; i++) {
            try {
                await this.$connect();
                break;
            } catch (error) {
                console.error(`Error connecting to the database: ${error}. Retrying (${i + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
}

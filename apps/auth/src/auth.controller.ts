import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { ClientProxy, MessagePattern } from "@nestjs/microservices";
import { RabbitMqService } from "common/utils/rmq.service";
@Controller("api")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject("AUTH_SERVICE") private readonly RabbitMqService: RabbitMqService,
    // @Inject("PRODUCTS_SERVICE") private readonly RabbitMqService: RabbitMqService,
  ) { }

  @MessagePattern({ cmd: 'login' })
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authService.login(createUserDto);
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

}

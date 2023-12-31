import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { ClientProxy, Ctx, MessagePattern, RmqContext } from "@nestjs/microservices";
import { RabbitmqService } from "common/services/rabbitmq.service";

@Controller("api")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject("AUTH_SERVICE") private readonly RabbitMqService: RabbitmqService,

  ) { }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext, @Body() createUserDto: CreateUserDto) {

    return await this.authService.login(createUserDto);
  }

  @MessagePattern({ cmd: 'register' })
  async register(@Ctx() context: RmqContext, @Body() createUserDto: CreateUserDto) {

    return await this.authService.register(createUserDto);
  }

}

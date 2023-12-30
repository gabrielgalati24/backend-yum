import { Body, Controller, Get, Inject, Post } from "@nestjs/common";


import { ClientProxy } from "@nestjs/microservices";
import { CreateUserDto } from "apps/auth/dto/create-user.dto";

@Controller("api/v1/auth")
export class AuthController {
  constructor(

    @Inject("AUTH_SERVICE") private readonly authRabbitmq: ClientProxy
  ) { }

  @Post("login")
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authRabbitmq.send({ cmd: "login" }, createUserDto);
  }

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authRabbitmq.send({ cmd: "register" }, createUserDto);
  }

}

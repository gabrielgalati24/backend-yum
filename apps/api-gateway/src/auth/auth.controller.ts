import { Body, Controller, Get, Inject, Post } from "@nestjs/common";


import { ClientProxy } from "@nestjs/microservices";
import { CreateUserDto } from "./dto/create-auth.dto";


@Controller("api/v1/auth")
export class AuthController {
  constructor(

    @Inject("AUTH_SERVICE") private readonly authRabbitmq: ClientProxy
  ) { }

  @Post("login")
  login(@Body() createUserDto: CreateUserDto) {
    return this.authRabbitmq.send({ cmd: "login" }, createUserDto);
  }

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authRabbitmq.send({ cmd: "register" }, createUserDto);
  }

}

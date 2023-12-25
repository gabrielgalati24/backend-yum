import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { ClientProxy } from "@nestjs/microservices";

@Controller("api")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject("AUTH_CLIENT") private readonly client: ClientProxy,
  ) {}

  @Post("/v1/auth/login")
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authService.login(createUserDto);
  }

  @Post("/v1/auth/register")
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Get("")
  async a(@Body() createUserDto: CreateUserDto) {
    console.log("a");
    return "a";
  }
}

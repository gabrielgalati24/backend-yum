import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PrismaService } from "common/database/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(createUserDto): Promise<any> {
    try {
      const { email, password } = createUserDto;
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException("Usuario no encontrado");
      }

      if (user.password !== password) {
        throw new UnauthorizedException("Contraseña incorrecta");
      }

      return {
        email: user.email,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "No se pudo iniciar sesión",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(createUserDto): Promise<any> {
    try {
      const { email, password, name = "" } = createUserDto;
      const user = await this.prisma.user.create({
        data: {
          name,
          password,
          email,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("El correo electrónico ya existe");
      }
      throw new HttpException(
        "No se pudo registrar el usuario",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

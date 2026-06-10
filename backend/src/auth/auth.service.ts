import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    //busca email
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    //mensaje en caso de que exista
    if (existingUser) {
      throw new ConflictException('El correo ya esta registrado');
    }

    //hasheo de contraseña ingresada
    const hashedPassword = await bcrypt.hash(registerDto.password, 10); //el 10 significan las rondas de hashing ... más seguro mas lento

    //guardar usuario
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new ConflictException('Correo o contraseña incorrectos');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new ConflictException('correo o contraseña incorrecta');
    }

    //la informacion que ira en el token
    const payload = {
      sub: user.id,
      email: user.email,
    };

    //generar token
    const accessToken = await this.jwtService.signAsync(payload);

    //retornamos el token
    return {
      access_token: accessToken,
    };
  }
}

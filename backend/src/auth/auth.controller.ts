import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = {
  user: {
    userId: number;
    email: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return {
      userId: req.user.userId,
      email: req.user.email,
    };
  }
}

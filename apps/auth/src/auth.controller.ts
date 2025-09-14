import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthTokens } from '../../auth/src/auth/interface/auth-tokens.interface';

function isHttpError(
  error: unknown,
): error is { status: number; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    typeof (error as any).status === 'number' &&
    typeof (error as any).message === 'string'
  );
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<AuthTokens> {
    try {
      return await this.authService.register(signupDto);
    } catch (error: unknown) {
      if (isHttpError(error)) {
        if (error.status === HttpStatus.CONFLICT) {
          throw new HttpException(error.message, HttpStatus.CONFLICT);
        }
      }
      throw new HttpException('Signup failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthTokens> {
    try {
      return await this.authService.login(loginDto);
    } catch {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AuthTokens> {
    try {
      // Use public method to verify token to avoid private property access
      const payload = this.authService.verifyToken(dto.refreshToken);
      const tokens = await this.authService.refreshTokens(payload.sub, dto.refreshToken);
      return tokens;
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}

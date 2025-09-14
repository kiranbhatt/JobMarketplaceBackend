// src/auth/auth.service.ts

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../../user/src/schemas/user.schema';
import { AuthTokens } from '../src/auth/interface/auth-tokens.interface';

// Type guard for error with message
function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  verifyToken(token: string): { sub: string; email: string } {
    return this.jwtService.verify(token);
  }
  async register(signupDto: SignupDto): Promise<AuthTokens> {
    try {
      const { email, password, fullName } = signupDto;

      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new this.userModel({
        fullName,
        email,
        password: hashedPassword,
        provider: 'local',
      });
      await newUser.save();

      const tokens = this.getTokens(newUser._id.toString(), newUser.email);
      await this.saveRefreshToken(newUser._id.toString(), tokens.refreshToken);
      return tokens;
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        throw new ConflictException(error.message);
      }
      throw new ConflictException('Unexpected error occurred during registration');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });
      if (!user || !user.password) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (!isPasswordMatching) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = this.getTokens(user._id.toString(), user.email);
      await this.saveRefreshToken(user._id.toString(), tokens.refreshToken);
      return tokens;
    } catch (error: unknown) {
      if (isErrorWithMessage(error)) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException('Unexpected error occurred during login');
    }
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = this.getTokens(userId, user.email);
    await this.saveRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  private async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, { refreshTokenHash: hashedToken });
  }

  private getTokens(userId: string, email: string): AuthTokens {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRY || '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    });
    return { accessToken, refreshToken };
  }
}

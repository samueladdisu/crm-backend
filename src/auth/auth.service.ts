import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { UserService } from './user.service';
import { ObjectId } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  generateToken(res: Response, userId: any) {
    const token = this.jwtService.sign({ userId });

    res.cookie('jwt', token, {
      httpOnly: true,
      // sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production',
    });
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.userService.validateUser(loginDto);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, jwt: string) {
    return null;
  }

  async findUser(email: string) {
    return await this.userService.findOne(email);
  }

  async signup(signupDto: SignupDto) {
    return await this.userService.signUp(signupDto);
  }

  // generateJwtToken(payload: any): string {
  //   return this.jwtService.sign(payload);
  // }

  verifyJwtToken(token: string): any {
    return this.jwtService.verify(token);
  }
}

import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.authService.generateToken(res, user._id);

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.firstName,
      email: user.email,
      role: user.role,
    });
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    try {
      const userExists = await this.authService.findUser(signupDto.email);

      if (userExists) {
        res.status(400);
        throw new UnauthorizedException('User already exists');
      }

      const user = await this.authService.signup(signupDto);

      if (user instanceof Error) {
        throw new UnauthorizedException(user.message);
      }

      this.authService.generateToken(res, user._id);

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

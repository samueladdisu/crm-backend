import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User, UserDocument } from '../schemas/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }

  private static extractJWT(req: RequestType): string | null {
    console.log(req.cookies.jwt);
    if (req.cookies && 'jwt' in req.cookies && req.cookies.jwt.length > 0) {
      return req.cookies.jwt;
    }

    return null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { userId } = payload;
    console.log('payload', payload);
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

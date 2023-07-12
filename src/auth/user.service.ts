import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from './schemas/users.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserDocument | null> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async findOne(email: string): Promise<UserDocument | null> {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  async signUp(signUpDto: SignupDto): Promise<UserDocument | Error> {
    try {
      const { email, password, firstName, lastName, role, company } = signUpDto;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        company,
      });

      return await newUser.save();
    } catch (error) {
      return error;
    }
  }
}

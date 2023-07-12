import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './schemas/customers.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private async handleRequest(promise: Promise<any>) {
    try {
      return await promise;
    } catch (error) {
      return error;
    }
  }

  async create(createCustomerDto: CreateCustomerDto, jwt: string) {
    const newCustomer = new this.customerModel(createCustomerDto);
    const { userId } = this.jwtService.decode(jwt) as { userId: string };

    newCustomer.userId = userId;

    return this.handleRequest(newCustomer.save());
  }

  async findAll(page: number, limit: number) {
    const customersQuery = this.customerModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const countQuery = this.customerModel.countDocuments();
    const [customers, count] = await this.handleRequest(
      Promise.all([customersQuery, countQuery]),
    );
    return {
      customers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOne(id: string) {
    return this.handleRequest(this.customerModel.findById(id).exec());
  }

  async findByUserId(jwt: string) {
    const { userId } = this.jwtService.decode(jwt) as { userId: string };

    return this.handleRequest(this.customerModel.find({ userId }).exec());
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    return this.handleRequest(
      this.customerModel
        .findByIdAndUpdate(id, updateCustomerDto, { new: true })
        .exec(),
    );
  }

  async remove(id: string) {
    return this.handleRequest(this.customerModel.findByIdAndDelete(id).exec());
  }
}

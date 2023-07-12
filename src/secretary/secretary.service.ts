import { Injectable } from '@nestjs/common';
import { CreateSecretaryDto } from './dto/create-secretary.dto';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Secretary, SecretaryDocument } from './schemas/secretary.schema';
import { Model } from 'mongoose';

@Injectable()
export class SecretaryService {
  constructor(
    @InjectModel(Secretary.name)
    private readonly secretaryModel: Model<SecretaryDocument>,
  ) {}

  private async handleRequest(promise: Promise<any>) {
    try {
      return await promise;
    } catch (error) {
      return error;
    }
  }
  async create(createSecretaryDto: CreateSecretaryDto) {
    const newSchedule = new this.secretaryModel(createSecretaryDto);

    return this.handleRequest(newSchedule.save());
  }

  async findAll(page: number, limit: number) {
    const secretaryQuery = this.secretaryModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const countQuery = this.secretaryModel.countDocuments();
    const [schedule, count] = await this.handleRequest(
      Promise.all([secretaryQuery, countQuery]),
    );

    return {
      schedule,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  async findOne(id: string) {
    return this.handleRequest(this.secretaryModel.findById(id).exec());
  }

  async update(id: string, updateSecretaryDto: UpdateSecretaryDto) {
    return this.handleRequest(
      this.secretaryModel
        .findByIdAndUpdate(id, updateSecretaryDto, { new: true })
        .exec(),
    );
  }

  async remove(id: string) {
    return this.handleRequest(this.secretaryModel.findByIdAndDelete(id).exec());
  }
}

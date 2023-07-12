import { Module } from '@nestjs/common';
import { SecretaryService } from './secretary.service';
import { SecretaryController } from './secretary.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SecretarySchema } from './schemas/secretary.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Secretary', schema: SecretarySchema }]),
  ],
  controllers: [SecretaryController],
  providers: [SecretaryService],
})
export class SecretaryModule {}

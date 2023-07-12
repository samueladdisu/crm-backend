import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { SecretaryService } from './secretary.service';
import { CreateSecretaryDto } from './dto/create-secretary.dto';
import { UpdateSecretaryDto } from './dto/update-secretary.dto';

@Controller('secretary')
export class SecretaryController {
  constructor(private secretaryService: SecretaryService) {}

  private async handleRequest(promise: Promise<any>, res: Response) {
    try {
      const response = await promise;
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post()
  create(@Body() createSecretaryDto: CreateSecretaryDto, @Res() res: Response) {
    return this.handleRequest(
      this.secretaryService.create(createSecretaryDto),
      res,
    );
  }

  @Get()
  findAll(
    @Query() query: { page: string; limit: string },
    @Res() res: Response,
  ) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    return this.handleRequest(this.secretaryService.findAll(page, limit), res);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.handleRequest(this.secretaryService.findOne(id), res);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSecretaryDto: UpdateSecretaryDto,
    @Res() res: Response,
  ) {
    return this.handleRequest(
      this.secretaryService.update(id, updateSecretaryDto),
      res,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.handleRequest(this.secretaryService.remove(id), res);
  }
}

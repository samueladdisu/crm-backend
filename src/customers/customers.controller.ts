import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/schemas/role.enum';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  private async handleRequest(promise: Promise<any>, res: Response) {
    try {
      const response = await promise;
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.handleRequest(
      this.customersService.create(createCustomerDto, req.cookies['jwt']),
      res,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.RECEPTION, Role.ADMIN)
  findAll(
    @Query() query: { page: string; limit: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log('jwt', req.cookies['jwt']);
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    return this.handleRequest(this.customersService.findAll(page, limit), res);
  }

  @Get('/id/:id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Res() res: Response) {
    return this.handleRequest(this.customersService.findOne(id), res);
  }

  @Get('/userId/')
  @UseGuards(JwtAuthGuard)
  findByUserId(@Res() res: Response, @Req() req: Request) {
    return this.handleRequest(
      this.customersService.findByUserId(req.cookies['jwt']),
      res,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
    @Res() res: Response,
  ) {
    return this.handleRequest(
      this.customersService.update(id, updateCustomerDto),
      res,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.handleRequest(this.customersService.remove(id), res);
  }
}

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user-create.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserdto: CreateUserDto) {
    const { email, password } = createUserdto;
    const newUser = await this.usersService.create({ email, password });
    return newUser;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: string) {
    return `User ${id}`;
  }
}

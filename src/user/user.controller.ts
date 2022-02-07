import { Controller, Get, Param } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param() params): Promise<User> {
    return this.userService.getOneById(params.id);
  }

  @Get('/create/:name')
  createUser(@Param() params): Promise<User> {
    return this.userService.createUser(params.name);
  }

  @Get('/alter/:id/:name')
  updateUser(@Param() params): Promise<User> {
    return this.userService.updateUser(params.id, params.name);
  }

  @Get('/delete/:id')
  deleteUser(@Param() params): Promise<User> {
    return this.userService.deleteUser(params.id);
  }
}

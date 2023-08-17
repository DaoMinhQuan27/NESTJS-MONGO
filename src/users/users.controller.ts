import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/auth/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage("Create a new User")
  createUser(@Body()  createUserDto: CreateUserDto , @User() user : IUser) {
    return this.usersService.create(createUserDto, user);
  }

  @Get()
  @ResponseMessage("Fetch user with paginate")
  findAll(@Query('current') page : string , @Query('pageSize') limit : string , @Query() query : string) {
    return this.usersService.findAll(page, limit, query);
  }

  @Public()
  @ResponseMessage("Fetch user by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage('Update a User')
  update( @Body() updateUserDto: UpdateUserDto , @User() user : IUser) {
    const id = updateUserDto._id
    return this.usersService.update(id, updateUserDto,user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a User')
  remove(@Param('id') id: string , @User() user : IUser) {
    return this.usersService.remove(id, user);
  }
}

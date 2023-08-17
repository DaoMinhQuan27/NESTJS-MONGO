import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/auth/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage("Create a new Permission")
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user : IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Get()
  @ResponseMessage("Fetch Permission with paginate")
  findAll(@Query('current') page : string , @Query('pageSize') limit : string , @Query() query : string) {
    return this.permissionsService.findAll(page, limit, query);
  }

  @Get(':id')
  @ResponseMessage("Fetch Permission by id")
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto , @User() user : IUser) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a Permission ")
  remove(@Param('id') id: string, @User() user : IUser) {
    return this.permissionsService.remove(id,user);
  }
}

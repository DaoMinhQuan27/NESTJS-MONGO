import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubcribersService } from './subcribers.service';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import { NotPermission, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/auth/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubcribersController {
  constructor(private readonly subcribersService: SubcribersService) {}

  @Post()
  @ResponseMessage("Create a new subcriber")
  create(@Body() createSubcriberDto: CreateSubcriberDto, @User() user : IUser) {
    return this.subcribersService.create(createSubcriberDto, user);
  }

  @NotPermission()
  @Post('skills')
  @ResponseMessage("Get subcriber skill")
  getSubcriberSkill(@User() user : IUser) {
    return this.subcribersService.getSubcriberSkill( user);
  }

  @Get()
  @ResponseMessage("Fetch subcribers with pagination")
  findAll(@Query('current') page : string , @Query('pageSize') limit : string , @Query() query : string) {
    return this.subcribersService.findAll(page, limit, query);
  }

  @Get(':id')
  @ResponseMessage("Fetch subcriber by id")
  findOne(@Param('id') id: string) {
    return this.subcribersService.findOne(id);
  }

  
  @Patch()
  @NotPermission()
  @ResponseMessage("Update a subcriber")
  update( @Body() updateSubcriberDto: UpdateSubcriberDto, @User() user : IUser) {
    return this.subcribersService.update( updateSubcriberDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string , @User() user : IUser) {
    return this.subcribersService.remove(id, user);
  }
}

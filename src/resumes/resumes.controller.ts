import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { NotPermission, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/auth/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @NotPermission()
  @ResponseMessage("Create a new Resume")
  create(@Body() createResumeDto: CreateUserCvDto , @User() user : IUser) {
    return this.resumesService.create(createResumeDto , user);
  }

  @Get()
  @ResponseMessage("Fetch All Resumes with paginate")
  findAll(@Query('current') page : string , @Query('pageSize') limit : string , @Query() query : string) {
    return this.resumesService.findAll(page, limit, query);
  }

  @Get(':id')
  @ResponseMessage("Fetch a Resume by id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update status a Resume")
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto , @User() user : IUser) {
    return this.resumesService.update(id, updateResumeDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a Resume")
  remove(@Param('id') id: string, @User() user : IUser) {
    return this.resumesService.remove(id,user);
  }

  @Post('by-user')
  @ResponseMessage("Get CV by user")
  getCvByUser(@User() user : IUser) {
    return this.resumesService.getCvByUser( user);
  }

}

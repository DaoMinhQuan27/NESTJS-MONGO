import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/auth/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage("Create a new Job")
  create(@Body() createJobDto: CreateJobDto , @User() user : IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch Jobs with paginate")
  findAll(@Query('current') page : string , @Query('pageSize') limit : string , @Query() query : string) {
    return this.jobsService.findAll(page, limit, query);
  }

  
  @Public()
  @Get(':id')
  @ResponseMessage("Fetch a Job by id")
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a Job")
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user : IUser) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a Job")
  remove(@Param('id') id: string, @User() user : IUser) {
    return this.jobsService.remove(id, user);
  }
}

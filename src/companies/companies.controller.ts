import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { IUser } from 'src/auth/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Company created successfully')
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user : IUser) {
    return this.companiesService.create(createCompanyDto,user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user : IUser) {
    return this.companiesService.update(id, updateCompanyDto,user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch companies paginated ")
  findAll(@Query('current') page : string , @Query('pageSize') limit : string , @Query() query : string) {
    
    return this.companiesService.findAll(page, limit, query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user : IUser) {
    return this.companiesService.remove(id,user);
  }
}

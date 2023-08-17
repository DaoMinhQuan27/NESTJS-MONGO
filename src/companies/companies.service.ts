import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/user.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}
  async create(company: CreateCompanyDto , user : IUser) {
    try {
      let response = await this.companyModel.create({
        ...company,
        createdBy : {
          _id : user._id,
          email : user.email,
        }
      });
      return response;
    } catch (error) {
      return error;
    }
  }

  async findAll(page : string, limit : string, query : string) {
    try {
      const limit1 = limit ? +limit : 5;
      const offset = (+page - 1) * limit1;
      const { filter, sort, projection, population } = aqp(query);
      delete filter.current;
      delete filter.pageSize;
      const totalItems = await this.companyModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit1);
      
      let result = await this.companyModel.find(filter).limit(limit1).skip(offset)
      // @ts-ignore:Unreachable code error
      .sort(sort).select(projection).populate(population)
      ;
      return {
        meta : {
          current:page,
          pageSize:limit1,
          pages:totalPages,
          total:totalItems,
        },
        result
      }
    } catch (error) {
      return error;
    }
  }

  findOne(id: string) {
    return this.companyModel.findById(id);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      let response = await this.companyModel.updateOne({ _id: id },
        {...updateCompanyDto,updatedBy : {
          _id : user._id,
          email : user.email,
        }}
        )
      return response;
    } catch (error) {
      return error;
    }
  }

  async remove(id: string, user: IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      await this.companyModel.updateOne({ _id: id },{deletedBy : {_id : user._id,email : user.email}}) 
      
      return this.companyModel.softDelete({ _id: id });
    } catch (error) {
      return error;
    }
  }
}

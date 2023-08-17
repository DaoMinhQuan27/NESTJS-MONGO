import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/user.interface';
import { ADMIN_ROLE } from 'src/database/sample';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import { Subcriber, SubcriberDocument } from './schemas/subcriber.schema';


@Injectable()
export class SubcribersService {
  constructor(@InjectModel(Subcriber.name) private subcriberModel: SoftDeleteModel<SubcriberDocument>) {}
  async create(subcriber : CreateSubcriberDto, user : IUser) {
    try {
      let checkEmail = await this.subcriberModel.findOne({email:subcriber.email})
      if(checkEmail) throw new BadRequestException(`Subcriber ${subcriber.email} already exists`);
      let response = await this.subcriberModel.create({...subcriber, createdBy : {_id:user._id, email:user.email}})
      return {
        _id:response._id,
        createdAt:response.createdAt,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getSubcriberSkill(user : IUser) {
    try {
      let response = await this.subcriberModel.findOne({email:user.email}, {skills:1})
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(page : string, limit : string, query : string) {
    try {
      const limit1 = limit ? +limit : 5;
      const offset = (+page - 1) * limit1;
      const { filter, sort, projection, population } = aqp(query);
      delete filter.current;
      delete filter.pageSize;
      const totalItems = await this.subcriberModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit1);
      
      let result = await this.subcriberModel.find(filter).limit(limit1).skip(offset)
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
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');
      }
      let response = await this.subcriberModel.findById(id)
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(updateSubcriberDto: UpdateSubcriberDto, user : IUser) {
    try {
      let response = await this.subcriberModel.updateOne(
        {email:user.email}, 
        {...updateSubcriberDto, updatedBy : {_id:user._id, email:user.email}}, 
        {upsert:true}
        )
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string, user : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      let response = await this.subcriberModel.updateOne({_id : id}, {
        deletedBy:{
          _id : user._id,
          email : user.email,
        }
      })
      return this.subcriberModel.softDelete({_id : id});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}

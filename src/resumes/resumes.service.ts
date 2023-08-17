import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/user.interface';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.shema';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) {}
  async create(createResumeDto: CreateUserCvDto , user : IUser) {
    try {
      let response = await this.resumeModel.create({
        ...createResumeDto,
        email : user.email,
        userId : user._id,
        status : "PENDING",
        history : [{
          status : "PENDING",
          updatedAt : new Date(),
          updatedBy : {
            _id : user._id,
            email : user.email,
          }
        }],
        createdBy : {
          _id : user._id,
          email : user.email,
        }
      });
      return {
        _id: response._id,
        createdAt: response.createdAt,
      }
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
      const totalItems = await this.resumeModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit1);
      
      let result = await this.resumeModel.find(filter).limit(limit1).skip(offset)
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
        throw new BadRequestException('Invalid Id');;
      }
      let response = await this.resumeModel.findById(id)
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      let findUser = await this.resumeModel.findById(id);
      let response = await this.resumeModel.updateOne({_id : id}, {
        ...updateResumeDto,
        updatedBy:{
          _id : user._id,
          email : user.email,
        },
        history : [
          ...findUser.history,
          {
            status : updateResumeDto.status,
            updatedAt : new Date(),
            updatedBy : {
              _id : user._id,
              email : user.email,
            }
          }
        ]
      })
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
      let response = await this.resumeModel.updateOne({_id : id}, {
        deletedBy:{
          _id : user._id,
          email : user.email,
        }
      })
      return this.resumeModel.softDelete({_id : id});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCvByUser(user : IUser) {
    try {
      let response = await this.resumeModel.find({userId : user._id}).sort({createdAt : -1})
      .populate([{path : "jobId", select : "name"} , {path : "companyId", select : "name"}]);
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

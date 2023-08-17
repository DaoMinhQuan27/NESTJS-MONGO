import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/user.interface';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) {}
  async create(permission : CreatePermissionDto, user : IUser) {
    try {
      let checkPath = await this.permissionModel.findOne({apiPath:permission.apiPath , method:permission.method})
      if(checkPath) throw new BadRequestException(`Path ${permission.apiPath} with method ${permission.method} already exists`);
      let response = await this.permissionModel.create({...permission, createdBy : {_id:user._id, email:user.email}})
      return {
        _id:response._id,
        createdAt:response.createdAt,
      };
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
      const totalItems = await this.permissionModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit1);
      
      let result = await this.permissionModel.find(filter).limit(limit1).skip(offset)
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
      let response = await this.permissionModel.findById(id)
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id : string , job: UpdatePermissionDto, user : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      let response = await this.permissionModel.updateOne({_id:id},{...job, updatedBy : {_id:user._id, email:user.email}})
      return response
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id : string, user : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      await this.permissionModel.updateOne({_id:id},{ deletedBy : {_id:user._id, email:user.email}})
      let response = this.permissionModel.softDelete({_id:id})
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

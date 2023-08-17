import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/user.interface';
import { ADMIN_ROLE } from 'src/database/sample';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, RoleDocument } from './schemas/role.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) {}
  async create(role : CreateRoleDto, user : IUser) {
    try {
      let checkName = await this.roleModel.findOne({name:role.name})
      if(checkName) throw new BadRequestException(`Role ${role.name} already exists`);
      let response = await this.roleModel.create({...role, createdBy : {_id:user._id, email:user.email}})
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
      const totalItems = await this.roleModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit1);
      
      let result = await this.roleModel.find(filter).limit(limit1).skip(offset)
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
      let response = await this.roleModel.findById(id).populate({path:'permissions', select:'_id name apiPath method module'});
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');;
      }
      // let checkName = await this.roleModel.findOne({name:updateRoleDto.name})
      // if(checkName) throw new BadRequestException(`Name ${updateRoleDto.name} already exists`);
      let response = await this.roleModel.updateOne({_id:id}, {...updateRoleDto, updatedBy : {_id:user._id, email:user.email}})
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
      let findAdmin = await this.roleModel.findOne({_id : id})
      if(findAdmin.name === ADMIN_ROLE) throw new BadRequestException('Cannot delete admin role');
      let response = await this.roleModel.updateOne({_id : id}, {
        deletedBy:{
          _id : user._id,
          email : user.email,
        }
      })
      return this.roleModel.softDelete({_id : id});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

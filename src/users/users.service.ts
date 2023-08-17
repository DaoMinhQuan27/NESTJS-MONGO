import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {genSaltSync,hashSync,compareSync} from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/auth/user.interface';
import aqp from 'api-query-params';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/database/sample';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument> , 
  private configService : ConfigService,
  @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  hassPassword(password: string){
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto , userJWT : IUser) {
    try {
      console.log(userJWT);
      const {email, gender, name, age , address, role , company} = createUserDto;

      const checkEmail = await this.findOneByEmail(email);
      if(checkEmail){
        throw new BadRequestException('Email already exists');
      }
      let user = await this.userModel.create({
        email , gender, name, age , address, role , company,
        password: this.hassPassword(createUserDto.password),
        createdBy: {
          _id: userJWT._id,
          email: userJWT.email,
        }
      });
      return {
        _id: user._id,
        createdAt: user.createdAt,
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
      const totalItems = await this.userModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / limit1);
      
      let result = await this.userModel.find(filter).select("-password").limit(limit1).skip(offset)
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
      let response = await this.userModel.findById(id).select('-password').populate({path:'role',select:'name permissions _id'});
      
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByUsername(username: string) {
    
    let response = await this.userModel.findOne({email: username}).populate({path:'role',select:'name '});
    return response;
  }

  async register(user : RegisterUserDto) {
    try {
      const role = await this.roleModel.findOne({name: USER_ROLE});
      const {email , name ,address, age, gender} = user;
      let response = await this.userModel.create({
        role:role._id,
        password: this.hassPassword(user.password),
        email , name ,address, age, gender
      });
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByEmail(email: string) {
    
    let response = await this.userModel.findOne({email: email});
    return response;
  }

  comparePassword(password: string, hashPassword: string) {
    const isPasswordValid = compareSync(password, hashPassword);
    return isPasswordValid;
  }

  async update(id: string, updateUserDto: UpdateUserDto , userJWT : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');
      }
      let response = await this.userModel.updateOne({_id: id}, {
        updatedBy:{
          _id: userJWT._id,
          email: userJWT.email,
        },
        ...updateUserDto
      } );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string , userJWT : IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');
      }
      let findAdmin = await this.userModel.findOne({_id: id});
      if(findAdmin.email === 'admin@gmail.com' || findAdmin.email === this.configService.get('ADMIN_EMAIL')){
        throw new BadRequestException('Cannot delete admin');
      }
      await this.userModel.updateOne({_id: id}, {
        deletedBy:{
          _id: userJWT._id,
          email: userJWT.email,
        }
      });
      let response = this.userModel.softDelete({_id: id});
    return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)){
        throw new BadRequestException('Invalid Id');
      }
      let response = await this.userModel.updateOne({_id: id}, {
        refreshToken: refreshToken
      } );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOneByRefreshToken(refreshToken: string) {
    let response = await this.userModel.findOne({refreshToken: refreshToken}).populate({path:'role',select:'name '});;
    return response;
  }
}

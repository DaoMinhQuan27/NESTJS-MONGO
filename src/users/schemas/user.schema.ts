import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
	@Prop({required: true})
  email: string;

	@Prop({required: true})
  password: string;

  @Prop()
  address: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Role'})
  role: mongoose.Schema.Types.ObjectId;

  @Prop()
  refreshToken: string;

	@Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop()
  gender: string;

  @Prop()
  age: number;

  @Prop({type:Object})
  company:{
    _id:mongoose.Schema.Types.ObjectId,
    name:string
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({type:Object})
  createdBy:{
    _id:mongoose.Schema.Types.ObjectId,
    email:string
  };

  @Prop({type:Object})
  updatedBy:{
    _id:mongoose.Schema.Types.ObjectId,
    email:string
  };

  @Prop({type:Object})
  deletedBy:{
    _id:mongoose.Schema.Types.ObjectId,
    email:string
  };

  @Prop()
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
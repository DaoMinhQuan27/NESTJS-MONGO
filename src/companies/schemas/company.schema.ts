import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
export type CompanyDocument = HydratedDocument<Company>;

@Schema({timestamps: true})
export class Company {
  @Prop({required: true})
  name: string;

	@Prop({required: true})
  description: string;

  @Prop()
  address: string;

  @Prop()
  logo : string;

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

export const CompanySchema = SchemaFactory.createForClass(Company);
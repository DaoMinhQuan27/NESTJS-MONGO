import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
export type SubcriberDocument = HydratedDocument<Subcriber>;

@Schema({timestamps: true})
export class Subcriber {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  skills: string[];

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

export const SubcriberSchema = SchemaFactory.createForClass(Subcriber);
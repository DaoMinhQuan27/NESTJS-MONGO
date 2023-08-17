import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
export type ResumeDocument = HydratedDocument<Resume>;

@Schema({timestamps: true})
export class Resume {
  @Prop()
  email: string;

	@Prop()
  url: string;

  @Prop({type:mongoose.Schema.Types.ObjectId, ref:'User'})
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  status: string;

  @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Company'})
  companyId : mongoose.Schema.Types.ObjectId;

  @Prop({type:mongoose.Schema.Types.ObjectId, ref:'Job'})
  jobId : mongoose.Schema.Types.ObjectId;

  @Prop({type:mongoose.Schema.Types.Array})
  history : {
    status:string,
    updatedAt:Date,
    updatedBy:{
      _id:mongoose.Schema.Types.ObjectId,
      email:string
    }
  }[]

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

export const ResumeSchema = SchemaFactory.createForClass(Resume);
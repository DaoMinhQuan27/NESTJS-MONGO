import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
export type RoleDocument = HydratedDocument<Role>;

@Schema({timestamps: true})
export class Role {
  @Prop()
  name: string;

	@Prop()
  description: string;

  @Prop()
  isActive: boolean;

  @Prop({type: [mongoose.Schema.Types.ObjectId], ref: 'Permission'})
  permissions: Permission[];

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

export const RoleSchema = SchemaFactory.createForClass(Role);
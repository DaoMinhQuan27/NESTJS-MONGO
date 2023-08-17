import { Module } from '@nestjs/common';
import { SubcribersService } from './subcribers.service';
import { SubcribersController } from './subcribers.controller';
import { Subcriber, SubcriberSchema } from './schemas/subcriber.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subcriber.name, schema: SubcriberSchema }])],
  controllers: [SubcribersController],
  providers: [SubcribersService]
})
export class SubcribersModule {}

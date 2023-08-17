import { PartialType } from '@nestjs/swagger';
import { CreateSubcriberDto } from './create-subcriber.dto';

export class UpdateSubcriberDto extends PartialType(CreateSubcriberDto) {}

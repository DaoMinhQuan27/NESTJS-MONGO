import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreatePermissionDto {
    @IsNotEmpty({message: 'Name is required'})
    @ApiProperty()
    name: string;

    @IsNotEmpty({message: 'ApiPath is required'})
    @ApiProperty()
    apiPath: string;

    @IsNotEmpty({message: 'Method is required'})
    @ApiProperty()
    method: string;

    @IsNotEmpty({message: 'Module is required'})
    @ApiProperty()
    module: string;

}

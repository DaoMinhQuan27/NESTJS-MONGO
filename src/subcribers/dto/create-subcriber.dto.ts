import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';

export class CreateSubcriberDto {
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    @ApiProperty()
    skills: string[];

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}


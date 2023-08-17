import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDate, IsDateString, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    logo: string;
}

export class CreateJobDto {
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
    @ApiProperty()
    location: string;

    @IsNotEmpty()
    @ApiProperty()
    salary: number;

    @IsNotEmpty()
    @ApiProperty()
    quantity: number;

    @IsNotEmpty()
    @ApiProperty()
    level: string;

    @IsNotEmpty()
    @ApiProperty()
    description: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    @ApiProperty()
    company: Company;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    startDate: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    endDate: Date;

    @IsNotEmpty()
    @ApiProperty()
    isActive: boolean;
}

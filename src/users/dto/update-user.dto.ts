import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import { Company } from 'src/companies/schemas/company.schema';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    _id: string;
    
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @ApiProperty({required:false})
    address: string;
    @ApiProperty({required:false})
    phone: string;
    @ApiProperty({required:false})
    gender: string;
    @ApiProperty({required:false})
    age: number;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    @ApiProperty()
    company: Company;

    @IsNotEmpty()
    @ApiProperty()
    role: string;
}

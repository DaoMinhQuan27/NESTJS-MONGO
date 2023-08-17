import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

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
    @IsMongoId()
    @ApiProperty()
    role: mongoose.Schema.Types.ObjectId;
}

export class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

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

}

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({example: 'user1@gmail.com', description: 'email'})
    username: string;

    @IsNotEmpty()
    @ApiProperty({example: 'password123', description: 'Password'})
    password: string;
}
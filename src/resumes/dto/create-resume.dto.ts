import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
    @IsNotEmpty({message: 'Email is required'})
    @ApiProperty()
    email: string;

    @IsNotEmpty({message: 'Url is required'})
    @ApiProperty()
    url: string;

    @IsNotEmpty({message: 'Status is required'})
    @ApiProperty()
    status: string;

    @IsNotEmpty({message: 'UserId is required'})
    @ApiProperty()
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'CompanyId is required'})
    @ApiProperty()
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'JobId is required'})
    @ApiProperty()
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
    @IsNotEmpty({message: 'Url is required'})
    @ApiProperty()
    url: string;

    @IsNotEmpty({message: 'CompanyId is required'})
    @IsMongoId()
    @ApiProperty()
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'JobId is required'})
    @IsMongoId()
    @ApiProperty()
    jobId: mongoose.Schema.Types.ObjectId;
}

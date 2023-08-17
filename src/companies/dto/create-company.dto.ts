import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({message: 'Name is required'})
    @ApiProperty()
    name: string;

    @IsNotEmpty({message: 'Address is required'})
    @ApiProperty()
    address: string;

    @IsNotEmpty({message: 'Description is required'})
    @ApiProperty()
    description: string;

    @IsNotEmpty({message: 'Logo is required'})
    @ApiProperty()
    logo: string;
}

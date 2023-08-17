import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { RolesService } from 'src/roles/roles.service';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService ,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
        ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if(user){
            const userRole = user.role as unknown as { _id: string, name: string };
            const role = await this.rolesService.findOne(userRole._id)
            const isPasswordValid = this.usersService.comparePassword(pass, user.password);
            if(isPasswordValid){
                return {
                    ...user.toObject(),
                    permissions: role.permissions ?? []
                }
            }
        }
        return null;
    }

    async login(user: IUser , response: Response) {
        const { _id , name, email , role , permissions } = user;
        const payload = { 
            sub:"token login",
            iss:"from server",
            _id,
            name,
            email,
            role
        };
        const refreshToken = await this.createRefreshToken(payload);

        // Update refresh token to database
        await this.usersService.updateRefreshToken(_id, refreshToken);
        // set cookies
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED')),
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        };
    }

    async logout(response: Response, user : IUser) {
        await this.usersService.updateRefreshToken(user._id, null);
        response.clearCookie('refreshToken');
        return 'ok'
    }

    async register(user: RegisterUserDto) {
        const email = user.email;
        
        let checkEmail = await this.usersService.findOneByEmail(email);
        if(checkEmail){
            throw new BadRequestException('Email already exists');
        } else{
            let newUser = await this.usersService.register(user);
            return {
                _id: newUser._id,
                createdAt: newUser.createdAt,
            };
        }
    }

    async createRefreshToken(payload: any) {
        let refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED'))/1000,
        });
        return refreshToken;
    }

    async refresh(refreshToken: string , response: Response) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN'),
            });
            const user = await this.usersService.findOneByRefreshToken(refreshToken);
            const roleUser = user.role as unknown as { _id: string, name: string };
            const findPermission = await this.rolesService.findOne(roleUser._id)
            if(user){
                const { _id , name, email , role } = user;
                const payload = { 
                    sub:"token refesh",
                    iss:"from server",
                    _id,
                    name,
                    email,
                    role
                };
                const refreshToken = await this.createRefreshToken(payload);

                // Update refresh token to database
                await this.usersService.updateRefreshToken(_id.toString(), refreshToken);
                // set cookies
                response.clearCookie('refreshToken');
                response.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRED')),
                })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: findPermission.permissions ?? []
                    }
                };
            } else{
                throw new BadRequestException('Invalid refresh token');
            }
        } catch (error) {
            throw new BadRequestException('Invalid refresh token');
        }
    }
}

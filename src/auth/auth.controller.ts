import { Controller,Render, Get , Post, Req ,UseGuards, Body, Res } from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LoginUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import {  Response , Request } from 'express';
import { IUser } from './user.interface';
import { RolesService } from 'src/roles/roles.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rolesService: RolesService
    ) {}


  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @ApiBody({type : LoginUserDto})
  @Post('login')
  async login(@User() user : IUser,@Res({ passthrough: true }) response: Response) {
    return this.authService.login(user , response);
  }

  
  @ResponseMessage("User logout")
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response, @User() user : IUser) {
    return this.authService.logout(response, user);
  }
  
  @Public()
  @ResponseMessage("Register a new user")
  @Post('register')
  async register(@Body() user : RegisterUserDto) {
    
    return this.authService.register(user);
  }

  @ResponseMessage("Get user infomation")
  @Get('account')
  async account(@User() user : IUser) {
    const role = await this.rolesService.findOne(user.role._id) as any;
    user.permissions = role.permissions;
    return {user}
  }

  @ResponseMessage("Get User by refresh token")
  @Get('refresh')
  refresh(@Req() req :  Request , @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies['refreshToken'];
    return this.authService.refresh(refreshToken , response);
  }
}

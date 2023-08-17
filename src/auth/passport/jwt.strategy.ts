import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '../user.interface';
import { RolesService } from 'src/roles/roles.service';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService, 
    private readonly rolesService: RolesService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:configService.get<string>('JWT_ACCESS_TOKEN'),
    });
  }

  async validate(payload: IUser) {
    const { _id , name, email , role } = payload;

    // get permissions from role
    const userRole = role as unknown as { _id: string, name: string };
    const findRole = await this.rolesService.findOne(userRole._id)
    return { _id, name, email , role , permissions: findRole.permissions ?? [] };
    // return req.user
  }
}
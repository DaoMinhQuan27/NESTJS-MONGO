import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
      super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info,context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token or cannot get bearer token');
    }
    // Check permission
    const isPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Check if user has permission to access resource
    const method = request.method;
    const apiPath = request.route.path as string;

    let check : any = user.permissions.find(permission => {
      return permission.method === method && permission.apiPath === apiPath;
    })

    if(apiPath.startsWith('/api/v1/auth')) check = true;
    if(!check && !isPermission){
      throw new ForbiddenException('You do not have permission to access this resource')
    }
    return user;
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";

import { ROLES_KEY } from './auth-roles.decorator';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService,
              private reflector: Reflector) {}

  canActivate(
      context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
          ROLES_KEY, [context.getHandler(), context.getClass()]);

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest(); // get req from context

      const authHeader = req.headers.authorization; //get header

      // divide authHeader into 2 parts
      const bearer = authHeader.split(' ')[0]; // type of the token
      const token = authHeader.split(' ')[1]; // token

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({message: 'User is not authorized'});
      }
      const user = this.jwtService.verify(token); // decode token;
      req.user = user;
      return user.role.some(role => requiredRoles.includes(role.value));
    } catch(e) {
      throw new HttpException('Access is denied', HttpStatus.FORBIDDEN)
    }
  }
}
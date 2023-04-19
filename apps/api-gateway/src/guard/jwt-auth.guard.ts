import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  /*
  Class for realisation func canActivate to returning true (access is allowed)
  or false (access is denied).
  */
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest(); // get req from context

    try {
      const authHeader = req.headers.authorization; //get header
      // divide authHeader into 2 parts
      const bearer = authHeader.split(' ')[0]; // type of the token
      const token = authHeader.split(' ')[1]; // token

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'User is not authorized',
        });
      }

      const user = this.jwtService.verify(token); // decode token;
      req.user = user;

      return true; // access is allowed.
    } catch(e) {
      throw new UnauthorizedException({
        message: 'User is not authorized',
      });
    }
  }
}
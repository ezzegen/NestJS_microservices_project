import {
  Controller,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { UserCreateDto } from './dto/user-create.dto';
import { RoleAddDto } from './dto/role-add.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {} // injection service

  @MessagePattern('login.user')
  login(userDto: UserCreateDto): Promise<object> {
    return this.authService.login(userDto);
  }

  @MessagePattern('registration.user')
  registration(userDto: UserCreateDto): Promise<object> {
    return this.authService.registration(userDto);
  }

  @MessagePattern('add.role')
  addRoleToUser(dto: RoleAddDto): Promise<object> {
    return this.authService.addRoleToUser(dto);
  }

  @MessagePattern('get.users.auth')
  getAllUsers(): Promise<object[]> {
    return this.authService.getAllUsers();
  }

  @MessagePattern('delete.user')
  deleteUser(@Payload() id: number){
    return this.authService.deleteUser(Number(id));
  }
}

import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Roles } from '../guard/auth-roles.decorator';
import { RoleAuthGuard } from '../guard/role-auth.guard';

@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
    ) {}

  @Post('/login')
  login(@Body() user: { email: string, password: string }) {
    return this.authClient.send('login.user', user);
  }

  @Roles('ADMIN')
  @UseGuards(RoleAuthGuard)
  @Get('/users')
  getAllUsers() {
    return this.authClient.send('get.users.auth', '')
  }

  @Roles('ADMIN')
  @UseGuards(RoleAuthGuard)
  @Post('/role')
  addRoleToUser(@Body() role: { value: string, userId: number }) {
    return this.authClient.send('add.role', role);
  }
}

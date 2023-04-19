import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Roles } from '../guard/auth-roles.decorator';
import { RoleAuthGuard } from '../guard/role-auth.guard';
import { UserCreateDto } from './dto/user-create.dto';

@Controller()
export class ProfileController {
  constructor(
    @Inject('PROFILE_SERVICE')
    private profileClient: ClientProxy,
  ) {}

  @Post('/registration')
  createProfile(@Body() dto: UserCreateDto) {
    return this.profileClient.send('create.profile', dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getAllUsers() {
    return this.profileClient.send('get.users', '');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getOneUser(@Param() param) {
    return this.profileClient.send('get.one.user', Number(param.id));
  }

  @Roles('ADMIN', 'USER')
  @UseGuards(RoleAuthGuard)
  @Patch('profile/:id')
  updateUser(
    @Param() param,
    @Body() dto,
  ) {
    return this.profileClient.send('update.user', { id: Number(param.id), dto: dto });
  }

  @Roles('ADMIN')
  @UseGuards(RoleAuthGuard)
  @Delete('profile/:id')
  deleteUser(@Param() param) {
    return this.profileClient.send('delete.user', Number(param.id) );
  }

}

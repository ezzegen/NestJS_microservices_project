import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProfileService } from './profile.service';
import { ProfileEntity } from './entity/profile.entity';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserCreateDto } from './dto/user-create.dto';


@Controller()
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    ) {}

  @MessagePattern('create.profile')
  createProfile(@Payload() dto: UserCreateDto) {
    return this.profileService.createProfile(dto);
  }

  @MessagePattern('get.users')
  getAllUsers(): Promise<ProfileEntity[]> {
    return this.profileService.getAllUsers();
  }

  @MessagePattern('get.one.user')
  getOneUser(id: number): Promise<ProfileEntity> {
    return this.profileService.getOneUser(+id);
  }

  @MessagePattern('update.user')
  updateUser(
    @Payload() body:any
  ): Promise<ProfileEntity | null> {
    const dto: UserUpdateDto = body.dto;
    return this.profileService.updateUser(Number(body.id), dto);
  }

  @MessagePattern('delete.user')
  deleteUser(@Payload() id: number) {
    return this.profileService.deleteUser(+id);
  }
}

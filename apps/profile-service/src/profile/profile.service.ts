import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';

import { ProfileEntity } from './entity/profile.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class ProfileService {
  constructor(
    // Injecting tables.
    // Repository is just like EntityManager but its operations are limited to a concrete entity.
    @InjectRepository(ProfileEntity)
    private userProfileRepository: Repository<ProfileEntity>,
    @Inject('AUTH_SERVICE')
    private authClient: ClientProxy,
  ) {}

  async createProfile(dto: UserCreateDto): Promise<ProfileEntity> {
    const observableUser = await this.authClient.send('registration.user', {
      email: dto.email,
      password: dto.password,
    });
    const user: any = await lastValueFrom(observableUser);

    const user_profile = await this.userProfileRepository.save({
      auth_id: user.id,
      name: dto.name,
      surname: dto.surname,
      age: dto.age,
      phone: dto.phone,
    });
    return user_profile;
  }

  async getAllUsers(): Promise<ProfileEntity[]> {
    return await this.userProfileRepository.find();
  }

  async getOneUser(user_id: number): Promise<ProfileEntity | null> {
    return await this.userProfileRepository.findOne({
      where: {
        id: user_id,
      },
    });
  }

  async updateUser(
    user_id: number,
    dto: UserUpdateDto,
  ): Promise<ProfileEntity | null> {
    const user = await this.userProfileRepository.findOne({
      where: {
        id: user_id,
      },
    });
    if (!user) {
      throw new HttpException('User are not found', HttpStatus.NOT_FOUND);
    }
    try {
      user[dto.property] = dto.value;
      return await this.userProfileRepository.save(user);
    } catch (e) {
      throw new HttpException(
        'Data is not validated!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(userId: number): Promise<any> {
    const observable = this.authClient.send('delete.user', userId);
    const result = await lastValueFrom(observable);
    await this.userProfileRepository.delete(userId);
    return result;
  }
}

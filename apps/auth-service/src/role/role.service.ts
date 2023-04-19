import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>
  ) {}

  async getRoleByValue(value: string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({
      where: { value },
      relations: { auth: true },
    });
  }
}

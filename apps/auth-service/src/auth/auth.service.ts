import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthEntity } from './entities/auth.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { RoleAddDto } from './dto/role-add.dto';
import { RoleService } from '../role/role.service';
import { RoleEntity } from '../role/role.entity';

@Injectable()
export class AuthService {
  /* injection service from ./user/
  !NB add ProfileModule in imports auth-service.module and ProfileService in exports user.module!
   */
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    private jwtService: JwtService,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    // // NB! Add RoleService in <exports> role.module and RoleModule in <imports> user.module!
    private roleService: RoleService,
    ) {}

  async login(userDto: UserCreateDto): Promise<object>{
      const user = await this.validateUser(userDto);
      return this.generateToken(user);
  }

  async getUserByEmail(email: string): Promise<AuthEntity | null> {
    const user = await this.authRepository.findOne({
      where: { email },
      relations: {
        role: true, // Bidirectional relations one-to-one
      },
    });
    return user;
  }

  async registration(userDto: UserCreateDto): Promise<object> {

    const candidate = await this.getUserByEmail(userDto.email)

    // Checking if such email exists in the database
    if (candidate) {
      throw new HttpException(
        `User with login ${userDto.email} already exists!`,
        HttpStatus.BAD_REQUEST
        );
    }

    // Hashing password (npm i bcryptjs).
    const hashPassword = await bcrypt.hash(userDto.password, 8); // second argument - salt

    // Saving user with hashing password.
    const user = await this.createUser({
      ...userDto, password: hashPassword
    });
    const generateToken = await this.generateToken(user);
    return user;
  }

  async createUser(userDto: UserCreateDto): Promise<AuthEntity> {
    let user_role = await this.roleService.getRoleByValue('USER')

    if (!user_role) {
      const newRole= await this.roleRepository.create({
        value: 'USER',
        description: 'User',
      });
      await this.roleRepository.save(newRole);
      user_role = await this.roleService.getRoleByValue('USER');
    }

    if (userDto.email == process.env.SUPER_USER) {
      const admin = await this.roleRepository.create({
        value: 'ADMIN',
        description: 'Administrator',
      });
      await this.roleRepository.save(admin);
      user_role = await this.roleService.getRoleByValue('ADMIN');
    }

    // Save data in table user_auth
    const user_auth = await this.authRepository.save({
      email: userDto.email,
      password: userDto.password,
      role: [user_role],
      relations: { role: true },
    });
    return user_auth;
  }


  private async generateToken(user: AuthEntity): Promise<object>{
    // Data in token.
    const payload = {
      login: user.email,
      id: user.id,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload) // data can be viewed in /jwt.io
    };
  }

  private async validateUser(userDto: UserCreateDto): Promise<AuthEntity>{
    const user = await this.getUserByEmail(userDto.email);

    // Checking the match of the entered password and the password from the database.
    if (user) {
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    }

    throw new UnauthorizedException({ message: 'Incorrect password or login!' });
  }

  async addRoleToUser(dto: RoleAddDto): Promise<AuthEntity> {
    const user = await this.authRepository.findOne({
      where: { id: dto.userId },
      relations: { role: true },
    });
    const user_role = await this.roleService.getRoleByValue(dto.value);
    if (user_role && user) {
      user.role.push(user_role);
      await this.authRepository.save(user);
      return user;
    }
    throw new HttpException('User or role are not found', HttpStatus.NOT_FOUND);
  }

  async getAllUsers(): Promise<AuthEntity[]> {
    return await this.authRepository.find();
  }

  async deleteUser(userId: number): Promise<any> {
    return await this.authRepository.delete(userId);
  }
}

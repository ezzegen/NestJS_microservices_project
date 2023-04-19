import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { AuthService } from '../auth.service';
import { RoleService } from '../../role/role.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from '../entities/auth.entity';
import { RoleEntity } from '../../role/role.entity';


describe('AuthService', () => {
  const role = [
    {
      ADMIN: "ADMIN",
      Description: "Administrator"
    }
  ];

  const testUser = {
    id: 1,
    email: 'nika@gmail.com',
    password: 'password',
    role: role[0]
  };

  const addRole = {
    value: 'ADMIN',
    userId: 1
  }

  const token = 'token';

  let authService: AuthService;
  let sampleUser: object;
  let authRepository: typeof AuthEntity;
  let roleRepository: typeof RoleEntity;

  let signAsyncMock = jest.fn(() => token);
  let addRoleToUserMock = jest.fn(() => sampleUser);

  const mockRepository = {
    findAll: jest.fn(() => {
      return [sampleUser]
    }),
    findOne: jest.fn(() => sampleUser),
    findByPk: jest.fn(() => sampleUser),
    create: jest.fn(() => sampleUser),
  }

  beforeAll(async () => {
    sampleUser = {
      ...testUser,
      password: await bcrypt.hash(testUser.password, 10),
    };
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(AuthEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: mockRepository,
        },
        {
          provide: RoleService,
          useValue: addRoleToUserMock
        },
        {
          provide: JwtService,
          useValue: {
            sign: signAsyncMock,
          }
        }
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authRepository = moduleRef.get<typeof AuthEntity>(getRepositoryToken(AuthEntity));
    roleRepository = moduleRef.get<typeof RoleEntity>(getRepositoryToken(RoleEntity))
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login method', () => {
    it('should return an auth token', async () => {
        const result = await authService.login(testUser);
        expect(result).toEqual({ token });
        expect(signAsyncMock).toBeCalled();
      });
    });

  describe('When calling getUserByEmail method', () => {
    describe('with an existing email', () => {
      it('should return one user', async () => {
        const result = await authService.getUserByEmail(testUser.email);
        expect(result).toEqual(sampleUser);
        expect(mockRepository.findOne).toBeCalledWith({
          where: { email: testUser.email },
          relations: {role: true}
        });
      });
    });
  });
});
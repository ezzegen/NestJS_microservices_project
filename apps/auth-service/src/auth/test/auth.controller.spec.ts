import { Test } from '@nestjs/testing';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';


describe('AuthController', () => {

  const roles =[
    {
      value: "ADMIN",
      Description: "Administrator"
    }
  ];

  const addRole = {
    value: roles[0].value,
    userId: 1
  }

  const testUser = {
    id: 1,
    email: "nika@gmail.com",
    password: 'password',
    role: roles[0]
  };

  let authController: AuthController;
  let authService: AuthService;
  let token = 'token';

  let getAllUsersMock: jest.SpyInstance;
  let registrationUserMock: jest.SpyInstance;
  let addRoleToUserMock: jest.SpyInstance;
  let deleteUserMock: jest.SpyInstance;
  let loginUserMock: jest.SpyInstance;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAllUsers: jest.fn(() => {
              return [testUser]
            }),
            registration: jest.fn(() => testUser),
            deleteUser: jest.fn(),
            login: jest.fn(() => ({ token })),
            addRoleToUser: jest.fn(() => testUser)
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);

    getAllUsersMock = jest.spyOn(authService, 'getAllUsers');
    registrationUserMock = jest.spyOn(authService, 'registration');
    deleteUserMock = jest.spyOn(authService, 'deleteUser');
    loginUserMock = jest.spyOn(authService, 'login');
    addRoleToUserMock = jest.spyOn(authService, 'addRoleToUser')
  });

  describe('getAll-method', () => {
    it('should return an array of users', async () => {
      const result = await authController.getAllUsers();
      expect(result).toEqual([testUser]);
    });
  });

  describe('registration-method', () => {
      it('should return a created user-auth data', async () => {
        const result = await authController.registration(testUser);
        expect(result).toEqual(testUser);
        expect(registrationUserMock).toBeCalledWith(testUser);
      });
    });

  describe('add role to user method', () => {
      it('should return user data with role', async () => {
        const result = await authController.addRoleToUser(addRole);
        expect(result).toEqual(testUser);
        expect(addRoleToUserMock).toBeCalledWith(addRole);
      });
    });

  describe('login-method', () => {
      it('should return token', async () => {
        const result = await authController.login(testUser);
        expect(result).toEqual({ token });
        expect(loginUserMock).toBeCalledWith(testUser);
      });
    });

    describe('delete-method', () => {
        let existingId = 1;
        it('should delete and return undefined', async () => {
          const result = await authController.deleteUser(existingId);
          expect(result).toBeUndefined();
          expect(deleteUserMock).toBeCalledWith(existingId);
        });
    });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});


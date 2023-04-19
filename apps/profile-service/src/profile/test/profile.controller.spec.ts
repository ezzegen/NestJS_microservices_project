import { Test } from '@nestjs/testing';

import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';


describe('ProfileController', () => {

    const testUser = {
        id: 1,
        email: "nika@gmail.com",
        password: 'password',
        name: 'Veronica',
        surname: 'Bakhareva',
        age: 27,
        phone: 89600000000
    };

    let profileController: ProfileController;
    let profileService: ProfileService;

    let getAllUsersMock: jest.SpyInstance;
    let createProfileMock: jest.SpyInstance;
    let getOneUserMock: jest.SpyInstance;
    let deleteUserMock: jest.SpyInstance;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
                {
                    provide: ProfileService,
                    useValue: {
                        getAllUsers: jest.fn(() => {
                            return [testUser]
                        }),
                        getOneUser: jest.fn(() => testUser),
                        createProfile: jest.fn(() => testUser),
                        deleteUser: jest.fn(),
                    },
                },
            ],
        }).compile();

        profileService = moduleRef.get<ProfileService>(ProfileService);
        profileController = moduleRef.get<ProfileController>(ProfileController);

        getAllUsersMock = jest.spyOn(profileService, 'getAllUsers');
        createProfileMock = jest.spyOn(profileService, 'createProfile');
        deleteUserMock = jest.spyOn(profileService, 'deleteUser');
        getOneUserMock = jest.spyOn(profileService, 'getOneUser');
    });

    describe('getAll-method', () => {
        it('should return an array of users', async () => {
            const result = await profileController.getAllUsers();
            expect(result).toEqual([testUser]);
        });
    });

    describe('createProfile-method', () => {
        it('should return a created user-profile', async () => {
            const result = await profileController.createProfile(testUser);
            expect(result).toEqual(testUser);
            expect(createProfileMock).toBeCalledWith(testUser);
        });
    });

    describe('getOneUser-method', () => {
            it('should return one user', async () => {
                let id = 1;
                const result = await profileController.getOneUser(id);
                expect(result).toEqual(testUser);
                expect(getOneUserMock).toBeCalledWith(id);
            });
    });

    describe('delete-method', () => {
        let id = 1;
        it('should delete and return undefined', async () => {
            const result = await profileController.deleteUser(id);
            expect(result).toBeUndefined();
            expect(deleteUserMock).toBeCalledWith(id);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
});


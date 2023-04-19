import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';

import { ProfileService } from '../profile.service';
import { ProfileEntity } from '../entity/profile.entity';


describe('ProfileService', () => {

    const testAuth = {
        id: 1,
        email: "nika@gmail.com",
        password: 'password',
    };

    const testProfile = {
        id: 1,
        auth_id: 1,
        name: 'Veronica',
        surname: 'Bakhareva',
        age: 27,
        phone: 89600000000
    };

    let client: ClientProxy;
    let profileService: ProfileService;
    let sampleProfile: object;
    let sampleAuth: object;
    let profileRepository: typeof ProfileEntity;
    let sendMock: jest.SpyInstance;

    const mockRepository = {
        find: jest.fn(() => [testProfile]),
        findOne: jest.fn(() => sampleProfile),
        create: jest.fn(() => sampleProfile),
        delete: jest.fn()
    }

    beforeAll(async () => {
        sampleProfile = {
            ...testProfile
        };
        sampleAuth = {
            ...testAuth
        }
    });

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: getRepositoryToken(ProfileEntity),
                    useValue: mockRepository,
                },
                {
                    provide: 'AUTH_SERVICE',
                    useValue: {
                        send: jest.fn(() => sampleAuth),
                    },
                }
            ],
        }).compile();

        client = moduleRef.get<ClientProxy>('AUTH_SERVICE');
        profileService = moduleRef.get<ProfileService>(ProfileService);
        profileRepository = moduleRef.get<typeof ProfileEntity>(getRepositoryToken(ProfileEntity));
        sendMock = jest.spyOn(client, 'send');
    });

    it('should be defined', () => {
        expect(profileService).toBeDefined();
    });

    describe('When calling getAllUsers method', () => {
        it('should return an array of users', async () => {
            const result = await profileService.getAllUsers();
            expect(result).toEqual([testProfile]);
            expect(mockRepository.find).toBeCalled();
        });
    });

    describe('When calling getUserByEmail method', () => {
        it('should return one user', async () => {
            let id = 1;
            const result = await profileService.getOneUser(id);
            expect(result).toEqual(testProfile);
            expect(mockRepository.findOne).toBeCalledWith({
                where: {id: testProfile.id},
                });
            });
        });
});

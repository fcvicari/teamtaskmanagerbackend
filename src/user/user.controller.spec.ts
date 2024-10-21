import { Test, TestingModule } from '@nestjs/testing';
import { jwtServiceMock } from '../../test/mocks/jwtService.mock';
import { passwordHashMock } from '../../test/mocks/password.hash.mock';
import { userServiceMock } from '../../test/mocks/user.repository.mock';
import { userTokenServiceMock } from '../../test/mocks/userToken.repository.mock';
import { UserController } from './user.controller';

describe('UserController Tests', () => {
  let userController: UserController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        passwordHashMock,
        userServiceMock,
        userTokenServiceMock,
        jwtServiceMock,
      ],
    }).compile();

    userController = moduleFixture.get<UserController>(UserController);
  });

  it('Should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('Update user - id does not exist', async () => {
    const body = {
      email: 'jonhdoe@jonhdoe.com',
      name: 'Jonh Doe',
      avatar: 'avatar',
    };

    await expect(
      userController.updateUser(body, 'idNotExists'),
    ).rejects.toHaveProperty('statusCode', 400);
  });

  it('Update user - inactive user', async () => {
    const body = {
      email: 'jonhdoe@jonhdoe.com',
      name: 'Jonh Doe',
      avatar: 'avatar',
    };

    await expect(userController.updateUser(body, '2')).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  it('Update user - success', async () => {
    const body = {
      email: 'jonhdoe@jonhdoe.com',
      name: 'Jonh Doe Update',
      avatar: 'avatar',
    };

    const updateUser = await userController.updateUser(body, '1');

    expect(updateUser.email).toEqual(body.email);
  });

  it('Change password user - user does not exist', async () => {
    const body = {
      password: '12345',
      newPassword: '12345NewPassword',
    };

    await expect(
      userController.changePasswordUser(body, 'idNotExists'),
    ).rejects.toHaveProperty('statusCode', 400);
  });

  it('Change password user - user inactive', async () => {
    const body = {
      password: '12345',
      newPassword: '12345NewPassword',
    };

    await expect(
      userController.changePasswordUser(body, '2'),
    ).rejects.toHaveProperty('statusCode', 401);
  });

  it('Change user password - current password and new password are the same', async () => {
    const body = {
      password: '12345',
      newPassword: '12345',
    };

    await expect(
      userController.changePasswordUser(body, '1'),
    ).rejects.toHaveProperty(
      'message',
      'The current password and the new password cannot be the same.',
    );
  });

  it('Change user password - the current password is invalid', async () => {
    const body = {
      password: '123456',
      newPassword: '12345NewPassword',
    };

    await expect(
      userController.changePasswordUser(body, '1'),
    ).rejects.toHaveProperty('message', 'The current password is not valid.');
  });

  it('Change user password - success', async () => {
    const body = {
      password: '12345',
      newPassword: '12345NewPassword',
    };

    const updateUser = await userController.changePasswordUser(body, '1');

    expect(updateUser.id).toEqual('1');
  });

  it('Delete user - id does not exist', async () => {
    await expect(
      userController.deleteUser('idNotExists'),
    ).rejects.toHaveProperty('statusCode', 400);
  });

  it('Delete user - success', async () => {
    expect(await userController.deleteUser('1')).toEqual(true);
  });
});

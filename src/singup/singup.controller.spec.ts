import { Test, TestingModule } from '@nestjs/testing';
import { passwordHashMock } from '../../test/mocks/password.hash.mock';
import {
  userMock,
  userServiceMock,
} from '../../test/mocks/user.repository.mock';
import {
  userTokenMock,
  userTokenServiceMock,
} from '../../test/mocks/userToken.repository.mock';
import { SingupController } from './singup.controller';

describe('SingupController Tests', () => {
  let singupController: SingupController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SingupController],
      providers: [passwordHashMock, userServiceMock, userTokenServiceMock],
    }).compile();

    singupController = moduleFixture.get<SingupController>(SingupController);
  });

  it('Should be defined', () => {
    expect(singupController).toBeDefined();
  });

  describe('SingupController.postNewUser - Tests', () => {
    it('Creating new user - Existing email', async () => {
      const newUser = {
        email: 'jonhdoe@jonhdoe.com',
        name: 'Jonh Doe',
        password: '12345',
        avatar: null,
      };

      await expect(
        singupController.postNewUser(newUser),
      ).rejects.toHaveProperty('statusCode', 400);
    });

    it('Creating new user - Success', async () => {
      const newUser = {
        email: 'jonhdoeNewUser@jonhdoe.com',
        name: 'Jonh Doe',
        password: '12345',
        avatar: null,
      };

      const result = await singupController.postNewUser(newUser);

      expect(result.id).toEqual('idNewUser');
      expect(result.email).toEqual(newUser.email);
      expect(result.active).toEqual(false);
    });
  });

  describe('SingupController.postActivateUser - Tests', () => {
    it('User activation - Nonexistent token', async () => {
      const token = { token: 'userTokenMockNonexistent' };

      const result = await singupController.postActivateUser(token);

      await expect(result).toEqual(null);
    });

    it('User activation - Expired token', async () => {
      const token = { token: 'userTokenMockID1' };

      await expect(
        singupController.postActivateUser(token),
      ).rejects.toHaveProperty('statusCode', 400);
    });

    it('User activation - Successful', async () => {
      const token = { token: 'userTokenMockID2' };

      const result = await singupController.postActivateUser(token);

      await expect(result.id).toEqual('2');
      await expect(result.active).toEqual(true);
    });
  });

  describe('SingupController.postAlterPassword - Tests', () => {
    it('Alter password - Nonexistent token', async () => {
      const token = { token: 'userTokenMockNonexistent' };
      const password = { password: 'newPassword' };

      const result = await singupController.postAlterPassword(password, token);

      await expect(result).toEqual(null);
    });

    it('Alter password - Expired token', async () => {
      const token = { token: 'userTokenMockID1' };
      const password = { password: 'newPassword' };

      await expect(
        singupController.postAlterPassword(password, token),
      ).rejects.toHaveProperty('statusCode', 400);
    });

    it('Alter password - Successful', async () => {
      const userToken = userTokenMock[1];
      const token = { token: userToken.id };
      const password = { password: 'newPassword' };

      const result = await singupController.postAlterPassword(password, token);

      await expect(result.id).toEqual(userToken.userID);
    });
  });

  describe('SingupController.postRecoverPassword - Tests', () => {
    it('Recover Password - Nonexistent token', async () => {
      const body = { email: 'nonexistentemail@nonexistentemail.com' };

      const result = await singupController.postRecoverPassword(body);

      await expect(result).toEqual(null);
    });

    it('Alter password - Successful', async () => {
      const user = userMock[1];
      const body = { email: user.email };

      const result = await singupController.postRecoverPassword(body);

      await expect(result).toEqual(true);
    });
  });
});

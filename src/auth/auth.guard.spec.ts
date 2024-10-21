import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/database/prisma.service';
import { userServiceMock } from '../../test/mocks/user.repository.mock';
import { AuthGuard } from './auth.guard';

describe('AuthGuard Tests', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        JwtService,
        userServiceMock,
        {
          provide: PrismaService,
          useValue: {
            onModuleInit: jest.fn().mockImplementation(() => {
              return Promise.resolve(true);
            }),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  const mockExecutionContext = () =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          user: null,
        }),
      }),
    }) as unknown as ExecutionContext;

  it('CanActivate - Token does not exist in header.', async () => {
    const context = mockExecutionContext();
    await expect(authGuard.canActivate(context)).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  it('CanActivate - Invalid token', async () => {
    const context = mockExecutionContext();
    context.switchToHttp().getRequest().headers.authorization =
      'Bearer invalidtoken';

    await expect(authGuard.canActivate(context)).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  it('CanActivate - Non-existing user', async () => {
    const payload = {
      name: 'JonhDoe',
      email: 'jonhdoeNon-existing@jonhdoe.com',
      id: 'idNonExisting',
    };

    const accessToken = await jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const mockRequest = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(context)).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  it('CanActivate - Invalid user email', async () => {
    const payload = {
      name: 'JonhDoe',
      email: 'nonexisting@nonexisting.com',
      id: '1',
    };

    const accessToken = await jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const mockRequest = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(context)).rejects.toHaveProperty(
      'statusCode',
      401,
    );
  });

  it('CanActivate - Successful login', async () => {
    const payload = {
      name: 'JonhDoe',
      email: 'jonhdoe@jonhdoe.com',
      id: '1',
    };

    const accessToken = await jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    const mockRequest = {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    await expect(await authGuard.canActivate(context)).toBe(true);
  });
});

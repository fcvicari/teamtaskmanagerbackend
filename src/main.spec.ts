import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('Application Bootstrap', () => {
  let appMock: { useGlobalPipes: jest.Mock; listen: jest.Mock };

  beforeEach(() => {
    appMock = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
  });

  it('should create the app and set up the global ValidationPipe', async () => {
    const { bootstrap } = await import('./main');

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    expect(appMock.useGlobalPipes).toHaveBeenCalledWith(
      expect.any(ValidationPipe),
    );

    expect(appMock.listen).toHaveBeenCalledWith(3333);
  });
});

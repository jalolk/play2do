import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should register a new user, login, and access protected route', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Mock for registration
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.create.mockResolvedValueOnce({
        id: user.id,
        email: user.email,
        name: user.name,
        password: await bcrypt.hash(user.password, 10), // Hash the password
      });

      // Register
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('access_token');

      // Mock for login
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        id: user.id,
        email: user.email,
        name: user.name,
        password: await bcrypt.hash(user.password, 10), // Hash the password
      });

      // Login
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('access_token');
      const token = loginResponse.body.access_token;

      // Mock JWT verify
      jest
        .spyOn(jwtService, 'verify')
        .mockImplementation(() => ({ userId: user.id, email: user.email }));

      // Access protected route
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('email', user.email);
        });
    });

    it('should not register a user with an existing email', async () => {
      const user = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      // Mock existing user
      mockPrismaService.user.findUnique.mockResolvedValueOnce(user);

      // Try to register
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toBe('User already exists');
        });
    });

    it('should not login with incorrect credentials', async () => {
      const user = {
        id: '2',
        email: 'wrongcreds@example.com',
        password: 'hashedPassword123',
        name: 'Wrong Creds User',
      };

      // Mock user found but wrong password
      mockPrismaService.user.findUnique.mockResolvedValueOnce(user);

      // Try to login with wrong password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: 'wrongpassword' })
        .expect(401);
    });

    it('should not access protected route without valid token', async () => {
      await request(app.getHttpServer()).get('/auth/profile').expect(401);

      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });

  describe('Input Validation', () => {
    it('should not register with invalid email', async () => {
      const invalidUser = {
        email: 'notanemail',
        password: 'password123',
        name: 'Invalid Email User',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });

    it('should not register with short password', async () => {
      const invalidUser = {
        email: 'short@example.com',
        password: '123',
        name: 'Short Password User',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);
    });
  });
});

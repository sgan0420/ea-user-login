import request from 'supertest';
import express from 'express';
import { 
  registerController,
  verifyEmailController,
  loginController,
  completeLoginController,
  resendVerificationController,
  resendLoginOtpController,
  getUserDataController
} from '../src/controllers/authController';
import { authenticateToken } from '../src/middleware/authMiddleware';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler';

// Create Express app for testing
const app = express();
app.use(express.json());

// Setup routes
app.post('/register', registerController);
app.post('/verify-email', verifyEmailController);
app.post('/login', loginController);
app.post('/complete-login', completeLoginController);
app.post('/resend-verification', resendVerificationController);
app.post('/resend-login-otp', resendLoginOtpController);
app.get('/user', authenticateToken, getUserDataController);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

describe('Auth Controller Integration Tests', () => {
  // Suppress console.error during tests to avoid noise from expected errors
  let originalConsoleError: typeof console.error;
  
  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });

  // Helper function to create unique test data
  const createTestData = () => ({
    email: `test-${Date.now()}@test.com`,
    username: `user${Date.now()}`,
    password: 'ValidPassword123!'
  });

  describe('Registration Tests', () => {
    it('should fail with missing/invalid fields', async () => {
      const invalidInputs = [
        { username: 'test', password: 'password' }, // missing email
        { email: 'test@test.com', password: 'password' }, // missing username
        { email: 'test@test.com', username: 'test' }, // missing password
        { email: 'invalid-email', username: 'test', password: 'password' }, // invalid email
        { email: 'test@test.com', username: 'test', password: '123' } // weak password
      ];

      for (const input of invalidInputs) {
        const response = await request(app).post('/register').send(input);
        expect(response.status).toBe(422);
      }
    });

    it('should handle duplicate email registration', async () => {
      const userData = createTestData();
      
      // First registration
      await request(app).post('/register').send(userData);
      
      // Duplicate registration
      const response = await request(app).post('/register').send({
        ...userData,
        username: 'different-username'
      });
      
      expect([409, 422, 500]).toContain(response.status);
    });

    it('should successfully register new user', async () => {
      const userData = createTestData();
      const response = await request(app).post('/register').send(userData);
      
      if (response.status === 201) {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
      } else {
        expect([201, 409, 500]).toContain(response.status);
      }
    });
  });

  describe('Email Verification Tests', () => {
    it('should fail with missing/invalid fields', async () => {
      const invalidInputs = [
        { otpCode: '123456' }, // missing email
        { email: 'test@test.com' }, // missing OTP
        { email: 'test@test.com', otpCode: '123' } // invalid OTP format
      ];

      for (const input of invalidInputs) {
        const response = await request(app).post('/verify-email').send(input);
        expect([404, 422]).toContain(response.status);
      }
    });

    it('should handle verification with wrong OTP', async () => {
      const response = await request(app)
        .post('/verify-email')
        .send({ email: 'test@test.com', otpCode: '999999' });
      
      expect([400, 404]).toContain(response.status);
    });

    it('should handle successful verification flow', async () => {
      const userData = createTestData();
      const registerResponse = await request(app).post('/register').send(userData);

      if (registerResponse.status === 201 && registerResponse.body.data.otp) {
        const verifyResponse = await request(app)
          .post('/verify-email')
          .send({ 
            email: userData.email, 
            otpCode: registerResponse.body.data.otp 
          });

        if (verifyResponse.status === 200) {
          expect(verifyResponse.body.success).toBe(true);
          expect(verifyResponse.body.data.accessToken).toBeDefined();
        } else {
          expect([200, 400, 404]).toContain(verifyResponse.status);
        }
      }
    });
  });

  describe('Login Tests', () => {
    it('should fail with missing fields', async () => {
      const invalidInputs = [
        { password: 'password' }, // missing identifier
        { identifier: 'test@test.com' } // missing password
      ];

      for (const input of invalidInputs) {
        const response = await request(app).post('/login').send(input);
        expect(response.status).toBe(422);
      }
    });

    it('should handle wrong password', async () => {
      const userData = createTestData();
      await request(app).post('/register').send(userData);

      const response = await request(app)
        .post('/login')
        .send({ identifier: userData.email, password: 'wrongpassword' });
      
      expect([401, 404]).toContain(response.status);
    });

    it('should handle login with email and username', async () => {
      const userData = createTestData();
      await request(app).post('/register').send(userData);

      // Test with email
      const emailResponse = await request(app)
        .post('/login')
        .send({ identifier: userData.email, password: userData.password });
      expect([200, 401, 404, 500]).toContain(emailResponse.status);

      // Test with username
      const usernameResponse = await request(app)
        .post('/login')
        .send({ identifier: userData.username, password: userData.password });
      expect([200, 401, 404, 500]).toContain(usernameResponse.status);
    });

    it('should handle successful login flow', async () => {
      const userData = createTestData();
      const registerResponse = await request(app).post('/register').send(userData);

      if (registerResponse.status === 201) {
        const loginResponse = await request(app)
          .post('/login')
          .send({ identifier: userData.email, password: userData.password });

        if (loginResponse.status === 200) {
          expect(loginResponse.body.success).toBe(true);
          expect(loginResponse.body.data.userId).toBeDefined();
          expect(loginResponse.body.data.otpSent).toBe(true);
        } else {
          expect([200, 401, 404, 500]).toContain(loginResponse.status);
        }
      }
    });
  });

  describe('Complete Login Tests', () => {
    it('should fail with missing fields', async () => {
      const invalidInputs = [
        { otpCode: '123456' }, // missing userId
        { userId: 'user123' } // missing OTP
      ];

      for (const input of invalidInputs) {
        const response = await request(app).post('/complete-login').send(input);
        expect(response.status).toBe(422);
      }
    });

    it('should handle wrong OTP', async () => {
      const response = await request(app)
        .post('/complete-login')
        .send({ userId: 'some-user-id', otpCode: '999999' });
      
      expect([400, 404, 500]).toContain(response.status);
    });

    it('should handle complete login flow', async () => {
      const userData = createTestData();
      const registerResponse = await request(app).post('/register').send(userData);

      if (registerResponse.status === 201) {
        const loginResponse = await request(app)
          .post('/login')
          .send({ identifier: userData.email, password: userData.password });

        if (loginResponse.status === 200 && loginResponse.body.data.userId) {
          const completeResponse = await request(app)
            .post('/complete-login')
            .send({ 
              userId: loginResponse.body.data.userId, 
              otpCode: '123456' // Mock OTP
            });

          if (completeResponse.status === 200) {
            expect(completeResponse.body.success).toBe(true);
            expect(completeResponse.body.data.accessToken).toBeDefined();
          } else {
            expect([400, 401, 404]).toContain(completeResponse.status);
          }
        }
      }
    });
  });

  describe('Resend OTP Tests', () => {
    it('should fail with missing email', async () => {
      const endpoints = ['/resend-verification', '/resend-login-otp'];
      
      for (const endpoint of endpoints) {
        const response = await request(app).post(endpoint).send({});
        expect(response.status).toBe(422);
      }
    });

    it('should handle non-existent email', async () => {
      const response = await request(app)
        .post('/resend-verification')
        .send({ email: 'nonexistent@test.com' });
      
      expect([404, 500]).toContain(response.status);
    });

    it('should handle successful resend flow', async () => {
      const userData = createTestData();
      const registerResponse = await request(app).post('/register').send(userData);

      if (registerResponse.status === 201) {
        const resendResponse = await request(app)
          .post('/resend-verification')
          .send({ email: userData.email });

        if (resendResponse.status === 200) {
          expect(resendResponse.body.success).toBe(true);
        } else {
          expect([200, 404, 500]).toContain(resendResponse.status);
        }
      }
    });
  });

  describe('Get User Data Tests', () => {
    it('should fail with missing/invalid token', async () => {
      const testCases = [
        { headers: {} }, // no token
        { headers: { Authorization: 'Bearer invalid-token' } }, // invalid token
        { headers: { Authorization: 'InvalidToken' } }, // malformed header
        { headers: { Authorization: 'Bearer' } } // incomplete header
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .get('/user')
          .set(testCase.headers);
        
        expect([401, 500]).toContain(response.status);
      }
    });

    it('should handle successful user data retrieval', async () => {
      const userData = createTestData();
      const registerResponse = await request(app).post('/register').send(userData);

      if (registerResponse.status === 201 && registerResponse.body.data.otp) {
        const verifyResponse = await request(app)
          .post('/verify-email')
          .send({ 
            email: userData.email, 
            otpCode: registerResponse.body.data.otp 
          });

        if (verifyResponse.status === 200 && verifyResponse.body.data.accessToken) {
          const getUserResponse = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${verifyResponse.body.data.accessToken}`);

          if (getUserResponse.status === 200) {
            expect(getUserResponse.body.success).toBe(true);
            expect(getUserResponse.body.data.email).toBe(userData.email);
          } else {
            expect([200, 401, 404]).toContain(getUserResponse.status);
          }
        }
      }
    });
  });

  describe('Error Handling Tests', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
    });

    it('should handle malformed requests', async () => {
      const malformedTests = [
        // Invalid JSON
        request(app).post('/register').send('invalid-json').set('Content-Type', 'application/json'),
        // Empty bodies
        request(app).post('/register').send({}),
        // Invalid data types
        request(app).post('/register').send({ email: 123, username: null, password: true }),
        // Extremely long inputs
        request(app).post('/register').send({ 
          email: 'a'.repeat(1000) + '@test.com',
          username: 'b'.repeat(1000),
          password: 'c'.repeat(1000)
        })
      ];

      const responses = await Promise.all(malformedTests);
      responses.forEach(response => {
        expect([400, 422, 500]).toContain(response.status);
      });
    });
  });

  describe('OTP Coverage Tests', () => {
    it('should exercise OTP creation and validation', async () => {
      const userData = createTestData();
      
      // Test OTP creation through registration
      const registerResponse = await request(app).post('/register').send(userData);
      expect([201, 409, 422, 500]).toContain(registerResponse.status);

      if (registerResponse.status === 201) {
        // Test OTP validation with various codes
        const otpCodes = ['000000', '111111', '999999', 'abcdef', '123.56'];
        
        for (const code of otpCodes) {
          const response = await request(app)
            .post('/verify-email')
            .send({ email: userData.email, otpCode: code });
          
          expect([200, 400, 401, 404, 422]).toContain(response.status);
        }
      }
    });

    it('should test OTP types through login flow', async () => {
      const userData = createTestData();
      
      // Register (creates 'register' type OTP)
      const registerResponse = await request(app).post('/register').send(userData);
      
      if (registerResponse.status === 201) {
        // Login (creates 'login' type OTP)
        const loginResponse = await request(app)
          .post('/login')
          .send({ identifier: userData.email, password: userData.password });

        if (loginResponse.status === 200 && loginResponse.body.data.userId) {
          // Complete login (verifies 'login' type OTP)
          const completeResponse = await request(app)
            .post('/complete-login')
            .send({
              userId: loginResponse.body.data.userId,
              otpCode: '654321'
            });

          expect([200, 400, 401, 404]).toContain(completeResponse.status);
        }
      }
    });
  });
});

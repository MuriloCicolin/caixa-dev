import request from 'supertest';

import { getConnection, Connection } from 'typeorm';

import createConnection from '../database';

import app from '../app';

let connection: Connection;

describe('App', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM transactions');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to create a new user', async () => {
    const user = await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    expect(user.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should not be able to create a new user with an email already registered', async () => {
    await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    const response = await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: 'error',
        message: expect.any(String),
      }),
    );
  });

  it('should be able to authenticate', async () => {
    await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    const response = await request(app).post('/sessions').send({
      email: 'murilo@example.com',
      password: '123456',
    });

    expect(response.body).toMatchObject(
      expect.objectContaining({
        token: expect.any(String),
      }),
    );
  });

  it('should not be able to authenticate with non existing user', async () => {
    const response = await request(app).post('/sessions').send({
      email: 'murilo@example.com',
      password: '123456',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: 'error',
        message: expect.any(String),
      }),
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    const response = await request(app).post('/sessions').send({
      email: 'murilo@example.com',
      password: '12345656',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: 'error',
        message: expect.any(String),
      }),
    );
  });

  it('should be able to create a new Transaction', async () => {
    await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    const authentication = await request(app).post('/sessions').send({
      email: 'murilo@example.com',
      password: '123456',
    });

    const { token } = authentication.body;

    const response = await request(app)
      .post('/transactions')
      .send({
        description: 'Toaster',
        type: 'outcome',
        value: 250,
        category: 'home appliances',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it('should be able to list the transactions', async () => {
    await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    const authentication = await request(app).post('/sessions').send({
      email: 'murilo@example.com',
      password: '123456',
    });

    const { token } = authentication.body;

    await request(app)
      .post('/transactions')
      .send({
        description: 'Salary August',
        type: 'income',
        value: 5000,
        category: 'Salary',
      })
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/transactions')
      .send({
        description: 'Playstation 5',
        type: 'outcome',
        value: 2500,
        category: 'Eletronic',
      })
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .get('/transactions')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body.transactions).toHaveLength(2);
    expect(response.body.total).toEqual(2500);
  });

  it('should not be able to create a new transaction without token', async () => {
    await request(app).post('/users').send({
      name: 'Murilo',
      email: 'murilo@example.com',
      password: '123456',
    });

    await request(app).post('/sessions').send({
      email: 'murilo@example.com',
      password: '123456',
    });

    const response = await request(app).post('/transactions').send({
      description: 'Salary August',
      type: 'income',
      value: 5000,
      category: 'Salary',
    });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(
      expect.objectContaining({
        status: 'error',
        message: expect.any(String),
      }),
    );
  });
});

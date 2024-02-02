import {
  DatabaseManager,
  PluginDatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { getCurrentUsername } from '../service/router';

describe('createRouter', () => {
  let app: express.Express;

  const mockIdentityApi = {
    getIdentity: jest.fn().mockResolvedValue({
      identity: { userEntityRef: 'user:default/johndoe' },
    }),
  };

  mockIdentityApi.getIdentity.mockResolvedValue({
    identity: { userEntityRef: 'user:default/johndoe' },
  });

  //TODO: Author still shows as unknown

  function createTestDatabase(): PluginDatabaseManager {
    return DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'better-sqlite3',
            connection: ':memory:',
          },
        },
      }),
    ).forPlugin('adp');
  }

  beforeAll(async () => {
    const router = await createRouter({
      logger: getVoidLogger(),
      identity: mockIdentityApi,
      database: createTestDatabase(),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /armsLengthBody', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/armsLengthBody');
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /armsLengthBody', () => {
    it('returns ok', async () => {
      const author = await getCurrentUsername(mockIdentityApi, express.request);

      const expectedALB = {
        creator: author,
        owner: author,
        name: 'Test ALB example',
        short_name: 'ALB',
        description: 'This is an example ALB',
      };
      const response = await request(app)
        .post('/armsLengthBody')
        .send(expectedALB);
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /armsLengthBody', () => {
    it('returns 406 when ALB Name already exists', async () => {
      const expectedALB = {
        name: 'Marine & Maritime',
        short_name: 'ALB',
        description: 'This is an example ALB',
      };
      const response = await request(app)
        .post('/armsLengthBody')
        .send(expectedALB);
      expect(response.status).toEqual(406);
      expect(response.text).toEqual('{"error":"ALB Name already exists"}');
    });
  });

  describe('PATCH /armsLengthBody', () => {
    it('returns ok', async () => {
      const author = await getCurrentUsername(mockIdentityApi, express.request);

      const expectedALB = {
        creator: author,
        owner: author,
        name: 'Test ALB',
        short_name: 'ALB',
        description: 'This is an example ALB',
      };
      const postRequest = await request(app).post('/armsLengthBody').send(expectedALB);
      expect(postRequest.status).toEqual(200);
      const getCurrentData = await request(app).get('/armsLengthBody');
      const currentDataId = getCurrentData.body.find((e: {name: string}) => e.name === 'Test ALB').id
      const updatedALB = {
        name: 'Test ALB updated',
        id: currentDataId
      }
      const patchRequest = await request(app).patch('/armsLengthBody').send(updatedALB);
      expect (patchRequest.status).toEqual(200);
    });
  });

  describe('getCurrentUsername', () => {
    const mockIdentityApi = {
      getIdentity: jest.fn().mockResolvedValue({
        identity: { userEntityRef: 'user:default/johndoe' },
      }),
    };

    it('returns the username when identity is found', async () => {
      mockIdentityApi.getIdentity.mockResolvedValue({
        identity: { userEntityRef: 'user:default/johndoe' },
      });

      await expect(
        getCurrentUsername(mockIdentityApi, express.request),
      ).resolves.toBe('user:default/johndoe');
    });

    it('returns "unknown" when identity is not found', async () => {
      mockIdentityApi.getIdentity.mockResolvedValue(null);

      await expect(
        getCurrentUsername(mockIdentityApi, express.request),
      ).resolves.toBe('unknown');
    });
  });
});

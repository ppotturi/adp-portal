import {
  DatabaseManager,
  PluginDatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import { DefaultIdentityClient } from '@backstage/plugin-auth-node';
import express from 'express';
import request from 'supertest';
import { checkForDuplicateName, createRouter } from './router';
import { ConfigReader } from '@backstage/config';
import { getCurrentUsername } from '../service/router';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { AdpDatabase } from '../database/adpDatabase';
import { ArmsLengthBody } from '../types';
import {
  ArmsLengthBodyStore,
  PartialArmsLenghBody,
} from '../armsLengthBody/armsLengthBodyStore';
import { createTitle } from '../utils';
import { createResponseComposition } from 'msw';

describe('createRouter', () => {
  let app: express.Express;

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
      identity: {} as DefaultIdentityClient,
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
      const creator='John'
      const expectedProgramme = {
        creator: creator,
        owner: creator,
        name: 'Test ALB',
        short_name: 'ALB',
        description: 'This is an example ALB',
      }
      console.log(expectedProgramme)
      const response = await request(app).post('/armsLengthBody').send(expectedProgramme)
      console.log(response)
      expect(response.status).toEqual(200);
    
    });
  });

  describe('POST /armsLengthBody', () => {
    it('returns 406 when ALB Name already exists', async () => {
      const creator='John'
      const expectedProgramme = {
        creator: creator,
        owner: creator,
        name: 'Marine & Maritime',
        short_name: 'ALB',
        description: 'This is an example ALB',
      }
      console.log(expectedProgramme)
      const response = await request(app).post('/armsLengthBody').send(expectedProgramme)
      expect(response.status).toEqual(406);
      expect(response.text).toEqual("{\"error\":\"ALB Name already exists\"}")
    
    });
  });

  describe('PATCH /armsLengthBody', () => {
    it('returns ok', async () => {
      const creator='John'
      const data = {
        creator: creator,
        owner: creator,
        name: 'Test ALB',
        short_name: 'ALB',
        description: 'This is an example ALB',
      }
      console.log(data)
      await request(app).post('/armsLengthBody').send(data)
      const updatedData = {
        id: "",
        name: 'Test ALB',
      }
      console.log(updatedData)
      const response = await request(app).patch('/armsLengthBody').send(updatedData)
      console.log(response)
      expect(response.status).toEqual(200);
    
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

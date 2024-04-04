import {
  DatabaseManager,
  PluginDatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createProgrammeRouter } from './deliveryProgrammeRouter';
import { ConfigReader } from '@backstage/config';
import {
  catalogTestData,
  expectedProgrammeDataWithManager,
  programmeManagerList,
  expectedProgrammeDataWithName,
  updatedProgrammeManagerList,
} from '../deliveryProgramme/programmeTestData';
import { InputError } from '@backstage/errors';

jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: jest.fn().mockImplementation(() => ({
    getEntities: async () => {
      return {
        items: catalogTestData,
      };
    },
  })),
}));
let mockGetCatalogEntity: jest.Mock;
mockGetCatalogEntity = jest.fn().mockResolvedValue(catalogTestData);

let mockGetAllProgrammes: jest.Mock;
let mockGetProgramme: jest.Mock;
let mockAddProgramme: jest.Mock;
let mockUpdateProgramme: jest.Mock;

jest.mock('../deliveryProgramme/deliveryProgrammeStore', () => {
  return {
    DeliveryProgrammeStore: jest.fn().mockImplementation(() => {
      mockGetAllProgrammes = jest
        .fn()
        .mockResolvedValue([expectedProgrammeDataWithManager]);
      mockGetProgramme = jest
        .fn()
        .mockResolvedValue(expectedProgrammeDataWithManager);
      mockAddProgramme = jest
        .fn()
        .mockResolvedValue(expectedProgrammeDataWithManager);
      mockUpdateProgramme = jest
        .fn()
        .mockResolvedValue(expectedProgrammeDataWithManager);
      return {
        getAll: mockGetAllProgrammes,
        get: mockGetProgramme,
        add: mockAddProgramme,
        update: mockUpdateProgramme,
      };
    }),
  };
});

let mockGetAllProgrammeManagers: jest.Mock;
let mockGetProgrammeManager: jest.Mock;
let mockAddProgrammeManagers: jest.Mock;
let mockUpdateProgrammeManagers: jest.Mock;

jest.mock('../deliveryProgramme/deliveryProgrammeManagerStore', () => {
  return {
    ProgrammeManagerStore: jest.fn().mockImplementation(() => {
      mockGetAllProgrammeManagers = jest
        .fn()
        .mockResolvedValue(programmeManagerList);
      mockGetProgrammeManager = jest
        .fn()
        .mockResolvedValue(programmeManagerList);
      mockAddProgrammeManagers = jest
        .fn()
        .mockResolvedValue(programmeManagerList);
      mockUpdateProgrammeManagers = jest
        .fn()
        .mockResolvedValue(programmeManagerList);
      return {
        getAll: mockGetAllProgrammeManagers,
        get: mockGetProgrammeManager,
        add: mockAddProgrammeManagers,
        update: mockUpdateProgrammeManagers,
      };
    }),
  };
});

describe('createRouter', () => {
  let programmeApp: express.Express;
  const mockIdentityApi = {
    getIdentity: jest.fn().mockResolvedValue({
      identity: { userEntityRef: 'user:default/johndoe' },
    }),
  };

  const mockConfig = new ConfigReader({
    rbac: {
      programmeAdminGroup: 'test',
    },
  });

  const mockDiscoveryApi = { getBaseUrl: jest.fn() };

  const mockOptions = {
    logger: getVoidLogger(),
    identity: mockIdentityApi,
    database: createTestDatabase(),
    config: mockConfig,
    discovery: mockDiscoveryApi,
  };

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
    const programmeRouter = await createProgrammeRouter(mockOptions);
    programmeApp = express().use(programmeRouter);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(programmeApp).get('/health');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /deliveryProgramme', () => {
    it('returns ok', async () => {
      mockGetAllProgrammes.mockResolvedValueOnce([
        expectedProgrammeDataWithManager,
      ]);
      const response = await request(programmeApp).get('/deliveryProgramme');
      expect(response.status).toEqual(200);
    });

    it('returns bad request', async () => {
      mockGetAllProgrammes.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp).get('/deliveryProgramme');
      expect(response.status).toEqual(400);
    });
  });

  describe('GET /deliveryProgramme/:id', () => {
    it('returns ok', async () => {
      mockGetProgramme.mockResolvedValueOnce(expectedProgrammeDataWithManager);
      mockGetProgrammeManager.mockResolvedValueOnce(programmeManagerList);
      const response = await request(programmeApp).get(
        '/deliveryProgramme/1234',
      );
      expect(response.status).toEqual(200);
    });

    it('returns bad request', async () => {
      mockGetProgramme.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp).get(
        '/deliveryProgramme/4321',
      );
      expect(response.status).toEqual(400);
    });
  });

  describe('GET /programmeManager', () => {
    it('returns ok', async () => {
      mockGetAllProgrammeManagers.mockResolvedValueOnce([programmeManagerList]);
      const response = await request(programmeApp).get('/programmeManager');
      expect(response.status).toEqual(200);
    });
    it('returns bad request', async () => {
      mockGetAllProgrammeManagers.mockRejectedValueOnce(
        new InputError('error'),
      );
      const response = await request(programmeApp).get('/programmeManager');
      expect(response.status).toEqual(400);
    });
  });

  describe('GET /catalogEntities', () => {
    it('returns ok', async () => {
      const response = await request(programmeApp).get('/catalogEntities');
      expect(response.status).toEqual(200);
    });
    it('returns bad request', async () => {
      mockGetCatalogEntity.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp).get('/catalogEntities');
      expect(response.status).toEqual(400);
    });
  });

  describe('POST /deliveryProgramme', () => {
    it('returns created', async () => {
      mockGetAllProgrammes.mockResolvedValueOnce([
        expectedProgrammeDataWithManager,
      ]);
      mockAddProgramme.mockResolvedValueOnce(expectedProgrammeDataWithManager);
      mockAddProgrammeManagers.mockResolvedValueOnce(programmeManagerList);
      const expectedProgramme = {
        ...expectedProgrammeDataWithManager,
        arms_length_body_id: '1',
      };
      expectedProgramme.title = 'new title';
      const response = await request(programmeApp)
        .post('/deliveryProgramme')
        .send(expectedProgramme);
      expect(response.status).toEqual(201);
    });

    it('return 406 if title already exists', async () => {
      mockGetAllProgrammes.mockResolvedValueOnce([
        expectedProgrammeDataWithManager,
      ]);
      const response = await request(programmeApp)
        .post('/deliveryProgramme')
        .send(expectedProgrammeDataWithManager);
      expect(response.status).toEqual(406);
    });

    it('returns bad request', async () => {
      mockAddProgramme.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp)
        .post('/deliveryProgramme')
        .send(expectedProgrammeDataWithManager);
      expect(response.status).toEqual(400);
    });
  });

  describe('PATCH /deliveryProgramme', () => {
    it('returns created without any updates to programme managers', async () => {
      const existing = {
        ...expectedProgrammeDataWithManager,
        id: '123',
        arms_length_body_id: '2',
      };
      mockGetAllProgrammes.mockResolvedValueOnce([existing]);

      const data = {
        ...expectedProgrammeDataWithName,
        id: '123',
        arms_length_body_id: '2',
        title: 'new title',
      };

      mockUpdateProgramme.mockResolvedValueOnce(data);
      mockGetAllProgrammeManagers.mockResolvedValueOnce(programmeManagerList);
      const response = await request(programmeApp)
        .patch('/deliveryProgramme')
        .send(data);
      expect(response.status).toEqual(200);
    });

    it('returns created with updates to programme managers', async () => {
      const existing = {
        ...expectedProgrammeDataWithManager,
        id: '123',
        arms_length_body_id: '2',
      };
      mockGetAllProgrammes.mockResolvedValueOnce([existing]);

      const data = {
        ...expectedProgrammeDataWithName,
        programme_managers: [
          [
            {
              aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73421',
            },
            {
              aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73423',
            },
            {
              aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73424',
            },
          ],
        ],
        id: '123',
      };

      mockUpdateProgramme.mockResolvedValueOnce(data);
      mockGetAllProgrammeManagers.mockResolvedValueOnce(programmeManagerList);
      mockUpdateProgrammeManagers.mockResolvedValueOnce(
        updatedProgrammeManagerList,
      );
      const response = await request(programmeApp)
        .patch('/deliveryProgramme')
        .send(data);
      expect(response.status).toEqual(200);
    });

    it('returns bad request', async () => {
      const existing = { ...expectedProgrammeDataWithManager, id: '123' };
      const data = { ...existing };
      mockUpdateProgramme.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp)
        .patch('/deliveryProgramme')
        .send(data);
      expect(response.status).toEqual(400);
    });
  });
});

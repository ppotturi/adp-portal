import {
  DatabaseManager,
  PluginDatabaseManager,
  getVoidLogger,
} from '@backstage/backend-common';
import express from 'express';
import request from 'supertest';
import { createProgrammeRouter } from './deliveryProgrammeRouter';
import { ConfigReader } from '@backstage/config';
import { createAlbRouter } from './armsLengthBodyRouter';
import {
  catalogTestData,
  expectedProgrammeDataWithManager,
  programmeManagerList,
} from '../deliveryProgramme/programmeTestData';
import { expectedAlbWithName } from '../armsLengthBody/albTestData';

import {
  CatalogRequestOptions,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import { InputError } from '@backstage/errors';

let catalogRequestOptions: CatalogRequestOptions;
jest.mock('@backstage/catalog-client', () => ({
  CatalogClient: jest.fn().mockImplementation(() => ({
    getEntities: async (
      request: GetEntitiesRequest,
      options: CatalogRequestOptions,
    ) => {
      catalogRequestOptions = options;
      return {
        items: catalogTestData,
      };
    },
  })),
}));

let mockGetAll: jest.Mock;
let mockGet: jest.Mock;
let mockAdd: jest.Mock;
let mockUpdate: jest.Mock;

jest.mock('../deliveryProgramme/deliveryProgrammeStore', () => {
  return {
    DeliveryProgrammeStore: jest.fn().mockImplementation(() => {
      mockGetAll = jest.fn().mockResolvedValue([expectedProgrammeDataWithManager]);
      mockGet = jest.fn().mockResolvedValue(expectedProgrammeDataWithManager);
      mockAdd = jest.fn().mockResolvedValue(expectedProgrammeDataWithManager);
      mockUpdate = jest.fn().mockResolvedValue(expectedProgrammeDataWithManager);
      return {
        getAll: mockGetAll,
        get: mockGet,
        add: mockAdd,
        update: mockUpdate,
      };
    }),
  };
});

let mockGetAllManagers: jest.Mock;
let mockGetManager: jest.Mock;

jest.mock('../deliveryProgramme/deliveryProgrammeManagerStore', () => {
  return {
    ProgrammeManagerStore: jest.fn().mockImplementation(() => {
      mockGetAllManagers = jest.fn().mockResolvedValue([programmeManagerList]);
      mockGetManager = jest.fn().mockResolvedValue(programmeManagerList)
      return {
        getAll: mockGetAllManagers,
        get: mockGetManager
      };
    }),
  };
});

describe('createRouter', () => {
  let programmeApp: express.Express;
  let albApp: express.Express;
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
    const albRouter = await createAlbRouter(mockOptions);
    programmeApp = express().use(programmeRouter);
    albApp = express().use(albRouter);
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
      mockGetAll.mockResolvedValueOnce([expectedProgrammeDataWithManager]);
      const response = await request(programmeApp).get('/deliveryProgramme');
      expect(response.status).toEqual(200);
    });

    it('returns bad request', async () => {
      mockGetAll.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp).get('/deliveryProgramme');
      expect(response.status).toEqual(400);
    });
  });

  describe('GET /deliveryProgramme/:id', () => {
    it('returns ok', async () => {
      mockGet.mockResolvedValueOnce(expectedProgrammeDataWithManager);
      mockGetManager.mockResolvedValueOnce(programmeManagerList);
      const response = await request(programmeApp).get('/deliveryProgramme/1234');
      expect(response.status).toEqual(200);
    });

    it('returns bad request', async () => {
      mockGet.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp).get('/deliveryProgramme/4321');
      expect(response.status).toEqual(400);
    });
  });

  describe('GET /programmeManager', () => {
    it('returns ok', async () => {
      mockGetAllManagers.mockResolvedValueOnce([programmeManagerList]);
      const response = await request(programmeApp).get('/programmeManager');
      expect(response.status).toEqual(200);
    });
    it('returns bad request', async () => {
      mockGetAllManagers.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp).get('/programmeManager');
      expect(response.status).toEqual(400);
    });
  });

  describe('GET /catalogEntities', () => {
    it('returns ok', async () => {
      const response = await request(programmeApp).get('/catalogEntities');
      expect(response.status).toEqual(200);
    });
  });

  describe('POST /deliveryProgramme', () => {
    
    it('returns ok', async () => {
      mockGetAll.mockResolvedValueOnce([expectedProgrammeDataWithManager]);
      const expectedALB = {
        ...expectedAlbWithName
      };
      await request(albApp).post('/armsLengthBody').send(expectedALB);

      const getExistingAlbData = await request(albApp).get('/armsLengthBody');
      const getAlbId = getExistingAlbData.body[0].id;
      const expectedProgramme = {
        programme_managers: [
          {
            aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73421',
          },
          {
            aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73422',
          },
          {
            aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73424',
          },
        ],
        title: 'Test title 1 ',
        alias: 'Test Alias',
        description: 'Test description',
        finance_code: 'Test finance_code',
        delivery_programme_code: 'Test delivery_programme_code',
        url: 'Test url',
        arms_length_body_id: getAlbId,
      };
      console.log(expectedProgramme)
      const response = await request(programmeApp)
        .post('/deliveryProgramme')
        .send(expectedProgramme);
        console.log(response)
      expect(response.status).toEqual(201);
    });

    it('return 406 if title already exists', async () => {
      mockGetAll.mockResolvedValueOnce([expectedProgrammeDataWithManager]);
      const response = await request(programmeApp)
        .post('/deliveryProgramme')
        .send(expectedProgrammeDataWithManager);
      expect(response.status).toEqual(406);
    });

    it('returns bad request', async () => {
      mockAdd.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp)
        .post('/deliveryProgramme')
        .send(expectedProgrammeDataWithManager);
      expect(response.status).toEqual(400);
    });
  });

  describe('PATCH /deliveryProgramme', () => {
    it('returns ok', async () => {
      const expectedALB = {
        ...expectedAlbWithName,
      };
      await request(albApp).post('/armsLengthBody').send(expectedALB);
      const getExistingAlbData = await request(albApp).get('/armsLengthBody');
      const albId = getExistingAlbData.body[0].id;
      const existing = {
        ...expectedProgrammeDataWithManager,
        id: '123',
        arms_length_body_id: albId,
      };
      mockGetAll.mockResolvedValueOnce([existing]);
      const data = { ...existing };
      data.title = 'Test title 1 patch';
      data.programme_managers = [
        {
          aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73421',
        },
        {
          aad_entity_ref_id: 'a9dc2414-0626-43d2-993d-a53aac4d73424',
        },
      ];
      const response = await request(programmeApp)
        .patch('/deliveryProgramme')
        .send(data);
      expect(response.status).toEqual(200);

      const updatedData = response.body.find(
        (e: { title: string }) => e.title === 'Test title 1 patch',
      );

      expect(updatedData.name).toBe(
        'test-title-expectedprogrammedatawithmanager',
      );
      const getDeliveryProgrammesWithPM = await request(programmeApp).get(
        `/deliveryProgramme/${updatedData.id}`,
      );

      const programmeManagers =
        getDeliveryProgrammesWithPM.body.programme_managers;

      expect(programmeManagers.length).toBe(2);
      expect(
        programmeManagers.some(
          (manager: { aad_entity_ref_id: string }) =>
            manager.aad_entity_ref_id ===
            'a9dc2414-0626-43d2-993d-a53aac4d73421',
        ),
      ).toBeTruthy();
      expect(
        programmeManagers.some(
          (manager: { aad_entity_ref_id: string }) =>
            manager.aad_entity_ref_id ===
            'a9dc2414-0626-43d2-993d-a53aac4d73424',
        ),
      ).toBeTruthy();
      expect(
        programmeManagers.some(
          (manager: { aad_entity_ref_id: string }) =>
            manager.aad_entity_ref_id ===
            'a9dc2414-0626-43d2-993d-a53aac4d73422',
        ),
      ).toBeFalsy();
      expect(
        programmeManagers.some(
          (manager: { aad_entity_ref_id: string }) =>
            manager.aad_entity_ref_id ===
            'a9dc2414-0626-43d2-993d-a53aac4d73423',
        ),
      ).toBeFalsy();
    });

    it('returns bad request', async () => {
      const existing = { ...expectedProgrammeDataWithManager, id: '123' };
      const data = { ...existing };
      mockUpdate.mockRejectedValueOnce(new InputError('error'));
      const response = await request(programmeApp)
        .patch('/deliveryProgramme')
        .send(data);
      expect(response.status).toEqual(400);
    });
  });
});

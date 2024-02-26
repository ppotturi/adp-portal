import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { AdpDatabase } from '../database/adpDatabase';
import {
  DeliveryProgrammeStore,
  PartialDeliveryProgramme,
} from './deliveryProgrammeStore';
import { NotFoundError } from '@backstage/errors';
import { createName } from '../utils';
import { expectedAlbsWithName } from '../armsLengthBody/albTestData';
import { DeliveryProgramme, ProgrammeManager } from '@internal/plugin-adp-common';
import { expectedProgrammeDataStore, expectedProgrammeNoPm} from './programmeTestData';
import { ProgrammeManagerStore } from './deliveryProgrammePMStore';

describe('DeliveryProgrammeStore', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await AdpDatabase.runMigrations(knex);
    const store = new DeliveryProgrammeStore(knex);
    const pmStore = new ProgrammeManagerStore(knex)
    return { knex, store, pmStore };
  }

  it.each(databases.eachSupportedId())(
    'should create a new Delivery Programme',
    async databaseId => {
      const { knex, store, pmStore } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const albId = insertAlbId[1].id;

      const expectedProgrammeId: Omit<DeliveryProgramme, 'id' | 'created_at' | 'updated_at'> = {
        ...expectedProgrammeDataStore,
        arms_length_body: albId,
      };

      const addResult = await store.add(expectedProgrammeId, 'test');

      expect(addResult.name).toEqual(createName(expectedProgrammeId.title));
      expect(addResult.id).toBeDefined();
      expect(addResult.created_at).toBeDefined();
      expect(addResult.updated_at).toBeDefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should get all Delivery Programmes from the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const albId = insertAlbId[1].id;
      const expectedProgramme = [
        {
          ...expectedProgrammeNoPm,
          arms_length_body: albId,
        },
      ];
      await knex('delivery_programme').insert(expectedProgramme);

      const getAllResult = await store.getAll();
      expect(getAllResult).toHaveLength(1);
    },
  );

  it.each(databases.eachSupportedId())(
    'should get a Delivery Programmes from the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const albId = insertAlbId[1].id;
      const expectedProgramme = [
        {
          ...expectedProgrammeNoPm,
          arms_length_body: albId,
        },
      ];
      const insertProgrammeId = await knex('delivery_programme').insert(
        expectedProgramme,
        ['id'],
      );

      const programmeId = insertProgrammeId[0].id;
      const getResult = await store.get(programmeId);

      expect(getResult).toBeDefined();
      expect(getResult?.title).toBe('Test title 1');
      expect(getResult?.alias).toBe('Test Alias');
      expect(getResult?.description).toBe('Test description');
      expect(getResult?.url).toBe('Test url');
    },
  );

  it.each(databases.eachSupportedId())(
    'should return null if a Delivery Programme cannot be found in the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = insertAlbId[1].id;
      const expectedProgramme = [
        {
          ...expectedProgrammeNoPm,
          arms_length_body: albId,
        },
      ];
      await knex('delivery_programme').insert(expectedProgramme);

      const getResult = await store.get('12345');

      expect(getResult).toBeNull();
    },
  );

  it.each(databases.eachSupportedId())(
    'should update an existing Delivery Programme in the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = insertAlbId[1].id;
      const expectedProgramme = [
        {
          ...expectedProgrammeNoPm,
          arms_length_body: albId,
        },
      ];
      const InsertinsertProgrammeId = await knex('delivery_programme').insert(
        expectedProgramme,
        ['id'],
      );

      const insertProgrammeId = InsertinsertProgrammeId[0].id;
      const expectedUpdate: PartialDeliveryProgramme = {
        id: insertProgrammeId,
        title: 'Programme Example',
        alias: 'programme',
        description: 'This is an example Delivery Programme 2',
        url: 'http://www.example.com/index.html',
      };

      const updateResult = await store.update(expectedUpdate, 'test@test.com');

      expect(updateResult).toBeDefined();
      expect(updateResult.title).toBe(expectedUpdate.title);
      expect(updateResult.alias).toBe(expectedUpdate.alias);
      expect(updateResult.url).toBe(expectedUpdate.url);
      expect(updateResult.updated_at).toBeDefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should not update a non-existent Delivery Programme',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = insertAlbId[1].id;
      const expectedProgramme = [
        {
          ...expectedProgrammeNoPm,
          arms_length_body: albId,
        },
      ];
      await knex('delivery_programme').insert(expectedProgramme);

      await expect(
        async () =>
          await store.update(
            {
              id: '1234567',
              title: 'Test title 3',
              alias: 'Test Alias',
            },
            'test@test.com',
          ),
      ).rejects.toThrow(NotFoundError);
    },
  );

  it.each(databases.eachSupportedId())(
    'should throw an error if existing Programme id is undefined',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);

      await knex('arms_length_body').insert(expectedAlbsWithName);
      await store.getAll();

      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = insertAlbId[1].id;
      const updateWithoutId = {
        ...expectedProgrammeDataStore,
        arms_length_body: albId,
      };
      await expect(
        async () => await store.update(updateWithoutId, 'test@test.com'),
      ).rejects.toThrow(NotFoundError);
    },
  );
});

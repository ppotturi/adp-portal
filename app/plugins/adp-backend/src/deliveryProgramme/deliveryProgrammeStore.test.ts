import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { AdpDatabase } from '../database/adpDatabase';
import {
  DeliveryProgrammeStore,
  PartialDeliveryProgramme,
} from './deliveryProgrammeStore';
import { NotFoundError } from '@backstage/errors';
import { createName } from '../utils';
import { expectedAlbsWithName } from '../armsLengthBody/albTestData';
import { DeliveryProgramme } from '../types';

describe('DeliveryProgrammeStore', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await AdpDatabase.runMigrations(knex);
    const store = new DeliveryProgrammeStore(knex);
    return { knex, store };
  }

  it.each(databases.eachSupportedId())(
    'should create a new Delivery Programme',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertedIds = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const test2Id = insertedIds[1].id;

      const expectedProgrammeId: Omit<DeliveryProgramme, 'id' | 'timestamp'> = {
        programme_manager: ['string1', 'string 2'],
        title: 'Test title 1',
        alias: 'Test Alias',
        description: 'Test description',
        finance_code: 'Test finance_code',
        arms_length_body: test2Id,
        delivery_programme_code: 'Test delivery_programme_code',
        url: 'Test url',
        name: 'test-title-1',
      };
      const addResult = await store.add(expectedProgrammeId, 'test');

      expect(addResult.name).toEqual(createName(expectedProgrammeId.title));
      expect(addResult.id).toBeDefined();
      expect(addResult.timestamp).toBeDefined();
    },
  );

  it.each(databases.eachSupportedId())(
    'should get all Delivery Programmes from the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertedIds = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const test2Id = insertedIds[1].id;
      const expectedProgrammesWithName = [
        {
          programme_manager: JSON.stringify(['string 1', 'string 2']),
          title: 'Test title 1',
          alias: 'Test Alias',
          description: 'Test description',
          finance_code: 'Test finance_code',
          arms_length_body: test2Id,
          delivery_programme_code: 'Test delivery_programme_code',
          url: 'Test url',
          updated_by: 'john',
          name: 'test-title-1',
        },
      ];
      await knex('delivery_programme').insert(expectedProgrammesWithName);

      const getAllResult = await store.getAll();
      expect(getAllResult).toHaveLength(1);
    },
  );

  it.each(databases.eachSupportedId())(
    'should get a Delivery Programmes from the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const getAlbID = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const albId = getAlbID[1].id;
      const expectedProgrammesWithName = [
        {
          programme_manager: JSON.stringify(['string 1', 'string 2']),
          title: 'Test title 1',
          alias: 'Test Alias',
          description: 'Test description',
          finance_code: 'Test finance_code',
          arms_length_body: albId,
          delivery_programme_code: 'Test delivery_programme_code',
          url: 'Test url',
          updated_by: 'john',
          name: 'test-title-1',
        },
      ];
      const insertedIds = await knex('delivery_programme').insert(
        expectedProgrammesWithName,
        ['id'],
      );

      const test1Id = insertedIds[0].id;
      const getResult = await store.get(test1Id);

      expect(getResult).toBeDefined();
      expect(getResult?.title).toBe('Test title 1');
      expect(getResult?.alias).toBe('Test Alias');
      expect(getResult?.description).toBe('Test description');
      expect(getResult?.programme_manager).toEqual(['string 1', 'string 2']);
      expect(getResult?.url).toBe('Test url');
    },
  );

  it.each(databases.eachSupportedId())(
    'should return null if a Delivery Programme cannot be found in the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const getAlbID = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = getAlbID[1].id;
      const expectedProgrammesWithName = [
        {
          programme_manager: JSON.stringify(['string 1', 'string 2']),
          title: 'Test title 1',
          alias: 'Test Alias',
          description: 'Test description',
          finance_code: 'Test finance_code',
          arms_length_body: albId,
          delivery_programme_code: 'Test delivery_programme_code',
          url: 'Test url',
          updated_by: 'john',
          name: 'test-title-1',
        },
      ];
      await knex('delivery_programme').insert(expectedProgrammesWithName);

      const getResult = await store.get('12345');

      expect(getResult).toBeNull();
    },
  );

  it.each(databases.eachSupportedId())(
    'should update an existing Delivery Programme in the database',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const getAlbID = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = getAlbID[1].id;
      const expectedProgrammesWithName = [
        {
          programme_manager: JSON.stringify(['string 1', 'string 2']),
          title: 'Test title 1',
          alias: 'Test Alias',
          description: 'Test description',
          finance_code: 'Test finance_code',
          arms_length_body: albId,
          delivery_programme_code: 'Test delivery_programme_code',
          url: 'Test url',
          updated_by: 'john',
          name: 'test-title-1',
        },
      ];
      const insertedIds = await knex('delivery_programme').insert(
        expectedProgrammesWithName,
        ['id'],
      );

      const test2Id = insertedIds[0].id;
      const expectedUpdate: PartialDeliveryProgramme = {
        id: test2Id,
        title: 'Programme Example',
        alias: 'programme',
        programme_manager: ['manager1, manager2'],
        description: 'This is an example Delivery Programme 2',
        url: 'http://www.example.com/index.html',

      };

      const updateResult = await store.update(expectedUpdate, 'test@test.com');

      expect(updateResult).toBeDefined();
      expect(updateResult.title).toBe(expectedUpdate.title);
      expect(updateResult.alias).toBe(expectedUpdate.alias);
      expect(updateResult.url).toBe(expectedUpdate.url);
    },
  );

  it.each(databases.eachSupportedId())(
    'should not update a non-existent Delivery Programme',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const getAlbID = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = getAlbID[1].id;
      const expectedProgrammesWithName = [
        {
          programme_manager: JSON.stringify(['string 1', 'string 2']),
          title: 'Test title 1',
          alias: 'Test Alias',
          description: 'Test description',
          finance_code: 'Test finance_code',
          arms_length_body: albId,
          delivery_programme_code: 'Test delivery_programme_code',
          url: 'Test url',
          updated_by: 'john',
          name: 'test-title-1',
        },
      ];
      await knex('delivery_programme').insert(expectedProgrammesWithName);

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

      const getAlbID = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );
      const albId = getAlbID[1].id;
      const updateWithoutId = {
        programme_manager: JSON.stringify(['string 1', 'string 2']),
          title: 'Test title 1',
          alias: 'Test Alias',
          description: 'Test description',
          finance_code: 'Test finance_code',
          arms_length_body: albId,
          delivery_programme_code: 'Test delivery_programme_code',
          url: 'Test url',
          updated_by: 'john',
          name: 'test-title-1',
      };
      await expect(
        async () => await store.update(updateWithoutId, 'test@test.com'),
      ).rejects.toThrow(NotFoundError);
    },
  );
});

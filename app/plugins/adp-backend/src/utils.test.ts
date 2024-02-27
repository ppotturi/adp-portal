import { expectedProgrammeDataWithName } from './deliveryProgramme/programmeTestData';
import {
  createName,
  createTransformerTitle,
  getCurrentUsername,
  checkForDuplicateTitle,
} from './utils';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { AdpDatabase } from './database/adpDatabase';
import express from 'express';
import { DeliveryProgrammeStore } from './deliveryProgramme/deliveryProgrammeStore';
import { expectedAlbsWithName } from './armsLengthBody/albTestData';
import { DeliveryProgramme } from '@internal/plugin-adp-common';


describe('createName', () => {
  it('replaces spaces with dashes and converts to lowercase', () => {
    const input = 'Example Name';
    const expected = 'example-name';
    expect(createName(input)).toBe(expected);
  });

  it('handles strings longer than 64 characters', () => {
    const longName = 'a'.repeat(70);
    const expected = 'a'.repeat(64);
    expect(createName(longName)).toBe(expected);
  });

  it('removes extra spaces within the name', () => {
    const input = 'Example   Name With  Spaces';
    const expected = 'example-name-with-spaces';
    expect(createName(input)).toBe(expected);
  });
});

describe('createTransformerTitle', () => {
  it('returns the title as is if no alias is provided', () => {
    const title = 'Example Title';
    expect(createTransformerTitle(title)).toBe(title);
  });

  it('puts the alias in brackets if provided', () => {
    const title = 'Example Title';
    const shortName = 'ET';
    const expected = 'Example Title (ET)';
    expect(createTransformerTitle(title, shortName)).toBe(expected);
  });
});

describe('checkForDuplicateTitle', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await AdpDatabase.runMigrations(knex);
    const store = new DeliveryProgrammeStore(knex);
    return { knex, store };
  }

  it.each(databases.eachSupportedId())(
    'returns false when there is no duplicate title',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const albId = insertAlbId[1].id;

      const expectedProgrammeId: Omit<
        DeliveryProgramme,
        'id' | 'created_at' | 'updated_at' | 'programme_managers'
      > = {
        ...expectedProgrammeDataWithName,
        arms_length_body: albId,
      };
      await store.add(expectedProgrammeId, 'test');
      const getResult = await store.getAll();

      const title = 'New Programme';
      const result = await checkForDuplicateTitle(getResult, title);
      expect(result).toBe(false);
    },
  );

  it.each(databases.eachSupportedId())(
    'returns true when there is a duplicate title',
    async databaseId => {
      const { knex, store } = await createDatabase(databaseId);
      const insertAlbId = await knex('arms_length_body').insert(
        expectedAlbsWithName,
        ['id'],
      );

      const albId = insertAlbId[1].id;

      const expectedProgrammeId: Omit<
        DeliveryProgramme,
        'id' | 'created_at' | 'updated_at' | 'programme_managers'
      > = {
        ...expectedProgrammeDataWithName,
        arms_length_body: albId,
      };
      await store.add(expectedProgrammeId, 'test');
      const getResult = await store.getAll();

      const title = 'Test title expectedProgrammeDataWithName';
      const result = await checkForDuplicateTitle(getResult, title);
      expect(result).toBe(true);
    },
  );
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

import { Knex } from 'knex';
import { ProgrammeManager } from '@internal/plugin-adp-common';

const TABLE_NAME = 'programme_manager';
type Row = {
  id: string;
  entity_identifier: string;
  name: string;
};

export class ProgrammeManagerStore {
  constructor(private readonly client: Knex) {}
  async getAll(): Promise<ProgrammeManager[]> {
    const ProgrammeManagers = await this.client<Row>(TABLE_NAME)
      .select('id', 'entity_identifier', 'name')
      // .orderBy('delivery_programme_id');

    return ProgrammeManagers.map(row => ({
      id: row.id,
      entity_identifier: row.entity_identifier,
      name: row.name,
    }));
  }

  async get(delivery_programme_id: string): Promise<ProgrammeManager[]> {
    const ProgrammeManagers = await this.client<Row>(TABLE_NAME)
      .where('delivery_programme_id', delivery_programme_id)
      .select('id', 'entity_identifier', 'name');

    return ProgrammeManagers.map(row => ({
      id: row.id,
      entity_identifier: row.entity_identifier,
      name: row.name,
    }));
  }

  async add(
    programmeManager: Omit<ProgrammeManager, 'id'>,
  ): Promise<ProgrammeManager> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        entity_identifier: programmeManager.entity_identifier,
        name: programmeManager.name,
      },
      ['id'],
    );

    return {
      ...programmeManager,
      id: insertResult[0].id,
    };
  }

  async delete(id: string) {
    const deleteResult = await this.client(TABLE_NAME)
      .where({ programme_manager_id: id })
      .del();
    return deleteResult;
  }
}

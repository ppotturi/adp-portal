import { Knex } from 'knex';
import { ProgrammeManager } from '@internal/plugin-adp-common';

const TABLE_NAME = 'delivery_programme_pm';
type Row = {
  id: string;
  delivery_programme_id: string;
  programme_manager_id: string;
};

export class ProgrammeManagerStore {
  constructor(private readonly client: Knex) {}
  async getAll(): Promise<ProgrammeManager[]> {
    const ProgrammeManagers = await this.client<Row>(TABLE_NAME)
      .select('id', 'programme_manager_id', 'delivery_programme_id')
      .orderBy('delivery_programme_id');

    return ProgrammeManagers.map(row => ({
      id: row.id,
      programme_manager_id: row.programme_manager_id,
      delivery_programme_id: row.delivery_programme_id,
    }));
  }

  async get(delivery_programme_id: string): Promise<ProgrammeManager[]> {
    const ProgrammeManagers = await this.client<Row>(TABLE_NAME)
      .where('delivery_programme_id', delivery_programme_id)
      .select('id', 'programme_manager_id', 'delivery_programme_id');

    return ProgrammeManagers.map(row => ({
      id: row.id,
      programme_manager_id: row.programme_manager_id,
      delivery_programme_id: row.delivery_programme_id,
    }));
  }

  async add(
    programmeManager: Omit<ProgrammeManager, 'id'>,
  ): Promise<ProgrammeManager> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        programme_manager_id: programmeManager.programme_manager_id,
        delivery_programme_id: programmeManager.delivery_programme_id,
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

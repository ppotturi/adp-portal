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

  async get(id: string): Promise<ProgrammeManager | null> {
    const row = await this.client<Row>(TABLE_NAME)
      .where('id', id)
      .select('id', 'programme_manager_id', 'delivery_programme_id')
      .first();

    return row
      ? {
          id: row.id,
          programme_manager_id: row.programme_manager_id,
          delivery_programme_id: row.delivery_programme_id,
        }
      : null;
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

  // async update(
  //   programmeManager:Omit<ProgrammeManager, 'id'>,
  //   programmeManagers: string[]
  // ): Promise<ProgrammeManager> {

  //   await this.client<Row>(TABLE_NAME)

  //   const existingProgrammeManager = await this.get(programmeManager.id);

  //   await this.client<Row>(TABLE_NAME)
  //     .where('id', programmeManager.id)
  //     .update({
  //       programme_manager_id: programmeManager.programme_manager_id,
  //       delivery_programme_id: programmeManager.delivery_programme_id
  //     });

  //   return { ...existingProgrammeManager};
  // }
}

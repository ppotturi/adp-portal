import { Knex } from 'knex';
import { ProgrammeManager } from '@internal/plugin-adp-common';

const TABLE_NAME = 'programme_manager';
type Row = {
  id: string;
  delivery_programme: string;
  programme_manager: string;
};

export class ProgrammeManagerStore {
  constructor(private readonly client: Knex) {}
  async getAll(): Promise<ProgrammeManager[]> {
    const ProgrammeManagers = await this.client<Row>(TABLE_NAME)
      .select('id', 'programme_manager', 'delivery_programme')
      .orderBy('delivery_programme');

    return ProgrammeManagers.map(row => ({
      id: row.id,
      programme_manager: row.programme_manager,
      delivery_programme: row.delivery_programme,
    }));
  }

  async get(id: string): Promise<ProgrammeManager | null> {
    const row = await this.client<Row>(TABLE_NAME)
      .where('id', id)
      .select('id', 'programme_manager', 'delivery_programme')
      .first();

    return row
      ? {
          id: row.id,
          programme_manager: row.programme_manager,
          delivery_programme: row.delivery_programme,
        }
      : null;
  }

  async add(
    programmeManager: Omit<ProgrammeManager, 'id'>,
  ): Promise<ProgrammeManager> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        programme_manager: programmeManager.programme_manager,
        delivery_programme: programmeManager.delivery_programme,
      },
      ['id'],
    );

    return {
      ...programmeManager,
      id: insertResult[0].id,
    };
  }
  //TODO: HANDLE CHANGE

//   async update(
//     programmeManager: Omit<ProgrammeManager>,
//   ): Promise<ProgrammeManager> {
//     const insertResult = await this.client<Row>(TABLE_NAME).insert(
//       {
//         programme_manager: programmeManager.programme_manager,
//         delivery_programme: programmeManager.delivery_programme,
//       },
//       ['id'],
//     );

//     return {
//       ...programmeManager,
//       id: insertResult[0].id,
//     };
//   }
}

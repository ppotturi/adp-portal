import { Knex } from 'knex';
import { NotFoundError } from '@backstage/errors';
import { DeliveryProgramme } from '../types';
import { createName } from '../utils';

const TABLE_NAME = 'delivery_programme';
type Row = {
  id: string;
  programme_manager: string;
  title: string;
  readonly name: string;
  alias?: string;
  description: string;
  finance_code?: string;
  arms_length_body: string;
  delivery_programme_code: string;
  url?: string;
  updated_by?: string;
  created_at: Date;
  updated_at?: Date;
};

export type PartialDeliveryProgramme = Partial<DeliveryProgramme>;

export class DeliveryProgrammeStore {
  constructor(private readonly client: Knex) {}
  async getAll(): Promise<DeliveryProgramme[]> {
    const DeliveryProgrammes = await this.client<Row>(TABLE_NAME)
      .select(
        'id',
        'programme_manager',
        'title',
        'name',
        'alias',
        'description',
        'finance_code',
        'arms_length_body',
        'delivery_programme_code',
        'url',
        'created_at',
        'updated_at'
      )
      .orderBy('created_at');

    return DeliveryProgrammes.map(row => ({
      id: row.id,
      programme_manager: JSON.parse(row.programme_manager),
      title: row.title,
      name: row.name,
      alias: row?.alias,
      description: row.description,
      finance_code: row?.finance_code,
      arms_length_body: row.arms_length_body,
      delivery_programme_code: row.delivery_programme_code,
      url: row?.url,
      created_at: new Date(row.created_at),
      updated_at: row.updated_at ? new Date(row?.updated_at) : new Date(row.created_at)
    }));
  }

  async get(id: string): Promise<DeliveryProgramme | null> {
    const row = await this.client<Row>(TABLE_NAME)
      .where('id', id)
      .select(
        'id',
        'programme_manager',
        'title',
        'name',
        'alias',
        'description',
        'finance_code',
        'arms_length_body',
        'delivery_programme_code',
        'url',
        'created_at',
        'updated_at'
      )
      .first();

    return row
      ? {
          id: row.id,
          programme_manager: JSON.parse(row.programme_manager),
          title: row.title,
          name: row.name,
          alias: row?.alias,
          description: row.description,
          finance_code: row?.finance_code,
          arms_length_body: row.arms_length_body,
          delivery_programme_code: row.delivery_programme_code,
          url: row?.url,
          created_at: new Date(row.created_at),
          updated_at: row.updated_at ? new Date(row?.updated_at) : new Date(row.created_at)
        }
      : null;
  }

  async add(
    deliveryProgramme: Omit<DeliveryProgramme, 'id' | 'created_at'>,
    author: string,
  ): Promise<DeliveryProgramme> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        programme_manager: JSON.stringify(deliveryProgramme.programme_manager),
        title: deliveryProgramme.title,
        name: createName(deliveryProgramme.title),
        alias: deliveryProgramme?.alias,
        description: deliveryProgramme.description,
        finance_code: deliveryProgramme?.finance_code,
        arms_length_body: deliveryProgramme.arms_length_body,
        delivery_programme_code: deliveryProgramme.delivery_programme_code,
        url: deliveryProgramme?.url,
        updated_by: author,
      },
      ['id', 'created_at'],
    );

    return {
      ...deliveryProgramme,
      id: insertResult[0].id,
      created_at: new Date(insertResult[0].created_at),
    };
  }

  async update(
    deliveryProgramme: Omit<
      PartialDeliveryProgramme,
      'updated_at' | 'programme_manager'
    >,
    updatedBy: string,
  ): Promise<DeliveryProgramme> {
    if (deliveryProgramme.id === undefined) {
      throw new NotFoundError(
        `Could not find Delivery Programme with ID ${deliveryProgramme.id}`,
      );
    }

    const existingProgramme = await this.get(deliveryProgramme.id);

    if (!existingProgramme) {
      throw new NotFoundError(
        `Could not find Delivery Programme with ID ${deliveryProgramme.id}`,
      );
    }
    const updated = new Date();
    const updatedData: Partial<DeliveryProgramme> = {
      ...deliveryProgramme,
    };

    if (Object.keys(updatedData).length === 0) {
      return existingProgramme;
    }

    await this.client<Row>(TABLE_NAME)
      .where('id', deliveryProgramme.id)
      .update({
        ...updatedData,
        programme_manager: JSON.stringify(updatedData.programme_manager),
        updated_at: updated,
        updated_by: updatedBy,
      });

    return { ...existingProgramme, ...updatedData, updated_at: updated };
  }
}

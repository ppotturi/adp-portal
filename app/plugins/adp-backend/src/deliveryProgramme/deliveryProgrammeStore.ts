import { Knex } from 'knex';
import { NotFoundError } from '@backstage/errors';
import { DeliveryProgramme } from '../types';
import { createName } from '../utils';

const TABLE_NAME = 'delivery_programme';
type Row = {
  id: string;
  timestamp: Date;
  programme_manager: string;
  title: string;
  readonly name: string;
  alias?: string;
  description: string;
  finance_code?: string;
  arms_length_body: string;
  delivery_programme_code: number;
  url?: string;
  created_at: Date;
  updated_by?: string;
  updated_at?: Date;
};

export type PartialDeliveryProgramme = Partial<DeliveryProgramme>;

export class DeliveryProgrammeStore {
  constructor(private readonly client: Knex) {}
  async getAll(): Promise<DeliveryProgramme[]> {
    const ArmsLengthBodies = await this.client<Row>(TABLE_NAME)
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
      )
      .orderBy('created_at');

    return ArmsLengthBodies.map(row => ({
      id: row.id,
      programme_manager: row.programme_manager,
      title: row.title,
      name: row.name,
      alias: row?.alias,
      description: row.description,
      finance_code: row.finance_code,
      arms_length_body: row.arms_length_body,
      delivery_programme_code: row.delivery_programme_code,
      url: row?.url,
      timestamp: new Date(row.created_at),
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
      )
      .first();

    return row
      ? {
        id: row.id,
        programme_manager: row.programme_manager,
        title: row.title,
        name: row.name,
        alias: row?.alias,
        description: row.description,
        finance_code: row.finance_code,
        arms_length_body: row.arms_length_body,
        delivery_programme_code: row.delivery_programme_code,
        url: row?.url,
        timestamp: new Date(row.created_at),
        }
      : null;
  }

  async add(
    deliveryProgramme: Omit<DeliveryProgramme, 'id' | 'timestamp'>,
    programme_manager: string,
  ): Promise<DeliveryProgramme> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        programme_manager: programme_manager,
        title: deliveryProgramme.title,
        name: createName(deliveryProgramme.title),
        alias: deliveryProgramme?.alias,
        description: deliveryProgramme.description,
        finance_code: deliveryProgramme.finance_code,
        arms_length_body: deliveryProgramme.arms_length_body,
        delivery_programme_code: deliveryProgramme.delivery_programme_code,
        url: deliveryProgramme?.url,
        updated_by: programme_manager,
      },
      ['id', 'created_at'],
    );

    if (insertResult.length < 1) {
      throw new Error(
        `Could not insert Delivery Programme ${deliveryProgramme.title}`,
      );
    }

    return {
      ...deliveryProgramme,
      id: insertResult[0].id,
      timestamp: new Date(insertResult[0].created_at),
    };
  }

  async update(
    deliveryProgramme: Omit<PartialDeliveryProgramme, 'timestamp'>,
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

    const updatedData: Partial<DeliveryProgramme> = {};
    if (deliveryProgramme.title !== undefined) {
      updatedData.title = deliveryProgramme.title;
    }
    if (deliveryProgramme.alias !== undefined) {
      updatedData.alias = deliveryProgramme.alias;
    }
    if (deliveryProgramme.description !== undefined) {
      updatedData.description = deliveryProgramme.description;
    }
    if (deliveryProgramme.url !== undefined) {
      updatedData.url = deliveryProgramme.url;
    }
    if (Object.keys(updatedData).length === 0) {
      return existingProgramme;
    }

    await this.client<Row>(TABLE_NAME)
      .where('id', deliveryProgramme.id)
      .update({
        ...updatedData,
        updated_at: updated,
        updated_by: updatedBy,
      });

    return { ...existingProgramme, ...updatedData, timestamp: updated };
  }
}

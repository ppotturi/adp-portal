import { Knex } from 'knex';
import { NotFoundError } from '@backstage/errors';
import { ArmsLengthBody } from '../types';
import { createTitle } from '../utils';

const TABLE_NAME = 'arms_length_bodies';
type Row = {
  id: string;
  creator: string;
  owner: string;
  name: string;
  short_name?: string;
  description: string;
  readonly title: string;
  created_at: Date;
  updated_by?: string;
  updated_at?: Date;
};

export type PartialArmsLenghBody = Partial<ArmsLengthBody>;

export class ArmsLengthBodyStore {
  constructor(private readonly client: Knex) {}

  async getAll(): Promise<ArmsLengthBody[]> {
    const ArmsLengthBodies = await this.client<Row>(TABLE_NAME)
      .select(
        'creator',
        'owner',
        'name',
        'short_name',
        'description',
        'title',
        'id',
        'created_at',
      )
      .orderBy('created_at');

    return ArmsLengthBodies.map(row => ({
      creator: row.creator,
      owner: row.owner,
      name: row.name,
      short_name: row?.short_name,
      description: row.description,
      title: row.title,
      id: row.id,
      timestamp: new Date(row.created_at),
    }));
  }

  async get(id: string): Promise<ArmsLengthBody | null> {
    const row = await this.client<Row>(TABLE_NAME)
      .where('id', id)
      .select(
        'creator',
        'owner',
        'name',
        'short_name',
        'description',
        'title',
        'id',
        'created_at',
      )
      .first();

    return row
      ? {
          creator: row.creator,
          owner: row.owner,
          name: row.name,
          short_name: row?.short_name,
          description: row.description,
          title: row.title,
          id: row.id,
          timestamp: new Date(row.created_at),
          
        }
      : null;
  }

  async add(
    armsLengthBody: Omit<ArmsLengthBody, 'id' | 'timestamp'>,
    creator: string,
  ): Promise<ArmsLengthBody> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        creator: creator,
        owner: creator,
        name: armsLengthBody.name,
        short_name: armsLengthBody?.short_name,
        description: armsLengthBody.description,
        title: createTitle(armsLengthBody.name),
        updated_by: creator,
      },
      ['id', 'created_at'],
    );

    if (insertResult.length < 1) {
      throw new Error(
        `Could not insert Arms Length Body ${armsLengthBody.name}`,
      );
    }

    return {
      ...armsLengthBody,
      id: insertResult[0].id,
      timestamp: new Date(insertResult[0].created_at),
    };
  }

  async update(
    armsLengthBody: Omit<PartialArmsLenghBody, 'timestamp'>,
    updatedBy: string,
  ): Promise<ArmsLengthBody> {
    if (armsLengthBody.id === undefined) {
      throw new NotFoundError(
        `Could not find Arms Length Body with ID ${armsLengthBody.id}`,
      );
    }

    const existingALB = await this.get(armsLengthBody.id);

    if (!existingALB) {
      throw new NotFoundError(
        `Could not find Arms Length Body with ID ${armsLengthBody.id}`,
      );
    }

    const updated = new Date();

    const updatedData: Partial<ArmsLengthBody> = {};
    if (armsLengthBody.name !== undefined) {
      updatedData.name = armsLengthBody.name;
    }
    if (armsLengthBody.short_name !== undefined) {
      updatedData.short_name = armsLengthBody.short_name;
    }
    if (armsLengthBody.description !== undefined) {
      updatedData.description = armsLengthBody.description;
    }

    if (Object.keys(updatedData).length === 0) {
      return existingALB;
    }

    await this.client<Row>(TABLE_NAME)
      .where('id', armsLengthBody.id)
      .update({
        ...updatedData,
        updated_at: updated,
        updated_by: updatedBy,
      });

    return { ...existingALB, ...updatedData, timestamp: updated };
  }
}

import { Knex } from 'knex';
import { NotFoundError } from '@backstage/errors';
import { ArmsLengthBody } from '../types';

const TABLE_NAME = 'arms_length_body';
type Row = {
    creatorUsername: string;
    creatorEmail: string;
    ownerUsername: string;
    ownerEmail: string;
    creatorSameAsOwner: boolean;
    name: string;
    shortName?: string;
    description?: string;
    id: string;
    created_at: Date;
    updated_at: Date;
    created_by: string;
    updated_by: string;
  };

export class ArmsLengthBodiestore {
  constructor(private readonly client: Knex) {}

  async getAll(): Promise<ArmsLengthBody[]> {
    const ArmsLengthBodies = await this.client<Row>(TABLE_NAME)
      .select(
        'creatorUsername',
        'creatorEmail',
        'ownerUsername',
        'ownerEmail',
        'creatorSameAsOwner',
        'name',
        'shortName',
        'description',
        'id',
        'created_at',
      )
      .orderBy('created_at');

    return ArmsLengthBodies.map(row => ({
      creatorUsername: row.creatorUsername,
      creatorEmail: row.creatorEmail,
      ownerUsername: row.ownerUsername,
      ownerEmail: row.ownerEmail,
      creatorSameAsOwner: row.creatorSameAsOwner,
      name: row.name,
      shortName: row?.shortName,
      description: row?.description,
      id: row.id,
      timestamp: new Date(row.created_at).getMilliseconds(),
    }));
  }

  async get(id: string): Promise<ArmsLengthBody | null> {
    const row = await this.client<Row>(TABLE_NAME)
      .where('id', id)
      .select(
        'creatorUsername',
        'creatorEmail',
        'ownerUsername',
        'ownerEmail',
        'creatorSameAsOwner',
        'name',
        'shortName',
        'description',
        'id',
        'created_at',
      )
      .first();

    return row
      ? {
        creatorUsername: row.creatorUsername,
        creatorEmail: row.creatorEmail,
        ownerUsername: row.ownerUsername,
        ownerEmail: row.ownerEmail,
        creatorSameAsOwner: row.creatorSameAsOwner,
        name: row.name,
        shortName: row.shortName,
        description: row.description,
        id: row.id,
        timestamp: new Date(row.created_at).getMilliseconds(),
        }
      : null;
  }

  async add(
    armsLengthBody: Omit<ArmsLengthBody, 'id' | 'timestamp'>,
    createdBy: string,
  ): Promise<ArmsLengthBody> {
    const insertResult = await this.client<Row>(TABLE_NAME).insert(
      {
        creatorUsername: armsLengthBody.creatorUsername,
        creatorEmail: armsLengthBody.creatorEmail,
        ownerUsername: armsLengthBody.ownerUsername,
        ownerEmail: armsLengthBody.ownerEmail,
        creatorSameAsOwner: armsLengthBody.creatorSameAsOwner,
        name: armsLengthBody.name,
        shortName: armsLengthBody.shortName,
        description: armsLengthBody.description,
        created_by: createdBy,
        updated_by: createdBy,
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
      timestamp: new Date(insertResult[0].created_at).getMilliseconds(),
    };
  }

  async update(
    armsLengthBody: Omit<ArmsLengthBody, 'timestamp'>,
    updatedBy: string,
  ): Promise<ArmsLengthBody> {
    const existingALB = await this.get(armsLengthBody.id);
    if (!existingALB) {
      throw new NotFoundError(
        `Could not find Arms Length Body with ID ${armsLengthBody.id}`,
      );
    }

    const updated = new Date();
    await this.client<Row>(TABLE_NAME)
      .where('id', armsLengthBody.id)
      .update({
        creatorUsername: armsLengthBody.creatorUsername,
        creatorEmail: armsLengthBody.creatorEmail,
        ownerUsername: armsLengthBody.ownerUsername,
        ownerEmail: armsLengthBody.ownerEmail,
        creatorSameAsOwner: armsLengthBody.creatorSameAsOwner,
        name: armsLengthBody.name,
        shortName: armsLengthBody.shortName,
        description: armsLengthBody.description,
        updated_at: updated,
        updated_by: updatedBy,
      });

    return { ...armsLengthBody, timestamp: updated.getMilliseconds() };
  }
}
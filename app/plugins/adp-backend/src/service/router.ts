import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { AdpDatabase } from '../database/adpDatabase';
import { ArmsLengthBodyStore } from '../armsLengthBody/armsLengthBodyStore';
import { ArmsLengthBody } from '../types';

export interface RouterOptions {
  logger: Logger;
  identity: IdentityApi;
  database: PluginDatabaseManager;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, database } = options;

  const adpDatabase = AdpDatabase.create(database);
  const armsLengthBodiesStore = new ArmsLengthBodyStore(
    await adpDatabase.get(),
  );

  // Seed test data
  armsLengthBodiesStore.add(
    {
      creatorUsername: 'john',
      creatorEmail: 'john@example.com',
      ownerUsername: 'john',
      ownerEmail: 'john@example',
      creatorSameAsOwner: true,
      name: 'example ALB 1',
      shortName: 'ALB 1',
      description: 'Lorem Ipsum',
    },
    'Seed',
  );
  armsLengthBodiesStore.add(
    {
      creatorUsername: 'john',
      creatorEmail: 'john@example.com',
      ownerUsername: 'john',
      ownerEmail: 'john@example',
      creatorSameAsOwner: true,
      name: 'example ALB 1',
      shortName: 'ALB 1',
      description: 'Lorem Ipsum',
    },
    'Seed',
  );

  const router = Router();
  router.use(express.json());

  // Define routes
  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/armLengthBody', async (_req, res) => {
    res.json(await armsLengthBodiesStore.getAll());
  });

  router.post('/armLengthBody', async (req, res) => {
    if (!isDeliveryProgrammeCreateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }

    const author = await getCurrentUsername(identity, req);
    const deliveryProgramme = await armsLengthBodiesStore.add(
      req.body,
      author,
    );
    res.json(deliveryProgramme);
  });

  router.put('/armLengthBody', async (req, res) => {
    if (!isDeliveryProgrammeUpdateRequest(req.body)) {
      throw new InputError('Invalid payload');
    }

    const author = await getCurrentUsername(identity, req);
    const deliveryProgramme = await armsLengthBodiesStore.update(
      req.body,
      author,
    );
    res.json(deliveryProgramme);
  });

  router.use(errorHandler());
  return router;
}

function isDeliveryProgrammeCreateRequest(
  request: Omit<ArmsLengthBody, 'id' | 'timestamp'>,
) {
  return typeof request?.name === 'string';
}

function isDeliveryProgrammeUpdateRequest(
  request: Omit<ArmsLengthBody, 'timestamp'>,
) {
  return (
    typeof request?.id === 'string' && isDeliveryProgrammeCreateRequest(request)
  );
}

async function getCurrentUsername(
  identity: IdentityApi,
  req: express.Request,
): Promise<string> {
  const user = await identity.getIdentity({ request: req });
  return user?.identity.userEntityRef ?? 'unknown';
}

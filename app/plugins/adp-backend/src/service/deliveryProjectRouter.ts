import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { AdpDatabase } from '../database/adpDatabase';
import {
  DeliveryProjectStore,
  PartialDeliveryProject,
} from '../deliveryProject/deliveryProjectStore';
import { DeliveryProject } from '@internal/plugin-adp-common';
import { checkForDuplicateTitle, getCurrentUsername } from '../utils';

export interface ProjectRouterOptions {
  logger: Logger;
  identity: IdentityApi;
  database: PluginDatabaseManager;
}

export async function createProjectRouter(
  options: ProjectRouterOptions,
): Promise<express.Router> {
  const { logger, identity, database } = options;
  const adpDatabase = AdpDatabase.create(database);
  const deliveryProjectStore = new DeliveryProjectStore(
    await adpDatabase.get(),
  );

  const router = Router();
  router.use(express.json());

  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/deliveryProject', async (_req, res) => {
    const data = await deliveryProjectStore.getAll();
    res.json(data);
  });

  router.get('/deliveryProject/:id', async (_req, res) => {
    const deliveryProject = await deliveryProjectStore.get(_req.params.id);
    res.json(deliveryProject);
  });

  router.post('/deliveryProject', async (req, res) => {
    try {
      if (!isDeliveryProjectCreateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }

      const data: DeliveryProject[] = await deliveryProjectStore.getAll();

      const isDuplicate: boolean = await checkForDuplicateTitle(
        data,
        req.body.title,
      );
      if (isDuplicate) {
        res
          .status(406)
          .json({ error: 'Delivery Project title already exists' });
      } else {
        const author = await getCurrentUsername(identity, req);
        const deliveryProject = await deliveryProjectStore.add(
          req.body,
          author,
        );
        res.json(deliveryProject);
      }
    } catch (error) {
      throw new InputError((error as Error).message);
    }
  });

  router.patch('/deliveryProject', async (req, res) => {
    try {
      if (!isDeliveryProjectUpdateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }
      const data: DeliveryProject[] = await deliveryProjectStore.getAll();

      const currentData = data.find(object => object.id === req.body.id);
      const updatedTitle = req.body?.title;
      const currentTitle = currentData?.title;
      const isTitleChanged = updatedTitle && currentTitle !== updatedTitle;

      if (isTitleChanged) {
        const isDuplicate: boolean = await checkForDuplicateTitle(
          data,
          updatedTitle,
        );
        if (isDuplicate) {
          res
            .status(406)
            .json({ error: 'Delivery Project title already exists' });
          return;
        }
      }

      const author = await getCurrentUsername(identity, req);
      const deliveryProject = await deliveryProjectStore.update(
        req.body,
        author,
      );
      res.json(deliveryProject);
    } catch (error) {
      throw new InputError('Error');
    }
  });
  router.use(errorHandler());
  return router;
}

function isDeliveryProjectCreateRequest(
  request: Omit<DeliveryProject, 'id' | 'created_at'>,
) {
  return typeof request?.title === 'string';
}

function isDeliveryProjectUpdateRequest(
  request: Omit<PartialDeliveryProject, 'updated_at'>,
) {
  return typeof request?.id === 'string';
}

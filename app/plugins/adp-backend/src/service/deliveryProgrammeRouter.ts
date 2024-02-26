import { PluginDatabaseManager, errorHandler } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { InputError } from '@backstage/errors';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { AdpDatabase } from '../database/adpDatabase';
import {
  DeliveryProgrammeStore,
  PartialDeliveryProgramme,
} from '../deliveryProgramme/deliveryProgrammeStore';
import {
  DeliveryProgramme,
  ProgrammeManager,
} from '@internal/plugin-adp-common';
import {
  addProgrammeManager,
  checkForDuplicateTitle,
  deleteProgrammeManager,
  getCurrentUsername,
} from '../utils';
import { ProgrammeManagerStore } from '../deliveryProgramme/deliveryProgrammeManagerStore';

export interface ProgrammeRouterOptions {
  logger: Logger;
  identity: IdentityApi;
  database: PluginDatabaseManager;
}

export async function createProgrammeRouter(
  options: ProgrammeRouterOptions,
): Promise<express.Router> {
  const { logger, identity, database } = options;

  const adpDatabase = AdpDatabase.create(database);
  const deliveryProgrammesStore = new DeliveryProgrammeStore(
    await adpDatabase.get(),
  );
  const programmeManagersStore = new ProgrammeManagerStore(
    await adpDatabase.get(),
  );

  const router = Router();
  router.use(express.json());

  // Define routes
  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/deliveryProgramme', async (_req, res) => {
    const data = await deliveryProgrammesStore.getAll();
    res.json(data);
  });

  router.get('/programmeManager', async (_req, res) => {
    const data = await programmeManagersStore.getAll();
    res.json(data);
  });

  router.post('/deliveryProgramme', async (req, res) => {
    try {
      if (!isDeliveryProgrammeCreateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }

      const data: DeliveryProgramme[] = await deliveryProgrammesStore.getAll();

      const isDuplicate: boolean = await checkForDuplicateTitle(
        data,
        req.body.title,
      );
      if (isDuplicate) {
        res
          .status(406)
          .json({ error: 'Delivery Programme name already exists' });
      } else {
        const author = await getCurrentUsername(identity, req);
        const deliveryProgramme = await deliveryProgrammesStore.add(
          req.body,
          author,
        );

        const programmeManagers = req.body.programme_managers;
        if (programmeManagers !== undefined) {
          addProgrammeManager(
            programmeManagers,
            deliveryProgramme.id,
            deliveryProgramme,
            programmeManagersStore,
          );
        } else { 
          req.body.programme_managers = []
        }
        res.json(deliveryProgramme);
      }
    } catch (error) {
      logger.error('Unable to create new Delivery Programme');
    }
  });

  router.patch('/deliveryProgramme', async (req, res) => {
    try {
      if (!isDeliveryProgrammeUpdateRequest(req.body)) {
        throw new InputError('Invalid payload');
      }
      const data: DeliveryProgramme[] = await deliveryProgrammesStore.getAll();

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
            .json({ error: 'Delivery Programme name already exists' });
          return;
        }
      }

      const author = await getCurrentUsername(identity, req);
      const deliveryProgramme = await deliveryProgrammesStore.update(
        req.body,
        author,
      );

      const programmeManagers = req.body.programme_managers;
      if (programmeManagers !== undefined) {
        const existingProgrammeManagers = await programmeManagersStore.getBy(
          deliveryProgramme.id,
        );
        const updatedManagers: ProgrammeManager[] = [];
        for (const updatedManager of programmeManagers) {
          if (
            !existingProgrammeManagers.some(
              manager =>
                manager.programme_manager_id ===
                updatedManager.programme_manager_id,
            )
          ) {
            updatedManagers.push(updatedManager);
          }
        }

        addProgrammeManager(
          updatedManagers,
          deliveryProgramme.id,
          deliveryProgramme,
          programmeManagersStore,
        );

        const removedManagers: ProgrammeManager[] = [];

        for (const existingManager of existingProgrammeManagers) {
          if (
            !programmeManagers.some(
              (manager: ProgrammeManager) =>
                manager.programme_manager_id ===
                existingManager.programme_manager_id,
            )
          ) {
            removedManagers.push(existingManager);
          }
        }

        deleteProgrammeManager(removedManagers, programmeManagersStore);
      }

      res.json(deliveryProgramme);
    } catch (error) {
      logger.error('Unable to update Delivery Programme');
    }
  });
  router.use(errorHandler());
  return router;
}

function isDeliveryProgrammeCreateRequest(
  request: Omit<DeliveryProgramme, 'id' | 'created_at'>,
) {
  return typeof request?.title === 'string';
}

function isDeliveryProgrammeUpdateRequest(
  request: Omit<PartialDeliveryProgramme, 'updated_at'>,
) {
  return typeof request?.id === 'string';
}

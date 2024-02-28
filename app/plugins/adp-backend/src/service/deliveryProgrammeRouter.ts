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
import { ProgrammeManagerStore } from '../deliveryProgramme/deliveryProgrammePMStore';

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

        addProgrammeManager(
          programmeManagers,
          deliveryProgramme.id,
          deliveryProgramme,
          programmeManagersStore,
        );

        res.json(deliveryProgramme);
      }
    } catch (error) {
      logger.error('Unable to create new Delivery Programme');
    }
  });

  router.patch('/deliveryProgramme', async (req, res) => {
    try {
      const requestBody = { ...req.body };
      delete requestBody.tableData;

      if (!isDeliveryProgrammeUpdateRequest(requestBody)) {
        throw new InputError('Invalid payload');
      }

      const data: DeliveryProgramme[] = await deliveryProgrammesStore.getAll();
      const currentData = data.find(object => object.id === requestBody.id);

      const updatedTitle = requestBody.title;
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
        requestBody,
        author,
      );

      const programmeManagers = requestBody.programme_managers;
      const existingProgrammeManagers = await programmeManagersStore.getBy(
        deliveryProgramme.id,
      );

      const updatedManagers = programmeManagers.filter(
        manager =>
          !existingProgrammeManagers.some(
            existing =>
              existing.programme_manager_id === manager.programme_manager_id,
          ),
      );
      addProgrammeManager(
        updatedManagers,
        deliveryProgramme.id,
        deliveryProgramme,
        programmeManagersStore,
      );

      const removedManagers = existingProgrammeManagers.filter(
        existing =>
          !programmeManagers.some(
            manager =>
              manager.programme_manager_id === existing.programme_manager_id,
          ),
      );
      deleteProgrammeManager(removedManagers, programmeManagersStore);

      res.json(deliveryProgramme);
    } catch (error) {
      logger.error('Unable to update Delivery Programme', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.use(errorHandler());
  return router;
  

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
}
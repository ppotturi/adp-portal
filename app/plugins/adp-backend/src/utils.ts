import {
  ArmsLengthBody,
  DeliveryProgramme,
  ProgrammeManager,
} from '@internal/plugin-adp-common';
import { IdentityApi } from '@backstage/plugin-auth-node';
import express from 'express';
import { AlbRouterOptions } from './service/armsLengthBodyRouter';
import { ProgrammeManagerStore } from './deliveryProgramme/deliveryProgrammeManagerStore';

export function createName(name: string) {
  const nameValue = name.replace(/\s+/g, '-').toLowerCase().substring(0, 64);
  return nameValue;
}

export function createTransformerTitle(title: string, alias?: string) {
  const titleValue = alias ? title + ' ' + `(${alias})` : title;
  return titleValue;
}

export async function checkForDuplicateTitle(
  store: DeliveryProgramme[] | ArmsLengthBody[],
  title: string,
): Promise<boolean> {
  title = title.trim().toLowerCase();

  const duplicate = store.find(
    object => object.title.trim().toLowerCase() === title,
  );

  return duplicate !== undefined;
}

export async function getCurrentUsername(
  identity: IdentityApi,
  req: express.Request,
): Promise<string> {
  const user = await identity.getIdentity({ request: req });
  return user?.identity.userEntityRef ?? 'unknown';
}

export function getOwner(options: AlbRouterOptions): string {
  const { config } = options;
  const ownerGroup = config.getConfig('rbac');
  const owner = ownerGroup.getString('programmeAdminGroup');
  return owner;
}

export async function addProgrammeManager(
  programmeManagers: ProgrammeManager[],
  id: string,
  deliveryProgramme: DeliveryProgramme,
  ProgrammeManagerStore: ProgrammeManagerStore,
) {
  if (programmeManagers !== undefined) {
    for (const manager of programmeManagers) {
      const store = {
        programme_manager_id: manager.programme_manager_id,
        delivery_programme_id: id,
      };
      const programmeManager = await ProgrammeManagerStore.add(store);
      deliveryProgramme.programme_managers.push(programmeManager);
    }
  }
}

export async function deleteProgrammeManager(
  programmeManagers: ProgrammeManager[],
  ProgrammeManagerStore: ProgrammeManagerStore,
) {
  for (const manager of programmeManagers) {
    const store = {
      programme_manager_id: manager.programme_manager_id,
    };
    await ProgrammeManagerStore.delete(store.programme_manager_id);
  }
}

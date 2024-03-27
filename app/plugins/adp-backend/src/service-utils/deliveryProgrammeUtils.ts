import { ProgrammeManagerStore } from '../deliveryProgramme/deliveryProgrammeManagerStore';
import { Entity } from '@backstage/catalog-model';
import { NotFoundError } from '@backstage/errors';
import { DeliveryProgramme, ProgrammeManager } from '@internal/plugin-adp-common';

export type catalogType = [
    {
      metadata: {
        name: string;
        annotations: {
          'microsoft.com/email': string;
          'graph.microsoft.com/user-id': string;
        };
      };
    },
  ];
  
  export async function addProgrammeManager(
    programmeManagers: ProgrammeManager[],
    deliveryProgrammeId: string,
    deliveryProgramme: DeliveryProgramme,
    ProgrammeManagerStore: ProgrammeManagerStore,
    catalogEntity: Entity[],
  ) {
    if (programmeManagers !== undefined) {
      for (const manager of programmeManagers) {
        const managerDetails = await getProgrammeManagerDetails(
          manager.aad_entity_ref_id,
          catalogEntity,
        );
        const store = {
          aad_entity_ref_id: manager.aad_entity_ref_id,
          delivery_programme_id: deliveryProgrammeId,
          name: managerDetails.name,
          email: managerDetails.email,
        };
        const programmeManager = await ProgrammeManagerStore.add(store);
        deliveryProgramme.programme_managers.push(programmeManager);
      }
    }
  }
  
  export async function deleteProgrammeManager(
    programmeManagers: ProgrammeManager[],
    deliveryProgrammeId: string,
    ProgrammeManagerStore: ProgrammeManagerStore,
  ) {
    for (const manager of programmeManagers) {
      const store = {
        aad_entity_ref_id: manager.aad_entity_ref_id,
        delivery_programme_id: deliveryProgrammeId,
        email: manager.email,
        name: manager.name,
      };
      await ProgrammeManagerStore.delete(
        store.aad_entity_ref_id,
        store.delivery_programme_id,
      );
    }
  }
  
  export async function getProgrammeManagerDetails(
    aad_entity_ref_id: string,
    catalog: Entity[],
  ) {
    const findManagerById = catalog.find(
      object =>
        object.metadata.annotations!['graph.microsoft.com/user-id'] ===
        aad_entity_ref_id,
    );
    if (findManagerById !== undefined) {
      const metadataName = findManagerById.metadata.name;
      const name = metadataName
        .replace(/^user:default\//, '')
        .replace(/_defra.*$/, '')
        .replace(/[\._]/g, ' ')
        .replace(/onmicrosoft.*$/, '')
        .trim();
  
      const managerName = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  
      const managerEmail =
        findManagerById.metadata.annotations!['microsoft.com/email'];
  
      return { name: managerName, email: managerEmail };
    } else {
      throw new NotFoundError(`Could not find Programme Managers details`);
    }
  }
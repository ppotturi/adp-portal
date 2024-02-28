import { useState, useEffect } from 'react';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
  alertApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';
import { DeliveryProgrammeClient } from '../components/DeliveryProgramme/api/DeliveryProgrammeClient';
import { DeliveryProgrammeApi } from '../components/DeliveryProgramme/api/DeliveryProgrammeApi';


export const useProgrammeManagersList = () => {
  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);

  const [programmeManagersMap, setProgrammeManagersMap] = useState<{
    [key: string]: string;
  }>({});

  function capitalizeWords(str: string) {
    return str.replace(/\b\w/g, (char: string) => char.toUpperCase());
  }

  useEffect(() => {
    const deliveryprogClient: DeliveryProgrammeApi =
      new DeliveryProgrammeClient(discoveryApi, fetchApi);
    const fetchAllData = async () => {
      try {
        const [programmes, managers] = await Promise.all([
          deliveryprogClient.getDeliveryProgrammes(),
          deliveryprogClient.getDeliveryPManagers(),
        ]);

      

        const map: { [key: string]: string } = {};

        programmes.forEach(programme => {
          const programmeManagerIds = managers
            .filter(manager => manager.delivery_programme_id === programme.id)
            .map(manager => {
              let cleanId = manager.programme_manager_id
                .replace(/^user:default\//, '')
                .replace(/_defra.*$/, '')
                .replace(/[\._]/g, ' ');

              return capitalizeWords(cleanId);
            })
            .join(', ');

          map[programme.id] = programmeManagerIds;
        });

    
        setProgrammeManagersMap(map);
      } catch (e: any) {
        errorApi.post(e);
      }
    };

    fetchAllData();
  }, [alertApi, errorApi, discoveryApi, fetchApi]);

  return programmeManagersMap;
};

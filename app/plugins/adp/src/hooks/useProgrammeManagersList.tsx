import { useState, useEffect } from 'react';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';

type ProgrammeManagersListOptions = {
  label: string;
  value: string;
};

export const useProgrammeManagersList = (): ProgrammeManagersListOptions[] => {
  const [options, setOptions] = useState<ProgrammeManagersListOptions[]>([]);

  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const errorApi = useApi(errorApiRef);

  useEffect(() => {
    const fetchProgrammeManagersList = async () => {
      try {
        const ProgrammeManagersListUrl = await discoveryApi.getBaseUrl('adp') + '/catalogentities';
        const response = await fetchApi.fetch(ProgrammeManagersListUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch programme managers list');
        }
        const data = await response.json();

        const formattedProgrammeManagers = data.items.map((item: any) => {
          const transformedName = item.metadata.name
            .replace(/^user:default\//, '')
            .replace(/_defra.*$/, '')
            .replace(/[\._]/g, ' ')
            .replace(/onmicrosoft.*$/, '')
            .trim()
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

          return {
            label: transformedName,
            value: item.metadata.annotations['graph.microsoft.com/user-id'],
          };
        });

        setOptions(formattedProgrammeManagers);
      } catch (e: any) {
        errorApi.post(e);
      }
    };

    fetchProgrammeManagersList();
  }, [discoveryApi, fetchApi, errorApi]);

  return options;
};

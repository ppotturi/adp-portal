import { useState, useEffect } from 'react';
import { useApi, errorApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

interface Profile {
  displayName?: string;
}

interface Entity {
  metadata: {
    name: string;
  };
  spec?: {
    profile: Profile;
  };
}

interface Option {
  label: string;
  value: string;
}

export const useEntities = (): Option[] => {
  const [options, setOptions] = useState<Option[]>([]);
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: {
            kind: 'User',
            'relations.memberOf':
              'group:default/ag-azure-cdo-adp-platformengineers',
          },
          fields: ['metadata.name', 'spec.profile.displayName'],
        });

        const items: Entity[] = response.items as Entity[];

        const transformedOptions: Option[] = items.map(entity => ({
          label: entity.spec?.profile?.displayName ?? 'Unknown',
          value: entity.metadata.name,
        }));

        setOptions(transformedOptions);
      } catch (e: any) {
        errorApi.post(e);
      }
    };

    fetchEntities();
  }, [catalogApi, errorApi]);

  return options;
};

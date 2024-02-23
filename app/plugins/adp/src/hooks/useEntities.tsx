import { useState, useEffect } from 'react';
import { useApi, errorApiRef} from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';


export const useEntities = (): Entity[] => {
  const [options, setOptions] = useState<Entity[]>([]);
  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await catalogApi.getEntities({
          filter: {
            kind: 'User',
            'relations.memberOf': 'group:default/ag-azure-cdo-adp-platformengineers',
          },
          fields: ['metadata.name', 'spec.profile.displayName'],
        });


        setOptions(response.items);
      } catch (e:any) {
        errorApi.post(e);
      }
    };

    fetchEntities();
  }, [catalogApi, errorApi]); 

  return options;
};


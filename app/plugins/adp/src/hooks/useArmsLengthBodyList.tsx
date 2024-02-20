import { useState, useEffect } from 'react';
import { ArmsLengthBodyClient } from '../components/ALB/api/AlbClient';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
  errorApiRef,
} from '@backstage/core-plugin-api';

type ArmsLengthBodyListOptions = {
  label: string;
  value: string;
};

export const useArmsLengthBodyList = (): { label: string; value: string }[]  => {
  const [options, setOptions] = useState<ArmsLengthBodyListOptions[]>([]);

  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const errorApi = useApi(errorApiRef);

  useEffect(() => {
    const albClient = new ArmsLengthBodyClient(discoveryApi, fetchApi);
    const fetchArmsLengthBodies = async () => {
      try {
        const bodies = await albClient.getArmsLengthBodies();
        const formattedBodies = bodies.map(body => ({
          label: body.title,
          value: body.id,
        }));
        setOptions(formattedBodies);
      } catch (e: any) {
        errorApi.post(e);
      }
    };

    fetchArmsLengthBodies();
  }, [discoveryApi, fetchApi, errorApi]);

  return options;
};

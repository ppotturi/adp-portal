import { armsLengthBodyApi } from './AlbApi';
import { ArmsLengthBody } from '../../../adp-common/src/types';

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export class armsLengthBodyClient implements armsLengthBodyApi {
  private discoveryApi: DiscoveryApi;
  private fetchApi: FetchApi;

  constructor(discoveryApi: DiscoveryApi, fetchApi: FetchApi) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  async getArmsLengthBodies(): Promise<ArmsLengthBody[]> {
    const url = `${await this.discoveryApi.getBaseUrl('adp')}/armsLengthBody`;
    const response = await this.fetchApi.fetch(url);
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return response.json();
  }

  async updateArmsLengthBody(data: any): Promise<ArmsLengthBody[]> {
    const url = `${await this.discoveryApi.getBaseUrl('adp')}/armsLengthBody`;

    const response = await this.fetchApi.fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const responseBody = await response.json();
      const errorMessage = responseBody?.error || 'Failed to update Arms Length Body';
      throw new Error(errorMessage);
    }

    const updatedData: ArmsLengthBody[] = await response.json();
    return updatedData;
  }

}

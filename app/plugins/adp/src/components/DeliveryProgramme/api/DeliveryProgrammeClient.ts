import { DeliveryProgrammeApi } from './DeliveryProgrammeApi';
import { DeliveryProgramme } from '@internal/plugin-adp-common';

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export class DeliveryProgrammeClient implements DeliveryProgrammeApi {
 

  private discoveryApi: DiscoveryApi;
  private fetchApi: FetchApi;

  constructor(discoveryApi: DiscoveryApi, fetchApi: FetchApi) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  private async getApiUrl(): Promise<string> {
    return `${await this.discoveryApi.getBaseUrl('adp')}/DeliveryProgramme`;
  }

  async getDeliveryProgrammes(): Promise<DeliveryProgramme[]> {
    try {
      const url = await this.getApiUrl();
      const response = await this.fetchApi.fetch(url);
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }
      return response.json();
    } catch (error) {
      throw new Error('Failed to fetch Delivery Programmes: ${error.message');
    }
  }

  async createDeliveryProgramme(data: any): Promise<DeliveryProgramme[]> {
    const url = await this.getApiUrl();

    const response = await this.fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.json();
  }

  async updateDeliveryProgramme(data: any): Promise<DeliveryProgramme[]> {
    const url = await this.getApiUrl();

    const response = await this.fetchApi.fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const updatedData: DeliveryProgramme[] = await response.json();
    return updatedData;
  }
}

export type { DeliveryProgrammeApi };

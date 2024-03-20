import { DeliveryProjectApi } from './DeliveryProjectApi';
import { DeliveryProject } from '@internal/plugin-adp-common';

import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';

export class DeliveryProjectClient implements DeliveryProjectApi {
  private discoveryApi: DiscoveryApi;
  private fetchApi: FetchApi;

  constructor(discoveryApi: DiscoveryApi, fetchApi: FetchApi) {
    this.discoveryApi = discoveryApi;
    this.fetchApi = fetchApi;
  }

  private async getApiUrl(): Promise<string> {
    return `${await this.discoveryApi.getBaseUrl('adp')}/deliveryProject`;
  }

  async getDeliveryProjects(): Promise<DeliveryProject[]> {
    try {
      const url = await this.getApiUrl();

      const deliveryProjectsResponse = await this.fetchApi.fetch(url);
      if (!deliveryProjectsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const deliveryProjects = await deliveryProjectsResponse.json();

      return deliveryProjects;
    } catch (error) {
      throw new Error(`Failed to fetch Delivery Project`);
    }
  }

  async createDeliveryProject(data: any): Promise<DeliveryProject> {
    try {
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
    } catch (error) {
      throw new Error(`Failed to create Delivery Project`);
    }
  }

  async updateDeliveryProject(data: any): Promise<DeliveryProject> {
    try {
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

      const updatedData: DeliveryProject = await response.json();
      return updatedData;
    } catch (error) {
      throw new Error(`Failed to update Delivery Project`);
    }
  }

  async getDeliveryProjectById(id: string): Promise<DeliveryProject> {
    try {
      const url = await this.getApiUrl();
      const response = await this.fetchApi.fetch(`${url}/${id}`);
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch Delivery Project by ID`);
    }
  }
}

export type { DeliveryProjectApi };

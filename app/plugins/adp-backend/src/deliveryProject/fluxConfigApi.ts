import { Config } from '@backstage/config';
import { DeliveryProject } from '@internal/plugin-adp-common';
import fetch from 'node-fetch';
import { DeliveryProgrammeStore } from '../deliveryProgramme';

export type FluxConfig = {
  key: string;
  value: string;
};

export type FluxEnvironment = {
  name: string;
  ConfigVariables: FluxConfig[];
};

export type FluxService = {
  name: string;
  type: string;
  environments: FluxEnvironment[];
  configVariables: FluxConfig[];
};

export type FluxTeamConfig = {
  serviceCode: string;
  programmeName: string;
  teamName: string;
  services: FluxService[];
  configVariables: FluxConfig[];
};

export class FluxConfigApi {
  #apiBaseUrl: string;
  #deliveryProgrammeStore: DeliveryProgrammeStore;

  constructor(config: Config, deliveryProgrammeStore: DeliveryProgrammeStore) {
    this.#apiBaseUrl = config.getString('adp.fluxOnboarding.apiBaseUrl');
    this.#deliveryProgrammeStore = deliveryProgrammeStore;
  }

  async CreateFluxConfig(deliveryProject: DeliveryProject) {
    const endpoint = `${this.#apiBaseUrl}/create/${deliveryProject.name}`;

    const deliveryProgramme = await this.#deliveryProgrammeStore.get(deliveryProject.delivery_programme_id);

    if (!deliveryProgramme) {
      throw new Error(`Delivery Programme with ID ${deliveryProject.delivery_programme_id} for project ${deliveryProject.id} not found`);
    }

    const teamConfig = {
      programmeName: deliveryProgramme.name,
      serviceCode: deliveryProject.name,
      services: [],
      configVariables: {
        key: 'value',
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamConfig),
    });

    if (!response.ok) {
      throw new Error(
        `Unexpected response from FluxConfig API. Expected 204 but got ${response.status} - ${response.statusText}`,
      );
    }
  }

  async GetFluxConfig(teamName: string): Promise<FluxTeamConfig | null> {
    const endpoint = `${this.#apiBaseUrl}/get/${teamName}`;
    const statusCodeNotFound = 404;

    const response = await fetch(endpoint, {
      method: 'GET',
    });

    if (response.status === statusCodeNotFound) {
      return null;
    }
    if (!response.ok) {
      throw new Error(
        `Unexpected response from FluxConfig API. Expected 200 but got ${response.status} - ${response.statusText}`,
      );
    }

    const fluxTeamConfig = (await response.json()) as FluxTeamConfig;

    return fluxTeamConfig;
  }
}

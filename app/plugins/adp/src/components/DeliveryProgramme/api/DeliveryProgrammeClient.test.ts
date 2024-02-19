import { DeliveryProgrammeClient } from './DeliveryProgrammeClient';

jest.mock('@backstage/core-plugin-api', () => ({
  DiscoveryApi: jest.fn(),
  FetchApi: jest.fn(() => ({
    fetch: jest.fn(),
  })),
}));

describe('armsLengthBodyClient', () => {
  let client: DeliveryProgrammeClient;
  let discoveryApi: { getBaseUrl: any };
  let fetchApi: { fetch: any };

  beforeEach(() => {
    discoveryApi = { getBaseUrl: jest.fn() };
    fetchApi = { fetch: jest.fn() };

    discoveryApi.getBaseUrl.mockResolvedValue('http://localhost');

    client = new DeliveryProgrammeClient(discoveryApi, fetchApi);
  });

  describe('get delivery programmes', () => {
    it('fetches delivery programmes successfully', async () => {
      const mockData = [{ name: 'Test Body' }];
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await client.getDeliveryProgrammes();
      expect(result).toEqual(mockData);
      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith('adp');
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://localhost/DeliveryProgramme',
      );
    });

    it('throws an error when the fetch fails', async () => {
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'BadRequest',
        json: jest.fn().mockResolvedValue({ error: 'Not found' }),
      });

      await expect(client.getDeliveryProgrammes()).rejects.toThrow();
    });
  });

  describe('update delivery programmes', () => {
    it('updates a delivery programme successfully', async () => {
      const mockData = [{ name: 'Updated Body' }];
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const updateData = { name: 'New Name' };
      const result = await client.updateDeliveryProgramme(updateData);
      expect(result).toEqual(mockData);
    });

    it('throws an error when the update fails', async () => {
      const errorMessage = 'Failed to update';
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ error: errorMessage }),
      });

      const updateData = { name: 'New Name' };
      await expect(client.updateDeliveryProgramme(updateData)).rejects.toThrow(
        'Request failed with 400 Error',
      );
    });
  });

  describe('create delivery programme', () => {
    it('creates a delivery programme successfully', async () => {
      const newData = { name: 'New Body' };
      const mockResponseData = [{ id: 1, name: 'New Body' }];

      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponseData),
      });

      const result = await client.createDeliveryProgramme(newData);
      expect(result).toEqual(mockResponseData);

      expect(fetchApi.fetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
    });

    it('throws an error when the creation fails', async () => {
      const newData = { name: 'New Body' };
      const errorMessage = 'Failed to create Delivery Programme';
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ error: errorMessage }),
      });

      await expect(client.createDeliveryProgramme(newData)).rejects.toThrow(
        'Request failed with 400 Error',
      );
    });
  });
});

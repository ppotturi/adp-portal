import { armsLengthBodyClient } from './AlbClient';


jest.mock('@backstage/core-plugin-api', () => ({
  DiscoveryApi: jest.fn(),
  FetchApi: jest.fn(() => ({
    fetch: jest.fn(),
  })),
}));

describe('armsLengthBodyClient', () => {
  let client: armsLengthBodyClient;
  let discoveryApi: { getBaseUrl: any };
  let fetchApi: { fetch: any };

  beforeEach(() => {
 
    discoveryApi = { getBaseUrl: jest.fn() };
    fetchApi = { fetch: jest.fn() };

    discoveryApi.getBaseUrl.mockResolvedValue('http://localhost');

    client = new armsLengthBodyClient(discoveryApi, fetchApi);
  });

  describe('getArmsLengthBodies', () => {
    it('fetches arms length bodies successfully', async () => {
      const mockData = [{ name: 'Test Body' }];
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await client.getArmsLengthBodies();
      expect(result).toEqual(mockData);
      expect(discoveryApi.getBaseUrl).toHaveBeenCalledWith('adp');
      expect(fetchApi.fetch).toHaveBeenCalledWith(
        'http://localhost/armsLengthBody',
      );
    });

    it('throws an error when the fetch fails', async () => {
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Not found' }),
      });

      await expect(client.getArmsLengthBodies()).rejects.toThrow();
    });
  });

  describe('updateArmsLengthBody', () => {
    it('updates an arms length body successfully', async () => {
      const mockData = [{ name: 'Updated Body' }];
      fetchApi.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData),
      });

      const updateData = { name: 'New Name' };
      const result = await client.updateArmsLengthBody(updateData);
      expect(result).toEqual(mockData);
    });

    it('throws an error when the update fails', async () => {
      const errorMessage = 'Failed to update';
      fetchApi.fetch.mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: errorMessage }),
      });

      const updateData = { name: 'New Name' };
      await expect(client.updateArmsLengthBody(updateData)).rejects.toThrow(
        new RegExp(errorMessage),
      );
    });
  });
});

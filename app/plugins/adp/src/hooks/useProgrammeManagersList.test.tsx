import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useProgrammeManagersList } from './useProgrammeManagersList';
import { TestApiProvider } from '@backstage/test-utils';
import {
  errorApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

const mockDiscoveryApi = { getBaseUrl: jest.fn() };
const mockFetchApi = { fetch: jest.fn() };
const mockErrorApi = { post: jest.fn() };

describe('useProgrammeManagersList', () => {
  it('fetches and formats programme managers data correctly', async () => {
    mockDiscoveryApi.getBaseUrl.mockResolvedValue('http://localhost/adp');
    mockFetchApi.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        items: [
          {
            metadata: {
              name: 'user:default/jane_doe_defra',
              annotations: {'graph.microsoft.com/user-id': 'jane.doe@example.com'},
            },
          },
          {
            metadata: {
              name: 'user:default/john_doe_defra',
              annotations: {'graph.microsoft.com/user-id': 'john.doe@example.com'},
            },
          },
        ],
      }),
    });

    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <TestApiProvider
        apis={[
          [errorApiRef, mockErrorApi],
          [discoveryApiRef, mockDiscoveryApi],
          [fetchApiRef, mockFetchApi],
        ]}
      >
        {children}
      </TestApiProvider>
    );

    const { result, waitForNextUpdate } = renderHook(() => useProgrammeManagersList(), { wrapper });

    await waitForNextUpdate();

    expect(mockDiscoveryApi.getBaseUrl).toHaveBeenCalledWith('adp');
    expect(mockFetchApi.fetch).toHaveBeenCalledWith('http://localhost/adp/catalogentities');
    expect(result.current).toEqual([
      { label: 'Jane Doe', value: 'jane.doe@example.com' },
      { label: 'John Doe', value: 'john.doe@example.com' },
    ]);
  });


});

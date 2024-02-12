import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';

import { AlbViewPageComponent } from './AlbViewPageComponent';
import {
  alertApiRef,
  errorApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

// Mock APIs
const mockAlertApi = { post: jest.fn() };
const mockErrorApi = { post: jest.fn() };
const mockDiscoveryApi = { getBaseUrl: jest.fn() };
const mockFetchApi = { fetch: jest.fn() };


const mockTableData = [
  { id: '1', title: 'ALB 1', short_name: 'ALB1', description: 'Description 1', url: 'http://alb1.com', timestamp: '2021-01-01T00:00:00Z' },
  { id: '2', title: 'ALB 2', short_name: 'ALB2', description: 'Description 2', url: 'http://alb2.com', timestamp: '2021-01-02T00:00:00Z' },
];

jest.mock('../../api/AlbClient', () => ({
  ArmsLengthBodyClient: jest.fn().mockImplementation(() => ({
    getArmsLengthBodies: jest.fn().mockResolvedValue(mockTableData),
    updateArmsLengthBody: jest.fn().mockResolvedValue({}),
  })),
}));

describe('AlbViewPageComponent', () => {
  it('fetches and displays arms length bodies in the table upon loading', async () => {
    const rendered = render(
      <TestApiProvider apis={[
        [alertApiRef, mockAlertApi],
        [errorApiRef, mockErrorApi],
        [discoveryApiRef, mockDiscoveryApi],
        [fetchApiRef, mockFetchApi],
      ]}>
     
          <AlbViewPageComponent />
     
      </TestApiProvider>
    );

    await waitFor(() => {
      expect(rendered.getByText('ALB 1')).toBeInTheDocument();
      expect(rendered.getByText('ALB 2')).toBeInTheDocument();
    });
  });

 
});



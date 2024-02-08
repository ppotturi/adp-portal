import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AlbViewPageComponent } from './AlbViewPageComponent';
import { armsLengthBodyClient } from '../../api/AlbClient'; //
import { ThemeProvider, createTheme } from '@material-ui/core';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import userEvent from '@testing-library/user-event';

jest.mock('@backstage/core-plugin-api', () => ({
    ...jest.requireActual('@backstage/core-plugin-api'),
    useApi: jest.fn(),
  }));

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn().mockReturnValue({
    alertApi: {
      post: jest.fn(),
    },
    errorApi: {
      post: jest.fn(),
    },
    discoveryApi: {
      getBaseUrl: jest.fn(),
    },
    fetchApi: {
      fetch: jest.fn(),
    },
    useApi: jest.fn(),
  }),
}));



jest.mock('../../api/AlbClient', () => ({
  armsLengthBodyClient: jest.fn().mockImplementation(() => ({
    getArmsLengthBodies: jest.fn().mockResolvedValue([
      { id: '1', name: 'ALB 1', short_name: 'A1', description: 'Description 1', timestamp: '2024-01-01' },
      { id: '2', name: 'ALB 2', short_name: 'A2', description: 'Description 2', timestamp: '2024-01-02' },
    ]),
    updateArmsLengthBody: jest.fn().mockResolvedValue({}),
  })),
}));

describe('AlbViewPageComponent', () => {
  beforeEach(() => {
   
    jest.clearAllMocks();
  });

  it('renders correctly and displays initial data', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <AlbViewPageComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('Arms Length Bodies')).toBeInTheDocument();
    expect(screen.getByText('View or add Arms Length Bodies')).toBeInTheDocument();

    // Wait for data to be displayed
    await waitFor(() => {
      expect(screen.getByText('ALB 1')).toBeInTheDocument();
      expect(screen.getByText('ALB 2')).toBeInTheDocument();
    });
  });

  it('handles modal open and close correctly', async () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <AlbViewPageComponent />
      </ThemeProvider>
    );


    await waitFor(() => screen.getByText('Edit'));
    userEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('Close Modal Text Here')).toBeInTheDocument(); 

    // Close the modal and verify
    userEvent.click(screen.getByText('Close Modal Button Text'));
    await waitFor(() => {
      expect(screen.queryByText('Close Modal Text Here')).not.toBeInTheDocument();
    });
  });

});

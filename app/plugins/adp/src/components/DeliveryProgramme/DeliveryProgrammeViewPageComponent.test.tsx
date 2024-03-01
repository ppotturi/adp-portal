import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';

import { DeliveryProgrammeViewPageComponent } from './DeliveryProgrammeViewPageComponent';
import {
  alertApiRef,
  errorApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  PermissionApi,
  permissionApiRef,
  usePermission,
} from '@backstage/plugin-permission-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { catalogApiRef } from '@backstage/plugin-catalog-react';



const mockErrorApi = { post: jest.fn() };
const mockDiscoveryApi = { getBaseUrl: jest.fn() };
const mockFetchApi = { fetch: jest.fn() };
const mockAlertApi = { post: jest.fn() };

const mockCatalogApi = {
  getEntities: jest
    .fn()
    .mockImplementation(async () => ({ items: entities })),
};

const entities = [
  {
    "metadata": {
      "namespace": "default",
      "name": "userone.onmicrosoft.com"
    },
    "spec": {
      "profile": {
        "displayName": "user one"
      }
    }
  },
  {
    "metadata": {
      "namespace": "default",
      "name": "usertwo.onmicrosoft.com"
    },
    "spec": {
      "profile": {
        "displayName": "user two"
      }
    }
  }
];



const mockTableData = [
  {
    id: '1',
    title: 'Delivery Programme 1',
    alias: 'DeliveryProgramme1',
    description: 'Description 1',
    url: 'http://deliveryprogramme.com',
    timestamp: '2021-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Delivery Programme 2',
    alias: 'DeliveryProgramme2',
    description: 'Description 2',
    url: 'http://deliveryprogramme.com',
    timestamp: '2021-01-01T00:00:00Z',
  },
];

const mockGetDeliveryProgrammes = jest.fn();
const mockUpdateDeliveryProgramme = jest.fn().mockResolvedValue({});
jest.mock('./api/DeliveryProgrammeClient', () => ({
  DeliveryProgrammeClient: jest.fn().mockImplementation(() => ({
    getDeliveryProgrammes: mockGetDeliveryProgrammes,
    updateDeliveryProgramme: mockUpdateDeliveryProgramme,
  })),
}));

jest.mock('../../hooks/useArmsLengthBodyList', () => ({
  useArmsLengthBodyList: jest.fn(() => [
    { label: 'Arms Length Body 1', value: '1' },
    { label: 'Arms Length Body 2', value: '2' },
  ]),
}));

jest.mock('../../utils/transformDeliveryProgrammeManagers', () => ({
  transformDeliveryProgrammeManagers: jest.fn()
  
}));




describe('DeliveryProgrammeViewPageComponent', () => {
  beforeEach(() => {
    mockGetDeliveryProgrammes.mockClear();
    mockUpdateDeliveryProgramme.mockClear();
    
  });

  const element = (
    <TestApiProvider
      apis={[
        [alertApiRef, mockAlertApi],
        [errorApiRef, mockErrorApi],
        [discoveryApiRef, mockDiscoveryApi],
        [fetchApiRef, mockFetchApi],
        [catalogApiRef, mockCatalogApi],
      ]}
    >
      <DeliveryProgrammeViewPageComponent />
    </TestApiProvider>
  );
  const render = async () => renderInTestApp(element);

  afterEach(() => {
    mockGetDeliveryProgrammes.mockReset();
    jest.clearAllMocks();
  });

  it('fetches and displays delivery programmes in the table upon loading', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const rendered = await render();

    await waitFor(() => {
      expect(rendered.getByText('Delivery Programme 1')).toBeInTheDocument();
      expect(rendered.getByText('Delivery Programme 2')).toBeInTheDocument();
    });
  });

  it('should throw error when DeliveryProgramClient throws error', async () => {
    mockGetDeliveryProgrammes.mockImplementation(() => {
      throw new Error('Cannot fetch Delivery Programme');
    });

    const rendered = await render();

    await waitFor(async () => {
      expect(
        await rendered.findByText('Delivery Programmes'),
      ).toBeInTheDocument();
      expect(mockErrorApi.post).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Cannot fetch Delivery Programme'
      }));
    });
  });
  

  it('should open edit modal when edit button is clicked', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const rendered = await render();
    act(() => {
      fireEvent.click(rendered.getByTestId('delivery-programme-edit-button-1'));
    });

    await waitFor(() => {
      expect(
        rendered.getByText('Edit: Delivery Programme 1'),
      ).toBeInTheDocument();
    });
  });

  it('should close edit modal when cancel button is clicked', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const rendered = await render();
    act(() => {
      fireEvent.click(rendered.getByTestId('delivery-programme-edit-button-1'));
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-cancel-button'));
    });

    await waitFor(() => {
      expect(
        rendered.queryByText('Edit: Delivery Programme 1'),
      ).not.toBeInTheDocument();
    });
  });

  it('should open add modal when add button is clicked', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('create-delivery-programme-button'));
    });

    await waitFor(() => {
      expect(rendered.getByText('Create:')).toBeInTheDocument();
    });
  });

  it('should update the item when update button is clicked', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const updatedTableData = [
      {
        id: '1',
        title: 'Delivery Programme 1 edited',
        alias: 'DeliveryProgramme1',
       
        description: 'Description 1',
        url: 'http://delivery1.com',
        timestamp: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Delivery Programme 2',
        alias: 'DeliveryProgramme2',
        programme_managers: [
          {
              "programme_manager_id": "user:default/test123"
          },
          {
              "programme_manager_id": "user:default/test345"
          },
      ],
        description: 'Description 2',
        url: 'http://delivery2.com',
        timestamp: '2021-01-02T00:00:00Z',
      },
    ];
    mockUpdateDeliveryProgramme.mockResolvedValue(updatedTableData);
    const rendered = await render();
    act(() => {
      fireEvent.click(rendered.getByTestId('delivery-programme-edit-button-1'));
    });

    act(() => {
      fireEvent.change(rendered.getByLabelText('Title'), {
        target: { value: 'Delivery Programme 1 edited' },
      });
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
    });
    mockGetDeliveryProgrammes.mockResolvedValue(updatedTableData);

    await waitFor(() => {
      expect(
        rendered.queryByText('Edit: Delivery Programme 1'),
      ).not.toBeInTheDocument();
      expect(
        rendered.queryByText('Delivery Programme 1 edited'),
      ).toBeInTheDocument();
    });
  });


  it('should not update the item when update button is clicked and has a non-unique title', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const updatedTableData = [
      {
        id: '1',
        title: 'Delivery Programme 2',
        short_name: 'DeliveryProgramme1',
        description: 'Description 1',
        url: 'http://deliveryprogramme1.com',
        updated_at: '2021-01-01T00:00:00Z',
      },

      {
        id: '2',
        title: 'Delivery Programme 2',
        short_name: 'DeliveryProgramme2',
        description: 'Description 2',
        url: 'http://deliveryprogramme2.com',
        updated_at: '2021-01-01T00:00:00Z',
      },
    ];
    mockUpdateDeliveryProgramme.mockResolvedValue(updatedTableData);
    const rendered = await render();
    act(() => {
      fireEvent.click(rendered.getByTestId('delivery-programme-edit-button-1'));
    });

    act(() => {
      fireEvent.change(rendered.getByLabelText('Title'), {
        target: { value: 'Delivery Programme 2' },
      });
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
    });
    mockGetDeliveryProgrammes.mockResolvedValue(updatedTableData);

    await waitFor(() => {
      expect(
        rendered.queryByText('Edit: Delivery Programme 1'),
      ).toBeInTheDocument();
      expect(mockAlertApi.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call AlertApi when update fails', async () => {
    mockGetDeliveryProgrammes.mockResolvedValue(mockTableData);
    const updatedTableData = [
      {
        id: '1',
        title: 'Delivery Programme 1',
        alias: 'DeliveryProgramme1',
        programme_managers: [
          {
              "programme_manager_id": "user:default/test123"
          },
          {
              "programme_manager_id": "user:default/test345"
          },
      ],
        description: 'Description 1',
        url: 'http://deliveryprogramme.com',
        timestamp: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        title: 'Delivery Programme 2',
        alias: 'DeliveryProgramme2',
        programme_managers: [
          {
              "programme_manager_id": "user:default/test123"
          },
          {
              "programme_manager_id": "user:default/test345"
          },
      ],
        description: 'Description 2',
        url: 'http://deliveryprogramme.com',
        timestamp: '2021-01-01T00:00:00Z',
      },
    ];
    mockUpdateDeliveryProgramme.mockRejectedValue(new Error('Update failed'));
    const rendered = await render();
    act(() => {
      fireEvent.click(rendered.getByTestId('delivery-programme-edit-button-1'));
    });

    act(() => {
      fireEvent.change(rendered.getByLabelText('Title'), {
        target: { value: 'Delivery Programme 2' },
      });
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
    });
    mockGetDeliveryProgrammes.mockResolvedValue(updatedTableData);

    await waitFor(() => {
      expect(mockAlertApi.post).toHaveBeenCalledTimes(1);
    });
  });

  
});

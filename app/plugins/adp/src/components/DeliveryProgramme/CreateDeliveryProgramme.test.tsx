import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react';
import CreateDeliveryProgramme from './CreateDeliveryProgramme';
import {
  alertApiRef,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

const mockAlertApi = { post: jest.fn() };
const mockErrorApi = { post: jest.fn() };
const mockDiscoveryApi = { getBaseUrl: jest.fn() };
const mockFetchApi = { fetch: jest.fn() };

const mockAuthorize = jest
  .fn()
  .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };

jest.mock('@backstage/plugin-permission-react', () => ({
  ...jest.requireActual('@backstage/plugin-permission-react'),
  usePermission: jest.fn().mockReturnValue({ allowed: true }),
}));

const mockGetDeliveryProgrammes = jest.fn();
const mockCreateDeliveryProgramme = jest.fn().mockResolvedValue({});
const mockRefetchDeliveryProgramme = jest.fn();

jest.mock('./api/DeliveryProgrammeClient', () => ({
  DeliveryProgrammeClient: jest.fn().mockImplementation(() => ({
    getDeliveryProgrammes: mockGetDeliveryProgrammes,
    createDeliveryProgramme: mockCreateDeliveryProgramme,
  })),
}));

jest.mock('../../hooks/useArmsLengthBodyList', () => ({
  useArmsLengthBodyList: jest.fn(() => [
    { label: 'Arms Length Body 1', value: '1' },
    { label: 'Arms Length Body 2', value: '2' },
  ]),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthorize.mockClear();
});

describe('Create Delivery Programme', () => {
  const element = (
    <TestApiProvider
      apis={[
        [alertApiRef, mockAlertApi],
        [errorApiRef, mockErrorApi],
        [discoveryApiRef, mockDiscoveryApi],
        [fetchApiRef, mockFetchApi],
        [permissionApiRef, permissionApi],
      ]}
    >
      <CreateDeliveryProgramme
        refetchDeliveryProgramme={mockRefetchDeliveryProgramme}
      />
    </TestApiProvider>
  );
  const render = async () => renderInTestApp(element);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockGetDeliveryProgrammes.mockReset();
  });

  it('closes the "Add Delivery Programme" modal when cancel button is clicked', async () => {
    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('create-delivery-programme-button'));
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-cancel-button'));
    });

    await waitFor(() => {
      expect(rendered.queryByText('Create:')).not.toBeInTheDocument();
    });
  });

  it('Add Delivery Programme can create a Delivery Programme', async () => {
    const updatedTableData = [
      {
        title: 'Delivery Programme 1',
        alias: 'DeliveryProgramme1',
        programme_managers: [
          {
            aad_entity_ref_id: '1',
          },
          {
            aad_entity_ref_id: '2',
          },
        ],
        arms_length_body_id: '1',
        description: 'Description 1',
        delivery_programme_code: 'Delivery Programme Code'
      },
    ];

    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('create-delivery-programme-button'));
    });

    act(() => {
      fireEvent.change(rendered.getByLabelText('Title'), {
        target: { value: 'Delivery Programme' },
      });

      fireEvent.change(
        rendered.getByLabelText('Delivery Programme Description'),
        {
          target: { value: 'Description for Delivery Programme 1' },
        },
      );

      fireEvent.change(rendered.getByLabelText('Delivery Programme Code'), {
        target: { value: 'Delivery Programme Code 1' },
      });
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
    });

    mockGetDeliveryProgrammes.mockResolvedValue(updatedTableData);

    await waitFor(() => {
      expect(mockGetDeliveryProgrammes).toHaveBeenCalledWith({
        title: 'Delivery Programme',
        alias: 'DeliveryProgramme1',
        programme_managers: [
          {
            aad_entity_ref_id: '1',
          },
          {
            aad_entity_ref_id: '2',
          },
        ],
        arms_length_body_id: '1',
        description: 'Description for Delivery Programme 1',
        delivery_programme_code: 'Delivery Programme Code 1',
        url: '',
        finance_code: ''
      });
      expect(mockAlertApi.post).toHaveBeenNthCalledWith(1, {
        display: 'transient',
        message: 'Delivery Programme created successfully.',
        severity: 'success',
      });
    });
  });

  it('Add Delivery Programme Creation fails and triggers error handling', async () => {
    mockCreateDeliveryProgramme.mockRejectedValue(new Error('Creation Failed'));

    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('create-delivery-programme-button'));
    });

    act(() => {
      fireEvent.change(rendered.getByLabelText('Title'), {
        target: { value: 'Delivery Programme 1' },
      });
      fireEvent.change(
        rendered.getByLabelText('Delivery Programme Description'),
        {
          target: { value: 'Description for Delivery Programme 1' },
        },
      );
    });

    act(() => {
      fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
    });

    await waitFor(() => {
      expect(mockCreateDeliveryProgramme).toHaveBeenCalledWith({
        description: 'Description for Delivery Programme 1',
        alias: '',
        title: 'Delivery Programme 1',
        url: '',
      });
      expect(mockErrorApi.post).toHaveBeenCalledWith(expect.any(Error));

      expect(mockAlertApi.post).toHaveBeenNthCalledWith(1, {
        display: 'permanent',
        message:
          "The title 'Delivery Programme 1' is already in use. Please choose a different title.",
        severity: 'error',
      });
    });
  });
});

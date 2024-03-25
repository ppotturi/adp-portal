import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react';
import CreateDeliveryProject from './CreateDeliveryProject';
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
// import userEvent from '@testing-library/user-event';

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

const mockGetDeliveryProjects = jest.fn().mockResolvedValue([]);
const mockCreateDeliveryProject = jest.fn().mockImplementation(() => {
  console.log('createDeliveryProject');
  return Promise.resolve({});
});
const mockRefetchDeliveryProject = jest.fn().mockResolvedValue([]);
jest.mock('./api/DeliveryProjectClient', () => ({
  DeliveryProjectClient: jest.fn().mockImplementation(() => ({
    getDeliveryProjects: mockGetDeliveryProjects,
    createDeliveryProject: mockCreateDeliveryProject,
  })),
}));

jest.mock('../../hooks/useDeliveryProgrammesList', () => ({
  useDeliveryProgrammesList: jest.fn().mockReturnValue([
    { label: 'Project 1', value: '1' },
    { label: 'Project 2', value: '2' },
  ]),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockAuthorize.mockClear();
});

describe('Create Delivery Project', () => {
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
      <CreateDeliveryProject
        refetchDeliveryProject={mockRefetchDeliveryProject}
      />
    </TestApiProvider>
  );
  const render = async () => renderInTestApp(element);

  afterEach(() => {
    mockGetDeliveryProjects.mockReset();
  });

  // it('closes the "Add Delivery Project" modal when cancel button is clicked', async () => {
  //   const rendered = await render();

  //   act(() => {
  //     fireEvent.click(rendered.getByTestId('create-delivery-project-button'));
  //   });

  //   act(() => {
  //     fireEvent.click(rendered.getByTestId('actions-modal-cancel-button'));
  //   });

  //   await waitFor(() => {
  //     expect(rendered.queryByText('Create:')).not.toBeInTheDocument();
  //   });
  // });

  it('Add Delivery Project can create a Delivery Project', async () => {
    const updatedTableData = [
      {
        title: 'Delivery Project 1',
        delivery_programme_id: '1',
        description: 'Description 1',
        delivery_project_code: 'DP1',
      },
    ];

    const rendered = await render();

    act(() => {
      fireEvent.click(rendered.getByTestId('create-delivery-project-button'));
    });

    act(async () => {
      fireEvent.change(rendered.getByLabelText('Title'), {
        target: { value: 'Delivery Project 1' },
      });

      fireEvent.change(
        rendered.getByLabelText('Delivery Project Description'),
        {
          target: { value: 'Description 1' },
        },
      );

      fireEvent.change(rendered.getByLabelText('Delivery Project Code'), {
        target: { value: 'DP1' },
      });

      userEvent.click(rendered.getByLabelText('Delivery Programme'));
      await waitFor(() => {
        userEvent.click(rendered.getByText(/Project 1/i));
      });

      fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
    });

    mockGetDeliveryProjects.mockResolvedValue(updatedTableData);

    await waitFor(() => {
      expect(mockCreateDeliveryProject).toHaveBeenCalled();
      // With({
      //   title: 'Delivery Project 1',
      //   description: 'Description 1',
      //   delivery_project_code: 'DP1',
      // });
      expect(mockAlertApi.post).toHaveBeenNthCalledWith(1, {
        display: 'transient',
        message: 'Delivery Project created successfully.',
        severity: 'success',
      });
    });
  });

  // it('Add Delivery Project Creation fails and triggers error handling', async () => {
  //   mockCreateDeliveryProject.mockRejectedValue(new Error('Creation Failed'));

  //   const rendered = await render();

  //   act(() => {
  //     fireEvent.click(rendered.getByTestId('create-delivery-project-button'));
  //   });

  //   act(() => {
  //     fireEvent.change(rendered.getByLabelText('Title'), {
  //       target: { value: 'Delivery Project 1' },
  //     });
  //     fireEvent.change(
  //       rendered.getByLabelText('Delivery Project Description'),
  //       {
  //         target: { value: 'Description for Delivery Project 1' },
  //       },
  //     );
  //   });

  //   act(() => {
  //     fireEvent.click(rendered.getByTestId('actions-modal-update-button'));
  //   });

  //   await waitFor(() => {
  //     expect(mockCreateDeliveryProject).toHaveBeenCalledWith({
  //       description: 'Description for Delivery Project 1',
  //       alias: '',
  //       title: 'Delivery Project 1',
  //       url: '',
  //     });
  //     expect(mockErrorApi.post).toHaveBeenCalledWith(expect.any(Error));

  //     expect(mockAlertApi.post).toHaveBeenNthCalledWith(1, {
  //       display: 'permanent',
  //       message:
  //         "The title 'Delivery Project 1' is already in use. Please choose a different title.",
  //       severity: 'error',
  //     });
  //   });
  // });
});

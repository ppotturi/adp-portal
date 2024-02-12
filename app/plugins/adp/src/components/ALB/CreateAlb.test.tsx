import EditModal from '../../utils/EditModal';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useApi, alertApiRef } from '@backstage/core-plugin-api';
import CreateAlb from './CreateAlb';

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn().mockImplementation(apiRef => {
    if (apiRef === alertApiRef) {
      return {
        post: jest.fn(),
      };
    }
    return undefined;
  }),
}));

describe('CreateAlb', () => {
  const initialValues = {
    title: '',
    description: '',
  };

  const fields = [
    {
      label: 'Name',
      name: 'name',
      validations: { required: true, maxLength: 10 },
    },
    { label: 'Description', name: 'description' },
  ];

  const onSubmitMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      alertApi: {
        post: jest.fn(),
      },
    });

    render(
      <EditModal
        open={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        initialValues={initialValues}
        mode="create"
        fields={fields}
      />,
    );
    onSubmitMock.mockClear();
    onCloseMock.mockClear();
  });

  describe('CreateAlb Component', () => {
    it('opens the modal when the "Add ALB" button is clicked', async () => {
      render(<CreateAlb refetchArmsLengthBody={() => {}} />);

      const addButton = screen.getByRole('button', { name: /Add ALB/i });
      userEvent.click(addButton);

      const modalTitle = screen.getAllByText(/Create:/i);
      expect(modalTitle.length).toBeGreaterThan(0);
    });
  });
});

import EditModal from './EditModal';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useApi} from '@backstage/core-plugin-api';

jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(),
}));


describe('EditModal', () => {
  const initialValues = {
    name: 'Test Record',
    description: 'Test Description',
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
        fields={fields}
      />,
    );
    onSubmitMock.mockClear();
    onCloseMock.mockClear();
  });

  it('renders correctly', () => {
    expect(screen.getByText(/Edit: Test Record/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
  });

  it('calls onSubmit with the correct values when the form is submitted', async () => {
    await userEvent.clear(screen.getByLabelText(/Name/));
    await userEvent.type(screen.getByLabelText(/Name/), 'Valid Name');

    await userEvent.clear(screen.getByLabelText(/Description/));
    await userEvent.type(
      screen.getByLabelText(/Description/),
      'Valid Description',
    );

    await userEvent.click(screen.getByText(/Update/));

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());
  });

  it('calls onClose when the Cancel button is clicked', async () => {
    await userEvent.click(screen.getByText(/Cancel/));

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('shows an error message if the name exceeds maxLength', async () => {
    await userEvent.type(
      screen.getByLabelText(/Name/),
      'VeryLongNameExceedingMaxLength',
    );

    await userEvent.click(screen.getByText(/Update/));

    expect(
      await screen.findByText(/Maximum length is 10 characters/),
    ).toBeInTheDocument();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

 
});

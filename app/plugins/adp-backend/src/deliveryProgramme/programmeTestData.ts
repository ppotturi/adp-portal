export const expectedProgrammeData = {
  programme_managers: [],
  title: 'Test title 1',
  alias: 'Test Alias',
  description: 'Test description',
  finance_code: 'Test finance_code',
  delivery_programme_code: 'Test delivery_programme_code',
  url: 'Test url',
};

export const expectedProgrammeDataWithPm = {
  programme_managers: [
    {
      programme_manager_id: 'string 1'
    },
    {
      programme_manager_id: 'string 2'
    },
    {
      programme_manager_id: 'string 3'
    }
  ],
  title: 'Test title 1',
  alias: 'Test Alias',
  description: 'Test description',
  finance_code: 'Test finance_code',
  delivery_programme_code: 'Test delivery_programme_code',
  url: 'Test url',
};

export const expectedProgrammeDataWithName = {
  programme_managers: [],
  title: 'Test title 2',
  alias: 'Test Alias',
  description: 'Test description',
  finance_code: 'Test finance_code',
  delivery_programme_code: 'Test delivery_programme_code',
  url: 'Test url',
  name: 'test-title-2',
};

export const expectedProgrammeDataStore = {
  programme_managers: [
    {
      programme_manager_id: 'string 1'
    },
    {
      programme_manager_id: 'string 2'
    },
    {
      programme_manager_id: 'string 3'
    }
  ],
  title: 'Test title 1',
  alias: 'Test Alias',
  description: 'Test description',
  finance_code: 'Test finance_code',
  delivery_programme_code: 'Test delivery_programme_code',
  url: 'Test url',
  updated_by: 'john',
  name: 'test-title-1',
};

export const expectedProgrammeNoPm = {
  title: 'Test title 1',
  alias: 'Test Alias',
  description: 'Test description',
  finance_code: 'Test finance_code',
  delivery_programme_code: 'Test delivery_programme_code',
  url: 'Test url',
  updated_by: 'john',
  name: 'test-title-1',
};

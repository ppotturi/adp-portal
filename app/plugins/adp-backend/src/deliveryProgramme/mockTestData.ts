import { DeliveryProgramme } from '../types';

export const expectedProgramme: Omit<DeliveryProgramme, 'id' | 'timestamp'> = {
    programme_manager: ['string1', 'string 2'],
    title: 'Test title 1',
    alias: 'Test Alias',
    description: 'Test description',
    finance_code: 'Test finance_code',
    arms_length_body: '05aa36b6-c7a2-4c35-820e-c31d20011f47',
    delivery_programme_code: 'Test delivery_programme_code',
    url: 'Test url',
    name: 'test-title-1'
  };
  
  export const expectedProgrammes =  [{
    programme_manager: ['string1', 'string 2'],
    title: 'Test title 1',
    alias: 'Test Alias',
    description: 'Test description',
    finance_code: 'Test finance_code',
    arms_length_body: '05aa36b6-c7a2-4c35-820e-c31d20011f47',
    delivery_programme_code: 'Test delivery_programme_code',
    url: 'Test url',
    updated_by: 'john',
  },
  {
    programme_manager: ['string1', 'string 2'],
    title: 'Test title 2',
    alias: 'Test Alias',
    description: 'Test description',
    finance_code: 'Test finance_code',
    arms_length_body: '05aa36b6-c7a2-4c35-820e-c31d20011f47',
    delivery_programme_code: 'Test delivery_programme_code',
    url: 'Test url',
    updated_by: 'john',
  },
  {
    programme_manager: ['string1', 'string 2'],
    title: 'Test title 3',
    alias: 'Test Alias',
    description: 'Test description',
    finance_code: 'Test finance_code',
    arms_length_body: '05aa36b6-c7a2-4c35-820e-c31d20011f47',
    delivery_programme_code: 'Test delivery_programme_code',
    url: 'Test url',
    updated_by: 'john',
  }]
  
  export const expectedProgrammesWithName =  [
    {
      programme_manager: ['string1', 'string 2'],
      title: 'Test title 1',
      alias: 'Test Alias',
      description: 'Test description',
      finance_code: 'Test finance_code',
      arms_length_body: '05aa36b6-c7a2-4c35-820e-c31d20011f47',
      delivery_programme_code: 'Test delivery_programme_code',
      url: 'Test url',
      updated_by: 'john',
      name: 'test-title-1',
    },
    {
      programme_manager: ['string1', 'string 2'],
      title: 'Test title 2',
      alias: 'Test Alias',
      description: 'Test description',
      finance_code: 'Test finance_code',
      arms_length_body: '05aa36b6-c7a2-4c35-820e-c31d20011f47',
      delivery_programme_code: 'Test delivery_programme_code',
      url: 'Test url',
      updated_by: 'john',
      name: 'test-title-2',
    }
  ]
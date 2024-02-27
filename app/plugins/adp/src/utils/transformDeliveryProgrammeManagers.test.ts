import { transformDeliveryProgrammeManagers } from './transformDeliveryProgrammeManagers';

describe('transformDeliveryProgrammeManagers', () => {
  it('transforms programme manager emails to programme manager ids', () => {
    const deliveryProgramme = {
      programme_name: 'Test Programme',
      programme_manager: ['manager1@example.com', 'manager2@example.com'],
    };

    const expectedOutput = {
      programme_name: 'Test Programme',
      programme_managers: [
        { programme_manager_id: 'user:default/manager1@example.com' },
        { programme_manager_id: 'user:default/manager2@example.com' },
      ],
    };

    const transformedOutput =
      transformDeliveryProgrammeManagers(deliveryProgramme);

    expect(transformedOutput).toEqual(expectedOutput);
  });

  it('retains other properties in the input object', () => {
    const deliveryProgramme = {
      programme_name: 'Another Programme',
      programme_manager: ['anothermanager@example.com'],
      additional_info: 'This is some additional info',
    };

    const expectedOutput = {
      programme_name: 'Another Programme',
      programme_managers: [
        { programme_manager_id: 'user:default/anothermanager@example.com' },
      ],
      additional_info: 'This is some additional info',
    };

    const transformedOutput =
      transformDeliveryProgrammeManagers(deliveryProgramme);

    expect(transformedOutput).toEqual(expectedOutput);
  });
});

export const transformDeliveryProgrammeManagers = (deliveryProgramme: any) => {
  const transformedProgrammeManagers = deliveryProgramme.programme_manager.map(
    (email: any) => ({
      programme_manager_id: `user:default/${email}`,
    }),
  );

  const { programme_manager, ...restOfData } = deliveryProgramme;

  return {
    ...restOfData,
    programme_managers: transformedProgrammeManagers,
  };
};

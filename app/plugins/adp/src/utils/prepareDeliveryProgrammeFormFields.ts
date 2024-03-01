import { DeliveryProgrammeFormFields } from '../components/DeliveryProgramme/DeliveryProgrammeFormFields';


export const prepareDeliveryProgrammeFormFields = (albOptions: any[], programmeManagerOptions: any[]) => {
  return DeliveryProgrammeFormFields.map(field => {
    if (field.name === 'arms_length_body') {
      return { ...field, options: albOptions };
    } else if (field.name === 'programme_manager') {
      return { ...field, options: programmeManagerOptions };
      
    }
    return field;
  });
};


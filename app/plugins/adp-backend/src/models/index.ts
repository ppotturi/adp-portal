import { DeliveryProgrammeM } from './deliveryProgramme';

 new DeliveryProgrammeM({ id: '560f0841-9be3-479e-9943-72a031540b17' })
  .fetch({ withRelated: ['managers'] })
  .then(manager => {
    console.log(manager.related('managers').toJSON());
  })
  .catch(error => {
    console.error(error);
  });

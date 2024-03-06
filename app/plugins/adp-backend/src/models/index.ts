export const bookshelf = require('../bookshelf');

import { DeliveryProgramme } from './deliveryProgramme';

let deliveryProgramme = new DeliveryProgramme();

deliveryProgramme
  .set({
    Name: 'deliveryProgramme',
    Title: 'deliveryProgramme',
    Alias: 'deliveryProgramme',
    Description: 'deliveryProgramme',
    FinanceCode: 'deliveryProgramme',
    ArmsLengthBody: 'deliveryProgramme',
    DeliveryProgrammeCode: 'deliveryProgramme',
    Url: 'deliveryProgramme',
    DeliveryProgrammeId: '1',
  })
  .save();

import { NotFoundError } from '@backstage/errors';
import { exampleCatalog } from '../deliveryProgramme/programmeTestData';
import { getProgrammeManagerDetails } from './deliveryProgrammeUtils';

describe('getProgrammeManagerDetails', () => {
    it('returns the programme manager details', async () => {
      await expect(
        getProgrammeManagerDetails(
          'a9dc2414-0626-43d2-993d-a53aac4d73421',
          exampleCatalog,
        ),
      ).resolves.toEqual({ email: 'test1.test@onmicrosoft.com', name: 'Test1 Test' });
    });
  
    it('returns error if name is not found', async () => {
      expect(
        getProgrammeManagerDetails(
          'a9dc2414-0626-43d2-993d-a53aac4d7341',
          exampleCatalog,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });
  
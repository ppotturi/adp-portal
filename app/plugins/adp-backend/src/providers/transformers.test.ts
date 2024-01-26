import { defaultGroupTransformer } from './transformers';

describe('defaultGroupTransformer', () => {
  it('should transform valid ArmsLengthBody to GroupEntity', async () => {
    const armsLengthBody = {
      creator: 'ADP',
      owner: 'ADP',
      name: 'testName',
      short_name: 'testShortName',
      description: 'testDescription',
      title: 'testName',
      id: '1234',
      timestamp: Date.now(),
    };

    const expectedGroupEntity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Group',
      metadata: {
        name: 'testName',
        displayName: 'testShortName',
        description: 'testDescription',
        tags: [],
        annotations: {
          'backstage.io/managed-by-location': 'adp:arms-length-body\\testName',
          'backstage.io/managed-by-origin-location':
            '`adp:arms-length-body\\${armsLengthBody.name}`',
        },
      },
      spec: {
        type: 'arms-length-body',
        children: [],
      },
    };

    const result = await defaultGroupTransformer(armsLengthBody);
    expect(result).toEqual(expectedGroupEntity);
  });

});

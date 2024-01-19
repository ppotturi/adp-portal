import { getAllArmsLengthBodies } from './armsLengthBody';

describe('ArmsLengthBody Filtering', () => {
  let mockArmsLengthBodies: object;

  beforeEach(() => {
    mockArmsLengthBodies = {
      obj1: {
        creator_username: 'John',
        creator_email: '@',
        owner_username: 'John',
        owner_email: '@',
        creator_same_as_owner: true,
        name: 'ALB',
        short_name: 'ALB',
        description: 'example',
      },

      obj2: {
        creator_username: 'John',
        creator_email: '@',
        owner_username: 'John',
        owner_email: '@',
        creator_same_as_owner: true,
        name: 'ALB',
        short_name: 'ALB',
        description: 'example',
      },

      obj3: {
        creator_username: 'John',
        creator_email: '@',
        owner_username: 'John',
        owner_email: '@',
        creator_same_as_owner: true,
        name: 'ALB',
        short_name: 'ALB',
        description: 'example',
      },
    };

    test('getAllArmsLengthBodies with no filter', () => {
      const results = getAllArmsLengthBodies();
      expect(results).toHaveLength(Object.keys(mockArmsLengthBodies).length);
    });

    test('getAllArmsLengthBodies with "allOf" filter', () => {
      const a = getAllArmsLengthBodies({
        anyOf: [
          { property: 'creator_username', values: ['John'] },
          { property: 'creator_email', values: ['@'] },
          { property: 'owner_username', values: ['John'] },
          { property: 'owner_email', values: ['@'] },
          { property: 'creator_same_as_owner', values: [1] },
          { property: 'name', values: ['ALB'] },
          { property: 'short_name', values: ['ALB'] },
          { property: 'description', values: ['example'] },
        ],
      });
    });
  });
});

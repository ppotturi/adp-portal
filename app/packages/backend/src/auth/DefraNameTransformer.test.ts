import { defraADONameTransformer } from './DefraNameTransformer'; // Import the function to be tested
import { UserEntity } from '@backstage/catalog-model';
import {
  defaultUserTransformer,
} from '@backstage/plugin-catalog-backend-module-msgraph';
import {
  MICROSOFT_EMAIL_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from '@backstage/plugin-catalog-backend-module-msgraph';

/** default data used to compare original with new function */
function default_setup_data() {
  const mockGraphUser = {id: 'mockGraphUser', displayName: 'User', mail: 'pZ6p6@example.com'};
  const mockUserPhoto = 'mockUserPhoto';
  return {mockGraphUser, mockUserPhoto};
}

function test_default_assertions(result: UserEntity | undefined) {
  expect(result?.apiVersion).toBe('backstage.io/v1alpha1'); // Example assertion
  expect(result?.kind).toBe('User');
  expect(result?.metadata?.name).toBe('pz6p6_example.com');
  expect(result?.metadata?.annotations?.[MICROSOFT_EMAIL_ANNOTATION]).toBe('pZ6p6@example.com');
  expect(result?.metadata?.annotations?.[MICROSOFT_GRAPH_USER_ID_ANNOTATION]).toBe('mockGraphUser');
  expect(result?.spec?.profile?.displayName).toBe('User' );
  expect(result?.spec?.profile?.email).toBe('pZ6p6@example.com' );
  expect(result?.spec?.profile?.picture).toBe('mockUserPhoto' );}
/**
 * Tests to confirm behaviour of the original function
 */
describe('Test original Function', () => {

  it('Transforms correctly for the email field', async () => {
    const {mockGraphUser, mockUserPhoto} = default_setup_data();

    const result = await defaultUserTransformer(mockGraphUser, mockUserPhoto);
    test_default_assertions(result);

  });
  it('If missing email does not transform the at all', async () => {
    const mockGraphUser = { id: 'mockGraphUser', displayName: 'User', mail: ''  };
    const mockUserPhoto = 'mockUserPhoto';

    const result = await defaultUserTransformer(mockGraphUser, mockUserPhoto);


    expect(result).toBeUndefined();


  });
});

describe('myUserTransformer', () => {
  it('Same Default Behavior as defaultUserTransformer ', async () => {
    const {mockGraphUser, mockUserPhoto} = default_setup_data();

    const result = await defraADONameTransformer(mockGraphUser, mockUserPhoto);
    test_default_assertions(result);

  });

  it('Parses UPN correctly for name ', async () => {


    const mockGraphUser = { id: 'someone@there.com', displayName: 'User', mail: ''  };
    const mockUserPhoto = 'mockUserPhoto';

    const result = await defraADONameTransformer(mockGraphUser, mockUserPhoto);
    expect(result?.apiVersion).toBe('backstage.io/v1alpha1'); // Example assertion
    expect(result?.kind).toBe('User');
    expect(result?.metadata?.name).toBe('someone_there.com');
    expect(result?.spec?.profile?.displayName).toBe('User' );
    // Assume if there was no email, the email was the UPN
    expect(result?.spec?.profile?.email).toBe('someone@there.com')

  });
});

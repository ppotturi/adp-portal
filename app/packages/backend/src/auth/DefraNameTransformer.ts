import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import {  UserEntity } from '@backstage/catalog-model';
import {
  normalizeEntityName
} from '@backstage/plugin-catalog-backend-module-msgraph';
import {
  MICROSOFT_EMAIL_ANNOTATION,
  MICROSOFT_GRAPH_USER_ID_ANNOTATION,
} from '@backstage/plugin-catalog-backend-module-msgraph';
// Can we write a test for theis function in tha file with the same name

function hasIdOrDisplayName(user: User) {
  return user.id || user.displayName;
}

function createEntitiyFromOrignalUser(name: string, user: User, idToUse: string | undefined | null) {
  const entity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name,
      annotations: {
        [MICROSOFT_EMAIL_ANNOTATION]: user.mail!,
        [MICROSOFT_GRAPH_USER_ID_ANNOTATION]: user.id!,
      },
    },
    spec: {
      profile: {
        displayName: user.displayName!,
        email: idToUse!,
      },
      memberOf: [],
    },
  };
  return entity;
}

function addPhotoIfRequired(userPhoto: string | undefined, entity: UserEntityV1alpha1) {
  if (userPhoto) {
    entity.spec.profile!.picture = userPhoto;
  }

  return entity;
}

function chooseIdIfEmailIsBlank(user: User) {
  return (user.mail === undefined || user.mail?.length === 0) ? user.id : user.mail;
}

export async function defraADONameTransformer(
  user: MicrosoftGraph.User,
  userPhoto?: string,
): Promise<UserEntity | undefined> {
    if (!hasIdOrDisplayName(user) ) {
      return undefined;
    }
    const idToUse  = chooseIdIfEmailIsBlank(user);
    const name = normalizeEntityName(idToUse);
    const entity = createEntitiyFromOrignalUser(name, user, idToUse);
    return addPhotoIfRequired(userPhoto, entity);

}

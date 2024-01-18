import { GroupEntity } from '@backstage/catalog-model';
import {ArmsLengthBody} from '../types/datamodel'

export type GroupTransformer = (
  armsl: ArmsLengthBody
) => Promise<GroupEntity | undefined>;


export const defaultGroupTransformer: GroupTransformer = async (
  armsLengthBody
): Promise<GroupEntity | undefined> => {

  return {
    apiVersion: 'backstage.io/v1beta1',
    kind: 'Group',
    metadata: {
      creator_username: armsLengthBody.creator_username,
      creator_email: armsLengthBody.creator_email,
      owner_username: armsLengthBody.owner_username,
      owner_email: armsLengthBody.owner_email,
      creator_same_as_owner: armsLengthBody.creator_same_as_owner,
      name: armsLengthBody.name,
      short_name: armsLengthBody?.short_name,
      description: armsLengthBody?.description,
      tags: [],
      annotations: {
        'backstage.io/managed-by-location': `adp:arms-length-body\\${armsLengthBody.name}`,
        'backstage.io/managed-by-origin-location': '`adp:arms-length-body\\${armsLengthBody.name}`',
      }
    },
    spec: {
      type: 'arms-length-body',
      children: [],
    },
  };
};
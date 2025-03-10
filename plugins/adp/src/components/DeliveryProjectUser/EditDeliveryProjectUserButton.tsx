import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import {
  deliveryProjectUserUpdatePermission,
  normalizeUsername,
  type DeliveryProjectUser,
} from '@internal/plugin-adp-common';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { deliveryProjectUserApiRef } from './api';
import type { DeliveryProjectUserFields } from './DeliveryProjectUserFormFields';
import {
  DeliveryProjectUserFormFields,
  emptyForm,
} from './DeliveryProjectUserFormFields';
import type { SubmitResult } from '../../utils';
import {
  DialogForm,
  TitleWithHelp,
  ValidationError,
  populate,
  readValidationError,
} from '../../utils';
import { usePermission } from '@backstage/plugin-permission-react';
import { checkUsernameIsReserved } from '../../utils/reservedUsernames';

export type EditDeliveryProjectUserButtonProps = Readonly<
  Omit<Parameters<typeof Button>[0], 'onClick'> & {
    deliveryProjectUser: DeliveryProjectUser;
    onEdited?: () => void;
  }
>;

export function EditDeliveryProjectUserButton({
  onEdited,
  deliveryProjectUser,
  children,
  ...buttonProps
}: EditDeliveryProjectUserButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const alertApi = useApi(alertApiRef);
  const client = useApi(deliveryProjectUserApiRef);
  const { allowed: canEditProjectUser } = usePermission({
    permission: deliveryProjectUserUpdatePermission,
    resourceRef: deliveryProjectUser.delivery_project_id,
  });

  if (!canEditProjectUser) return null;

  const userEntityRef = normalizeUsername(deliveryProjectUser.email);

  async function handleSubmit(
    fields: DeliveryProjectUserFields,
  ): Promise<SubmitResult<DeliveryProjectUserFields>> {
    try {
      if (checkUsernameIsReserved(fields.github_username.trim())) {
        throw new ValidationError([
          {
            path: 'github_username',
            error: {
              message:
                'Please enter a valid GitHub handle. This Github handle is reserved.',
            },
          },
        ]);
      }

      await client.update({
        ...deliveryProjectUser,
        ...fields,
        github_username: fields.github_username.trim(),
      });
    } catch (e: any) {
      return readValidationError(e);
    }
    alertApi.post({
      message: 'Delivery Project User updated successfully.',
      severity: 'success',
      display: 'transient',
    });
    return { type: 'success' };
  }

  return (
    <>
      <Button
        data-testid="edit-delivery-project-user-button"
        {...buttonProps}
        onClick={() => setIsModalOpen(true)}
      >
        {children}
      </Button>
      {isModalOpen && (
        <DialogForm
          defaultValues={populate(emptyForm, {
            ...deliveryProjectUser,
            user_catalog_name: {
              label: deliveryProjectUser.name,
              value: userEntityRef,
            },
          })}
          renderFields={DeliveryProjectUserFormFields}
          completed={success => {
            setIsModalOpen(false);
            if (success) onEdited?.();
          }}
          title={
            <TitleWithHelp href="https://defra.github.io/adp-documentation/Getting-Started/onboarding-a-user/">
              {`Edit team member ${deliveryProjectUser.name}`}
            </TitleWithHelp>
          }
          confirm="Update"
          submit={handleSubmit}
          disabled={{
            user_catalog_name: true,
          }}
        />
      )}
    </>
  );
}

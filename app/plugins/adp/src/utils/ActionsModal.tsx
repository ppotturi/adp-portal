import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

interface ActionsModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialValues: Record<string, any>;
  mode: 'create' | 'edit';

  fields: {
    label: string;
    name: string;
    helperText?: string;
    validations?: {
      required?: boolean;
      maxLength?: number;
      pattern?: {
        value: RegExp;
        message: string;
      };
    };
    multiline?: boolean;
    maxRows?: number;
    select?: boolean;
    options?: { label: string; value: string }[]; 
  }[];
}

export const ActionsModal: FC<ActionsModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  mode,
  fields,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
  });
  const errorApi = useApi(alertApiRef);

  const onFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (e: any) {
      errorApi.post(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${mode === 'edit' ? 'Edit' : 'Create'}: ${initialValues.title || ''}`}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          {fields.map((field) =>
            field.select ? (
              <TextField
                key={field.name}
                id={field.name}
                label={field.label}
                variant="outlined"
                fullWidth
                margin="dense"
                select
                {...register(field.name, {
                  required: field.validations?.required ? 'This field is required' : undefined,
                  maxLength: field.validations?.maxLength
                    ? {
                        value: field.validations.maxLength,
                        message: `Maximum length is ${field.validations.maxLength} characters`,
                      }
                    : undefined,
                  pattern: field.validations?.pattern
                    ? {
                        value: field.validations.pattern.value,
                        message: field.validations.pattern.message,
                      }
                    : undefined,
                })}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message ?? field.helperText}
              >
                {field.options?.map((option,index) => (
                   <MenuItem key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                key={field.name}
                id={field.name}
                label={field.label}
                variant="outlined"
                fullWidth
                margin="dense"
                {...register(field.name, {
                  required: field.validations?.required ? 'This field is required' : undefined,
                  maxLength: field.validations?.maxLength
                    ? {
                        value: field.validations.maxLength,
                        message: `Maximum length is ${field.validations.maxLength} characters`,
                      }
                    : undefined,
                  pattern: field.validations?.pattern
                    ? {
                        value: field.validations.pattern.value,
                        message: field.validations.pattern.message,
                      }
                    : undefined,
                })}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message ?? field.helperText}
                multiline={field.multiline}
                maxRows={field.maxRows}
              />
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset(initialValues);
              onClose();
            }}
            color="primary"
            data-testid="actions-modal-cancel-button"
          >
            Cancel
          </Button>
          <Button type="submit"
            color="primary"
            data-testid="actions-modal-update-button"
          >
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ActionsModal;

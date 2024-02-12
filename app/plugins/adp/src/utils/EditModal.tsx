import React, { FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { ArmsLengthBody } from '@internal/plugin-adp-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (armsLengthBody: ArmsLengthBody) => Promise<void>;
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
  }[];
}

export const EditModal: FC<EditModalProps> = ({
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
      errorApi.post(e)
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`${mode === 'edit' ? 'Edit' : 'Create'}: ${initialValues.title|| ''}`}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          {fields.map(field => (
            <TextField
              key={field.name}
              id={field.name}
              label={field.label}
              variant="outlined"
              fullWidth
              margin="dense"
              {...register(field.name, {
                required: field.validations?.required
                  ? 'This field is required'
                  : undefined,
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
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset(initialValues);
              onClose();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditModal;

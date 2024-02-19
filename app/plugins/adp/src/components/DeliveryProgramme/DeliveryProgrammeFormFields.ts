export const DeliveryProgrammeFormFields = [
  {
    label: 'Title',
    name: 'title',
    helperText: 'This must be unique',
    validations: {
      required: true,
      pattern: {
        value: /^[a-zA-Z0-9]+(?:[. ][a-zA-Z0-9]+)*$/,
        message: 'Invalid Delivery Programme name format',
      },
    },
  },
  {
    label: 'Alias',
    name: 'alias',
    helperText: 'Optional - an alias to identify the body',
  },
  {
    label: 'Website',
    name: 'url',
    helperText: 'Optional - a link to website',
  },
  {
    label: 'Arms Length Body',
    name: 'arms_length_body',
  },

  {
    label: 'Programme Manager',
    name: 'programme_manager',
  },

  {
    label: 'Finance Code',
    name: 'finance_code',
  },
  {
    label: 'Delivery Programme Code',
    name: 'delivery_programme_code',
  },

  {
    label: 'Delivery Programme Description',
    name: 'description',
    helperText: 'Max 200 Chars',
    validations: {
      required: true,
      maxLength: 200,
    },
    multiline: true,
    maxRows: 4,
  },
];

export const albFormFields = [
    {
      label: 'Title',
      name: 'title',
      helperText:
        'This must be unique - use letters, numbers, or separators such as "_", "-"',
      validations: {
        required: true,
        pattern: {
          value: /^[a-zA-Z0-9]+(?:[-_. ][a-zA-Z0-9]+)*$/,
          message:
            'Invalid ALB name format. Use letters, numbers, or "-", "_", "." as separators.',
        },
      },
    },
    {
      label: 'Short Name',
      name: 'short_name',
      helperText: 'Optional - a short form name to identify the body',
    },
    {
      label: 'Website',
      name: 'url',
      helperText: 'Optional - a link to website',
    },
    {
      label: 'ALB Description',
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